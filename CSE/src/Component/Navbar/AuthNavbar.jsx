import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/surplusx_logo_transparent_white_text.png';
import NotificationBell from './NotificationBell';

const AuthNavbar = ({ user }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Search', path: '/search' },
    { name: 'Requirements', path: '/requirements' },
    { name: 'Profile', path: '/profile' },
  ];

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

        {/* Desktop Navigation Links + Notification Bell */}
        <div className="flex items-center space-x-5 md:space-x-6 text-sm font-medium">
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `pb-1.5 transition-all duration-200 ${
                    isActive
                      ? 'text-white border-b-2 border-[#3f4bc2] font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

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
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsAuthOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#2a3038] text-white border-l-4 border-[#008ba9] font-semibold'
                    : 'text-gray-300 hover:bg-[#252b33] hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default AuthNavbar;