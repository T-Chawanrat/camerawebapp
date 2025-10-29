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
        (result: Result | undefined) => {
          if (result) {
            const text = result.getText();

            // ถ้าผลใหม่ไม่ซ้ำ
            if (!todos.includes(text)) {
              setResultText(text);
              setError(null);
            } else {
              // ถ้าซ้ำ
              setResultText(text);
              setError("แสกนไปแล้ว");
            }
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
      <div className="max-w-xl mx-auto mt-3">
        <h2 className="text-lg font-semibold mb-3">สแกน QR / Barcode</h2>

        {/* กล้อง */}
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
          <div className="flex items-center justify-between mt-4 gap-2">
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

            {/* แสดงข้อความผิดพลาดเฉพาะตอนซ้ำ */}
            {error === "แสกนไปแล้ว" && (
              <p className="text-red-500">{error}</p>
            )}
          </div>
        </div>

        {/* ช่องผลลัพธ์ */}
        <div className="mt-6">
          <div className="flex gap-2 mb-1">
            <input
              type="text"
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              placeholder="แสกนหรือกรอกโค้ด"
              className="border p-2 rounded w-full mb-3"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 text-white rounded-md bg-green-500 hover:bg-green-600 transition-colors duration-200 h-[42px]"
            >
              เพิ่ม
            </button>
          </div>

          {/* รายการที่สแกนแล้ว */}
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
                  X
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
