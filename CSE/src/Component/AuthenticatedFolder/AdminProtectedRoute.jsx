import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthInfo from "../../Hook/useAuthInfo";

const AdminProtectedRoute = () => {
  const { user } = useAuthInfo();

  // ইউজার লগইন করা না থাকলে অথবা role "admin" না হলে /admin/login-এ পাঠিয়ে দেবে
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;