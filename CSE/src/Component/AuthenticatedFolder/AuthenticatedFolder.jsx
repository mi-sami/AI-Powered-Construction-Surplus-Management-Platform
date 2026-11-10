import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthInfo from '../../Hook/useAuthInfo';
import Navbar from '../Navbar/Navbar';

const AuthenticatedFolder = () => {
  const { user, loading } = useAuthInfo();
  const location = useLocation();

  // ১. Auth Check হওয়া পর্যন্ত লোডার দেখাবে
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f2]">
        <span className="text-gray-600 font-medium">Checking authentication...</span>
      </div>
    );
  }

  // ২. ইউজার লগইন থাকলে Navbar ও Outlet দেখাবে, নাহলে Login-এ পাঠাবে
  return user?.email ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default AuthenticatedFolder;