import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ZodError, z } from 'zod';

// Tentukan skema validasi untuk data input menggunakan Zod
const userSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi.'),
  email: z.string().email('Format email tidak valid.'),
  password: z
    .string()
    .min(6, 'Password harus minimal 6 karakter.')
    .max(20, 'Password maksimal 20 karakter.'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi data input menggunakan Zod
    const { name, email, password } = userSchema.parse(body);

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email ini sudah terdaftar.' },
        { status: 409 } // Menggunakan status 409 Conflict untuk konflik data
      );
    }

    // Hash password dengan salt yang dihasilkan secara otomatis
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat user baru di database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      // Pilih hanya kolom yang ingin dikembalikan, tanpa password
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: 'Registrasi berhasil.', user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      // Tangani error validasi dari Zod
      return NextResponse.json(
        { error: 'Data yang dikirim tidak valid.', issues: error.issues },
        { status: 400 }
      );
    }

    // Tangani error lain yang tidak terduga
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal. Silakan coba lagi nanti.' },
      { status: 500 }
    );
  }
}
