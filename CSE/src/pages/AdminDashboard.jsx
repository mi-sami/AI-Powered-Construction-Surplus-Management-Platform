import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { handleApiAction } from "../Utils/ApiHandler";
import useAuthInfo from "../Hook/useAuthInfo";
import AdminNavbar from "../Component/Admin/AdminNavbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthInfo();
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [listingsData, usersData] = await Promise.all([
          handleApiAction({ action: "GET", target: "listings" }),
          handleApiAction({ action: "GET", target: "users" }),
        ]);

        const safeListings = Array.isArray(listingsData) ? listingsData : [];
        const safeUsers = Array.isArray(usersData) ? usersData : [];

        setListings(safeListings);
        setUsers(safeUsers);

        const mappedFlagged = safeListings
          .filter(
            (item) =>
              item.isSuspicious || item.status === "flagged" || item.riskLevel
          )
          .map((item) => {
            const seller = safeUsers.find(
              (u) => String(u.id || u._id) === String(item.sellerId)
            );
            return {
              id: item.id || item._id,
              type: "listing",
              title: `${item.title}, ${item.quantity} ${item.unit}`,
              sellerName: seller ? seller.name : `Seller #${item.sellerId}`,
              sellerId: item.sellerId,
              riskScore: item.riskScore || 82,
              level: item.riskLevel || "High",
              reviewStatus: item.reviewStatus || "Open",
              reasons: item.flagReasons || [
                "Price far below the typical price",
                "Same photo used in another listing",
                "Quantity changed several times",
              ],
              images: item.images || [],
              raw: item,
            };
          });

        const finalItems =
          mappedFlagged.length > 0
            ? mappedFlagged
            : [
                {
                  id: "l201",
                  type: "listing",
                  title: "Red Bricks, 2,000 pcs",
                  sellerName: "[Seller A]",
                  sellerId: "u101",
                  riskScore: 88,
                  level: "High",
                  reviewStatus: "Open",
                  reasons: [
                    "Price far below the typical price",
                    "Same photo used in another listing",
                    "Quantity changed several times",
                  ],
                  images: [],
                },
                {
                  id: "l202",
                  type: "listing",
                  title: "Cement, 80 bags",
                  sellerName: "[Seller B]",
                  sellerId: "u101",
                  riskScore: 64,
                  level: "Medium",
                  reviewStatus: "Open",
                  reasons: [
                    "Unusual bulk discount compared to local market",
                    "New account posting high-value inventory",
                  ],
                  images: [],
                },
                {
                  id: "u103",
                  type: "account",
                  title: "Seller account [C]",
                  sellerName: "—",
                  sellerId: "u103",
                  riskScore: 59,
                  level: "Medium",
                  reviewStatus: "Open",
                  reasons: [
                    "Multiple phone numbers linked to same device",
                    "Incomplete company verification documents",
                  ],
                  images: [],
                },
                {
                  id: "l204",
                  type: "listing",
                  title: "PVC Pipe, 40 m",
                  sellerName: "[Seller D]",
                  sellerId: "u104",
                  riskScore: 24,
                  level: "Low",
                  reviewStatus: "Closed",
                  reasons: ["Minor keyword mismatch in description"],
                  images: [],
                },
              ];

        setFlaggedItems(finalItems);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("adminAuth");
    if (setUser) setUser(null);
    navigate("/admin/login", { replace: true });
  };

  const pendingApprovalsCount = users.filter(
    (u) =>
      u.role !== "admin" &&
      u.accountType !== "Admin" &&
      (u.status || "pending").toLowerCase() === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900">
      <AdminNavbar
        onLogout={handleLogout}
        pendingCount={pendingApprovalsCount}
      />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <Outlet
          context={{
            users,
            setUsers,
            listings,
            setListings,
            flaggedItems,
            setFlaggedItems,
            loading,
          }}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;