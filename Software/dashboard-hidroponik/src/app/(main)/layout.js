'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { Menu } from 'lucide-react';

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Otomatis tutup sidebar kalau dibuka di HP agar tidak kepotong
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex bg-[#121315] h-[100dvh] text-white font-sans overflow-hidden relative">
      
      {/* BACKDROP GELAP KHUSUS HP */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* SIDEBAR */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out shrink-0 bg-[#121315] ${
        isSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'
      }`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      {/* KONTEN UTAMA SISI KANAN */}
      <div className="flex-1 flex flex-col h-[100dvh] min-w-0 overflow-hidden">
        
        {/* TOPBAR / NAVBAR ATAS (Bersih, hanya ada tombol menu & indikator online) */}
        <header className="h-[90px] flex items-center justify-between px-6 md:px-8 border-b border-white/5 shrink-0 bg-[#121315] z-30 sticky top-0">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 cursor-pointer"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2.5 bg-[#1f2021] px-5 py-2.5 rounded-full border border-white/10 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">System Online</span>
            </div>
          </div>
        </header>

        {/* AREA HALAMAN */}
        <div className="flex-1 overflow-y-auto bg-[#121315]">
          {children}
        </div>

      </div>
    </div>
  );
}