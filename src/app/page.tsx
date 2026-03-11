export const dynamic = 'force-dynamic';

import React from 'react';
import { 
  AlertCircle, 
  ArrowUpRight, 
  Clock, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import prisma from '@/lib/db';
import { differenceInDays, isAfter, isBefore, addDays } from 'date-fns';

async function getDashboardData() {
  const products = await prisma.product.findMany({
    include: {
      batches: true,
    },
  });

  const now = new Date();
  const sevenDaysFromNow = addDays(now, 7);
  const fourteenDaysFromNow = addDays(now, 14);

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

  return {
    expiringSevenDays,
    expiringFourteenDays,
    totalRiskValue,
    lowStockItems,
    totalProducts: products.length
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-zinc-500 mt-1">Daily overview of your inventory and expiry status.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Total Products</p>
            <Package className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white">{data.totalProducts}</h3>
            <span className="text-xs text-green-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              12%
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Expiring in 7 Days</p>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white">{data.expiringSevenDays}</h3>
            <p className="text-xs text-red-400 mt-1">Requires immediate action</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Cost at Risk</p>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white">£{data.totalRiskValue.toFixed(2)}</h3>
            <p className="text-xs text-zinc-500 mt-1">Value of items expiring soon</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Low Stock Items</p>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white">{data.lowStockItems}</h3>
            <p className="text-xs text-zinc-500 mt-1">Below minimum level</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Expiry Alert Summary */}
        <div className="col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Expiry Warning System</h3>
            <Clock className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-950/50 flex items-center justify-center border border-red-900/50">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-red-400">Critical Stage (&lt;7 days)</span>
                  <span className="text-sm text-red-500 font-bold">{data.expiringSevenDays} units</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-950/50 flex items-center justify-center border border-yellow-900/50">
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-yellow-400">Warning Stage (7-14 days)</span>
                  <span className="text-sm text-yellow-500 font-bold">{data.expiringFourteenDays} units</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-950/50 flex items-center justify-center border border-green-900/50">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-green-400">Healthy Stage (&gt;14 days)</span>
                  <span className="text-sm text-green-500 font-bold">Stable</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="font-semibold text-white">System Notifications</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-4 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="w-10 h-10 rounded-lg bg-red-950/50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Milk Batch #402 Expiring</p>
                <p className="text-xs text-zinc-500 mt-0.5">£45.00 value at risk. Act now.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="w-10 h-10 rounded-lg bg-yellow-950/50 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Low Stock: Sugar (5kg)</p>
                <p className="text-xs text-zinc-500 mt-0.5">Current stock is below reorder level.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-3 rounded-lg bg-zinc-950 border border-zinc-800 opacity-60">
              <div className="w-10 h-10 rounded-lg bg-green-950/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Supplier Order Delivered</p>
                <p className="text-xs text-zinc-500 mt-0.5">Bread & Pastries batch added successfully.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
