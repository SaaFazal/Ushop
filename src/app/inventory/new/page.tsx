import React from 'react';
import { ArrowLeft, Camera, Barcode, Tag, Truck, PoundSterling, Package, Check } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { addProduct } from '@/lib/actions';

async function getSuppliers() {
  return await prisma.supplier.findMany();
}

export default async function NewProductPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/inventory" className="p-2 hover:bg-zinc-900 rounded-lg transition-colors group">
          <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-white" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Add Product</h2>
          <p className="text-zinc-500 mt-1">Create a new item in your inventory catalog.</p>
        </div>
      </div>

      <form action={addProduct} className="space-y-6">
        {/* Visual/Image Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-2xl bg-zinc-950 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer group">
            <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Take Photo</span>
          </div>
          <div className="w-full">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Image URL</label>
            <input 
              name="image"
              type="text" 
              placeholder="Paste image URL or take photo..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Core Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Product Name</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  name="name"
                  type="text" 
                  required
                  placeholder="e.g., Fresh Espresso Beans" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Barcode</label>
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  name="barcode"
                  type="text" 
                  placeholder="Scan item..." 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Category</label>
              <select 
                name="category"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
              >
                <option>Beverages</option>
                <option>Bakery</option>
                <option>Dairy</option>
                <option>Snacks</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Supplier */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Cost Price</label>
              <div className="relative">
                <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  name="costPrice"
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Selling Price</label>
              <div className="relative">
                <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  name="sellingPrice"
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Supplier</label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <select 
                  name="supplierId"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Min Stock Level</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  name="minStockLevel"
                  type="number" 
                  defaultValue="5"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Check className="w-6 h-6" />
          Save Product
        </button>
      </form>
    </div>
  );
}
