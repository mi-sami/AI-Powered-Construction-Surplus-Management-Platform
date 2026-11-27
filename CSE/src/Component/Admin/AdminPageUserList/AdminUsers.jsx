import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { handleApiAction } from "../../../Utils/ApiHandler";
const AdminUsers = ({ users = [], setUsers, loading }) => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const accType = (u.accountType || u.type || "Individual").toLowerCase();
      const status = (u.status || "pending").toLowerCase();

      const matchesFilter =
        roleFilter === "all" ||
        (roleFilter === "company" && accType === "company") ||
        (roleFilter === "individual" && accType === "individual") ||
        (roleFilter === "suspended" && (u.isSuspended || status === "suspended"));

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const counts = useMemo(
    () => ({
      all: users.length,
      company: users.filter(
        (u) => (u.accountType || u.type || "").toLowerCase() === "company"
      ).length,
      individual: users.filter(
        (u) =>
          (u.accountType || u.type || "individual").toLowerCase() ===
          "individual"
      ).length,
      suspended: users.filter(
        (u) => u.isSuspended || (u.status || "").toLowerCase() === "suspended"
      ).length,
    }),
    [users]
  );

  const selectedUser = useMemo(() => {
    if (filteredUsers.length === 0) return null;
    return (
      filteredUsers.find(
        (u) => String(u.id || u._id) === String(selectedUserId)
      ) || filteredUsers[0]
    );
  }, [filteredUsers, selectedUserId]);

  const handleToggleSuspend = async (targetUser) => {
    if (!targetUser) return;
    const userId = targetUser.id || targetUser._id;
    const currentlySuspended =
      targetUser.isSuspended || targetUser.status === "suspended";
    const nextSuspended = !currentlySuspended;
    const nextStatus = nextSuspended ? "suspended" : "approved";

    setActionLoading(true);
    setToastMessage("");

    try {
      await handleApiAction({
        action: "EDIT",
        target: "users",
        payload: {
          id: userId,
          isSuspended: nextSuspended,
          status: nextStatus,
        },
      });

      setUsers((prev) =>
        prev.map((u) =>
          String(u.id || u._id) === String(userId)
            ? { ...u, isSuspended: nextSuspended, status: nextStatus }
            : u
        )
      );

      setToastMessage(
        nextSuspended
          ? `${targetUser.name}'s account has been suspended.`
          : `${targetUser.name}'s account has been re-activated.`
      );
    } catch (err) {
      console.error("Failed to update user status:", err);
      setToastMessage("Failed to update account status. Check backend server.");
    } finally {
      setActionLoading(false);
    }
  };

  const renderUserStatusBadge = (u) => {
    const status = (u.status || "pending").toLowerCase();
    if (u.isSuspended || status === "suspended") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border border-red-300 text-red-700 bg-red-50">
          <Ban className="w-3 h-3" /> Suspended
        </span>
      );
    }
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border border-purple-300 text-purple-800 bg-purple-100/80">
          <CheckCircle2 className="w-3 h-3 text-purple-700" /> Active
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border border-red-200 text-red-600 bg-red-50/70">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border border-violet-300 text-violet-800 bg-violet-50">
        <Clock className="w-3 h-3 text-violet-600" /> Pending
      </span>
    );
  };

  return (
    <>
      {/* Header + Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full mb-2">
            <Users className="w-3.5 h-3.5" /> Directory Management
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Registered Users
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Monitor all marketplace buyers, companies, and individual sellers.
          </p>
        </div>

        {/* Purple Pill Filter Tabs */}
        <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-white border border-purple-200/80 shadow-xs">
          {[
            { key: "all", label: "All Users", count: counts.all },
            { key: "company", label: "Companies", count: counts.company },
            { key: "individual", label: "Individuals", count: counts.individual },
            { key: "suspended", label: "Suspended", count: counts.suspended },
          ].map((tab) => {
            const active = roleFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setRoleFilter(tab.key);
                  setToastMessage("");
                }}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? "bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] text-white shadow-sm shadow-purple-600/30"
                    : "text-gray-600 hover:text-purple-800 hover:bg-purple-50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Users Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-purple-200/70 p-6 shadow-xs">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone number..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-purple-50/50 border border-purple-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-purple-900/80 text-xs font-bold text-gray-900">
                  <th className="pb-3 pr-4">User / Company</th>
                  <th className="pb-3 px-4">Type</th>
                  <th className="pb-3 px-4">Phone</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 pl-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500">
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const rowId = u.id || u._id;
                    const isSelected =
                      String(selectedUser?.id || selectedUser?._id) ===
                      String(rowId);
                    const accType = u.accountType || u.type || "Individual";

                    return (
                      <tr
                        key={rowId}
                        onClick={() => {
                          setSelectedUserId(rowId);
                          setToastMessage("");
                        }}
                        className={`cursor-pointer transition ${
                          isSelected
                            ? "bg-purple-50/90"
                            : "hover:bg-purple-50/40"
                        }`}
                      >
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-gray-900">
                            {u.name}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {u.email}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
                            {accType === "Company" ? (
                              <Building2 className="w-3 h-3" />
                            ) : accType === "Admin" ? (
                              <ShieldCheck className="w-3 h-3" />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                            {accType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-700">
                          {u.phone || "—"}
                        </td>
                        <td className="py-3.5 px-4 capitalize font-medium text-purple-900">
                          {u.role || "user"}
                        </td>
                        <td className="py-3.5 pl-4">
                          {renderUserStatusBadge(u)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right User Profile & Action Card */}
        {selectedUser && (
          <div className="lg:col-span-4 bg-white rounded-xl border border-purple-200/70 p-6 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedUser.name}
                </h2>
                <p className="text-[11px] font-semibold text-purple-700 mt-0.5">
                  {selectedUser.accountType || selectedUser.type || "Individual"}{" "}
                  • Joined {selectedUser.createdAt || "N/A"}
                </p>
              </div>
              {renderUserStatusBadge(selectedUser)}
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-gray-700 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="break-all">{selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{selectedUser.phone || "No phone provided"}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                <span>{selectedUser.address || "No address provided"}</span>
              </div>
              {(selectedUser.tradeLicenseNo || selectedUser.nidNo) && (
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="font-semibold text-gray-900">
                    {selectedUser.tradeLicenseNo
                      ? `Trade License: ${selectedUser.tradeLicenseNo}`
                      : `NID No: ${selectedUser.nidNo}`}
                  </span>
                </div>
              )}
            </div>

            {toastMessage && (
              <div className="mt-4 p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 font-medium">
                {toastMessage}
              </div>
            )}

            {/* Action Button (Hidden for Admin accounts) */}
            {selectedUser.role !== "admin" &&
              selectedUser.accountType !== "Admin" && (
                <div className="mt-6">
                  {selectedUser.isSuspended ||
                  selectedUser.status === "suspended" ? (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleToggleSuspend(selectedUser)}
                      className="w-full py-2.5 px-6 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {actionLoading ? "Updating..." : "Activate Account"}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleToggleSuspend(selectedUser)}
                      className="w-full py-2.5 px-6 rounded-full bg-white hover:bg-purple-50 text-purple-900 border border-purple-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Ban className="w-4 h-4 text-purple-700" />
                      <span>
                        {actionLoading ? "Updating..." : "Suspend Account"}
                      </span>
                    </button>
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;