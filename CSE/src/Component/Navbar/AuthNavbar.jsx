import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ShoppingBag, PlusCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/surplusx_logo_transparent_white_text.png';
import NotificationBell from './NotificationBell';

const AuthNavbar = ({ user }) => {
  const { t, i18n } = useTranslation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const location = useLocation();

  const buyPath = '/search';
  const sellPath = '/add-advertisement';

  const isBuyOrSellActive =
    location.pathname === buyPath || location.pathname === sellPath;

  const isBangla = i18n.language?.startsWith('bn');

  const toggleLanguage = () => {
    i18n.changeLanguage(isBangla ? 'en' : 'bn');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#1e232a] text-white px-6 md:px-12 py-3 border-b border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div>
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Surplus Exchange Logo"
              className="h-11 md:h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation Links + Language Toggle + Notification Bell */}
        <div className="flex items-center space-x-4 md:space-x-6 text-sm font-medium">
          <div className="hidden md:flex items-center space-x-6">
            {/* Dashboard */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `pb-1.5 transition-all duration-200 ${
                  isActive
                    ? 'text-white border-b-2 border-[#3f4bc2] font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {t('nav.dashboard')}
            </NavLink>

            {/* Buy & Sell Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1 pb-1.5 transition-all duration-200 cursor-pointer ${
                  isBuyOrSellActive
                    ? 'text-white border-b-2 border-[#3f4bc2] font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>{t('nav.buySell')}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2.5 w-48 bg-[#252b33] border border-gray-700 rounded-md shadow-xl py-1.5 z-50">
                  <Link
                    to={buyPath}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                      location.pathname === buyPath
                        ? 'bg-[#3f4bc2]/20 text-white font-semibold'
                        : 'text-gray-300 hover:bg-[#2f3640] hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-[#4f5bd5]" />
                    <span>{t('nav.buy')}</span>
                  </Link>

                  <Link
                    to={sellPath}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                      location.pathname === sellPath
                        ? 'bg-[#3f4bc2]/20 text-white font-semibold'
                        : 'text-gray-300 hover:bg-[#2f3640] hover:text-white'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    <span>{t('nav.sell')}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* AI Recommendation */}
            <NavLink
              to="/requirements"
              className={({ isActive }) =>
                `pb-1.5 transition-all duration-200 ${
                  isActive
                    ? 'text-white border-b-2 border-[#3f4bc2] font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {t('nav.aiRecommendation')}
            </NavLink>

            {/* Profile */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `pb-1.5 transition-all duration-200 ${
                  isActive
                    ? 'text-white border-b-2 border-[#3f4bc2] font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {t('nav.profile')}
            </NavLink>
          </div>

          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            title="Switch Language"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#2a3038] border border-gray-700 hover:border-[#4f5bd5] text-gray-200 hover:text-white transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#4f5bd5]" />
            <span>{isBangla ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* Notification Bell Component */}
          <NotificationBell userId={user?.id} />

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsAuthOpen(!isAuthOpen)}
              aria-label="Toggle Menu"
              className="text-gray-300 hover:text-white focus:outline-none cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isAuthOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isAuthOpen && (
        <div className="md:hidden mt-4 space-y-2 pb-3 border-t border-gray-800 pt-3">
          <NavLink
            to="/dashboard"
            onClick={() => setIsAuthOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#2a3038] text-white border-l-4 border-[#008ba9] font-semibold'
                  : 'text-gray-300 hover:bg-[#252b33] hover:text-white'
              }`
            }
          >
            {t('nav.dashboard')}
          </NavLink>

          {/* Mobile Buy & Sell Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setIsMobileDropdownOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
                isBuyOrSellActive
                  ? 'bg-[#2a3038] text-white border-l-4 border-[#008ba9] font-semibold'
                  : 'text-gray-300 hover:bg-[#252b33] hover:text-white'
              }`}
            >
              <span>{t('nav.buySell')}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMobileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isMobileDropdownOpen && (
              <div className="mt-1 ml-4 pl-3 border-l border-gray-700 space-y-1">
                <Link
                  to={buyPath}
                  onClick={() => {
                    setIsMobileDropdownOpen(false);
                    setIsAuthOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-300 hover:bg-[#252b33] hover:text-white"
                >
                  <ShoppingBag className="w-4 h-4 text-[#4f5bd5]" />
                  <span>{t('nav.buy')}</span>
                </Link>
                <Link
                  to={sellPath}
                  onClick={() => {
                    setIsMobileDropdownOpen(false);
                    setIsAuthOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-300 hover:bg-[#252b33] hover:text-white"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>{t('nav.sell')}</span>
                </Link>
              </div>
            )}
          </div>

          <NavLink
            to="/requirements"
            onClick={() => setIsAuthOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#2a3038] text-white border-l-4 border-[#008ba9] font-semibold'
                  : 'text-gray-300 hover:bg-[#252b33] hover:text-white'
              }`
            }
          >
            {t('nav.aiRecommendation')}
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setIsAuthOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#2a3038] text-white border-l-4 border-[#008ba9] font-semibold'
                  : 'text-gray-300 hover:bg-[#252b33] hover:text-white'
              }`
            }
          >
            {t('nav.profile')}
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default AuthNavbar;