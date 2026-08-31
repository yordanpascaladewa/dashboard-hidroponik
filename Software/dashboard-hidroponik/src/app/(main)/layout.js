'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { Menu, Clock, Wifi, WifiOff } from 'lucide-react';

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSync, setLastSync] = useState('--:--:--');
  
  const [liveTime, setLiveTime] = useState({ 
    tanggal: 'Memuat waktu...', 
    jam: '--:--:--' 
  });

  useEffect(() => {
    const handleResize = () => {
      // Sidebar otomatis terbuka penuh di Desktop, dan tertutup di HP
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const latest = json.data[0];
          const dataTime = new Date(latest.timestamp).getTime();
          const currentTime = new Date().getTime();
          const diffSeconds = (currentTime - dataTime) / 1000;
          
          // Toleransi super ketat: 15 detik (karena ESP32 ngirim tiap 10 dtk)
          setIsOnline(diffSeconds <= 15);
          setLastSync(new Date(latest.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }));
        }
      } catch (error) {
        setIsOnline(false);
      }
    };
    
    checkSystemStatus();
    // Tarik data lebih agresif: setiap 3 detik (awalnya 10 dtk)
    const interval = setInterval(checkSystemStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-[#121315] h-[100dvh] text-white font-sans overflow-hidden relative">
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out shrink-0 bg-[#121315] border-r border-white/5 ${
        isSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'
      }`}>
        <Sidebar 
          onClose={() => {
            // Cegah sidebar menutup di desktop saat link diklik
            if (window.innerWidth < 1024) {
              setIsSidebarOpen(false);
            }
          }} 
        />
      </div>
      
      <div className="flex-1 flex flex-col h-[100dvh] min-w-0 overflow-hidden">
        <header className="h-[90px] flex items-center px-6 md:px-8 border-b border-white/5 shrink-0 bg-[#121315] z-30 sticky top-0 w-full">
          <div className="flex items-center gap-4 md:gap-5 w-full">
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 cursor-pointer shrink-0"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex flex-col justify-center border-l border-white/10 pl-4 md:pl-5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] md:text-[12px] font-bold text-slate-200 tracking-wide uppercase">
                  {liveTime.tanggal}
                </span>
                <span className="hidden md:inline text-slate-600 font-bold">•</span>
                <div className="hidden md:flex items-center gap-1.5">
                  <Clock size={12} className="text-[#10B981]" />
                  <span className="text-[11px] font-mono font-semibold text-[#10B981] tracking-widest">
                    {liveTime.jam} WIB
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${
                  isOnline ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                }`}>
                  {isOnline ? (
                    <Wifi size={10} className="text-[#10B981] animate-pulse" />
                  ) : (
                    <WifiOff size={10} className="text-red-400" />
                  )}
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isOnline ? 'text-[#10B981]' : 'text-red-400'}`}>
                    {isOnline ? 'Sistem Online' : 'Sistem Offline'}
                  </span>
                </div>
                
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                  <span className="md:hidden text-[#10B981]">{liveTime.jam} |</span> Sync: {lastSync}
                </span>
              </div>
            </div>
            
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#121315]">
          {children}
        </div>
      </div>
    </div>
  );
}