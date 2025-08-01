'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  setCart,
  updateQuantity,
  removeFromCart,
} from '@/store/slices/cartSlice';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: {
    name: string;
  };
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cart);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchCartItems();
  }, [session, status, router]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const items: CartItem[] = await response.json();
        setCartItems(items);

        // Update Redux store
        const cartData = items.map((item) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image ?? '',
          quantity: item.quantity,
        }));
        dispatch(setCart(cartData));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    try {
      const currentItem = cartItems.find(
        (item) => item.product.id === productId
      );
      if (!currentItem) return;

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity - currentItem.quantity,
        }),
      });

      if (response.ok) {
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        dispatch(removeFromCart(productId));
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (status === 'loading' || loading) {
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
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Shopping Cart</h1>
          <p className='text-gray-600 mt-2'>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in
            your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className='text-center py-16'>
            <ShoppingBag className='h-24 w-24 text-gray-400 mx-auto mb-4' />
            <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
              Your cart is empty
            </h2>
            <p className='text-gray-600 mb-8'>
              Start shopping to add items to your cart
            </p>
            <Link
              href='/products'
              className='bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors'
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Cart Items */}
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className='p-6 border-b border-gray-200 last:border-b-0'
                  >
                    <div className='flex items-center space-x-4'>
                      <div className='flex-shrink-0 w-20 h-20 relative'>
                        <Image
                          src={item.product.image || '/placeholder.png'}
                          alt={item.product.name}
                          fill
                          className='object-cover rounded-md'
                          sizes='80px'
                        />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <h3 className='text-lg font-semibold text-gray-900 truncate'>
                          {item.product.name}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {item.product.category.name}
                        </p>
                        <p className='text-lg font-bold text-indigo-600 mt-1'>
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>

                      <div className='flex items-center space-x-3'>
                        <div className='flex items-center border border-gray-300 rounded-md'>
                          <button
                            onClick={() =>
                              updateItemQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className='p-2 hover:bg-gray-100 transition-colors'
                            aria-label='Decrease quantity'
                          >
                            <Minus className='h-4 w-4' />
                          </button>
                          <span className='px-4 py-2 font-medium'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateItemQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className='p-2 hover:bg-gray-100 transition-colors'
                            aria-label='Increase quantity'
                          >
                            <Plus className='h-4 w-4' />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className='p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors'
                          aria-label='Remove item'
                        >
                          <Trash2 className='h-5 w-5' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-lg shadow-md p-6 sticky top-8'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  Order Summary
                </h2>

                <div className='space-y-3 mb-6'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='font-medium'>
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Shipping</span>
                    <span className='font-medium'>Free</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Tax</span>
                    <span className='font-medium'>
                      ${(calculateTotal() * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className='border-t border-gray-200 pt-3'>
                    <div className='flex justify-between'>
                      <span className='text-lg font-semibold'>Total</span>
                      <span className='text-lg font-semibold text-indigo-600'>
                        ${(calculateTotal() * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href='/checkout'
                  className='w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-center block'
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href='/products'
                  className='w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block'
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
