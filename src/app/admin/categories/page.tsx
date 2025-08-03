import { getCategories } from '@/lib/data-fetching'; // Asumsikan Anda memiliki fungsi ini
import Link from 'next/link';

// Definisikan tipe data untuk kategori
interface Category {
  id: string;
  name: string;
  count: number;
}

export default async function CategoriesPage() {
  const categories: Category[] = await getCategories();

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Semua Kategori</h1>

      {categories.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {categories.map((category) => (
            <Link
              href={`/categories/${category.id}`}
              key={category.id}
              className='block p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'
            >
              <h2 className='text-xl font-semibold text-gray-800'>
                {category.name}
              </h2>
              <p className='text-gray-600 mt-2'>{category.count} produk</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 text-center'>
          Tidak ada kategori yang tersedia saat ini.
        </p>
      )}
    </div>
  );
}
