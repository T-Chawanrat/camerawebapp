import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="font-thai relative flex flex-col items-center justify-center min-h-screen bg-white px-6 py-10 overflow-hidden sm:hidden">
      {/* หัวข้อ */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">ERROR</h1>

      {/* ภาพ 404 */}
      <img
        src="https://img5.pic.in.th/file/secure-sv1/4044af5018a72ad772c.png"
        alt="404"
        className="w-56 h-auto mb-6"
      />

      {/* ข้อความ */}
      <p className="text-base text-gray-600 text-center mb-8">
        ไม่พบหน้าที่คุณกำลังค้นหา!
      </p>

      {/* ปุ่มกลับหน้าแรก */}
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow hover:bg-gray-50"
      >
        กลับสู่หน้าหลัก
      </Link>

      {/* Footer */}
      <p className="absolute bottom-4 text-xs text-gray-500 text-center">
        &copy; {new Date().getFullYear()} - Trantech
      </p>
    </div>
  );
}
