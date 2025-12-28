import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./store/ProtectRoute"; // ✅ เปิดใช้
import CameraFormPage from "./page/CameraFormPage";
import NotFound from "./page/NotFound";
import SignIn from "./page/SignIn";

export default function App() {
  return (
    <Router basename="/qr">
      <Routes>
        {/* Public */}
        <Route path="/" element={<SignIn />} />

        {/* Protected: role_id 1,6 เท่านั้น */}
        <Route
          path="/camera"
          element={
            <ProtectedRoute allowedRoles={[1, 6]}>
              <CameraFormPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
