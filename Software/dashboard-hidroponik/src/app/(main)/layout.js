import React from 'react';
import Sidebar from '../Sidebar';
import { Menu, Search, Bell, User } from 'lucide-react'; // Jangan lupa import icon-nya

export default function MainLayout({ children }) {
  return (
    <div className="flex bg-[#121315] min-h-screen text-white font-sans">
      {/* 1. SIDEBAR KIRI */}
      <Sidebar />
      
      {/* 2. SISI KANAN (Ngebungkus Topbar + Konten) */}
      <div className="flex-1 ml-[280px] flex flex-col h-screen">
        
        {/* TOPBAR / NAVBAR ATAS */}
        <header className="h-[100px] flex items-center justify-between px-8 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 bg-[#1f2021] px-4 py-2 rounded-full border border-white/10 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">System Online</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell size={20} />
              {/* Titik merah notifikasi (opsional, biar keren aja) */}
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#121315]"></span>
            </button>
            <button className="w-9 h-9 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors bg-white/10 text-slate-200 ml-2">
              <User size={18} />
            </button>
          </div>
        </header>

        {/* AREA KONTEN UTAMA (Dashboard, Analytics, dll) */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}