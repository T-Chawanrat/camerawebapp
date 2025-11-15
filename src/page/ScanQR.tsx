import { Camera } from "lucide-react";
import { useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { Result } from "@zxing/library";

type ZXingReaderWithReset = BrowserMultiFormatReader & { reset?: () => void };

interface ScanQR {
  resultText: string;
  onResultChange: (text: string) => void;
  scanning: boolean;
  error: string | null;
  onScanningChange: (scanning: boolean) => void;
  onErrorChange: (error: string | null) => void;
}

export default function ScanQR({
  resultText,
  onResultChange,
  scanning,
  error,
  onScanningChange,
  onErrorChange,
}: ScanQR) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<ZXingReaderWithReset | null>(null);

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
    onScanningChange(false);
  };

  const startScan = async () => {
    onErrorChange(null);
    const v = videoRef.current;
    if (!v) {
      onErrorChange("ไม่พบ element วิดีโอ");
      return;
    }

    const reader = ensureReader();

    try {
      onScanningChange(true);

      await reader.decodeFromVideoDevice(
        undefined,
        v,
        (result: Result | undefined) => {
          if (result) {
            const text = result.getText();
            onResultChange(text);
            onErrorChange(null);
            // onScanningChange(false);
          }
        }
      );
    } catch (e) {
      console.error("startScan error:", e);
      onErrorChange("กรุณาอนุญาตการเข้าถึงกล้อง");
      onScanningChange(false);
      stopTracks();
    }
  };

  useEffect(() => {
    if (!scanning) {
      stopScan();
    }
  }, [scanning]);

  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);

  return (
    <>
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
          onChange={(e) => onResultChange(e.target.value)}
          className="bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
        />
      </div>
    </>
  );
}
