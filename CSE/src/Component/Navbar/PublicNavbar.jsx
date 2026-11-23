import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/surplusx_logo_transparent_white_text.png";

const PublicNavbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const isBangla = i18n.language?.startsWith("bn");

  const toggleLanguage = () => {
    i18n.changeLanguage(isBangla ? "en" : "bn");
  };

  const navLinks = [
    { id: "home", label: t("nav.home"), href: "#home" },
    { id: "how-it-works", label: t("nav.howItWorks"), href: "#how-it-works" },
    { id: "smart-tools", label: t("nav.smartTools"), href: "#smart-tools" },
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
                key={link.id}
                href={link.href}
                onClick={() => setActiveTab(link.id)}
                className={`relative py-1 transition-colors duration-200 ${
                  activeTab === link.id
                    ? "text-white font-semibold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {link.label}
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#3f4bc2] rounded-full"></span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side Buttons + Language Toggle */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            type="button"
            onClick={toggleLanguage}
            title="Switch Language"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#2a3038] border border-gray-700 hover:border-[#4f5bd5] text-gray-200 hover:text-white transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#4f5bd5]" />
            <span>{isBangla ? "EN" : "বাংলা"}</span>
          </button>

          <Link to="/login">
            <button className="px-5 py-2 text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition-all cursor-pointer rounded-full">
              {t("nav.login")}
            </button>
          </Link>
          <Link to="/register">
            <button className="px-9 py-3 bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-[#4f5bd5]/30 transition-all cursor-pointer disabled:opacity-50">
              {t("nav.register")}
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button + Language Toggle */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#2a3038] border border-gray-700 text-gray-200 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#4f5bd5]" />
            <span>{isBangla ? "EN" : "বাংলা"}</span>
          </button>

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
              key={link.id}
              href={link.href}
              onClick={() => {
                setActiveTab(link.id);
                setIsOpen(false);
              }}
              className={`block px-2 py-1 text-base ${
                activeTab === link.id
                  ? "text-white font-semibold"
                  : "text-gray-400"
              }`}
            >
              {link.label}
            </a>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1">
              <button className="w-full py-2 text-sm font-medium text-gray-900 bg-white rounded-full">
                {t("nav.login")}
              </button>
            </Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1">
              <button className="w-full py-2.5 bg-[#4f5bd5] text-white text-xs font-bold tracking-wider uppercase rounded-full">
                {t("nav.register")}
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;