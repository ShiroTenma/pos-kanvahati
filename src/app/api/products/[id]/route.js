import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// UPDATE DATA (PUT)
export async function PUT(request, { params }) {
  try {
    // --- PERBAIKAN DI SINI ---
    // params harus di-'await' dulu di Next.js terbaru
    const { id } = await params; 
    const productId = parseInt(id);
    // -------------------------

    const body = await request.json();

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        price: parseInt(body.price),
        category: body.category,
        image: body.image
      }
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error); // Biar errornya kelihatan di terminal
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

// HAPUS DATA (SOFT DELETE)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    // Bukannya .delete, tapi kita .update
    await prisma.product.update({
      where: { id: productId },
      data: { isDeleted: true } // <--- Tandai sebagai terhapus
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}