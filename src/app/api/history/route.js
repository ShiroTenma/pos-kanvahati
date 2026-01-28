import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        items: {
          include: {
            product: true // Sertakan detail nama produk
          }
        }
      },
      orderBy: {
        date: 'desc' // Urutkan dari yang terbaru
      }
    });
    
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil history" }, { status: 500 });
  }
}