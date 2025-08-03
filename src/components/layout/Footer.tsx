'use client';

import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div>
            <h3 className='text-2xl font-bold text-indigo-400 mb-4'>
              Jabar OnShop
            </h3>
            <p className='text-gray-300 mb-4'>
              Your trusted online shopping destination for quality products at
              great prices.
            </p>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-gray-400 hover:text-indigo-400 transition-colors'
              >
                <Facebook className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-indigo-400 transition-colors'
              >
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-indigo-400 transition-colors'
              >
                <Instagram className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/'
                  className='text-gray-300 hover:text-indigo-400 transition-colors'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='/products'
                  className='text-gray-300 hover:text-indigo-400 transition-colors'
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href='/categories'
                  className='text-gray-300 hover:text-indigo-400 transition-colors'
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href='/about'
                  className='text-gray-300 hover:text-indigo-400 transition-colors'
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Customer Service</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/contact'
                  className='text-gray-300 hover:text-indigo-400 transition-colors'
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href='/shipping'
                  className='text-gray-300 hover:text-indigo-400 transition-colors'
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href='/returns'
                  className='text-gray-300 hover:text-indigo-400 transition-colors'
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href='/faq'
                  className='text-gray-300 hover:text-indigo-400 transition-colors'
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Contact Info</h4>
            <div className='space-y-3'>
              <div className='flex items-center space-x-3'>
                <MapPin className='h-5 w-5 text-indigo-400' />
                <span className='text-gray-300'>Bogor Jawa Barat</span>
              </div>
              <div className='flex items-center space-x-3'>
                <Phone className='h-5 w-5 text-indigo-400' />
                <span className='text-gray-300'>081282827477</span>
              </div>
              <div className='flex items-center space-x-3'>
                <Mail className='h-5 w-5 text-indigo-400' />
                <span className='text-gray-300'>support@jabaronshop.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className='border-t border-gray-800 mt-8 pt-8 text-center'>
          <p className='text-gray-400'>
            © 2025 E-Store. All rights reserved. Built with Next.js and
            TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
}
