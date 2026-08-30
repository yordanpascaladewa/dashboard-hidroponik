'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Server, LogOut, Sprout } from 'lucide-react';

export default function Sidebar({ onClose }) {
  const pathname = usePathname();

  // Menu Analisis Data sudah dihapus dari daftar ini
  const menuItems = [
    { name: 'Beranda', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Status Sistem', path: '/hardware-status', icon: <Server size={20} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-[#121315] w-full">
      
      {/* LOGO */}
      <div className="h-[90px] flex items-center px-8 shrink-0">
        <Sprout className="text-[#10B981] mr-2.5" size={28} />
        <span className="text-xl font-bold text-white tracking-wide">
          AeroGrow<span className="text-[#10B981]">Pro</span>
        </span>
      </div>

      {/* MENU ITEMS */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} onClick={onClose}>
              <div className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-xs md:text-sm tracking-wider uppercase transition-all ${
                isActive 
                  ? 'bg-white/5 text-[#10B981] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}>
                {item.icon}
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>

      {/* TOMBOL KELUAR */}
      <div className="p-4 mb-2">
        <button 
          onClick={() => signOut()} 
          className="flex items-center gap-4 px-4 py-3.5 w-full text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-bold text-xs md:text-sm tracking-wider uppercase transition-all"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
      
    </div>
  );
}