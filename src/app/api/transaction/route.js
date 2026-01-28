import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json(); // Terima data dari frontend
    const { total, items } = body;

    // Gunakan transaksi Database (Semua berhasil atau gagal semua)
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Buat Catatan Transaksi Utama
      const newTransaction = await tx.transaction.create({
        data: {
          total: total,
        }
      });

      // 2. Masukkan Detail Barang yang Dibeli
      for (const item of items) {
        await tx.transactionItem.create({
          data: {
            transactionId: newTransaction.id,
            productId: item.id,
            qty: item.qty,
            price: item.price // Simpan harga saat beli (jaga2 kalau harga menu naik nanti)
          }
        });
      }

      return newTransaction;
    });

    return NextResponse.json({ success: true, id: result.id });
    
  } catch (error) {
    console.error("Gagal simpan transaksi:", error);
    return NextResponse.json({ success: false, error: "Database Error" }, { status: 500 });
  }
}