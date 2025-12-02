import { useState, useEffect } from "react";
import axios from "axios";

type BillData = {
  id: number;
  SERIAL_NO: string;
  REFERENCE: string;
};

type ApiResponse =
  | BillData[]
  | { data: BillData[] }
  | { rows: BillData[] };

export default function SearchSerial() {
  const [allData, setAllData] = useState<BillData[]>([]);
  const [serialInput, setSerialInput] = useState("");
  const [matchedReference, setMatchedReference] = useState<string | null>(null);
  const [serialList, setSerialList] = useState<BillData[]>([]);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    setNotFound(false);
    setSerialList([]);

    if (!serialInput.trim()) return;

    if (!Array.isArray(allData)) {
      console.error("allData is not array:", allData);
      return;
    }

    const found = allData.find(
      (x) => x.SERIAL_NO.toLowerCase() === serialInput.toLowerCase()
    );

    if (!found) {
      setMatchedReference(null);
      setNotFound(true);
      return;
    }

    setMatchedReference(found.REFERENCE);

    const list = allData.filter((x) => x.REFERENCE === found.REFERENCE);
    setSerialList(list);
  };

  useEffect(() => {
    axios
      .get<ApiResponse>("https://xsendwork.com/api/bills-data")
      .then((res) => {
        const result = res.data;

        let arr: BillData[] = [];

        if (Array.isArray(result)) {
          arr = result;
        } else if ("data" in result && Array.isArray(result.data)) {
          arr = result.data;
        } else if ("rows" in result && Array.isArray(result.rows)) {
          arr = result.rows;
        } else {
          console.error("Unexpected API format:", result);
        }

        setAllData(arr);
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <div style={{ width: "350px", margin: "30px auto", fontFamily: "sans-serif" }}>
      <h2>ค้นหา SERIAL_NO → ดูกลุ่ม REFERENCE</h2>

      <input
        type="text"
        placeholder="ใส่ SERIAL_NO เช่น SHM25102422192"
        value={serialInput}
        onChange={(e) => setSerialInput(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <button
        onClick={handleSearch}
        style={{
          width: "100%",
          padding: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        ค้นหา
      </button>

      {notFound && (
        <p style={{ color: "red", marginTop: "10px" }}>
          ❌ ไม่พบ SERIAL_NO นี้ในระบบ
        </p>
      )}

      {matchedReference && (
        <div style={{ marginTop: "20px" }}>
          <h3>REFERENCE: {matchedReference}</h3>

          <h4>SERIAL ทั้งหมดในกลุ่มนี้:</h4>

          <ul>
            {serialList.map((item) => (
              <li key={item.id}>
                {item.SERIAL_NO} (id: {item.id})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
