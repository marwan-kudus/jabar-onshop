import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
      total,
      notes,
    }: {
      items: OrderItemInput[];
      shippingAddress: ShippingAddress;
      paymentMethod?: string;
      total: number;
      notes?: string;
    } = await request.json();

    // Validasi order items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      );
    }

    // Validasi shipping address dan total
    if (!shippingAddress || !total) {
      return NextResponse.json(
        { error: 'Shipping address and total are required' },
        { status: 400 }
      );
    }

    // Buat order dengan items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: 'PENDING', // Pastikan menggunakan enum yang benar
        total: parseFloat(total.toString()), // Pastikan total adalah angka
        paymentMethod: paymentMethod || 'credit_card',
        paymentStatus: 'PENDING',
        shippingAddress: JSON.stringify(shippingAddress),
        notes: notes || '',
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // Hapus item keranjang pengguna setelah order berhasil
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    // Perbarui stok produk
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
