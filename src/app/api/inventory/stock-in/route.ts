import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { barcode, quantity, expiryDate, batchNumber } = await req.json();

    const product = await prisma.product.findUnique({
      where: { barcode },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Create new batch
      const batch = await tx.batch.create({
        data: {
          productId: product.id,
          quantity: parseInt(quantity),
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          batchNumber,
        },
      });

      // Update product current stock
      return await tx.product.update({
        where: { id: product.id },
        data: {
          currentStock: {
            increment: parseInt(quantity),
          },
        },
      });
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process stock-in' }, { status: 500 });
  }
}
