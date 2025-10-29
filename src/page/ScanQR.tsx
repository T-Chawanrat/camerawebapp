// import React, { useEffect, useRef, useState } from "react";
// import { BrowserMultiFormatReader } from "@zxing/browser";
// import type { Result } from "@zxing/library";
// import { Camera } from "lucide-react";

// /**
//  * Live QR/Barcode scanner using @zxing/browser.
//  * Fix: use React.FC and import React so editor/TS doesn't mark JSX.Element as red.
//  */

// type ZXingReaderWithReset = BrowserMultiFormatReader & { reset?: () => void };

// const ScanQR: React.FC = () => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const codeReaderRef = useRef<ZXingReaderWithReset | null>(null);
//   const [scanning, setScanning] = useState(false);
//   const [resultText, setResultText] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [continuous, setContinuous] = useState(false);
//   const [todos, setTodos] = useState<string[]>([]);

//   const ensureReader = () => {
//     if (!codeReaderRef.current) {
//       codeReaderRef.current =
//         new BrowserMultiFormatReader() as ZXingReaderWithReset;
//     }
//     return codeReaderRef.current!;
//   };

//   const stopTracks = () => {
//     const v = videoRef.current;
//     if (v?.srcObject instanceof MediaStream) {
//       v.srcObject.getTracks().forEach((t) => t.stop());
//       v.srcObject = null;
//     }
//   };

//   const stopScan = () => {
//     codeReaderRef.current?.reset?.();
//     stopTracks();
//     setScanning(false);
//   };

//   const startScan = async () => {
//     setError(null);
//     setResultText("");
//     const v = videoRef.current;
//     if (!v) {
//       setError("ไม่พบ element วิดีโอ");
//       return;
//     }

//     const reader = ensureReader();

//     try {
//       setScanning(true);
//       await reader.decodeFromVideoDevice(
//         undefined,
//         v,
//         (result: Result | undefined, err: unknown) => {
//           if (result) {
//             const text = result.getText();
//             setResultText(text);
//             setError(null);

//             if (!continuous) {
//               try {
//                 reader.reset?.();
//               } finally {
//                 stopTracks();
//                 setScanning(false);
//               }
//             }
//           } else if (err) {
//             setError("กำลังค้นหา QR/Barcode...");
//           }
//         }
//       );
//     } catch (e) {
//       console.error("startScan error:", e);
//       setError("ไม่สามารถเปิดกล้องได้ — ตรวจสอบสิทธิ์หรืออุปกรณ์");
//       setScanning(false);
//       stopTracks();
//     }
//   };

//   useEffect(() => {
//     return () => {
//       codeReaderRef.current?.reset?.();
//       stopTracks();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="min-h-screen p-4 bg-gray-100 font-thai">
//       <div className="max-w-xl mx-auto">
//         <h2 className="text-lg font-semibold mb-3">สแกน QR / Barcode</h2>

//         <div className="mb-3">
//           <div className="relative rounded-lg overflow-hidden ">
//             <video
//               ref={videoRef}
//               className="w-full h-64 object-cover"
//               playsInline
//               autoPlay
//               muted
//             />
//             <div className="absolute inset-0 pointer-events-none">
//               <div className="w-3/4 h-3/4 mx-auto my-4 border-2 border-brand-500 rounded-lg opacity-80" />
//             </div>
//           </div>

//           <div className="flex items-center justify-between mt-2 gap-2">
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => (scanning ? stopScan() : startScan())}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
//                   scanning
//                     ? "bg-red-500 hover:bg-red-600"
//                     : "bg-brand-600 hover:bg-brand-700"
//                 }`}
//               >
//                 <Camera className="w-5 h-5" />
//                 <span>{scanning ? "หยุดสแกน" : "เริ่มสแกน"}</span>
//               </button>

//               <label className="flex items-center gap-2 text-sm">
//                 <input
//                   type="checkbox"
//                   checked={continuous}
//                   onChange={(e) => setContinuous(e.target.checked)}
//                 />
//                 ต่อเนื่อง
//               </label>
//             </div>

//             <div className="text-sm text-gray-600">
//               {error || (scanning ? "กำลังสแกน..." : "พร้อมสแกน")}
//             </div>
//           </div>
//         </div>

//         {/* To-Do List */}
//         <div className="mt-4">
//           <h3 className="font-semibold mb-2">ผลลัพธ์จากการสแกน</h3>

//           {/* Input + Add */}
//           <div className="flex gap-2 mb-3">
//             <input
//               type="text"
//               className="flex-1 rounded-md border border-gray-300 px-3 py-2"
//               value={resultText}
//               placeholder="ผลลัพธ์ QR/Barcode"
//               readOnly
//             />
//             <button
//               onClick={() => {
//                 if (!resultText) return;
//                 setTodos((prev) => [...prev, resultText]);
//                 setResultText(""); // ล้าง input หลังเพิ่ม
//               }}
//               className="px-4 py-2 bg-green-500 text-white rounded-md"
//             >
//               Add
//             </button>
//           </div>

//           {/* List */}
//           <ul className="space-y-2">
//             {todos.map((item, idx) => (
//               <li
//                 key={idx}
//                 className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md shadow-sm"
//               >
//                 <span>{item}</span>
//                 <button
//                   onClick={() => {
//                     setTodos((prev) => prev.filter((_, i) => i !== idx));
//                   }}
//                   className="text-red-500 font-bold px-2 py-1 hover:bg-red-100 rounded"
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScanQR;

import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { Result } from "@zxing/library";
import { Camera } from "lucide-react";

type ZXingReaderWithReset = BrowserMultiFormatReader & { reset?: () => void };

const ScanQR: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<ZXingReaderWithReset | null>(null);
  const [scanning, setScanning] = useState(false);
  const [resultText, setResultText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<string[]>([]);

  const ensureReader = () => {
    if (!codeReaderRef.current) {
      codeReaderRef.current =
        new BrowserMultiFormatReader() as ZXingReaderWithReset;
    }
    return codeReaderRef.current!;
  };

  const stopTracks = () => {
    const v = videoRef.current;
    if (v?.srcObject instanceof MediaStream) {
      v.srcObject.getTracks().forEach((t) => t.stop());
      v.srcObject = null;
    }
  };

  const stopScan = () => {
    codeReaderRef.current?.reset?.();
    stopTracks();
    setScanning(false);
  };

  const startScan = async () => {
    setError(null);
    setResultText("");
    const v = videoRef.current;
    if (!v) {
      setError("ไม่พบ element วิดีโอ");
      return;
    }

    const reader = ensureReader();

    try {
      setScanning(true);

      await reader.decodeFromVideoDevice(
        undefined, // กล้องหลังอัตโนมัติ
        v,
        (result: Result | undefined, err: unknown) => {
          if (result) {
            const text = result.getText();
            setResultText(text);

            // ถ้า barcode ซ้ำกับ list ให้แจ้งเตือน แต่ไม่เพิ่มเอง
            if (todos.includes(text)) {
              setError("แสกนไปแล้ว");
            } else {
              setError(null);
            }
          } else if (err) {
            setError("กำลังค้นหา QR/Barcode...");
          }
        }
      );
    } catch (e) {
      console.error("startScan error:", e);
      setError("ไม่สามารถเปิดกล้องได้ — ตรวจสอบสิทธิ์หรืออุปกรณ์");
      setScanning(false);
      stopTracks();
    }
  };

  useEffect(() => {
    return () => {
      codeReaderRef.current?.reset?.();
      stopTracks();
    };
  }, []);

  // ตรวจสอบก่อน add ว่า resultText ซ้ำหรือไม่
  const handleAdd = () => {
    if (!resultText) return;
    if (todos.includes(resultText)) {
      setError("แสกนไปแล้ว");
      return;
    }
    setTodos((prev) => [...prev, resultText]);
    setResultText("");
    setError(null);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 font-thai">
      <div className="max-w-xl mx-auto">
        <h2 className="text-lg font-semibold mb-3">สแกน QR / Barcode</h2>

        {/* Video Preview */}
        <div className="mb-3">
          <div className="relative rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-96 object-cover"
              playsInline
              autoPlay
              muted
            />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-11/12 h-5/6 border-2 border-brand-500 rounded-lg opacity-80" />
            </div>
          </div>

          {/* ปุ่มสแกน */}
          <div className="flex items-center justify-between mt-2 gap-2">
            <button
              onClick={() => (scanning ? stopScan() : startScan())}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
                scanning
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-brand-600 hover:bg-brand-700"
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>{scanning ? "หยุดสแกน" : "เริ่มสแกน"}</span>
            </button>

            <div className="text-sm text-gray-600">
              {error || (scanning ? "กำลังสแกน..." : "พร้อมสแกน")}
            </div>
          </div>
        </div>

        {/* To-Do List */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">ผลลัพธ์จากการสแกน</h3>

          {/* Input + Add */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
              value={resultText}
              placeholder="ผลลัพธ์ QR/Barcode"
              readOnly
            />
            <button
              onClick={handleAdd}
              disabled={!resultText || todos.includes(resultText)}
              className={`px-4 py-2 text-white rounded-md ${
                !resultText || todos.includes(resultText)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Add
            </button>
          </div>

          {/* List */}
          <ul className="space-y-2">
            {todos.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md shadow-sm"
              >
                <span>{item}</span>
                <button
                  onClick={() =>
                    setTodos((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="text-red-500 font-bold px-2 py-1 hover:bg-red-100 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
