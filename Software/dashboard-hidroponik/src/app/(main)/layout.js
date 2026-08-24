'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { Menu } from 'lucide-react';

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSync, setLastSync] = useState('--:--:--');

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

  // FUNGSI CEK STATUS REAL-TIME UNTUK TOPBAR
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
          // Format presisi 07:05:30
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
      
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out shrink-0 bg-[#121315] ${
        isSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'
      }`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col h-[100dvh] min-w-0 overflow-hidden">
        
        <header className="h-[90px] flex items-center justify-between px-6 md:px-8 border-b border-white/5 shrink-0 bg-[#121315] z-30 sticky top-0">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 cursor-pointer"
            >
              <Menu size={24} />
            </button>
            
            {/* INDIKATOR ONLINE/OFFLINE DI TOPBAR DENGAN LAST SYNC */}
            <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border shadow-sm transition-colors ${
              isOnline ? 'bg-[#1f2021] border-white/10' : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-red-500'}`}></div>
              <div className="flex flex-col">
                <span className={`text-[11px] font-bold uppercase tracking-widest leading-none ${isOnline ? 'text-slate-300' : 'text-red-400'}`}>
                  {isOnline ? 'System Online' : 'System Offline'}
                </span>
                <span className={`text-[9px] font-mono mt-0.5 ${isOnline ? 'text-slate-500' : 'text-red-400/80'}`}>
                  Sync: {lastSync}
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