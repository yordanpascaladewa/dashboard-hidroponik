"use client";
import React, { useState } from 'react';
import Sidebar from '../Sidebar'; // Pastikan path ini benar mengarah ke file Sidebar lu

export default function DashboardLayout({ children }) {
  // State untuk kontrol buka/tutup Navigasi
  const [isNavOpen, setIsNavOpen] = useState(true);

  return (
    <div className="bg-[#121315] min-h-screen text-[#e3e2e3] font-sans overflow-x-hidden">
      
      {/* Mengimpor Font dan Icon */}
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Panggil komponen Sidebar dan kirim state isNavOpen */}
      <Sidebar isNavOpen={isNavOpen} />

      {/* Wrapper Konten Utama yang otomatis bergeser */}
      <div className={`transition-all duration-300 ease-in-out flex flex-col min-h-screen ${isNavOpen ? 'ml-0 lg:ml-72' : 'ml-0'}`}>
        
        {/* HEADER BAR */}
        <header className="sticky top-0 h-16 bg-[#1f2021]/90 backdrop-blur-md z-40 flex items-center justify-between px-6 border-b border-[rgba(255,255,255,0.12)]">
          <div className="flex items-center gap-4">
            {/* Tombol Toggle */}
            <button 
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="flex items-center justify-center p-2 rounded-lg bg-[#292a2b] border border-[rgba(255,255,255,0.12)] text-[#e3e2e3] hover:text-[#10B981] transition-all duration-300 shadow-sm"
              title="Toggle Sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isNavOpen ? 'menu_open' : 'menu'}
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#343536] rounded-full border border-[rgba(255,255,255,0.12)]">
              <span className="w-2 h-2 rounded-full bg-[#00dce5] animate-pulse shadow-[0_0_8px_rgba(0,220,229,0.6)]"></span>
              <span className="font-mono text-[10px] text-[#e3e2e3] font-bold tracking-[0.1em] uppercase">SYSTEM ONLINE</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#c8c8ac] hover:text-[#ffffff] cursor-pointer">search</span>
              <span className="material-symbols-outlined text-[#c8c8ac] hover:text-[#ffffff] cursor-pointer">notifications</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ffffff] flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <span className="material-symbols-outlined text-[#00363b] text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* INI ADALAH TEMPAT PAGE.JS DITAMPILKAN */}
        {children}

      </div>
    </div>
  );
}