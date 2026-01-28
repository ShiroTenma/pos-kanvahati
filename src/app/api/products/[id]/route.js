import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// UPDATE DATA (PUT)
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        price: parseInt(body.price),
        category: body.category,
        image: body.image
      }
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

// HAPUS DATA (DELETE)
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}