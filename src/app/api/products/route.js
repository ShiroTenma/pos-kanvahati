import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// AMBIL DATA (GET)
export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

// TAMBAH DATA BARU (POST)
export async function POST(request) {
  try {
    const body = await request.json();
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        price: parseInt(body.price), // Pastikan jadi angka
        category: body.category,
        image: body.image || "📦" // Default emoji kalau kosong
      }
    });
    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ error: "Gagal tambah produk" }, { status: 500 });
  }
}