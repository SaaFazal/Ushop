'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  AlertTriangle,
  User,
  Search
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/' },
  { icon: Package, label: 'Inventory', href: '/inventory' },
  { icon: PlusCircle, label: 'Stock In', href: '/inventory/stock-in' },
  { icon: AlertTriangle, label: 'Alerts', href: '/alerts' },
];

export default function MobileNav() {
  const pathname = usePathname();

  // Hide mobile nav on the Till page specifically if needed, 
  // but the user said "dont need till in app", so it won't be in the nav.
  const isTill = pathname === '/till';
  if (isTill) return null;

  return (
    <>
      {/* Premium Mobile App Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 px-6 flex items-center justify-between z-40">
        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400" />
        </div>
        
        <h1 className="text-lg font-bold text-white tracking-tight">Ushop</h1>
        
        <Link href="/settings" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 overflow-hidden">
          <User className="w-4 h-4 text-zinc-400" />
        </Link>
      </div>

      {/* iOS Style Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-zinc-950/80 backdrop-blur-2xl border-t border-zinc-800 flex items-center justify-around px-2 pb-safe z-40">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 w-20 py-2 transition-all duration-300",
                isActive ? "text-blue-500 scale-110" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <div className={cn(
                "p-1 rounded-xl transition-colors",
                isActive ? "bg-blue-500/10" : "bg-transparent"
              )}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
