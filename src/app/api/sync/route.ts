export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { syncSale } from '@/lib/actions';

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json({ error: 'Missing productId or quantity' }, { status: 400 });
    }

    await syncSale(productId, quantity);

    return NextResponse.json({ success: true, message: `Stock reduced by ${quantity}` });
  } catch (error) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: 'Failed to sync sale' }, { status: 500 });
  }
}
