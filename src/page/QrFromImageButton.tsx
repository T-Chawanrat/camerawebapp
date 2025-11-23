// // QrFromImageButton.tsx
// import { useRef } from "react";
// import { BrowserMultiFormatReader } from "@zxing/browser";
// import { BarcodeFormat, DecodeHintType } from "@zxing/library";

// // กำหนด format ที่อยากให้มันลองอ่าน (ทั้ง QR และ barcode หลัก ๆ)
// const hints = new Map();
// hints.set(DecodeHintType.POSSIBLE_FORMATS, [
//   BarcodeFormat.QR_CODE,
//   BarcodeFormat.CODE_128,
//   BarcodeFormat.CODE_39,
//   BarcodeFormat.EAN_13,
//   BarcodeFormat.EAN_8,
//   BarcodeFormat.UPC_A,
//   BarcodeFormat.UPC_E,
//   BarcodeFormat.ITF,
// ]);

// // สร้าง reader แค่ครั้งเดียว (reuse ได้)
// const imageReader = new BrowserMultiFormatReader(hints);

// type QrFromImageButtonProps = {
//   onResultChange: (text: string) => void;
//   onErrorChange: (msg: string | null) => void;
// };

// export default function QrFromImageButton({
//   onResultChange,
//   onErrorChange,
// }: QrFromImageButtonProps) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       onErrorChange(null);

//       const reader = new FileReader();
//       reader.onload = async () => {
//         try {
//           const img = new Image();
//           img.onload = async () => {
//             try {
//               const result = await imageReader.decodeFromImageElement(img);
//               onResultChange(result.getText());
//             } catch (err) {
//               console.error(err);
//               onErrorChange("อ่าน QR/Barcode จากรูปไม่สำเร็จ");
//             }
//           };
//           img.src = reader.result as string;
//         } catch (err) {
//           console.error(err);
//           onErrorChange("ไม่สามารถโหลดรูปได้");
//         }
//       };
//       reader.readAsDataURL(file);
//     } catch (err) {
//       console.error(err);
//       onErrorChange("เกิดข้อผิดพลาดในการอ่านรูป");
//     } finally {
//       // เคลียร์ค่า input เพื่อให้เลือกไฟล์เดิมซ้ำได้ถ้าต้องการ
//       e.target.value = "";
//     }
//   };

//   return (
//     <>
//       <button
//         type="button"
//         onClick={handleClick}
//         className="mt-2 px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700"
//       >
//         ถ่ายรูป/เลือกรูป QR หรือ Barcode
//       </button>
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         capture="environment"
//         className="hidden"
//         onChange={handleFileChange}
//       />
//     </>
//   );
// }

import { useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import Tesseract from "tesseract.js";

// ---- ZXing hints ----
const hints = new Map();
hints.set(DecodeHintType.POSSIBLE_FORMATS, [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.ITF,
]);
hints.set(DecodeHintType.TRY_HARDER, true);

const imageReader = new BrowserMultiFormatReader(hints);

type Props = {
  onResultChange: (text: string) => void;
  onErrorChange: (msg: string | null) => void;
};

export default function QrFromImageButton({
  onResultChange,
  onErrorChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => fileInputRef.current?.click();

  // ------------------------------------------------------
  // 🧪 Preprocess (ทำให้ OCR อ่านง่ายขึ้น)
  // ------------------------------------------------------
  const preprocessImage = (img: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const maxWidth = 1200;
    const scale = maxWidth / img.width;

    canvas.width = maxWidth;
    canvas.height = img.height * scale;

    ctx.filter = "brightness(1.05) contrast(1.1)";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return canvas;
  };

  // ------------------------------------------------------
  // 🔍 OCR fallback (ไม่มี whitelist แต่ใช้ clean + filter)
  // ------------------------------------------------------
  const ocrFallback = async (canvas: HTMLCanvasElement) => {
    try {
      const { data } = await Tesseract.recognize(canvas, "eng", {
        logger: () => {},
      });

      // ตัวเลขอย่างเดียว (ไม่ต้อง whitelist)
      const digits = data.text.replace(/\D/g, "");
      return digits || null;
    } catch (err) {
      console.error("OCR error:", err);
      return null;
    }
  };

  // ------------------------------------------------------
  // 📥 handleFileChange
  // ------------------------------------------------------
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      onErrorChange(null);

      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = async () => {
          const canvas = preprocessImage(img);

          // 1) ZXing → ถ้าอ่านได้ จบ
          try {
            const result = await imageReader.decodeFromCanvas(canvas);
            onResultChange(result.getText());
            return;
          } catch (zxErr) {
            console.warn("ZXing ไม่อ่าน:", zxErr);
          }

          // 2) OCR fallback
          const text = await ocrFallback(canvas);
          if (text) {
            onResultChange(text);
            return;
          }

          // 3) not found
          onErrorChange("ไม่สามารถอ่าน QR / Barcode หรือข้อความใต้บาร์โค้ดได้");
        };

        img.src = reader.result as string;
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      onErrorChange("เกิดข้อผิดพลาดในการอ่านรูป");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="mt-2 px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700"
      >
        ถ่ายรูป QR หรือ Barcode
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}



