import React from "react";
import { BarChart3, Users, Package, ShieldAlert, CheckCircle2 } from "lucide-react";

const AdminReports = ({ users = [], listings = [], flaggedItems = [] }) => {
  const approvedUsers = users.filter(
    (u) => (u.status || "").toLowerCase() === "approved"
  ).length;
  const activeListings = listings.filter(
    (l) => (l.status || "available").toLowerCase() === "available"
  ).length;
  const openFlags = flaggedItems.filter(
    (f) => (f.reviewStatus || "Open").toLowerCase() === "open"
  ).length;

  const stats = [
    {
      label: "Total Registered Users",
      value: users.length,
      icon: Users,
    },
    {
      label: "Verified Accounts",
      value: approvedUsers,
      icon: CheckCircle2,
    },
    {
      label: "Live Marketplace Listings",
      value: activeListings,
      icon: Package,
    },
    {
      label: "Open Flagged Cases",
      value: openFlags,
      icon: ShieldAlert,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full mb-2">
          <BarChart3 className="w-3.5 h-3.5" /> Analytics & Summary
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Platform Reports
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Real-time overview of marketplace users, listings, and moderation health.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-purple-200/70 p-6 shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReports;