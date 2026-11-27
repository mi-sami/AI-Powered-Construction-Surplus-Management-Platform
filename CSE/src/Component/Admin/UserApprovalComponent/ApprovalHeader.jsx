import React from "react";
import { ShieldCheck } from "lucide-react";

const ApprovalHeader = ({ statusFilter, onFilterChange, counts }) => {
  const filterTabs = [
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "rejected", label: "Rejected", count: counts.rejected },
    { key: "all", label: "All", count: counts.all },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
      <div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Verification Queue
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Account Approvals
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Verify NID or Trade License documents before granting marketplace
          login access.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-white border border-purple-200/80 shadow-xs">
        {filterTabs.map((tab) => {
          const active = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
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
  );
};

export default ApprovalHeader;