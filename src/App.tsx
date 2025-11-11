import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./store/ProtectRoute";

import CameraFormPage from "./page/CameraFormPage";
import NotFound from "./page/NotFound";
import Test from "./page/Test";
import SignIn from "./page/SignIn";

export default function App() {
  return (
    <Router basename="/qr">
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
        <Route path="/test" element={<Test />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
