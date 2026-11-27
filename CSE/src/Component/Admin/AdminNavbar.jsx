import React from "react";
import { LogOut } from "lucide-react";
import Logo from "../../assets/surplusx_logo_transparent_white_text.png";

const AdminNavbar = ({
  navTabs,
  activeTab,
  setActiveTab,
  onLogout,
  pendingCount = 0,
}) => {
  return (
    <header className="bg-[#181a1b] text-white px-6 md:px-10 h-16 flex items-center justify-between shadow-sm">
      {/* Left: Brand Logo + Navigation Links */}
      <div className="flex items-center gap-8 h-full">
        <div
          onClick={() => setActiveTab("Flagged listings")}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
        >
          <img
            src={Logo}
            alt="Surplus Exchange Admin"
            className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Admin
          </span>
        </div>

        <nav className="flex items-center gap-6 h-full overflow-x-auto">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative h-full flex items-center gap-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span>{tab}</span>
                {tab === "Account Approvals" && pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-gradient-to-r from-[#5b21b6] to-[#9333ea] text-white">
                    {pendingCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 right-0 bottom-2.5 h-[2.5px] rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.75)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: Rounded Pill Logout Button */}
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-[11px] font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer shrink-0"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Logout</span>
      </button>
    </header>
  );
};

export default AdminNavbar;