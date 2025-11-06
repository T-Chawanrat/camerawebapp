import { Camera, Save } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "../store/Auth";
import { toast } from "react-toastify";
// import Button from "../components/Button";
import SignaturePad from "./SignaturePad";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { Result } from "@zxing/library";

type ZXingReaderWithReset = BrowserMultiFormatReader & { reset?: () => void };

export default function CameraFormPage() {
  const { user } = useAuth();
  const [images, setImages] = useState<File[]>([]);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [resultText, setResultText] = useState("");
  const [remark, setRemark] = useState("");
  const cameraRef = useRef<HTMLInputElement>(null);
  const browseRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<ZXingReaderWithReset | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  // --- Handle Images ---
  const handleAddImage = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    if (images.length + newFiles.length > 8) {
      setShowLimitAlert(true);
      return;
    }
    setImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- ZXing Scanner ---
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
    const v = videoRef.current;
    if (!v) {
      setError("ไม่พบ element วิดีโอ");
      return;
    }

    const reader = ensureReader();

    try {
      setScanning(true);

      await reader.decodeFromVideoDevice(
        undefined,
        v,
        (result: Result | undefined) => {
          if (result) {
            const text = result.getText();
            setResultText(text);
            setError(null);
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

    const formData = new FormData();

    formData.append("user_id", user?.user_id || "");
    formData.append("receive_code", resultText);
    formData.append("name", user?.first_name || "");
    formData.append("surname", user?.last_name || "");
    formData.append(
      "license_plate",
      user?.license_plate || "Null"
    );
    formData.append("warehouse_name", "");
    formData.append("remark", remark);

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch("http://localhost:8000/bills", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      toast.success("บันทึกสำเร็จ!");
      console.log("response:", data);
    } catch (err) {
      console.error("Error:", err);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <form className="min-h-screen p-4 bg-gray-100 flex flex-col font-thai">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-md font-semibold text-gray-700">{today}</span>
        <span className="text-md font-semibold text-gray-700">
          {user?.first_name} {user?.last_name}
        </span>
      </div>

      {/* QR/Barcode Scanner */}
      <div className="mb-4">
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

        <div className="flex items-center gap-4 mt-3">
          <button
            type="button"
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
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>

      {/* DO Input (รับผลจาก QR/Barcode) */}
      <div className="mt-2 mb-4 flex flex-col">
        <label className="mb-2 text-gray-700 font-semibold">
          เลขที่บิล (DO)
        </label>
        <input
          type="text"
          placeholder="DO"
          value={resultText}
          onChange={(e) => setResultText(e.target.value)}
          className="border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
        />
      </div>

      {/* Images */}
      <label className="mt-4 mb-2 text-gray-700 font-semibold">รูปภาพ</label>
      <div
        className="upload-area flex flex-col items-center justify-center p-6 border-2 border-dashed border-brand-600 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-4"
        onClick={() => browseRef.current?.click()}
      >
        <Camera className="h-8 w-8 text-brand-500 mb-3" />
        <p className="text-brand-500 text-sm text-center">
          ถ่ายรูป หรือเลือกจากแกลเลอรี <br />
          หลายรูปได้
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraRef}
        onChange={(e) => handleAddImage(e.target.files)}
      />
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={browseRef}
        onChange={(e) => handleAddImage(e.target.files)}
      />

      {/* Thumbnails */}
      <div className="flex flex-wrap gap-2 mb-4">
        {images.map((img, idx) => {
          const url = URL.createObjectURL(img);
          return (
            <div
              key={idx}
              className="relative w-23 h-24 rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={url}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* หมายเหตุ */}
      <div className="mt-2 mb-4 flex flex-col">
        <label className="mb-2 text-gray-700 font-semibold">หมายเหตุ</label>
        <input
          type="text"
          placeholder="กรอกหมายเหตุ"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
        />
      </div>

      <SignaturePad />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 active:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-6 h-6" />
        <p className="text-md">บันทึก</p>
      </button>

      {/* Toast Limit */}
      {showLimitAlert && (
        <div
          onClick={() => setShowLimitAlert(false)}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg ">
            <span className="font-medium flex-1">สูงสุดไม่เกิน 8 รูป X</span>
          </div>
        </div>
      )}
    </form>
  );
}
