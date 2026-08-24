'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, BarChart2, Server, LogOut, Sprout } from 'lucide-react';

export default function Sidebar({ onClose }) {
  const pathname = usePathname();

  // Daftar menu yang sesuai dengan UI web lu
  const menuItems = [
    { path: '/dashboard', name: 'BERANDA', icon: <LayoutGrid size={20} /> },
    { path: '/analytics', name: 'ANALISIS DATA', icon: <BarChart2 size={20} /> },
    { path: '/hardware-status', name: 'STATUS SISTEM', icon: <Server size={20} /> },
  ];

  // FUNGSI UNTUK LOGOUT / KELUAR SESI (Hapus Tiket)
  const handleLogout = () => {
    // Hapus cookie sesi login
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Refresh dan kembalikan ke halaman login
    window.location.href = '/login';
  };

  // FUNGSI NAVIGASI PINTAR (Hanya nutup sidebar di layar HP)
  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <aside className="w-full h-full bg-[#0d0e0f] border-r border-white/5 flex flex-col py-6 md:py-8 overflow-y-auto">
      
      {/* AREA ATAS: flex-1 akan mendorong konten ini mengisi ruang kosong */}
      <div className="flex-1 flex flex-col">
        {/* LOGO AREA */}
        <div className="flex items-center gap-3 px-8 mb-10 md:mb-12 shrink-0">
          <Sprout size={28} className="text-[#10B981]" />
          <span className="text-xl font-bold text-white tracking-tight">AeroGrow<span className="text-[#10B981]">Pro</span></span>
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className="flex flex-col gap-2 px-4 shrink-0">
          {menuItems.map((item) => {
            // Mengecek apakah halaman ini sedang aktif
            const isActive = pathname === item.path;
            
            return (
              <Link href={item.path} key={item.path} onClick={handleLinkClick}>
                <div className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
                  isActive 
                    ? 'bg-[#1f2021] text-[#10B981] shadow-lg border border-white/5' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}>
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* AREA BAWAH: Tombol Logout (Aman dari potongan layar HP) */}
      <div className="px-4 mt-8 pb-4 shrink-0">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 cursor-pointer"
        >
          <LogOut size={20} /> KELUAR SESI
        </button>
      </div>

    </aside>
  );
}