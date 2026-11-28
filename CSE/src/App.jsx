import React from "react";
import { Navigate, Route, Routes, useOutletContext } from "react-router-dom";
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

// অ্যাডমিন ড্যাশবোর্ডের সাব-কম্পোনেন্টগুলো
import FlaggedListings from "./Component/Admin/FlaggedListings/FlaggedListings";
import UserApprovals from "./Component/Admin/UserApprovalComponent/UserApprovals";
import AdminUsers from "./Component/Admin/AdminPageUserList/AdminUsers";
import AdminListings from "./Component/Admin/AdminPageListing/AdminListings";
import AdminReports from "./Component/Admin/AdminReports/AdminReports";
import AdminSettings from "./Component/Admin/AdminSettings/AdminSettings";

// Outlet context থেকে প্রপস পাস করার ব্রিজ কম্পোনেন্টসমূহ
const FlaggedRoute = () => {
  const { flaggedItems, setFlaggedItems, loading } = useOutletContext();
  return (
    <FlaggedListings
      flaggedItems={flaggedItems}
      setFlaggedItems={setFlaggedItems}
      loading={loading}
    />
  );
};

const ApprovalsRoute = () => {
  const { users, setUsers, loading } = useOutletContext();
  return <UserApprovals users={users} setUsers={setUsers} loading={loading} />;
};

const UsersRoute = () => {
  const { users, setUsers, loading } = useOutletContext();
  return <AdminUsers users={users} setUsers={setUsers} loading={loading} />;
};

const ListingsRoute = () => {
  const { listings, setListings, users, loading } = useOutletContext();
  return (
    <AdminListings
      listings={listings}
      setListings={setListings}
      users={users}
      loading={loading}
    />
  );
};

const ReportsRoute = () => {
  const { users, listings, flaggedItems } = useOutletContext();
  return (
    <AdminReports
      users={users}
      listings={listings}
      flaggedItems={flaggedItems}
    />
  );
};

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

        {/* Protected Admin Nested Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<Navigate to="flagged" replace />} />
            <Route path="flagged" element={<FlaggedRoute />} />
            <Route path="approvals" element={<ApprovalsRoute />} />
            <Route path="users" element={<UsersRoute />} />
            <Route path="listings" element={<ListingsRoute />} />
            <Route path="reports" element={<ReportsRoute />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;