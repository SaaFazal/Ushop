'use client';

import React from 'react';
import { Truck, Clock, ShoppingCart, Plus, Mail, FileText } from 'lucide-react';

const suppliers = [
  { id: '1', name: 'Dairy Fresh', leadTime: 2, minOrder: 50, email: 'orders@dairyfresh.com', deliveryDays: 'Mon, Wed, Fri' },
  { id: '2', name: 'Bakery Co', leadTime: 1, minOrder: 30, email: 'sales@bakeryco.uk', deliveryDays: 'Daily' },
];

export default function SuppliersPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Supplier Ordering</h2>
          <p className="text-zinc-500 mt-1">Smart reordering based on lead time and safety stock.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Add Supplier
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <Truck className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-[10px] font-bold bg-blue-950 text-blue-400 px-2 py-1 rounded border border-blue-900/50 uppercase tracking-widest">
                {supplier.leadTime}D Lead Time
              </span>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">{supplier.name}</h3>
              <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3" />
                {supplier.email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 mb-1">Min Order</p>
                <p className="text-white font-medium">£{supplier.minOrder}</p>
              </div>
              <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 mb-1">Delivery</p>
                <p className="text-white font-medium truncate">{supplier.deliveryDays}</p>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4 text-zinc-400" />
                View Order
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Auto Reorder Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mt-12">
        <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-white">Suggested Auto-Reorders</h3>
        </div>
        <div className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="pb-4">Product</th>
                <th className="pb-4">Current Stock</th>
                <th className="pb-4">Reorder Level</th>
                <th className="pb-4">Suggested Qty</th>
                <th className="pb-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr className="group">
                <td className="py-4">
                  <p className="text-sm font-medium text-white">Fresh Milk (1L)</p>
                  <p className="text-xs text-zinc-500">Supplier: Dairy Fresh</p>
                </td>
                <td className="py-4">
                  <span className="text-red-400 font-bold">12</span>
                </td>
                <td className="py-4 text-sm text-zinc-400">
                  20 <span className="text-[10px] text-zinc-600 ml-1">(SD: 5, LT: 2)</span>
                </td>
                <td className="py-4">
                  <span className="bg-blue-900/40 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/20">40 units</span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-blue-500 hover:text-blue-400 text-sm font-bold">Add to Cart</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-6 flex justify-between items-center p-4 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-500">
              Formula: <code className="text-blue-400 font-mono">(Avg Sales × Lead Time) + Safety Stock</code>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all">
              Generate All POs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
