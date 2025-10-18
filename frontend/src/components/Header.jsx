import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = ({ cartCount = 0, onCartClick, onAuthClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'SHOP', href: '/shop', hasDropdown: true },
    { name: 'NEW ARRIVALS', href: '/new-arrivals' },
    { name: 'INFLUENCER PICKS', href: '/influencer-picks' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  return (
    <header className='bg-white sticky top-0 z-50 shadow-sm'>
      {/* Promotional Banner */}
      <div className='bg-gradient-to-r from-purple-400 to-pink-400 text-white py-2 overflow-hidden'>
        <div className='animate-scroll whitespace-nowrap flex'>
          <span className='mx-8 text-sm font-medium'>
            {' '}
            📦 Free shipping on all orders{' '}
          </span>{' '}
          <span className='mx-8 text-sm font-medium'>
            {' '}
            🎉 5% OFF on all Prepaid orders, Use code: PREPAID5 Shop now!{' '}
          </span>{' '}
          <span className='mx-8 text-sm font-medium'>
            {' '}
            📦 Free shipping on all orders{' '}
          </span>{' '}
          <span className='mx-8 text-sm font-medium'>
            {' '}
            🎉 5% OFF on all Prepaid orders, Use code: PREPAID5 Shop now!{' '}
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-20'>
          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Search Icon (Mobile) */}
          <button
            className='md:hidden p-2'
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} />
          </button>

          {/* Logo */}
          <div className='flex-1 md:flex-none flex justify-center md:justify-start'>
            <Link to='/' className='text-center'>
              <div className='text-purple-600 text-2xl font-serif mb-1'>
                IFM
              </div>
              <div className='text-xs font-medium tracking-wider text-gray-600'>
                IRAXA FASHION MART
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8 flex-1 justify-center'>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className='text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors'
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className='flex items-center space-x-4'>
            {/* Desktop Search */}
            <button className='hidden md:block p-2 hover:text-purple-600 transition-colors'>
              <Search size={20} />
            </button>

            {/* Account */}
            <button
              className='p-2 hover:text-purple-600 transition-colors'
              onClick={onAuthClick}
            >
              <User size={20} />
            </button>

            {/* Cart */}
            <button
              className='p-2 hover:text-purple-600 transition-colors relative'
              onClick={onCartClick}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className='md:hidden pb-4'>
            <Input
              type='text'
              placeholder='Search for products...'
              className='w-full'
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white border-t'>
          <nav className='container mx-auto px-4 py-4'>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className='block py-3 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
