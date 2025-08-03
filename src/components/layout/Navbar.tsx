'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useAppSelector } from '@/store/hooks';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className='bg-white shadow-lg sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='text-2xl font-bold text-indigo-600'>
              Jabar OnShop
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
              <Link
                href='/'
                className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
              >
                Home
              </Link>
              <Link
                href='/products'
                className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
              >
                Products
              </Link>
              <Link
                href='/categories'
                className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
              >
                Categories
              </Link>
              {session && (
                <Link
                  href='/orders'
                  className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  My Orders
                </Link>
              )}
              {session?.user?.role === 'ADMIN' && (
                <Link
                  href='/admin'
                  className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className='hidden md:block flex-1 max-w-md mx-8'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search products...'
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className='flex items-center space-x-4'>
            {/* Cart */}
            <Link
              href='/cart'
              className='relative p-2 text-gray-700 hover:text-indigo-600 transition-colors'
            >
              <ShoppingCart className='h-6 w-6' />
              {cartItemCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className='relative group'>
                <button className='flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors'>
                  <User className='h-6 w-6' />
                  <span className='hidden md:block text-sm font-medium'>
                    {session.user.name || session.user.email}
                  </span>
                </button>
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
                  <Link
                    href='/dashboard'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    Dashboard
                  </Link>
                  <Link
                    href='/orders'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <Link
                  href='/auth/signin'
                  className='text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Sign In
                </Link>
                <Link
                  href='/auth/signup'
                  className='bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden p-2 text-gray-700 hover:text-indigo-600 transition-colors'
            >
              {isMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200'>
              <Link
                href='/'
                className='text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href='/products'
                className='text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href='/categories'
                className='text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              {session && (
                <>
                  <Link
                    href='/dashboard'
                    className='text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href='/orders'
                    className='text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href='/admin'
                      className='text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}

              {/* Mobile Search */}
              <div className='px-3 py-2'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Search className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    placeholder='Search products...'
                    className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
