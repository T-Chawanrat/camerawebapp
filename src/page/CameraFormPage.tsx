// import { useState } from "react";
// import { useAuth } from "../store/Auth";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { Save } from "lucide-react";
// import ScanQR from "./ScanQR";
// import Upload from "./Upload";
// import Remark from "./Remark";
// import SignaturePad from "./SignaturePad";
// import { ChevronDown, LogOut } from "lucide-react";
// import QrFromImageButton from "./QrFromImageButton";

// export default function CameraFormPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [images, setImages] = useState<File[]>([]);
//   const [resultText, setResultText] = useState("");
//   const [remark, setRemark] = useState("");
//   const [scanning, setScanning] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
//   const [resetSignature, setResetSignature] = useState(false);
//   const [openUserMenu, setOpenUserMenu] = useState(false);

//   const today = new Date().toLocaleDateString("th-TH", {
//     weekday: "short",
//     day: "2-digit",
//     month: "2-digit",
//     year: "2-digit",
//   });

//   const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();

//     if (!resultText.trim()) {
//       toast.error("กรุณาสแกน QR Code หรือกรอกเลขที่บิล");
//       return;
//     }

//     if (images.length === 0) {
//       toast.error("กรุณาถ่ายรูปหรือเลือกรูปภาพ");
//       return;
//     }

//     if (signatureBase64 === null) {
//       toast.error("กรุณาเซ็นชื่อ");
//       return;
//     }

//     let signatureFile: File | null = null;
//     if (signatureBase64) {
//       const arr = signatureBase64.split(",");
//       const mime = arr[0].match(/:(.*?);/)![1];
//       const bstr = atob(arr[1]);
//       const u8arr = new Uint8Array(bstr.length);

//       for (let i = 0; i < bstr.length; i++) {
//         u8arr[i] = bstr.charCodeAt(i);
//       }

//       signatureFile = new File([u8arr], `signature_${Date.now()}.png`, {
//         type: mime,
//       });
//     }

//     const formData = new FormData();

//     formData.append("user_id", user?.user_id || "");
//     formData.append("receive_code", resultText);
//     formData.append("name", user?.first_name || "");
//     formData.append("surname", user?.last_name || "");
//     formData.append("license_plate", user?.license_plate || "Null");
//     // formData.append("warehouse_name", "");
//     formData.append("remark", remark);

//     if (signatureFile) {
//       formData.append("signature", signatureFile);
//     }

//     images.forEach((file) => {
//       formData.append("images", file);
//     });

//     const apiUrl = import.meta.env.VITE_API_URL;

//     try {
//       const res = await fetch(`${apiUrl}/bills`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Upload failed");
//       const data = await res.json();
//       toast.success("บันทึกสำเร็จ!");

//       setResultText("");
//       setImages([]);
//       setRemark("");
//       setSignatureBase64(null);
//       setScanning(false);
//       setError(null);
//       setResetSignature((prev) => !prev);
//       console.log("response:", data);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error("เกิดข้อผิดพลาดในการบันทึก");
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/", { replace: true });
//   };

//   return (
//     <form className="min-h-screen p-4 bg-gray-50 flex flex-col font-thai sm:hidden">
//       <div className="flex justify-between items-center mb-4">
//         <span className="text-md font-semibold text-gray-700">{today}</span>

//         <div className="relative">
//           <button
//             type="button"
//             onClick={() => setOpenUserMenu((prev) => !prev)}
//             className="flex items-center gap-1 text-md font-semibold text-gray-700"
//           >
//             <span className="">
//               {user?.first_name} {user?.last_name}
//             </span>
//             <ChevronDown
//               className={`w-4 h-4 transition-transform ${
//                 openUserMenu ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {openUserMenu && (
//             <div className="absolute right-0 mt-2 w-28 rounded-lg bg-white shadow-md border border-gray-200 z-10">
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="w-full text-left px-3 py-2 text-md font-semibold text-red-500"
//               >
//                 <LogOut className="w-4 h-4 inline-block mr-1" /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* QR Scanner Section */}
//       <ScanQR
//         resultText={resultText}
//         onResultChange={setResultText}
//         scanning={scanning}
//         error={error}
//         onScanningChange={setScanning}
//         onErrorChange={setError}
//       />

//       <QrFromImageButton
//         onResultChange={(text) => setResultText(text)}
//         onErrorChange={(msg) => setError(msg)}
//       />

//       {/* Image Upload Section */}
//       <Upload images={images} onImagesChange={setImages} />

//       {/* Remark Input */}
//       <Remark value={remark} onChange={setRemark} />

//       {/* Signature Pad */}
//       <SignaturePad
//         onSignatureChange={setSignatureBase64}
//         reset={resetSignature}
//       />

//       {/* Submit Button */}
//       <button
//         onClick={handleSubmit}
//         className="mt-6 w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 active:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         <Save className="w-6 h-6" />
//         <p className="text-md">บันทึก</p>
//       </button>
//     </form>
//   );
// }

import { useState, useEffect } from "react";
import { useAuth } from "../store/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, ChevronDown, LogOut } from "lucide-react";

import ScanQR from "./ScanQR";
import Upload from "./Upload";
import Remark from "./Remark";
import SignaturePad from "./SignaturePad";
import QrFromImageButton from "./QrFromImageButton";

// 👇 type สำหรับข้อมูลที่ใช้ค้นหา
type BillData = {
  id: number;
  SERIAL_NO: string;
  REFERENCE: string;
};

// 👇 ให้รองรับทั้งแบบ array ตรง ๆ และแบบ { data: [...] } / { rows: [...] }
type BillsApiResponse =
  | BillData[]
  | { data: BillData[] }
  | { rows: BillData[] };

export default function CameraFormPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [images, setImages] = useState<File[]>([]);
  const [resultText, setResultText] = useState("");
  const [remark, setRemark] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const [resetSignature, setResetSignature] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [allData, setAllData] = useState<BillData[]>([]);
  const [searchingSerial, setSearchingSerial] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [serialsInReference, setSerialsInReference] = useState<string[]>([]);

  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  // ⬇️ ดึงข้อมูล bills-data มาเก็บไว้ครั้งเดียวตอนเปิดหน้า
  useEffect(() => {
    const fetchBillsData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/bills-data`);

        if (!res.ok) {
          console.error("โหลดข้อมูล bills-data ไม่สำเร็จ");
          return;
        }

        const json: BillsApiResponse = await res.json();

        let arr: BillData[] = [];
        if (Array.isArray(json)) {
          arr = json;
        } else if ("data" in json && Array.isArray(json.data)) {
          arr = json.data;
        } else if ("rows" in json && Array.isArray(json.rows)) {
          arr = json.rows;
        } else {
          console.error("รูปแบบข้อมูล bills-data ไม่คาดคิด:", json);
        }

        setAllData(arr);
      } catch (e) {
        console.error("Error โหลด bills-data:", e);
      }
    };

    fetchBillsData();
  }, []);

  // ⬇️ ฟังก์ชันค้นหา S/N → REFERENCE และดึง serial ทั้งกลุ่ม
  const handleSearchSerial = () => {
    const serial = resultText.trim();
    if (!serial) {
      setError("กรุณาสแกนหรือกรอกเลขที่กล่อง (S/N) ก่อน");
      return;
    }

    setSearchingSerial(true);
    setError(null);
    setReference(null);
    setSerialsInReference([]);

    if (!Array.isArray(allData) || allData.length === 0) {
      setError("ยังไม่มีข้อมูลสำหรับค้นหา (โหลดข้อมูลไม่สำเร็จ)");
      setSearchingSerial(false);
      return;
    }

    // หา record ที่มี SERIAL_NO ตรงกับที่กรอก
    const found = allData.find(
      (x) => x.SERIAL_NO.toLowerCase() === serial.toLowerCase()
    );

    if (!found) {
      setError("ไม่พบ S/N นี้ในระบบ");
      setSearchingSerial(false);
      return;
    }

    setReference(found.REFERENCE);

    // ดึง serial ทั้งหมดที่อยู่ใน REFERENCE เดียวกัน
    const list = allData
      .filter((x) => x.REFERENCE === found.REFERENCE)
      .map((x) => x.SERIAL_NO);

    setSerialsInReference(list);
    setSearchingSerial(false);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!resultText.trim()) {
      toast.error("กรุณาสแกน QR Code หรือกรอกเลขที่บิล");
      return;
    }

    if (!reference) {
      toast.error("กรุณากดค้นหา S/N เพื่อให้ได้ REFERENCE ก่อนบันทึก");
      return;
    }

    if (images.length === 0) {
      toast.error("กรุณาถ่ายรูปหรือเลือกรูปภาพ");
      return;
    }

    if (!signatureBase64) {
      toast.error("กรุณาเซ็นชื่อ");
      return;
    }

    // แปลง signature base64 → File
    const arr = signatureBase64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    const signatureFile = new File([u8arr], `signature_${Date.now()}.png`, {
      type: mime,
    });

    const formData = new FormData();
    formData.append("user_id", user?.user_id || "");
    formData.append("REFERENCE", reference);
    formData.append("name", user?.first_name || "");
    formData.append("surname", user?.last_name || "");
    formData.append("license_plate", user?.license_plate || "Null");
    formData.append("remark", remark);
    formData.append("signature", signatureFile);
    images.forEach((file) => formData.append("images", file));

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${apiUrl}/bills`, {
        method: "POST",
        body: formData,
      });

 type ApiResponse = {
    message?: string;
    id?: number;
    [key: string]: unknown; // กัน error เวลา backend ส่ง field อื่นมา
  };

  let data: ApiResponse = {};


  try {
    data = (await res.json()) as ApiResponse;
  } catch {
  //
}


  if (!res.ok) {
    const msg =
      data.message ||
      "เกิดข้อผิดพลาดในการบันทึก (ไม่สามารถสร้างบิลได้)";

    toast.error(msg);
    return;
  }

      toast.success("บันทึกสำเร็จ!");

      setResultText("");
      setImages([]);
      setRemark("");
      setSignatureBase64(null);
      setScanning(false);
      setError(null);
      setReference(null);
      setSerialsInReference([]);
      setResetSignature((p) => !p);
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <form className="min-h-screen p-4 bg-gray-50 flex flex-col font-thai sm:hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-md font-semibold text-gray-700">{today}</span>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenUserMenu((prev) => !prev)}
            className="flex items-center gap-1 text-md font-semibold text-gray-700"
          >
            <span>
              {user?.first_name} {user?.last_name}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                openUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {openUserMenu && (
            <div className="absolute right-0 mt-2 w-28 rounded-lg bg-white shadow-md border border-gray-200 z-10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-md font-semibold text-red-500"
              >
                <LogOut className="w-4 h-4 inline-block mr-1" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 📸 สแกน QR */}
      <ScanQR
        resultText={resultText}
        onResultChange={setResultText}
        scanning={scanning}
        error={error}
        onScanningChange={setScanning}
        onErrorChange={setError}
      />

      {/* 🔍 ช่องกรอก S/N + ปุ่มค้นหา */}
      <div className="mt-2 mb-4 flex flex-col gap-2">
        <label className="text-gray-700 font-semibold">เลขที่กล่อง (S/N)</label>

        <div className="flex gap-2">
          {/* <input
            type="text"
            placeholder="S/N"
            value={resultText}
            onChange={(e) => {
              setResultText(e.target.value);
              if (error) setError(null);
            }}
            className="flex-1 bg-white border border-gray-400 rounded-md px-3 py-2"
          /> */}

          <input
            type="text"
            placeholder="S/N"
            value={resultText}
            onChange={(e) => {
              setResultText(e.target.value);
              if (error) setError(null);

              // 👉 เปลี่ยนเลข S/N แล้วให้เคลียร์ข้อมูลอ้างอิงเก่า
              setReference(null);
              setSerialsInReference([]);
            }}
            className="flex-1 bg-white border border-gray-400 rounded-md px-3 py-2"
          />

          <button
            type="button"
            onClick={handleSearchSerial}
            disabled={!resultText.trim() || searchingSerial}
            className={`px-3 py-2 rounded-md text-white text-sm ${
              searchingSerial ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {searchingSerial ? "ค้นหา..." : "ค้นหา"}
          </button>
        </div>

        <QrFromImageButton
          onResultChange={(text) => {
            setResultText(text);
            if (error) setError(null);
          }}
          onErrorChange={(msg) => setError(msg)}
        />

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        {/* 📦 ผลลัพธ์การค้นหา REFERENCE + serial list */}
        {reference && (
          <div className="mt-3 p-3 border rounded-md bg-gray-50 text-sm">
            <p>
              REFERENCE:{" "}
              <span className="font-semibold text-brand-700">{reference}</span>
            </p>

            {serialsInReference.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold mb-1">
                  Serial ทั้งหมดใน REFERENCE นี้
                </p>
                <ul className="list-disc pl-5 space-y-0.5">
                  {serialsInReference.map((sn) => (
                    <li key={sn}>{sn}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📤 Upload */}
      <Upload images={images} onImagesChange={setImages} />

      {/* 📝 Remark */}
      <Remark value={remark} onChange={setRemark} />

      {/* ✍️ Signature */}
      <SignaturePad
        onSignatureChange={setSignatureBase64}
        reset={resetSignature}
      />

      {/* 💾 Submit */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
      >
        <Save className="w-6 h-6" />
        <p className="text-md">บันทึก</p>
      </button>
    </form>
  );
}
