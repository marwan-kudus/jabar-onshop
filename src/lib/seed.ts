import { prisma } from './prisma';

export async function seedDatabase() {
  try {
    // Create categories
    const electronics = await prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: {
        name: 'Electronics',
        description: 'Latest electronic gadgets and devices',
        image: 'https://via.placeholder.com/400x300',
      },
    });

    const fashion = await prisma.category.upsert({
      where: { name: 'Fashion' },
      update: {},
      create: {
        name: 'Fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://via.placeholder.com/400x300',
      },
    });

    const homeGarden = await prisma.category.upsert({
      where: { name: 'Home & Garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        description: 'Everything for your home and garden',
        image: 'https://via.placeholder.com/400x300',
      },
    });

    const sports = await prisma.category.upsert({
      where: { name: 'Sports' },
      update: {},
      create: {
        name: 'Sports',
        description: 'Sports equipment and accessories',
        image: 'https://via.placeholder.com/400x300',
      },
    });

    // Create products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        image: 'https://via.placeholder.com/400x300',
        stock: 50,
        categoryId: electronics.id,
        featured: true,
      },
      {
        name: 'Smart Watch',
        description: 'Advanced smartwatch with health monitoring',
        price: 199.99,
        image: 'https://via.placeholder.com/400x300',
        stock: 30,
        categoryId: electronics.id,
        featured: true,
      },
      {
        name: 'Laptop Backpack',
        description: 'Durable laptop backpack with multiple compartments',
        price: 49.99,
        image: 'https://via.placeholder.com/400x300',
        stock: 75,
        categoryId: fashion.id,
        featured: true,
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with excellent sound quality',
        price: 79.99,
        image: 'https://via.placeholder.com/400x300',
        stock: 40,
        categoryId: electronics.id,
        featured: true,
      },
      {
        name: 'Running Shoes',
        description: 'Comfortable running shoes for all terrains',
        price: 129.99,
        image: 'https://via.placeholder.com/400x300',
        stock: 60,
        categoryId: sports.id,
        featured: false,
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with programmable settings',
        price: 89.99,
        image: 'https://via.placeholder.com/400x300',
        stock: 25,
        categoryId: homeGarden.id,
        featured: false,
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat for comfortable workouts',
        price: 29.99,
        image: 'https://via.placeholder.com/400x300',
        stock: 100,
        categoryId: sports.id,
        featured: false,
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with long battery life',
        price: 39.99,
        image: 'https://via.placeholder.com/400x300',
        stock: 80,
        categoryId: electronics.id,
        featured: false,
      },
    ];

    for (const productData of products) {
      await prisma.product.upsert({
        where: { name: productData.name },
        update: {},
        create: productData,
      });
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
