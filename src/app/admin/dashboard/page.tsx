'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
} from 'lucide-react';

// Type definitions for better type safety
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: {
    name: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Order[];
  topProducts: Product[];
}

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);

      const products = productsResponse.ok ? await productsResponse.json() : [];
      const orders = ordersResponse.ok ? await ordersResponse.json() : [];

      const totalRevenue = orders.reduce(
        (sum: number, order: Order) => sum + order.total,
        0
      );

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: 1, // TODO: Implement user count API
        totalRevenue,
        recentOrders: orders.slice(0, 5),
        topProducts: products.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'increase',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+23%',
      changeType: 'increase',
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <header>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard Overview</h1>
        <p className='text-gray-600 mt-2'>
          Welcome to your e-commerce admin panel
        </p>
      </header>

      {/* Stats Cards Section */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </section>

      {/* Recent Orders and Top Products Section */}
      <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <RecentOrders orders={stats.recentOrders} />
        <TopProducts products={stats.topProducts} />
      </section>

      {/* Quick Actions Section */}
      <section className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-6'>
          Quick Actions
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <QuickActionButton icon={Package} label='Add New Product' />
          <QuickActionButton icon={ShoppingCart} label='View Orders' />
          <QuickActionButton icon={Eye} label='View Reports' />
        </div>
      </section>
    </div>
  );
}

// Component for individual stat cards
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  changeType,
}: StatCard) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-600'>{title}</p>
          <p className='text-3xl font-bold text-gray-900 mt-2'>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className='w-6 h-6 text-white' />
        </div>
      </div>
      <div className='mt-4 flex items-center'>
        {changeType === 'increase' ? (
          <TrendingUp className='w-4 h-4 text-green-500 mr-1' />
        ) : (
          <TrendingDown className='w-4 h-4 text-red-500 mr-1' />
        )}
        <span
          className={`text-sm font-medium ${
            changeType === 'increase' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {change}
        </span>
        <span className='text-sm text-gray-600 ml-1'>from last month</span>
      </div>
    </div>
  );
}

// Component for recent orders
function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-gray-900'>Recent Orders</h2>
        <button className='text-indigo-600 hover:text-indigo-700 text-sm font-medium'>
          View All
        </button>
      </div>

      {orders.length === 0 ? (
        <p className='text-gray-500 text-center py-8'>No orders yet</p>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

// Component for individual order items
function OrderItem({ order }: { order: Order }) {
  const statusStyles = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
      <div>
        <p className='font-medium text-gray-900'>Order #{order.id.slice(-8)}</p>
        <p className='text-sm text-gray-600'>
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className='text-right'>
        <p className='font-medium text-gray-900'>${order.total.toFixed(2)}</p>
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            statusStyles[order.status]
          }`}
        >
          {order.status}
        </span>
      </div>
    </div>
  );
}

// Component for top products
function TopProducts({ products }: { products: Product[] }) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-gray-900'>Top Products</h2>
        <button className='text-indigo-600 hover:text-indigo-700 text-sm font-medium'>
          View All
        </button>
      </div>

      {products.length === 0 ? (
        <p className='text-gray-500 text-center py-8'>No products yet</p>
      ) : (
        <div className='space-y-4'>
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// Component for individual product items
function ProductItem({ product }: { product: Product }) {
  return (
    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
      <div className='flex items-center space-x-3'>
        <div className='w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center'>
          <Package className='w-5 h-5 text-gray-600' />
        </div>
        <div>
          <p className='font-medium text-gray-900'>{product.name}</p>
          <p className='text-sm text-gray-600'>{product.category.name}</p>
        </div>
      </div>
      <div className='text-right'>
        <p className='font-medium text-gray-900'>${product.price.toFixed(2)}</p>
        <p className='text-sm text-gray-600'>Stock: {product.stock}</p>
      </div>
    </div>
  );
}

// Component for quick action buttons
function QuickActionButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button className='flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors'>
      <Icon className='w-6 h-6 text-gray-600 mr-2' />
      <span className='font-medium text-gray-700'>{label}</span>
    </button>
  );
}
