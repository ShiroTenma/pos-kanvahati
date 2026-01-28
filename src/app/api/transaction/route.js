// src/app/api/transaction/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { total, items, paymentMethod } = body; // <--- Ambil paymentMethod

    // Gunakan transaksi Database (Atomicity)
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Simpan Transaksi Utama
      const newTransaction = await tx.transaction.create({
        data: {
          total: total,
          paymentMethod: paymentMethod || "CASH", // <--- Simpan ke DB
        }
      });

      // 2. Simpan Detail Barang
      for (const item of items) {
        await tx.transactionItem.create({
          data: {
            transactionId: newTransaction.id,
            productId: item.id,
            qty: item.qty,
            price: item.price
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