'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  BarChart3,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className='flex flex-col w-64 bg-gray-900 text-white'>
      <div className='flex items-center justify-center h-16 bg-gray-800'>
        <h1 className='text-xl font-bold'>Admin Panel</h1>
      </div>

      <nav className='flex-1 px-4 py-6 space-y-2'>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className='w-5 h-5 mr-3' />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className='p-4 border-t border-gray-700'>
        <Link
          href='/'
          className='flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors'
        >
          <LogOut className='w-5 h-5 mr-3' />
          Back to Store
        </Link>
      </div>
    </div>
  );
}
