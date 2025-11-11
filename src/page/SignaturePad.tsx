import { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSignatureChange: (base64: string | null) => void;
  reset?: boolean;
}

export default function SignaturePad({
  onSignatureChange,
  reset,
}: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
    onSignatureChange(null);
  };

  const handleEnd = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      // ใช้ toDataURL() โดยตรง ไม่ต้องใช้ getTrimmedCanvas()
      const base64 = sigCanvas.current.toDataURL("image/png");
      onSignatureChange(base64);
    } else {
      onSignatureChange(null);
    }
  };

  useEffect(() => {
    if (reset) clear();
  }, [reset]);

  return (
    <div>
      <label className="text-gray-700 font-semibold">ลายเซ็น</label>
      <div className="flex flex-col items-center space-y-4 mt-2">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          onEnd={handleEnd}
          canvasProps={{
            width: 350,
            height: 180,
            className: "border border-gray-400 rounded-md bg-white w-full",
          }}
        />
        <div className="flex justify-end w-full">
          <button
            type="button"
            onClick={clear}
            className="px-6 py-2 bg-brand-600 text-white rounded-md"
          >
            ล้าง
          </button>
        </div>
      </div>
    </div>
  );
}
