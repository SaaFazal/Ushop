import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { differenceInDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        batches: true,
      },
    });

    const now = new Date();
    const alerts: any[] = [];

    products.forEach((product: any) => {
      product.batches.forEach((batch: any) => {
        if (batch.expiryDate) {
          const daysToExpiry = differenceInDays(new Date(batch.expiryDate), now);
          if (daysToExpiry < 7 && daysToExpiry >= 0) {
            alerts.push({
              type: 'CRITICAL',
              productName: product.name,
              message: `${batch.quantity} units are expiring in ${daysToExpiry} days!`,
              batchId: batch.id,
              expiryDate: new Date(batch.expiryDate).toDateString(),
            });
          } else if (daysToExpiry < 14 && daysToExpiry >= 7) {
            alerts.push({
              type: 'WARNING',
              productName: product.name,
              message: `${batch.quantity} units expiring soon.`,
              batchId: batch.id,
              expiryDate: new Date(batch.expiryDate).toDateString(),
            });
          }
        }
      });
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}
