'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import { CreditCard, MapPin, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category: { name: string };
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  notes: string;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    notes: '',
  });

  const fetchCartItems = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
      const items: CartItem[] = await res.json();
      setCartItems(items);
      if (items.length === 0) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [session, router]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin?callbackUrl=/checkout');
      return;
    }

    if (session?.user?.email) {
      setFormData((prev) => ({ ...prev, email: session.user.email as string }));
    }

    fetchCartItems();
  }, [session, status, router, fetchCartItems]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s?/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.zipCode,
            country: formData.country,
          },
          paymentMethod: 'credit_card',
          total,
          notes: formData.notes,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await res.json();
      dispatch(clearCart());
      router.push(`/orders/${order.id}?success=true`);
    } catch (error) {
      console.error('Error:', error);
      // Perbaikan: Pengecekan tipe error yang aman
      if (error instanceof Error) {
        alert(`Error processing order: ${error.message}`);
      } else {
        alert('Error processing order. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  if (!session || cartItems.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center'>
          <ShoppingBag className='h-24 w-24 text-gray-400 mx-auto mb-4' />
          <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
            {!session ? 'Please sign in to checkout' : 'Your cart is empty'}
          </h2>
          <button
            onClick={() => router.push(!session ? '/auth/signin' : '/products')}
            className='bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors'
          >
            {!session ? 'Sign In' : 'Continue Shopping'}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
          <p className='text-gray-600 mt-2'>Complete your order</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 lg:grid-cols-3 gap-8'
        >
          <div className='lg:col-span-2 space-y-8'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex items-center mb-6'>
                <MapPin className='h-6 w-6 text-indigo-600 mr-3' />
                <h2 className='text-xl font-semibold text-gray-900'>
                  Shipping Information
                </h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Full Name *
                  </label>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder='First Name'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder='Last Name'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                  </div>
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email Address *
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Address *
                  </label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      City *
                    </label>
                    <input
                      type='text'
                      name='city'
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      State *
                    </label>
                    <input
                      type='text'
                      name='state'
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Zip Code *
                    </label>
                    <input
                      type='text'
                      name='zipCode'
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                  </div>
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Country *
                  </label>
                  <select
                    name='country'
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  >
                    {['United States', 'Canada', 'United Kingdom'].map(
                      (country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex items-center mb-6'>
                <CreditCard className='h-6 w-6 text-indigo-600 mr-3' />
                <h2 className='text-xl font-semibold text-gray-900'>
                  Payment Information
                </h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Card Number *
                  </label>
                  <input
                    type='text'
                    name='cardNumber'
                    value={formData.cardNumber}
                    onChange={handlePaymentChange}
                    maxLength={19}
                    placeholder='1234 5678 9012 3456'
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Expiry Date *
                  </label>
                  <input
                    type='text'
                    name='expiryDate'
                    value={formData.expiryDate}
                    onChange={handlePaymentChange}
                    maxLength={5}
                    placeholder='MM/YY'
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    CVV *
                  </label>
                  <input
                    type='text'
                    name='cvv'
                    value={formData.cvv}
                    onChange={handleChange}
                    maxLength={4}
                    placeholder='123'
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Cardholder Name *
                  </label>
                  <input
                    type='text'
                    name='cardName'
                    value={formData.cardName}
                    onChange={handleChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Order Notes (Optional)
              </h2>
              <textarea
                name='notes'
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder='Any special instructions...'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
          </div>

          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-6 sticky top-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Order Summary
              </h2>
              <div className='space-y-4 mb-6 max-h-96 overflow-y-auto'>
                {cartItems.map((item) => (
                  <div key={item.id} className='flex items-center space-x-3'>
                    <div className='flex-shrink-0 w-12 h-12 relative'>
                      <Image
                        src={item.product.image || '/placeholder-product.png'}
                        alt={item.product.name}
                        fill
                        className='object-cover rounded-md'
                        sizes='48px'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {item.product.name}
                      </p>
                      <p className='text-xs text-gray-600'>
                        Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className='text-sm font-medium text-gray-900'>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className='space-y-3 mb-6 border-t border-gray-200 pt-4'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-medium'>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-medium'>Free</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Tax</span>
                  <span className='font-medium'>${tax.toFixed(2)}</span>
                </div>
                <div className='border-t border-gray-200 pt-3'>
                  <div className='flex justify-between'>
                    <span className='text-lg font-semibold'>Total</span>
                    <span className='text-lg font-semibold text-indigo-600'>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type='submit'
                disabled={processing}
                className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors ${
                  processing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {processing ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
