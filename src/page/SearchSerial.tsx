import { useState } from "react";

type BillData = {
  id: number;
  SERIAL_NO: string;
  REFERENCE: string;
  warehouse_accept?: "Y" | "N" | null;
  dc_accept?: "Y" | "N" | null;
};

type SearchBySerialResponse = {
  success: boolean;
  reference: string;
  rows: BillData[];
  count: number;
  message?: string;
};

type Props = {
  value: string; // serial input (ของคุณคือ resultText)
  onChange: (v: string) => void; // setResultText
  apiBaseUrl: string; // import.meta.env.VITE_API_URL
  onFound: (payload: {
    reference: string;
    rows: BillData[];
    serials: string[];
  }) => void; // ส่งผลกลับไปให้หน้าหลัก
  onError?: (msg: string | null) => void; // ให้หน้าหลักโชว์ error ได้
};

export default function SearchSerial({
  value,
  onChange,
  apiBaseUrl,
  onFound,
  onError,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const serial = value.trim();
    if (!serial) {
      onError?.("กรุณาสแกนหรือกรอกเลขที่กล่อง (S/N) ก่อน");
      return;
    }

    setLoading(true);
    onError?.(null);

    try {
      const res = await fetch(
        `${apiBaseUrl}/bills-data/by-serial?serial=${encodeURIComponent(serial)}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          onError?.("ไม่พบ S/N นี้ในระบบ");
          return;
        }
        onError?.("ค้นหาไม่สำเร็จ (server error)");
        return;
      }

      const json = (await res.json()) as SearchBySerialResponse;

      const rows = json.rows || [];
      onFound({
        reference: json.reference,
        rows,
        serials: rows.map((x) => x.SERIAL_NO),
      });
    } catch (e) {
      console.error(e);
      onError?.("เกิดข้อผิดพลาดในการค้นหา");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 mb-4 flex flex-col gap-2">
      <label className="text-gray-700 font-semibold">เลขที่กล่อง (S/N)</label>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="S/N"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
        />

        <button
          type="button"
          onClick={handleSearch}
          disabled={!value.trim() || loading}
          className={`px-3 py-2 rounded-md text-white text-sm ${
            loading ? "bg-gray-400" : "bg-brand-600 hover:bg-brand-700"
          }`}
        >
          ค้นหา
        </button>
      </div>
    </div>
  );
}
