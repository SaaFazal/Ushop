import React from 'react';
import prisma from '@/lib/db';
import { Scan, Calendar, Hash, ArrowLeft, Package, Check } from 'lucide-react';
import Link from 'next/link';

async function getProducts() {
  return await prisma.product.findMany({ select: { id: true, name: true, barcode: true } });
}

export default async function StockInPage() {
  const products = await getProducts();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/inventory" className="p-2 hover:bg-zinc-900 rounded-lg transition-colors group">
          <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-white" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Stock In</h2>
          <p className="text-zinc-500 mt-1">Register new stock delivery and track expiry batches.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column - Form */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Scan Barcode or Select Product</label>
              <div className="relative">
                <Scan className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Scan item barcode..." 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  autoFocus
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Quantity Recieved</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="date" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Batch Number / Reference</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="e.g., BATCH-123" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            Confirm Stock In
          </button>
        </div>

        {/* Right Column - Summary/Info */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h4 className="font-semibold text-white mb-4">Stock Handling Tip</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/50 flex items-center justify-center text-[10px] text-blue-400 shrink-0">1</div>
                <p className="text-xs text-zinc-400 leading-relaxed">Ensure you scan the manufacturer barcode for automatic product matching.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/50 flex items-center justify-center text-[10px] text-blue-400 shrink-0">2</div>
                <p className="text-xs text-zinc-400 leading-relaxed">Always check the physical expiry date on the packaging before saving.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-950/20 border border-blue-900/40 rounded-2xl p-6">
            <h4 className="font-semibold text-blue-400 mb-2">Automatic Sync</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Once you confirm, the stock levels will be updated across all modules including the POS sync API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
