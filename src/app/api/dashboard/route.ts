import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { differenceInDays, addDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        batches: true,
      },
    });

    const now = new Date();
    const sevenDaysFromNow = addDays(now, 7);

    let expiringSevenDays = 0;
    let expiringFourteenDays = 0;
    let totalRiskValue = 0;
    let lowStockItems = products.filter((p: any) => p.currentStock <= p.minStockLevel).length;

    products.forEach((product: any) => {
      product.batches.forEach((batch: any) => {
        if (batch.expiryDate) {
          const daysToExpiry = differenceInDays(new Date(batch.expiryDate), now);
          if (daysToExpiry < 7 && daysToExpiry >= 0) {
            expiringSevenDays += batch.quantity;
            totalRiskValue += batch.quantity * product.costPrice;
          } else if (daysToExpiry < 14 && daysToExpiry >= 7) {
            expiringFourteenDays += batch.quantity;
          }
        }
      });
    });

    return NextResponse.json({
      expiringSevenDays,
      expiringFourteenDays,
      totalRiskValue,
      lowStockItems,
      totalProducts: products.length
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
