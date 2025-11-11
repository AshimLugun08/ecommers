import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = ({ cartCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'SHOP', href: '/shop', hasDropdown: true },
    { name: 'NEW ARRIVALS', href: '/new-arrivals' },
    { name: 'INFLUENCER PICKS', href: '/influencer-picks' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  // ✅ Handle user button click
  const handleAuthClick = () => {
    const token = localStorage.getItem('token');
    console.log('Auth click, token:', token);
    if (token) {
      navigate('/profile');
    } else {
      setIsAuthModalOpen(true);
      setIsMobileMenuOpen(false);
    }
  };

  // ✅ Auth Modal Component
  const AuthModal = () => (
    <div
      className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm m-4 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sign Up / Log In</h2>
          <button onClick={() => setIsAuthModalOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 mb-6">
          Join IFM quickly using your Google account.
        </p>

        <Button
          onClick={() => {
            window.location.href = 'http://localhost:5000/api/auth/google';
            setIsAuthModalOpen(false);
          }}
          className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-3 transition-colors shadow-sm"
        >
          <span className="font-medium text-base">Sign in with Google</span>
        </Button>
      </div>
    </div>
  );

  return (
    <header className="bg-white sticky top-0 z-[100] shadow-sm">
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white py-2 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap flex">
          <span className="mx-8 text-sm font-medium">📦 Free shipping on all orders</span>
          <span className="mx-8 text-sm font-medium">🎉 5% OFF on all Prepaid orders, Use code: PREPAID5 Shop now!</span>
          <span className="mx-8 text-sm font-medium">📦 Free shipping on all orders</span>
          <span className="mx-8 text-sm font-medium">🎉 5% OFF on all Prepaid orders, Use code: PREPAID5 Shop now!</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu & Search */}
          <div className="flex items-center md:hidden space-x-2">
            <button className="p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {/* <button className="p-2" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search size={20} />
            </button> */}
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link to="/" className="text-center">
              <div className="text-purple-600 text-2xl font-serif mb-1">IFM</div>
              <div className="text-xs font-medium tracking-wider text-gray-600">IRAXA FASHION MART</div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <button className="p-2 hover:text-purple-600 transition-colors" onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
            </button> */}

            {/* ✅ User Button (with login/profile functionality) */}
            <button className="p-2 hover:text-purple-600 transition-colors" onClick={handleAuthClick}>
              <User size={20} />
            </button>

            <Link to="/cart" className="p-2 hover:text-purple-600 transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <Input type="text" placeholder="Search for products..." className="w-full" />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-3 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && <AuthModal />}
    </header>
  );
};

export default Header;
