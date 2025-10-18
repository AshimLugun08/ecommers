import React from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      {/* Newsletter Section */}
      <div className='border-b border-gray-800'>
        <div className='container mx-auto px-4 py-12'>
          <div className='max-w-2xl mx-auto text-center'>
            <h3 className='text-2xl font-serif mb-4'>Stay in the Loop</h3>
            <p className='text-gray-400 mb-6'>
              Subscribe to receive updates on new arrivals, special offers, and
              styling tips.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Input
                type='email'
                placeholder='Enter your email address'
                className='flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400'
              />
              <Button className='bg-purple-600 hover:bg-purple-700 px-8'>
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Brand Info */}
          <div>
            <div className='mb-6'>
              <img
                src='/logo.png'
                alt='IRAXA FASHION MART'
                className='h-12 mb-2'
              />
              <p className='text-gray-400 text-sm'>
                Timeless elegance, artisanal craftsmanship, and bespoke designs.
              </p>
            </div>
            <p className='text-gray-400 text-sm leading-relaxed mb-6'>
              Made with care to celebrate your individuality.
            </p>
            <div className='flex space-x-4'>
              <a
                href='https://www.facebook.com/people/IRAXA-fashion-Mart/61577947153142/?'
                className='text-gray-400 hover:text-purple-400 transition-colors'
              >
                <Facebook size={20} />
              </a>
              <a
                href='https://www.instagram.com/iraxa_fashion/'
                className='text-gray-400 hover:text-purple-400 transition-colors'
              >
                <Instagram size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-purple-400 transition-colors'
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='font-semibold mb-6'>Quick Links</h4>
            <ul className='space-y-3 text-sm'>
              <li>
                <a
                  href='/'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href='/shop'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href='/new-arrivals'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  New Arrivals
                </a>
              </li>
              <li>
                <a
                  href='/influencer-picks'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  Influencer Picks
                </a>
              </li>
              <li>
                <a
                  href='/contact'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className='font-semibold mb-6'>Categories</h4>
            <ul className='space-y-3 text-sm'>
              <li>
                <a
                  href='/collections/dresses'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  Dresses
                </a>
              </li>
              <li>
                <a
                  href='/collections/jumpsuits'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  Jumpsuits
                </a>
              </li>
              <li>
                <a
                  href='/collections/co-ord-sets'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  Co-ord Sets
                </a>
              </li>
              <li>
                <a
                  href='/collections/blazers-vests'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  Blazers & Vests
                </a>
              </li>
              <li>
                <a
                  href='/collections/tops-shirts'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  Tops & Shirts
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='font-semibold mb-6'>Get in Touch</h4>
            <div className='space-y-4 text-sm'>
              <div className='flex items-start space-x-3'>
                <MapPin
                  size={16}
                  className='text-purple-400 mt-1 flex-shrink-0'
                />
                <span className='text-gray-400'>
                  Chitardih road near Yamaha showroom jamua , Giridih,
                  Jharkhand, India
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <Phone size={16} className='text-purple-400 flex-shrink-0' />
                <span className='text-gray-400'>+91 88868 98383</span>
              </div>
              <div className='flex items-center space-x-3'>
                <Mail size={16} className='text-purple-400 flex-shrink-0' />
                <span className='text-gray-400'>iraxa.fashion@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-800'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-sm text-gray-400 mb-4 md:mb-0'>
              © 2025 Iraxa Fashion Mart. All rights reserved.
            </p>
            <div className='flex space-x-6 text-sm'>
              <a
                href='/privacy-policy'
                className='text-gray-400 hover:text-white transition-colors'
              >
                Privacy Policy
              </a>
              <a
                href='/terms-of-service'
                className='text-gray-400 hover:text-white transition-colors'
              >
                Terms of Service
              </a>
              <a
                href='/returns'
                className='text-gray-400 hover:text-white transition-colors'
              >
                Returns & Exchanges
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Banner */}
      <div className='fixed bottom-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm z-40'>
        <div className='animate-scroll whitespace-nowrap'>
          <span className='mx-8'>
            MADE TO ORDER • SUSTAINABLE • AFFORDABLE LUXURY •
          </span>
          <span className='mx-8'>
            MADE TO ORDER • SUSTAINABLE • AFFORDABLE LUXURY •
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
