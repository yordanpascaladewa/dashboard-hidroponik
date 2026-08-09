import React from 'react';

export default function Sidebar() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      <aside className="fixed left-0 top-0 h-full w-72 bg-[#1f2021] border-r border-[rgba(255,255,255,0.12)] z-50 flex flex-col p-6">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 mb-12">
          <span className="material-symbols-outlined text-[#10B981] text-3xl">eco</span>
          <span className="text-[24px] font-bold tracking-tighter text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif' }}>
            AeroGrow <span className="text-[#10B981]">Pro</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-[#10B981] bg-[#10B981]/10 text-[#10B981] transition-all duration-300 shadow-[inset_4px_0_0_0_rgba(16,185,129,1)]">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[12px] uppercase tracking-[0.1em] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Beranda</span>
          </a>
          
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
            <span className="material-symbols-outlined">monitoring</span>
            <span className="text-[12px] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Analisis Data</span>
          </a>
          
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
            <span className="material-symbols-outlined">settings_input_component</span>
            <span className="text-[12px] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Pusat Kendali</span>
          </a>
          
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
            <span className="material-symbols-outlined">database</span>
            <span className="text-[12px] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Riwayat Tanam</span>
          </a>
          
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
            <span className="material-symbols-outlined">health_and_safety</span>
            <span className="text-[12px] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Status Sistem</span>
          </a>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto border-t border-[rgba(255,255,255,0.12)] pt-6">
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-[#c8c8ac] hover:text-[#ffb4ab] hover:bg-[#93000a]/20">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-[12px] uppercase tracking-[0.1em] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Keluar Sesi</span>
          </a>
        </div>
        
      </aside>
    </>
  );
}