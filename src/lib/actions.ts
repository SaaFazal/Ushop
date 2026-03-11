'use server';

import prisma from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const barcode = formData.get('barcode') as string;
  const category = formData.get('category') as string;
  const supplierId = formData.get('supplierId') as string;
  const costPrice = parseFloat(formData.get('costPrice') as string);
  const sellingPrice = parseFloat(formData.get('sellingPrice') as string);
  const minStockLevel = parseInt(formData.get('minStockLevel') as string);
  const image = formData.get('image') as string;

  await prisma.product.create({
    data: {
      name,
      barcode,
      category,
      supplierId,
      costPrice,
      sellingPrice,
      minStockLevel,
      image,
      currentStock: 0,
    },
  });

  revalidatePath('/inventory');
  redirect('/inventory');
}

export async function stockIn(formData: FormData) {
  const productId = formData.get('productId') as string;
  const quantity = parseInt(formData.get('quantity') as string);
  const expiryDate = formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : null;
  const batchNumber = formData.get('batchNumber') as string;

  await prisma.$transaction(async (tx: any) => {
    // 1. Create Batch
    await tx.batch.create({
      data: {
        productId,
        quantity,
        expiryDate,
        batchNumber,
      },
    });

    // 2. Update Product Stock
    await tx.product.update({
      where: { id: productId },
      data: {
        currentStock: { increment: quantity },
      },
    });
  });

  revalidatePath('/inventory');
  revalidatePath('/');
}

export async function syncSale(productId: string, quantity: number) {
  await prisma.$transaction(async (tx: any) => {
    // 1. Reduce total stock
    await tx.product.update({
      where: { id: productId },
      data: {
        currentStock: { decrement: quantity },
      },
    });

    // 2. Reduce from batches (FIFO: oldest received first)
    const batches = await tx.batch.findMany({
      where: { productId, quantity: { gt: 0 } },
      orderBy: { receivedAt: 'asc' },
    });

    let remainingToReduce = quantity;
    for (const batch of batches) {
      if (remainingToReduce <= 0) break;

      const reduction = Math.min(batch.quantity, remainingToReduce);
      await tx.batch.update({
        where: { id: batch.id },
        data: { quantity: { decrement: reduction } },
      });
      remainingToReduce -= reduction;
    }
  });

  revalidatePath('/inventory');
  revalidatePath('/');
}

export async function processCheckout(items: { productId: string; quantity: number }[]) {
  await prisma.$transaction(async (tx: any) => {
    for (const item of items) {
      // 1. Reduce total stock
      await tx.product.update({
        where: { id: item.productId },
        data: {
          currentStock: { decrement: item.quantity },
        },
      });

      // 2. Reduce from batches (FIFO)
      const batches = await tx.batch.findMany({
        where: { productId: item.productId, quantity: { gt: 0 } },
        orderBy: { receivedAt: 'asc' },
      });

      let remainingToReduce = item.quantity;
      for (const batch of batches) {
        if (remainingToReduce <= 0) break;

        const reduction = Math.min(batch.quantity, remainingToReduce);
        await tx.batch.update({
          where: { id: batch.id },
          data: { quantity: { decrement: reduction } },
        });
        remainingToReduce -= reduction;
      }
    }
  });

  revalidatePath('/inventory');
  revalidatePath('/');
}
