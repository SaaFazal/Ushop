'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Users, 
  ShoppingCart, 
  Settings, 
  AlertTriangle 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: ShoppingCart, label: 'Supermarket Till', href: '/till' },
  { icon: Package, label: 'Inventory', href: '/inventory' },
  { icon: PlusCircle, label: 'Stock In', href: '/inventory/stock-in' },
  { icon: AlertTriangle, label: 'Expiry Alerts', href: '/alerts' },
  { icon: Users, label: 'Suppliers', href: '/suppliers' },
  { icon: ShoppingCart, label: 'Orders', href: '/orders' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar({ className, "aria-hidden": ariaHidden }: { className?: string; "aria-hidden"?: boolean | "true" | "false" }) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col fixed left-0 top-0 z-50", className)} aria-hidden={ariaHidden}>
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          Ushop Inventory
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                isActive 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-blue-500" : "group-hover:text-blue-400"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 p-2 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-zinc-700" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Ushop Admin</p>
            <p className="text-xs text-zinc-500 truncate">admin@ushop.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
