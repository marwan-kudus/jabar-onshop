'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

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
  createdAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  featured: boolean;
  categoryId: string;
}

// Mock component for ProductFormModal
const ProductFormModal = ({
  isOpen,
  onClose,
  onSave,
  product,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
  product: Product | null;
  categories: Category[];
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    featured: product?.featured || false,
    categoryId: product?.category.id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg w-full max-w-md'>
        <h2 className='text-xl font-bold mb-4'>
          {product ? 'Edit Produk' : 'Tambah Produk'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Nama</label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='w-full p-2 border rounded'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Harga</label>
            <input
              type='number'
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className='w-full p-2 border rounded'
              required
              min='0'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Stok</label>
            <input
              type='number'
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: Number(e.target.value) })
              }
              className='w-full p-2 border rounded'
              required
              min='0'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Kategori</label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            >
              <option value=''>Pilih Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className='mb-4 flex items-center'>
            <input
              type='checkbox'
              id='featured'
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className='mr-2'
            />
            <label htmlFor='featured' className='text-sm font-medium'>
              Produk Unggulan
            </label>
          </div>

          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border rounded'
            >
              Batal
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-indigo-600 text-white rounded'
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const useFetchData = () => {
  const [data, setData] = useState<{
    products: Product[];
    categories: Category[];
  }>({
    products: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock API calls - replace with actual API calls
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Produk Contoh 1',
          description: 'Deskripsi produk contoh 1',
          price: 100000,
          stock: 10,
          featured: true,
          category: { id: '1', name: 'Elektronik' },
          createdAt: '2023-01-01',
        },
        {
          id: '2',
          name: 'Produk Contoh 2',
          description: 'Deskripsi produk contoh 2',
          price: 150000,
          stock: 5,
          featured: false,
          category: { id: '2', name: 'Fashion' },
          createdAt: '2023-01-02',
        },
      ];

      const mockCategories: Category[] = [
        { id: '1', name: 'Elektronik' },
        { id: '2', name: 'Fashion' },
        { id: '3', name: 'Makanan' },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setData({
        products: mockProducts,
        categories: mockCategories,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

export default function AdminProductsPage() {
  const { data, loading, error, fetchData } = useFetchData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveProduct = async (productData: ProductFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Produk disimpan:', productData);
      alert(`Produk ${productData.name} berhasil disimpan`);
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Gagal menyimpan produk');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Produk dihapus:', productId);
      alert('Produk berhasil dihapus');
      await fetchData();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Gagal menghapus produk');
    }
  };

  const filteredProducts = data.products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === '' || product.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-16'>
        <p className='text-red-600 mb-4'>{error}</p>
        <button
          onClick={fetchData}
          className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Daftar Produk</h1>
          <p className='text-gray-600'>Kelola produk Anda</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className='mt-4 md:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700'
        >
          <Plus className='w-4 h-4 mr-2' />
          Tambah Produk
        </button>
      </div>

      {/* Search and Filter */}
      <div className='bg-white p-4 rounded-lg shadow-sm mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Search */}
          <div>
            <label
              htmlFor='search'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Cari Produk
            </label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                id='search'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Cari produk...'
                className='pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Filter Kategori
            </label>
            <select
              id='category'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value=''>Semua Kategori</option>
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Result Count */}
          <div className='flex items-end'>
            <p className='text-sm text-gray-600'>
              Menampilkan {filteredProducts.length} dari {data.products.length}{' '}
              produk
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        {filteredProducts.length === 0 ? (
          <div className='text-center py-12'>
            <Package className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-2 text-lg font-medium text-gray-900'>
              Tidak ada produk ditemukan
            </h3>
            <p className='mt-1 text-sm text-gray-500 mb-4'>
              {searchTerm || selectedCategory
                ? 'Coba sesuaikan pencarian Anda'
                : 'Mulai dengan menambahkan produk'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700'
            >
              <Plus className='-ml-1 mr-2 h-4 w-4' />
              Tambah Produk
            </button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Produk
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Kategori
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Harga
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Stok
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Status
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10 bg-gray-200 rounded flex items-center justify-center'>
                          <Package className='h-5 w-5 text-gray-500' />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {product.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'>
                        {product.category.name}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      Rp {product.price.toLocaleString('id-ID')}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock} stok
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          product.featured
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.featured ? 'Unggulan' : 'Reguler'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className='text-indigo-600 hover:text-indigo-900'
                        >
                          <Edit className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className='text-red-600 hover:text-red-900'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={data.categories}
      />
    </div>
  );
}
