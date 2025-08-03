import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ProductCreateInput {
  name: string;
  description?: string;
  price: number | string;
  image?: string;
  stock?: number | string;
  categoryId: string;
  featured?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const featuredParam = searchParams.get('featured');

    const where: {
      categoryId?: string;
      featured?: boolean;
    } = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featuredParam === 'true') {
      where.featured = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Menggunakan interface ProductCreateInput yang sudah didefinisikan
    const {
      name,
      description,
      price,
      image,
      stock,
      categoryId,
      featured,
    }: ProductCreateInput = await request.json();

    // Validasi field yang wajib ada
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, or categoryId' },
        { status: 400 }
      );
    }

    // Mengkonversi harga dan stok ke tipe numerik dengan aman
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numericStock = stock
      ? typeof stock === 'string'
        ? parseInt(stock)
        : stock
      : 0;

    if (isNaN(numericPrice)) {
      return NextResponse.json(
        { error: 'Price must be a valid number' },
        { status: 400 }
      );
    }

    // Hanya lakukan validasi stock jika properti stock memang ada
    if (stock && isNaN(numericStock)) {
      return NextResponse.json(
        { error: 'Stock must be a valid number' },
        { status: 400 }
      );
    }

    // Membuat produk baru dengan data yang sudah divalidasi dan diolah
    const product = await prisma.product.create({
      data: {
        name,
        // Menggunakan operator || untuk memberikan nilai default (string kosong)
        // jika `description` atau `image` tidak ada atau kosong.
        // Ini mengatasi error tipe 'string | null' is not assignable to type 'string'.
        description: description || '',
        price: numericPrice,
        image: image || '',
        stock: numericStock,
        categoryId,
        // Menggunakan operator nullish coalescing `??` untuk memberikan nilai
        // default `false` jika `featured` tidak ada.
        featured: featured ?? false,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
