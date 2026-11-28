import React from "react";
import { NavLink, Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "../../assets/surplusx_logo_transparent_white_text.png";

const navItems = [
  { label: "Flagged listings", path: "/admin/dashboard/flagged" },
  { label: "Account Approvals", path: "/admin/dashboard/approvals" },
  { label: "Users", path: "/admin/dashboard/users" },
  { label: "Listings", path: "/admin/dashboard/listings" },
  { label: "Reports", path: "/admin/dashboard/reports" },
  { label: "Settings", path: "/admin/dashboard/settings" },
];

const AdminNavbar = ({ onLogout, pendingCount = 0 }) => {
  return (
    <header className="bg-[#181a1b] text-white px-6 md:px-10 h-16 flex items-center justify-between shadow-sm">
      {/* Left: Brand Logo + URL Navigation Links */}
      <div className="flex items-center gap-8 h-full">
        <Link
          to="/admin/dashboard/flagged"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <img
            src={Logo}
            alt="Surplus Exchange Admin"
            className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Admin
          </span>
        </Link>

        <nav className="flex items-center gap-6 h-full overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative h-full flex items-center gap-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {item.path.endsWith("/approvals") && pendingCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-gradient-to-r from-[#5b21b6] to-[#9333ea] text-white">
                      {pendingCount}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 right-0 bottom-2.5 h-[2.5px] rounded-full bg-purple-500 shadow-[0_0_8px_rgba(59,130,246,0.75)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
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