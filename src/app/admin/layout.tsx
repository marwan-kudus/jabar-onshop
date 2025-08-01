'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Check if user is admin (you can implement role-based access here)
    // For now, we'll allow any authenticated user to access admin
    // In production, you should check user.role === 'admin'
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
    <div className='flex h-screen bg-gray-100'>
      <AdminSidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='bg-white shadow-sm border-b border-gray-200'>
          <div className='flex items-center justify-between px-6 py-4'>
            <h1 className='text-2xl font-semibold text-gray-900'>
              Admin Dashboard
            </h1>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600'>
                Welcome, {session.user?.name}
              </span>
              <div className='w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center'>
                <span className='text-white text-sm font-medium'>
                  {session.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
