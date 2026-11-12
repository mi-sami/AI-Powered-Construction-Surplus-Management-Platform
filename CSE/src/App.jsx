import React from "react";
import { Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route element={<AuthenticatedFolder />}>
          {/* Profile routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-advertisement" element={<AddNewAdvertisement />} />
          <Route
            path="/profile/edit-advertisement/:id"
            element={<EditAdvertisement />}
          />

          {/* Search Routes */}
          <Route path="/search" element={<SearchPage />} />

          {/* Product info */}
          <Route path="/product/:id" element={<ProductDetailsPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/requirements" element={<RequirementsPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
