import { Camera, Save } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "../store/Auth";
import Button from "../components/Button";

export default function CameraPage() {
  const { user } = useAuth();
  const [images, setImages] = useState<File[]>([]);
  const [showLimitAlert, setShowLimitAlert] = useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);
  const browseRef = useRef<HTMLInputElement>(null);

  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const handleAddImage = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    if (images.length + newFiles.length > 5) {
      setShowLimitAlert(true);
      return;
    }
    setImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col relative font-thai">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-md font-semibold text-gray-700">{today}</span>
        <span className="text-md font-semibold text-gray-700">
          {user?.first_name} {user?.last_name}
        </span>
      </div>

      <div className="mt-6 mb-6 flex flex-col ">
        <label className="mb-2 text-gray-700 font-semibold">เลขที่บิล</label>
        <input
          type="text"
          placeholder="DO"
          className="border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
        />
      </div>

      <label className="mb-2 text-gray-700 font-semibold">รูปภาพ</label>
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

      {/* Camera Button */}
      {/* <button
          onClick={() => cameraRef.current?.click()}
          className="w-full mb-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors"
        >
          ถ่ายรูป
        </button> */}

      {/* Hidden Inputs */}

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
      <div className="flex flex-wrap gap-2">
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

      <div className="mt-4 flex flex-col">
        <label className="mb-2 text-gray-700 font-semibold">หมายเหตุ</label>
        <input
          type="text"
          placeholder="กรอกหมายเหตุ"
          className="border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
        />
      </div>
      <Button className="mt-6 w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg">
        <Save className="w-6 mr-1" />
        <p className="text-md">บันทึก</p>
      </Button>

      {/* Toast Limit */}
      {showLimitAlert && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg animate-slidein">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="font-medium">สูงสุดไม่เกิน 5 รูป</span>
          </div>
        </div>
      )}
    </div>
  );
}
