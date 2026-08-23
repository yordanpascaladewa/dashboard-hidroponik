'use client';
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { Menu, Search, Bell, User } from 'lucide-react';

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex bg-[#121315] h-screen text-white font-sans overflow-hidden">
      
      {/* KOTAK SIDEBAR */}
      <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${isSidebarOpen ? 'w-[280px]' : 'w-0'}`}>
        <Sidebar />
      </div>
      
      {/* SISI KANAN */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        
        {/* TOPBAR / NAVBAR ATAS (INI YANG ILANG TADI WKWK) */}
        <header className="h-[90px] flex items-center justify-between px-8 border-b border-white/5 shrink-0 bg-[#121315]">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2.5 bg-[#1f2021] px-5 py-2.5 rounded-full border border-white/10 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">System Online</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <button className="p-2.5 hover:bg-white/10 rounded-xl transition-colors">
              <Search size={22} />
            </button>
            <button className="p-2.5 hover:bg-white/10 rounded-xl transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#121315]"></span>
            </button>
            <div className="w-[1px] h-6 bg-white/10 mx-2"></div> {/* Pembatas vertikal */}
            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors bg-[#1f2021] border border-white/10 text-slate-200">
              <User size={20} />
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