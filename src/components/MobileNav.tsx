'use client';

import React, { useState } from 'react';
import { Menu, X, Package } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">Ushop</span>
        </div>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Slide-over Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-[100] lg:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Sidebar Container */}
        <div className="relative w-72 h-full bg-zinc-950 border-r border-zinc-800 shadow-2xl">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-4 p-2 text-zinc-400 hover:text-white transition-colors z-[110]"
          >
            <X className="w-6 h-6" />
          </button>
          
          <Sidebar 
            className="w-full h-full static border-none" 
            onClose={() => setIsOpen(false)} 
          />
        </div>
      </div>
    </>
  );
}
