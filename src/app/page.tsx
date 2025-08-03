import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';

export default function HomePage() {
  // Mock data for featured products
  const featuredProducts = [
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://via.placeholder.com/400x300',
      rating: 4.5,
      reviews: 128,
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 199.99,
      image: 'https://via.placeholder.com/400x300',
      rating: 4.8,
      reviews: 89,
    },
    {
      id: '3',
      name: 'Laptop Backpack',
      price: 49.99,
      image: 'https://via.placeholder.com/400x300',
      rating: 4.3,
      reviews: 156,
    },
    {
      id: '4',
      name: 'Bluetooth Speaker',
      price: 79.99,
      image: 'https://via.placeholder.com/400x300',
      rating: 4.6,
      reviews: 203,
    },
  ];

  const categories = [
    {
      id: '1',
      name: 'Electronics',
      image: 'https://via.placeholder.com/400x300',
      productCount: 150,
    },
    {
      id: '2',
      name: 'Fashion',
      image: 'https://via.placeholder.com/400x300',
      productCount: 89,
    },
    {
      id: '3',
      name: 'Home & Garden',
      image: 'https://via.placeholder.com/400x300',
      productCount: 67,
    },
    {
      id: '4',
      name: 'Sports',
      image: 'https://via.placeholder.com/400x300',
      productCount: 45,
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      {/* Hero Section */}
      <section className='relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h1 className='text-4xl md:text-6xl font-bold mb-6'>
                Discover Amazing Products
              </h1>
              <p className='text-xl mb-8 text-indigo-100'>
                Shop the latest trends and find everything you need in one
                place. Quality products, great prices, and fast delivery.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Link
                  href='/products'
                  className='bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center'
                >
                  Shop Now
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
                <Link
                  href='/categories'
                  className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors inline-flex items-center justify-center'
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className='relative'>
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-white/20 rounded-lg p-4 text-center'>
                    <div className='text-2xl font-bold'>1000+</div>
                    <div className='text-sm text-indigo-100'>Products</div>
                  </div>
                  <div className='bg-white/20 rounded-lg p-4 text-center'>
                    <div className='text-2xl font-bold'>50k+</div>
                    <div className='text-sm text-indigo-100'>Customers</div>
                  </div>
                  <div className='bg-white/20 rounded-lg p-4 text-center'>
                    <div className='text-2xl font-bold'>4.8</div>
                    <div className='text-sm text-indigo-100'>Rating</div>
                  </div>
                  <div className='bg-white/20 rounded-lg p-4 text-center'>
                    <div className='text-2xl font-bold'>24/7</div>
                    <div className='text-sm text-indigo-100'>Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Truck className='h-8 w-8 text-indigo-600' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Free Shipping</h3>
              <p className='text-gray-600'>Free shipping on orders over $50</p>
            </div>
            <div className='text-center'>
              <div className='bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Shield className='h-8 w-8 text-indigo-600' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Secure Payment</h3>
              <p className='text-gray-600'>Your payment information is safe</p>
            </div>
            <div className='text-center'>
              <div className='bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Headphones className='h-8 w-8 text-indigo-600' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>24/7 Support</h3>
              <p className='text-gray-600'>Get help whenever you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Featured Products
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Discover our most popular products, carefully selected for quality
              and value.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
              >
                <div className='aspect-square relative'>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-900 mb-2'>
                    {product.name}
                  </h3>
                  <div className='flex items-center mb-2'>
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-sm text-gray-600 ml-2'>
                      ({product.reviews})
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-xl font-bold text-indigo-600'>
                      ${product.price}
                    </span>
                    <button className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm'>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='text-center mt-12'>
            <Link
              href='/products'
              className='bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center'
            >
              View All Products
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Shop by Category
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Browse our wide range of categories to find exactly what you are
              looking for.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className='group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow'
              >
                <div className='aspect-[4/3] relative'>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors' />
                  <div className='absolute inset-0 flex flex-col justify-end p-6'>
                    <h3 className='text-white text-xl font-semibold mb-1'>
                      {category.name}
                    </h3>
                    <p className='text-white/80 text-sm'>
                      {category.productCount} products
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='py-16 bg-indigo-600'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold text-white mb-4'>Stay Updated</h2>
          <p className='text-indigo-100 mb-8 max-w-2xl mx-auto'>
            Subscribe to our newsletter and be the first to know about new
            products, special offers, and exclusive deals.
          </p>
          <div className='max-w-md mx-auto flex gap-4'>
            <input
              type='email'
              placeholder='Enter your email'
              className=' bg-white flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:outline-none'
            />
            <button className='bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
