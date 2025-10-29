import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./store/ProtectRoute";
import CameraFormPage from "./page/CameraFormPage";
import ScanQR from "./page/ScanQR";
import NotFound from "./page/NotFound";
import SignIn from "./page/SignIn";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        {/* <Route
          path="/camera"
          element={
            <ProtectedRoute>
              <CameraPage />
            // </ProtectedRoute>
          }
        /> */}

        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/camera" element={<CameraFormPage />} />
        <Route path="/qr" element={<ScanQR />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
