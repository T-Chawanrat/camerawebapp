import { useState } from "react";
import { useAuth } from "../store/Auth";
import { toast } from "react-toastify";
import { Save } from "lucide-react";
import ScanQR from "./ScanQR";
import Upload from "./Upload";
import Remark from "./Remark";
import SignaturePad from "./SignaturePad";

export default function CameraFormPage() {
  const { user } = useAuth();
  const [images, setImages] = useState<File[]>([]);
  const [resultText, setResultText] = useState("");
  const [remark, setRemark] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const [resetSignature, setResetSignature] = useState(false);

  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!resultText.trim()) {
      toast.error("กรุณาสแกน QR Code หรือกรอกเลขที่บิล");
      return;
    }

    if (images.length === 0) {
      toast.error("กรุณาถ่ายรูปหรือเลือกรูปภาพ");
      return;
    }

    if (signatureBase64 === null) {
      toast.error("กรุณาเซ็นชื่อ");
      return;
    }

    let signatureFile: File | null = null;
    if (signatureBase64) {
      const arr = signatureBase64.split(",");
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      const u8arr = new Uint8Array(bstr.length);

      for (let i = 0; i < bstr.length; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }

      signatureFile = new File([u8arr], `signature_${Date.now()}.png`, {
        type: mime,
      });
    }

    const formData = new FormData();

    formData.append("user_id", user?.user_id || "");
    formData.append("receive_code", resultText);
    formData.append("name", user?.first_name || "");
    formData.append("surname", user?.last_name || "");
    formData.append("license_plate", user?.license_plate || "Null");
    formData.append("warehouse_name", "");
    formData.append("remark", remark);

    if (signatureFile) {
      formData.append("signature", signatureFile);
    }

    images.forEach((file) => {
      formData.append("images", file);
    });

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${apiUrl}/bills`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      toast.success("บันทึกสำเร็จ!");

      setResultText("");
      setImages([]);
      setRemark("");
      setSignatureBase64(null);
      setScanning(false);
      setError(null);
      setResetSignature(true);
      setTimeout(() => setResetSignature(false), 0);
      console.log("response:", data);
    } catch (err) {
      console.error("Error:", err);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <form className="min-h-screen p-4 bg-gray-50 flex flex-col font-thai sm:hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-md font-semibold text-gray-700">{today}</span>
        <span className="text-md font-semibold text-gray-700">
          {user?.first_name} {user?.last_name}
        </span>
      </div>

      {/* QR Scanner Section */}
      <ScanQR
        resultText={resultText}
        onResultChange={setResultText}
        scanning={scanning}
        error={error}
        onScanningChange={setScanning}
        onErrorChange={setError}
      />

      {/* Image Upload Section */}
      <Upload images={images} onImagesChange={setImages} />

      {/* Remark Input */}
      <Remark value={remark} onChange={setRemark} />

      {/* Signature Pad */}
      <SignaturePad
        onSignatureChange={setSignatureBase64}
        reset={resetSignature}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 active:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-6 h-6" />
        <p className="text-md">บันทึก</p>
      </button>
    </form>
  );
}
