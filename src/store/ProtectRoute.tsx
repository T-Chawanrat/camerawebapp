import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/Auth"; // ปรับ path ให้ตรงกับไฟล์ของคุณ

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
