'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  User,
  Mail,
  Calendar,
  ShoppingBag,
  Heart,
  Settings,
} from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p className='text-gray-600 mt-2'>
            Welcome back, {session.user.name || session.user.email}!
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* User Profile Card */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='text-center'>
                <div className='w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <User className='h-12 w-12 text-indigo-600' />
                </div>
                <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                  {session.user.name || 'User'}
                </h2>
                <div className='flex items-center justify-center text-gray-600 mb-4'>
                  <Mail className='h-4 w-4 mr-2' />
                  <span className='text-sm'>{session.user.email}</span>
                </div>
                <div className='flex items-center justify-center text-gray-600 mb-6'>
                  <Calendar className='h-4 w-4 mr-2' />
                  <span className='text-sm'>Member since 2025</span>
                </div>
                <button className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center'>
                  <Settings className='h-4 w-4 mr-2' />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              {/* Stats Cards */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='flex items-center'>
                  <div className='bg-blue-100 p-3 rounded-full'>
                    <ShoppingBag className='h-6 w-6 text-blue-600' />
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Total Orders
                    </h3>
                    <p className='text-2xl font-bold text-blue-600'>12</p>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='flex items-center'>
                  <div className='bg-green-100 p-3 rounded-full'>
                    <Heart className='h-6 w-6 text-green-600' />
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Wishlist Items
                    </h3>
                    <p className='text-2xl font-bold text-green-600'>5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Recent Orders
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                  <div>
                    <p className='font-medium text-gray-900'>Order #12345</p>
                    <p className='text-sm text-gray-600'>
                      Placed on January 15, 2025
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-gray-900'>$129.99</p>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                      Delivered
                    </span>
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                  <div>
                    <p className='font-medium text-gray-900'>Order #12344</p>
                    <p className='text-sm text-gray-600'>
                      Placed on January 10, 2025
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-gray-900'>$89.99</p>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                      Shipped
                    </span>
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                  <div>
                    <p className='font-medium text-gray-900'>Order #12343</p>
                    <p className='text-sm text-gray-600'>
                      Placed on January 5, 2025
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-gray-900'>$199.99</p>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                      Processing
                    </span>
                  </div>
                </div>
              </div>

              <div className='mt-6 text-center'>
                <button className='text-indigo-600 hover:text-indigo-700 font-medium'>
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='mt-8'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Quick Actions
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <button className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center'>
              <ShoppingBag className='h-8 w-8 text-indigo-600 mx-auto mb-2' />
              <p className='font-medium text-gray-900'>Browse Products</p>
            </button>

            <button className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center'>
              <Heart className='h-8 w-8 text-red-600 mx-auto mb-2' />
              <p className='font-medium text-gray-900'>View Wishlist</p>
            </button>

            <button className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center'>
              <User className='h-8 w-8 text-green-600 mx-auto mb-2' />
              <p className='font-medium text-gray-900'>Edit Profile</p>
            </button>

            <button className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center'>
              <Settings className='h-8 w-8 text-gray-600 mx-auto mb-2' />
              <p className='font-medium text-gray-900'>Account Settings</p>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
