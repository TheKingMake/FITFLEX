import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('nav')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Search' },
    { path: '/about', label: 'About' }
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1C]/100 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Home Link */}
            <Link 
              to="/" 
              className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 
                text-transparent bg-clip-text hover:from-blue-400 hover:to-purple-500 transition-all duration-300"
            >
              FitFlex
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <Link 
                to="/" 
                className="text-lg md:text-xl font-semibold text-gray-300 hover:text-teal-400 
                  transition-colors duration-300"
              >
                Home
              </Link>
              <Link 
                to="/search" 
                className="text-lg md:text-xl font-semibold text-gray-300 hover:text-teal-400 
                  transition-colors duration-300"
              >
                Exercises
              </Link>
              <Link 
                to="/about" 
                className="text-lg md:text-xl font-semibold text-gray-300 hover:text-teal-400 
                  transition-colors duration-300"
              >
                About
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0A0F1C] border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-2">
              {menuItems.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`block px-4 py-3 rounded-md text-xl font-medium text-center ${
                    location.pathname === path
                      ? 'text-teal-400 bg-gray-900'
                      : 'text-gray-300 hover:text-teal-400 hover:bg-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar; 
