import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePad() {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => sigCanvas.current?.clear();

  // const save = () => {
  //   const dataUrl = sigCanvas.current
  //     ?.getTrimmedCanvas()
  //     .toDataURL("image/png");
  //   console.log("เซ็นแล้วได้รูป base64:", dataUrl);
  // };

  return (
    <div className="flex flex-col items-center space-y-2">
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: 400,
          height: 200,
          className: "border border-gray-400 rounded-md",
        }}
      />
      <div className="space-x-2 flex justify-end w-full">
        <button onClick={clear} className=" px-6 py-1 bg-brand-600 text-white rounded-md">
          ล้าง
        </button>
        {/* <button
          onClick={save}
          className="px-3 py-1 bg-brand-600 text-white rounded"
        >
          บันทึก
        </button> */}
      </div>
    </div>
  );
}
