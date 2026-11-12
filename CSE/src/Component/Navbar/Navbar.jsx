import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuthInfo from '../../Hook/useAuthInfo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Public mobile menu state
  const [isAuthOpen, setIsAuthOpen] = useState(false); // Authenticated mobile menu state
  const [activeTab, setActiveTab] = useState('Home');
  const { user } = useAuthInfo();

  const navLinks1 = [
    { name: 'Home', href: '#home' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Smart tools', href: '#smart-tools' },
  ];

  const navLinks2 = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Search', path: '/search' },
    { name: 'Requirements', path: '/requirements' },
    { name: 'Orders', path: '/orders' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {!user?.email ? (
        /* Unauthenticated Navbar (Public) */
        <nav className="bg-[#1e232a] text-white px-6 py-4 border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Left Side */}
            <div className="flex items-center space-x-10">
              <a href="#home" className="text-xl font-bold tracking-tight text-white cursor-pointer">
                Surplus Exchange
              </a>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                {navLinks1.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setActiveTab(link.name)}
                    className={`relative py-1 transition-colors duration-200 ${
                      activeTab === link.name
                        ? 'text-white font-semibold'
                        : 'text-gray-400 hover:text-gray-200'
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
                <button className="px-5 py-2 text-sm font-medium text-white bg-[#c24e00] hover:bg-[#a84300] rounded transition-all cursor-pointer">
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isOpen && (
            <div className="md:hidden mt-4 space-y-3 pb-3 border-t border-gray-800 pt-3">
              {navLinks1.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveTab(link.name);
                    setIsOpen(false);
                  }}
                  className={`block px-2 py-1 text-base ${
                    activeTab === link.name ? 'text-white font-semibold' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-2 text-sm font-medium text-gray-900 bg-white rounded">
                    Login
                  </button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-2 text-sm font-medium text-white bg-[#c24e00] rounded">
                    Register
                  </button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      ) : (
        /* Authenticated Navbar (User Logged In) */
        <nav className="bg-[#1e232a] text-white px-6 md:px-12 py-4 border-b border-gray-800 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Brand Logo / Title */}
            <div className="text-xl font-bold tracking-tight">
              <Link to="/" className="text-white hover:text-gray-200 transition-colors">
                Surplus Exchange
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {navLinks2.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `pb-1.5 transition-all duration-200 ${
                      isActive
                        ? 'text-white border-b-2 border-[#008ba9] font-semibold'
                        : 'text-gray-300 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile Hamburger Button (Logged In) */}
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

          {/* Mobile Dropdown Menu (Logged In) */}
          {isAuthOpen && (
            <div className="md:hidden mt-4 space-y-2 pb-3 border-t border-gray-800 pt-3">
              {navLinks2.map((link) => (
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
      )}
    </>
  );
};

export default Navbar;