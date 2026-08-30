'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { Menu, Clock } from 'lucide-react';

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSync, setLastSync] = useState('--:--:--');
  
  // STATE UNTUK JAM DIGITAL REAL-TIME
  const [liveTime, setLiveTime] = useState({ 
    tanggal: 'Memuat waktu...', 
    jam: '--:--:--' 
  });

  // Efek untuk sidebar di layar HP
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

  // 1. FUNGSI JAM BERJALAN (Update setiap 1 detik)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
      const dayName = days[now.getDay()];
      const date = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      
      setLiveTime({
        tanggal: `${dayName}, ${date} ${monthName} ${year}`,
        jam: `${h}:${m}:${s}`
      });
    };
    
    updateClock(); // Panggil pertama kali
    const timer = setInterval(updateClock, 1000); // Looping tiap detik
    return () => clearInterval(timer);
  }, []);

  // 2. FUNGSI CEK STATUS ONLINE/OFFLINE ALAT
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const latest = json.data[0];
          const dataTime = new Date(latest.timestamp).getTime();
          const currentTime = new Date().getTime();
          const diffMinutes = (currentTime - dataTime) / (1000 * 60);
          
          setIsOnline(diffMinutes <= 3);
          setLastSync(new Date(latest.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }));
        }
      } catch (error) {
        setIsOnline(false);
      }
    };
    
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-[#121315] h-[100dvh] text-white font-sans overflow-hidden relative">
      
      {/* Overlay Sidebar untuk HP */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Komponen Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out shrink-0 bg-[#121315] ${
        isSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'
      }`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col h-[100dvh] min-w-0 overflow-hidden">
        
        {/* HEADER TOPBAR (Muncul di semua halaman) */}
        <header className="h-[90px] flex items-center justify-between px-6 md:px-8 border-b border-white/5 shrink-0 bg-[#121315] z-30 sticky top-0">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 cursor-pointer"
            >
              <Menu size={24} />
            </button>
            
            {/* TAMPILAN JAM LIVE (Untuk Layar Desktop/Laptop) */}
            <div className="hidden md:flex flex-col border-l border-white/10 pl-5">
              <span className="text-[13px] font-bold text-slate-200 tracking-wide uppercase">
                {liveTime.tanggal}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock size={12} className="text-[#10B981]" />
                <span className="text-[12px] font-mono font-semibold text-[#10B981] tracking-widest">
                  {liveTime.jam} WIB
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            
            {/* TAMPILAN JAM LIVE KECIL (Untuk Layar HP biar muat) */}
            <div className="flex md:hidden flex-col items-end border-r border-white/10 pr-4">
              <span className="text-[9px] font-bold text-slate-300 uppercase">{liveTime.tanggal.split(',')[0]}</span>
              <span className="text-[10px] font-mono font-bold text-[#10B981]">{liveTime.jam}</span>
            </div>

            {/* INDIKATOR ONLINE/OFFLINE ALAT */}
            <div className={`flex items-center gap-2.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full border shadow-sm transition-colors ${
              isOnline ? 'bg-[#1f2021] border-white/10' : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-red-500'}`}></div>
              <div className="flex flex-col">
                <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-widest leading-none ${isOnline ? 'text-slate-300' : 'text-red-400'}`}>
                  {isOnline ? 'System Online' : 'System Offline'}
                </span>
                <span className={`text-[9px] font-mono mt-0.5 ${isOnline ? 'text-slate-500' : 'text-red-400/80'}`}>
                  Sync: {lastSync}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* KONTEN HALAMAN (Beranda, Analisis, dll masuk ke sini) */}
        <div className="flex-1 overflow-y-auto bg-[#121315]">
          {children}
        </div>

      </div>
    </div>
  );
}