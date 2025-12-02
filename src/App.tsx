import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./store/ProtectRoute";
import CameraFormPage from "./page/CameraFormPage";
import NotFound from "./page/NotFound";
import SignIn from "./page/SignIn";
import SearchSerial from "./page/SearchSerial";

export default function App() {
  return (
    <Router basename="/qr">
      <Routes>
        {/* Protected Routes */}
        {/* <Route
          path="/camera"
          element={
            <ProtectedRoute>
              <CameraFormPage />
            </ProtectedRoute>
          }
        /> */}

        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/camera" element={<CameraFormPage />} />
        <Route path="/sn" element={<SearchSerial />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
