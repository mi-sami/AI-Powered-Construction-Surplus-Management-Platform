import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiAction } from "../Utils/ApiHandler";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await handleApiAction({ action: "GET", target: "users" });
      
      // handleApiAction সরাসরি অ্যারে বা { data: [...] } যা-ই রিটার্ন করুক, তা হ্যান্ডেল করবে
      const usersList = Array.isArray(response) ? response : response?.data || [];

      const adminUser = usersList.find(
        (u) =>
          u.email?.trim().toLowerCase() === email.trim().toLowerCase() &&
          u.password === password &&
          (u.role === "admin" || u.accountType === "Admin")
      );

      if (!adminUser) {
        setError("Invalid admin credentials or unauthorized access.");
        setLoading(false);
        return;
      }

      // সতর্কতার জন্য দুই নামেই সেভ রাখা হলো, যাতে AdminProtectedRoute কোনোভাবেই ব্লক না করে
      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem("adminAuth", JSON.stringify(adminUser));

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Admin Login Error:", err);
      setError("Server error. Please check console or json-server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Admin Portal
        </h2>
        <p className="text-xs text-gray-500 text-center mb-6">
          Sign in with your administrator credentials
        </p>

        {error && (
          <div className="mb-4 p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;