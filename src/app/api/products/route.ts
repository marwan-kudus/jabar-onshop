import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ProductData {
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
    const featured = searchParams.get('featured');

    const where: {
      categoryId?: string;
      featured?: boolean;
    } = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured === 'true') {
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
    const {
      name,
      description,
      price,
      image,
      stock,
      categoryId,
      featured,
    }: ProductData = await request.json();

    // Validate required fields
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, or categoryId' },
        { status: 400 }
      );
    }

    // Convert price and stock to numbers safely
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

    if (isNaN(numericStock)) {
      return NextResponse.json(
        { error: 'Stock must be a valid number' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: numericPrice,
        image: image || null,
        stock: numericStock,
        categoryId,
        featured: featured || false,
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
