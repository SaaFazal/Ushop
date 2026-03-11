export const dynamic = 'force-dynamic';

import React from 'react';
import prisma from '@/lib/db';
import { Plus, Search, Filter, MoreVertical, Package, Barcode } from 'lucide-react';
import Link from 'next/link';

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      supplier: true,
      _count: {
        select: { batches: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Product Master</h2>
          <p className="text-zinc-500 mt-1">Manage your product catalog and stock levels.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4 items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search products, barcodes..." 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-zinc-950 border border-zinc-800 text-zinc-400 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            Category
          </button>
          <button className="bg-zinc-950 border border-zinc-800 text-zinc-400 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            Supplier
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-950 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Price (Cost/Sell)</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Batches</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  No products found. Add your first product to get started.
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors border-b border-zinc-800/50 last:border-0">
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 overflow-hidden shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-zinc-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{product.name}</p>
                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                          <Barcode className="w-3 h-3" />
                          {product.barcode || 'No Barcode'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-6 hidden md:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${product.currentStock <= product.minStockLevel ? 'text-red-400' : 'text-green-400'}`}>
                        {product.currentStock}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase font-medium">Available</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-6 hidden lg:table-cell">
                    <div className="text-sm font-bold text-white">£{product.sellingPrice.toFixed(2)}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">Margin: £{(product.sellingPrice - product.costPrice).toFixed(2)}</div>
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-right">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-white">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
