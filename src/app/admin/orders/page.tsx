import { getServerSession } from 'next-auth';
// Perbaiki baris import ini agar menunjuk ke lokasi yang benar:
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getOrdersByUserId } from '@/lib/data-fetching';

// Definisikan tipe data untuk order
interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = session.user.id;
  const orders: Order[] = await getOrdersByUserId(userId);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Daftar Pesanan Saya</h1>

      {orders.length > 0 ? (
        <div className='space-y-4'>
          {orders.map((order) => (
            <div key={order.id} className='p-6 border rounded-lg shadow-sm'>
              <div className='flex justify-between items-center mb-2'>
                <h2 className='text-xl font-semibold'>
                  Pesanan #{order.id.slice(0, 8)}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'SHIPPED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className='text-gray-600'>
                Tanggal: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className='text-gray-600 mt-1'>
                Total: Rp{order.totalAmount.toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 text-center'>
          Anda belum memiliki pesanan.
        </p>
      )}
    </div>
  );
}
