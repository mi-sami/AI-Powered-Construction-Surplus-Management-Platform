import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AuthenticatedFolder from "./Component/AuthenticatedFolder/AuthenticatedFolder";
import AddNewAdvertisement from "./pages/AddNewAdvertisement";
import EditAdvertisement from "./pages/EditAdvertisement";
import SearchPage from "./pages/SearchPage";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsxProductDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import RequirementsPage from "./pages/RequirementsPage";
import AdvancePaymentPage from "./pages/AdvancePaymentPage";
import PaymentReceiptPage from "./pages/PaymentReceiptPage";

// অ্যাডমিন পেজ ও প্রোটেক্টেড রাউট
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./Component/AuthenticatedFolder/AdminProtectedRoute";

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Login URL */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected User Routes */}
        <Route element={<AuthenticatedFolder />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-advertisement" element={<AddNewAdvertisement />} />
          <Route
            path="/profile/edit-advertisement/:id"
            element={<EditAdvertisement />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/advance-payment/:id" element={<AdvancePaymentPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/requirements" element={<RequirementsPage />} />
          <Route path="/receipt/:orderId" element={<PaymentReceiptPage />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;