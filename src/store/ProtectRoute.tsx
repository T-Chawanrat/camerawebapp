import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/Auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const user = useAuth((state) => state.user);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return null; // หรือ <div>Loading...</div>
  }

  // ✅ เช็ค role
  if (allowedRoles && !allowedRoles.includes(Number(user.role_id))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
