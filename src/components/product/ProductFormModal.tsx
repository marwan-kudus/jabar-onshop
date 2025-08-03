import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

// Interface untuk data produk yang dikirim dari formulir
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  featured: boolean;
  categoryId: string;
}

// Mendefinisikan props untuk modal dengan tipe yang spesifik
interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: ProductFormData) => void;
  product: ProductFormData | null;
  categories: Category[];
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  product,
  categories,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    featured: false,
    categoryId: '',
  });

  useEffect(() => {
    // Menambahkan pemeriksaan untuk memastikan array categories tidak kosong
    const defaultCategoryId =
      categories && categories.length > 0 ? categories[0].id : '';

    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        featured: product.featured,
        categoryId: product.categoryId || defaultCategoryId,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        featured: false,
        categoryId: defaultCategoryId,
      });
    }
  }, [product, categories]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : name === 'price' || name === 'stock'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
          aria-hidden='true'
        ></div>
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>

        <div className='inline-block w-full max-w-lg overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle'>
          <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
            <div className='flex justify-between items-center pb-3 border-b'>
              <h3 className='text-lg font-bold leading-6 text-gray-900'>
                {product ? 'Edit Produk' : 'Tambah Produk'}
              </h3>
              <button
                onClick={onClose}
                className='p-2 rounded-md hover:bg-gray-100'
              >
                <X className='w-5 h-5 text-gray-500' />
              </button>
            </div>
            <div className='mt-4'>
              <form
                id='product-form'
                onSubmit={handleSubmit}
                className='space-y-4'
              >
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Nama Produk
                  </label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className='block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                  />
                </div>
                <div>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Deskripsi
                  </label>
                  <textarea
                    name='description'
                    id='description'
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className='block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                  ></textarea>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='price'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Harga
                    </label>
                    <input
                      type='number'
                      name='price'
                      id='price'
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className='block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='stock'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Stok
                    </label>
                    <input
                      type='number'
                      name='stock'
                      id='stock'
                      required
                      value={formData.stock}
                      onChange={handleChange}
                      className='block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='categoryId'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Kategori
                  </label>
                  <select
                    name='categoryId'
                    id='categoryId'
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                    className='block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex items-center'>
                  <input
                    id='featured'
                    name='featured'
                    type='checkbox'
                    checked={formData.featured}
                    onChange={handleChange}
                    className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                  />
                  <label
                    htmlFor='featured'
                    className='ml-2 block text-sm text-gray-900'
                  >
                    Produk Unggulan
                  </label>
                </div>
              </form>
            </div>
          </div>
          <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse'>
            <button
              type='submit'
              form='product-form'
              onClick={handleSubmit}
              className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm'
            >
              Simpan
            </button>
            <button
              onClick={onClose}
              type='button'
              className='inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
