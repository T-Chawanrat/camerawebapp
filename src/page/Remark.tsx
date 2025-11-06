interface RemarkInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RemarkInput({ value, onChange }: RemarkInputProps) {
  return (
    <div className="mt-2 mb-4 flex flex-col">
      <label className="mb-2 text-gray-700 font-semibold">หมายเหตุ</label>
      <input
        type="text"
        placeholder="กรอกหมายเหตุ"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
      />
    </div>
  );
}