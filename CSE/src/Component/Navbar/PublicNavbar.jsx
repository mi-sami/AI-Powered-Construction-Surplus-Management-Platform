import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/surplusx_logo_transparent_white_text.png";

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Smart tools", href: "#smart-tools" },
  ];

  return (
    <nav className="bg-[#1e232a] text-white px-6 py-3 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Logo + Links */}
        <div className="flex items-center space-x-10">
          <a href="#home" className="flex items-center cursor-pointer">
            <img
              src={logo}
              alt="Surplus Exchange Logo"
              className="h-11 md:h-12 w-auto object-contain"
            />
          </a>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveTab(link.name)}
                className={`relative py-1 transition-colors duration-200 ${
                  activeTab === link.name
                    ? "text-white font-semibold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {link.name}
                {activeTab === link.name && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#008ba9] rounded-full"></span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/login">
            <button className="px-5 py-2 text-sm font-medium text-gray-900 bg-white rounded hover:bg-gray-100 transition-all cursor-pointer">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-9 py-3 bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-[#4f5bd5]/30 transition-all cursor-pointer disabled:opacity-50">
              Register
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white focus:outline-none cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-3 pb-3 border-t border-gray-800 pt-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                setActiveTab(link.name);
                setIsOpen(false);
              }}
              className={`block px-2 py-1 text-base ${
                activeTab === link.name
                  ? "text-white font-semibold"
                  : "text-gray-400"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
