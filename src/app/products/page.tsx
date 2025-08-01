'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { Star, ShoppingCart, Filter } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
  featured: boolean;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  _count: {
    products: number;
  };
}

export default function ProductsPage() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const url = selectedCategory
        ? `/api/products?categoryId=${selectedCategory}`
        : '/api/products';

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/signin';
      return;
    }

    setAddingToCart(product.id);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        // Update Redux store
        dispatch(
          addToCart({
            id: `cart-${product.id}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          })
        );

        // Show success message (you could use a toast library here)
        alert('Product added to cart!');
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <div className='flex items-center justify-center py-16'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Products</h1>
          <p className='text-gray-600 mt-2'>
            Discover our amazing collection of products
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Filters Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex items-center mb-4'>
                <Filter className='h-5 w-5 text-gray-600 mr-2' />
                <h2 className='text-lg font-semibold text-gray-900'>Filters</h2>
              </div>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-900 mb-3'>
                    Categories
                  </h3>
                  <div className='space-y-2'>
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === ''
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      All Categories ({products.length})
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category.name} ({category._count.products})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className='lg:col-span-3'>
            {products.length === 0 ? (
              <div className='text-center py-16'>
                <ShoppingCart className='h-24 w-24 text-gray-400 mx-auto mb-4' />
                <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                  No products found
                </h2>
                <p className='text-gray-600'>
                  Try selecting a different category or check back later
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
                  >
                    <div className='aspect-square relative'>
                      <Image
                        src={product.image || '/api/placeholder/300/300'}
                        alt={product.name}
                        fill
                        className='object-cover'
                      />
                      {product.featured && (
                        <div className='absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-medium'>
                          Featured
                        </div>
                      )}
                    </div>

                    <div className='p-4'>
                      <div className='mb-2'>
                        <span className='text-xs text-gray-500 uppercase tracking-wide'>
                          {product.category.name}
                        </span>
                      </div>

                      <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2'>
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
                          {product.description}
                        </p>
                      )}

                      <div className='flex items-center mb-3'>
                        <div className='flex items-center'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < 4
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className='text-sm text-gray-600 ml-2'>
                          (4.0)
                        </span>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <span className='text-xl font-bold text-indigo-600'>
                            ${product.price.toFixed(2)}
                          </span>
                          {product.stock > 0 ? (
                            <p className='text-xs text-green-600'>
                              In stock ({product.stock})
                            </p>
                          ) : (
                            <p className='text-xs text-red-600'>Out of stock</p>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={
                            product.stock === 0 || addingToCart === product.id
                          }
                          className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
                        >
                          {addingToCart === product.id ? (
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                          ) : (
                            <ShoppingCart className='h-4 w-4 mr-2' />
                          )}
                          {addingToCart === product.id
                            ? 'Adding...'
                            : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
