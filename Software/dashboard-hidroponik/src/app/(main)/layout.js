'use client'; // Wajib ditambahin karena kita pake interaksi useState
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { Menu, Search, Bell, User } from 'lucide-react';

export default function MainLayout({ children }) {
  // Bikin state buat ngetrack Sidebar kebuka/tertutup (default: buka)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex bg-[#121315] min-h-screen text-white font-sans overflow-hidden">
      
      {/* 1. SIDEBAR KIRI (Kirim state isOpen ke komponen Sidebar) */}
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* 2. SISI KANAN (Margin kiri berubah mulus nge-slide ngikutin sidebar) */}
      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        
        {/* TOPBAR / NAVBAR ATAS */}
        <header className="h-[100px] flex items-center justify-between px-8 border-b border-white/5 shrink-0 bg-[#121315] z-10 relative">
          <div className="flex items-center gap-4">
            {/* Tombol Hamburger dipasang onClick buat ganti state */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 bg-[#1f2021] px-4 py-2 rounded-full border border-white/10 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">System Online</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#121315]"></span>
            </button>
            <button className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors bg-white/10 text-slate-200 ml-2">
              <User size={18} />
            </button>
          </div>
        </header>

        {/* AREA KONTEN UTAMA */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}