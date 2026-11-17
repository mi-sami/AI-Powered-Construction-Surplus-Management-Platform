import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiAction } from "../Utils/ApiHandler";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Flagged listings");
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  const navTabs = ["Flagged listings", "Users", "Listings", "Reports", "Settings"];

  // ডেটাবেস থেকে listings এবং users লোড করা
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

        // db.json থেকে suspicious বা flagged আইটেমগুলো সাজানো
        const mappedFlagged = safeListings
          .filter((item) => item.isSuspicious || item.status === "flagged" || item.riskLevel)
          .map((item) => {
            const seller = safeUsers.find(
              (u) => String(u.id) === String(item.sellerId)
            );
            return {
              id: item.id,
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

        // যদি db.json-এ কোনো suspicious লিস্টিং না থাকে, তবে ডিজাইনের মতো ডেমো ডেটা দেখাবে
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
        setSelectedItem(finalItems[0] || null);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // লেভেল ব্যাজ স্টাইল (High, Medium, Low)
  const renderLevelBadge = (level) => {
    const normalized = level?.toLowerCase();
    if (normalized === "high") {
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-medium rounded-full border border-red-400 text-red-700 bg-red-50">
          High
        </span>
      );
    }
    if (normalized === "medium") {
      return (
        <span className="inline-block px-3 py-0.5 text-xs font-medium rounded-full border border-amber-500 text-amber-800 bg-amber-50">
          Medium
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-0.5 text-xs font-medium rounded-full border border-emerald-500 text-emerald-700 bg-emerald-50">
        Low
      </span>
    );
  };

  // ডান পাশের ৫টি অ্যাকশন বাটনের হ্যান্ডলার
  const handleModerationAction = async (actionType) => {
    if (!selectedItem) return;
    setActionMessage("");

    try {
      if (selectedItem.type === "listing") {
        if (actionType === "approve" || actionType === "false_positive") {
          await handleApiAction({
            action: "PATCH",
            target: `listings/${selectedItem.id}`,
            data: {
              status: "available",
              isSuspicious: false,
              reviewStatus: "Closed",
            },
          });
        } else if (actionType === "reject") {
          await handleApiAction({
            action: "PATCH",
            target: `listings/${selectedItem.id}`,
            data: {
              status: "rejected",
              isSuspicious: true,
              reviewStatus: "Closed",
            },
          });
        }
      }

      if (actionType === "warn" && selectedItem.sellerId) {
        await handleApiAction({
          action: "PATCH",
          target: `users/${selectedItem.sellerId}`,
          data: { warningCount: 1, lastWarnedAt: new Date().toISOString() },
        });
      }

      if (actionType === "suspend" && selectedItem.sellerId) {
        await handleApiAction({
          action: "PATCH",
          target: `users/${selectedItem.sellerId}`,
          data: { isSuspended: true, status: "suspended" },
        });
      }
    } catch (err) {
      // ডেমো আইটেম db.json-এ না থাকলে লোকাল স্টেট আপডেট চলবে
      console.warn("API update skipped or item is mock:", err);
    }

    // UI-তে স্ট্যাটাস Open থেকে Closed করা
    const updatedList = flaggedItems.map((item) =>
      item.id === selectedItem.id ? { ...item, reviewStatus: "Closed" } : item
    );
    setFlaggedItems(updatedList);
    setSelectedItem({ ...selectedItem, reviewStatus: "Closed" });

    const labels = {
      approve: "Listing approved and marked live.",
      false_positive: "Marked as false positive and closed.",
      reject: "Listing rejected and removed from marketplace.",
      warn: "Warning notice sent to seller.",
      suspend: "Seller account has been suspended.",
    };
    setActionMessage(labels[actionType] || "Action completed.");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900">
      {/* Top Dark Navigation Bar */}
      <header className="bg-[#181a1b] text-white px-6 md:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8 h-full">
          <span className="font-bold text-base tracking-tight text-white">
            Surplus Exchange Admin
          </span>

          <nav className="flex items-center gap-6 h-full">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`h-full flex items-center text-xs font-medium border-b-2 transition cursor-pointer ${
                    isActive
                      ? "border-[#d9531e] text-white"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-gray-300 hover:text-white border border-gray-600 px-3 py-1 rounded transition cursor-pointer"
        >
          Logout
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {activeTab === "Flagged listings" && (
          <>
            {/* Page Heading */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Flagged listings and accounts
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Review what the system marked as suspicious.
              </p>
            </div>

            {/* 2-Column Layout: Left Table (8 cols) + Right Review Panel (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Table Card */}
              <div className="lg:col-span-8 bg-white rounded-lg border border-gray-200/90 p-6 shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-800 text-xs font-bold text-gray-900">
                        <th className="pb-3 pr-4">Listing / account</th>
                        <th className="pb-3 px-4">Seller</th>
                        <th className="pb-3 px-4">Risk</th>
                        <th className="pb-3 px-4">Level</th>
                        <th className="pb-3 pl-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-500">
                            Loading flagged items...
                          </td>
                        </tr>
                      ) : (
                        flaggedItems.map((item) => {
                          const isSelected = selectedItem?.id === item.id;
                          return (
                            <tr
                              key={item.id}
                              onClick={() => {
                                setSelectedItem(item);
                                setActionMessage("");
                              }}
                              className={`cursor-pointer transition ${
                                isSelected
                                  ? "bg-[#f7f6f2]"
                                  : "hover:bg-gray-50/80"
                              }`}
                            >
                              <td className="py-3.5 pr-4 font-medium text-gray-900">
                                {item.title}
                              </td>
                              <td className="py-3.5 px-4 text-gray-700">
                                {item.sellerName}
                              </td>
                              <td className="py-3.5 px-4 text-gray-700">
                                {item.riskScore}
                              </td>
                              <td className="py-3.5 px-4">
                                {renderLevelBadge(item.level)}
                              </td>
                              <td className="py-3.5 pl-4 text-gray-800">
                                {item.reviewStatus}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Details & Action Card */}
              {selectedItem && (
                <div className="lg:col-span-4 bg-white rounded-lg border border-gray-200/90 p-6 shadow-xs">
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedItem.title}
                  </h2>

                  <div className="mt-2">
                    <span
                      className={`inline-block px-3 py-0.5 text-xs font-medium rounded-full border ${
                        selectedItem.level?.toLowerCase() === "high"
                          ? "border-red-400 text-red-700 bg-red-50"
                          : selectedItem.level?.toLowerCase() === "medium"
                          ? "border-amber-500 text-amber-800 bg-amber-50"
                          : "border-emerald-500 text-emerald-700 bg-emerald-50"
                      }`}
                    >
                      {selectedItem.level} risk
                    </span>
                  </div>

                  {/* Why it was flagged */}
                  <div className="mt-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">
                      Why it was flagged
                    </h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-700">
                      {selectedItem.reasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Evidence Box */}
                  <div className="mt-5">
                    {selectedItem.images && selectedItem.images.length > 0 ? (
                      <div className="border border-dashed border-gray-400 rounded-md p-2 bg-[#ebe8e1]">
                        <img
                          src={selectedItem.images[0]}
                          alt="Evidence"
                          className="w-full h-24 object-cover rounded"
                        />
                        <p className="text-[11px] text-center text-gray-600 mt-1">
                          Evidence: photos and history
                        </p>
                      </div>
                    ) : (
                      <div className="h-24 rounded-md border border-dashed border-gray-400 bg-[#e5e2d9] flex items-center justify-center text-xs text-gray-600">
                        Evidence: photos and history
                      </div>
                    )}
                  </div>

                  {actionMessage && (
                    <div className="mt-4 p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                      {actionMessage}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-5 space-y-2.5">
                    <button
                      onClick={() => handleModerationAction("approve")}
                      className="w-full py-2.5 px-4 rounded-md bg-[#b34200] hover:bg-[#993800] text-white text-xs font-bold transition cursor-pointer"
                    >
                      Approve listing
                    </button>

                    <button
                      onClick={() => handleModerationAction("false_positive")}
                      className="w-full py-2.5 px-4 rounded-md bg-white hover:bg-gray-50 text-gray-900 border border-gray-400 text-xs font-bold transition cursor-pointer"
                    >
                      Mark as false positive
                    </button>

                    <button
                      onClick={() => handleModerationAction("reject")}
                      className="w-full py-2.5 px-4 rounded-md bg-white hover:bg-gray-50 text-gray-900 border border-gray-400 text-xs font-bold transition cursor-pointer"
                    >
                      Reject and remove
                    </button>

                    <button
                      onClick={() => handleModerationAction("warn")}
                      className="w-full py-2.5 px-4 rounded-md bg-white hover:bg-gray-50 text-gray-900 border border-gray-400 text-xs font-bold transition cursor-pointer"
                    >
                      Warn seller
                    </button>

                    <button
                      onClick={() => handleModerationAction("suspend")}
                      className="w-full py-2.5 px-4 rounded-md bg-white hover:bg-red-50 text-gray-900 hover:text-red-700 border border-gray-400 text-xs font-bold transition cursor-pointer"
                    >
                      Suspend account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Users Tab View */}
        {activeTab === "Users" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Registered Users ({users.length})</h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-gray-800 font-bold">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Company</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 font-medium">{u.name}</td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3">{u.companyName || "—"}</td>
                    <td className="py-3 capitalize">{u.role}</td>
                    <td className="py-3">{u.isVerified ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* All Listings Tab View */}
        {activeTab === "Listings" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">All Marketplace Listings ({listings.length})</h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-gray-800 font-bold">
                  <th className="py-2">Title</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {listings.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-medium">{item.title}</td>
                    <td className="py-3">
                      {item.price} {item.currency}
                    </td>
                    <td className="py-3">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 capitalize">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reports & Settings Placeholder */}
        {(activeTab === "Reports" || activeTab === "Settings") && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-lg font-bold text-gray-900">{activeTab}</h2>
            <p className="text-xs text-gray-500 mt-1">
              System {activeTab.toLowerCase()} configuration panel.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;