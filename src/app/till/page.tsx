'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Barcode, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Search,
  X
} from 'lucide-react';
import { processCheckout } from '@/lib/actions';

interface CartItem {
  id: string;
  name: string;
  barcode: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function TillPage() {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ 
    type: 'idle', 
    message: '' 
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus barcode input
  useEffect(() => {
    inputRef.current?.focus();
    const interval = setInterval(() => {
      if (document.activeElement?.tagName !== 'INPUT') {
        inputRef.current?.focus();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;

    setStatus({ type: 'loading', message: 'Looking up product...' });
    
    try {
      // For the demo/hackaton, we fetch from an API route we'll create next
      const res = await fetch(`/api/products/lookup?barcode=${barcodeInput}`);
      const product = await res.json();

      if (product.error) {
        setStatus({ type: 'error', message: 'Product not found' });
      } else {
        addToCart(product);
        setBarcodeInput('');
        setStatus({ type: 'idle', message: '' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection error' });
    }
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        barcode: product.barcode, 
        price: product.sellingPrice, 
        quantity: 1,
        image: product.image
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setStatus({ type: 'loading', message: 'Processing sale...' });
    try {
      const checkoutItems = cart.map(item => ({ 
        productId: item.id, 
        quantity: item.quantity 
      }));
      
      await processCheckout(checkoutItems);
      
      setCart([]);
      setStatus({ type: 'success', message: 'Sale completed successfully!' });
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Checkout failed. Please try again.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex overflow-hidden lg:pl-64">
      {/* Left Interface: Scanning & Cart */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        {/* Top Header */}
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">Supermarket Till</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active Station: POS-01</p>
            </div>
          </div>
          
          <form onSubmit={handleBarcodeSubmit} className="max-w-md w-full mx-8">
            <div className="relative group">
              <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 group-focus-within:scale-110 transition-transform" />
              <input 
                ref={inputRef}
                type="text"
                placeholder="READY TO SCAN..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl pl-14 pr-4 py-4 text-white text-xl font-mono focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-700"
              />
            </div>
          </form>
        </header>

        {/* Cart Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
              <Barcode className="w-24 h-24 opacity-10 animate-pulse" />
              <p className="text-sm font-bold uppercase tracking-widest">Awaiting First Scan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-6 group hover:border-blue-500/50 transition-colors">
                  <div className="w-16 h-16 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-8 h-8 text-zinc-700" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate uppercase">{item.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono tracking-tighter">{item.barcode}</p>
                  </div>

                  <div className="flex items-center gap-4 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-mono font-bold text-white w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-32 text-right">
                    <p className="text-xl font-mono font-bold text-white">£{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-[10px] text-zinc-500">£{item.price.toFixed(2)} / ea</p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 hover:bg-red-950 rounded-xl text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        {status.type !== 'idle' && (
          <div className={`p-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs border-t border-zinc-800 animate-in slide-in-from-bottom-2 ${
            status.type === 'error' ? 'bg-red-950/30 text-red-500' : 
            status.type === 'success' ? 'bg-green-950/30 text-green-500' : 
            'bg-blue-950/30 text-blue-400'
          }`}>
            {status.type === 'loading' ? <div className="w-3 h-3 border-2 border-t-transparent border-current rounded-full animate-spin" /> : 
             status.type === 'error' ? <AlertCircle className="w-4 h-4" /> : 
             <CheckCircle2 className="w-4 h-4" />}
            {status.message}
          </div>
        )}
      </div>

      {/* Right Sidebar: Totals & Checkout */}
      <div className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col">
        <div className="p-8 flex-1 flex flex-col">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">Summary</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-zinc-500 font-bold uppercase text-xs">Items</span>
              <span className="text-white font-mono text-xl">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-zinc-500 font-bold uppercase text-xs">Subtotal</span>
              <span className="text-white font-mono text-xl">£{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-zinc-500 font-bold uppercase text-xs">Tax (0%)</span>
              <span className="text-white font-mono text-xl">£0.00</span>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-zinc-800">
            <div className="flex justify-between items-end mb-8">
              <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Grand Total</span>
              <span className="text-5xl font-mono font-bold text-white tracking-tighter">£{total.toFixed(2)}</span>
            </div>

            <button 
              disabled={cart.length === 0 || status.type === 'loading'}
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-6 rounded-2xl text-xl font-bold uppercase tracking-widest shadow-2xl shadow-blue-900/40 active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1"
            >
              <span>{status.type === 'loading' ? 'Processing...' : 'Complete Sale'}</span>
              <span className="text-[10px] opacity-60">Press [ENTER] to confirm</span>
            </button>
            
            <button 
              onClick={() => setCart([])}
              className="w-full mt-4 py-4 px-6 text-zinc-500 hover:text-red-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-950/20 rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
              Void Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
