import { Camera } from "lucide-react";
import { useRef } from "react";
import { toast } from "react-toastify";

interface ImageUploadSectionProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export default function ImageUploadSection({
  images,
  onImagesChange,
}: ImageUploadSectionProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const browseRef = useRef<HTMLInputElement>(null);

  const handleAddImage = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    if (images.length + newFiles.length > 8) {
      toast.error("สูงสุดไม่เกิน 8 รูป");
      return;
    }
    onImagesChange([...images, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <>
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
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}