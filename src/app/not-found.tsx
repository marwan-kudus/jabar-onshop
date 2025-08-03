'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4'>
      <div className='text-center'>
        {/* 404 Illustration */}
        <div className='mb-8'>
          <div className='text-9xl font-bold text-indigo-600 mb-4'>404</div>
          <div className='w-32 h-1 bg-indigo-600 mx-auto rounded-full'></div>
        </div>

        {/* Error Message */}
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Oops! Page Not Found
        </h1>
        <p className='text-xl text-gray-600 mb-8 max-w-md mx-auto'>
          The page you are looking for does not exist. It might have been moved,
          deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            href='/'
            className='bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center'
          >
            <Home className='mr-2 h-5 w-5' />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className='border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition-colors inline-flex items-center justify-center'
          >
            <ArrowLeft className='mr-2 h-5 w-5' />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className='mt-12'>
          <p className='text-gray-600 mb-4'>Or try these popular pages:</p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Link
              href='/products'
              className='text-indigo-600 hover:text-indigo-700 underline'
            >
              Products
            </Link>
            <Link
              href='/categories'
              className='text-indigo-600 hover:text-indigo-700 underline'
            >
              Categories
            </Link>
            <Link
              href='/auth/signin'
              className='text-indigo-600 hover:text-indigo-700 underline'
            >
              Sign In
            </Link>
            <Link
              href='/contact'
              className='text-indigo-600 hover:text-indigo-700 underline'
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
