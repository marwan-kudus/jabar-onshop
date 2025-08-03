//  tipe data untuk kategori agar kode lebih aman (type-safe)
interface Category {
  id: string;
  name: string;
  count: number;
}

//  tipe data untuk pesanan (Order)
interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
}

/**
 * Mengambil semua kategori dari API endpoint.
 * @returns {Promise<Category[]>} - Promise yang berisi array objek kategori.
 */
export async function getCategories(): Promise<Category[]> {
  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }/api/categories`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil data kategori: ${res.statusText}`);
    }

    const data: Category[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Mengambil daftar pesanan berdasarkan ID pengguna dari API.
 * @param {string} userId - ID unik pengguna.
 * @returns {Promise<Order[]>} - Promise yang berisi array objek pesanan.
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  // Pastikan userId ada sebelum melakukan fetch
  if (!userId) {
    console.error('Error: userId tidak tersedia untuk mengambil pesanan.');
    return [];
  }

  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }/api/orders?userId=${userId}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil data pesanan: ${res.statusText}`);
    }

    const data: Order[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    // Kembalikan array kosong jika terjadi error untuk mencegah aplikasi crash
    return [];
  }
}
