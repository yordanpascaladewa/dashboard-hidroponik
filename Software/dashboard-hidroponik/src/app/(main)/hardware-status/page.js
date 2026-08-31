'use client';
import React, { useState, useEffect } from 'react';
import { Activity, Zap, Cpu, Droplets } from 'lucide-react';

export default function HardwareStatusPage() {
  const [telemetry, setTelemetry] = useState({});
  const [isOnline, setIsOnline] = useState(false);
  const [lastSyncFull, setLastSyncFull] = useState('Memuat data sinkronisasi...');

  useEffect(() => {
    const fetchHardwareData = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          const latest = json.data[0];
          setTelemetry(latest);

          const dataTime = new Date(latest.timestamp);
          const currentTime = new Date();
          const diffMinutes = (currentTime - dataTime) / (1000 * 60);
          
          setIsOnline(diffMinutes <= 3);

          const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
          const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
          
          const dayName = days[dataTime.getDay()];
          const date = dataTime.getDate();
          const monthName = months[dataTime.getMonth()];
          const year = dataTime.getFullYear();
          
          const h = String(dataTime.getHours()).padStart(2, '0');
          const m = String(dataTime.getMinutes()).padStart(2, '0');
          const s = String(dataTime.getSeconds()).padStart(2, '0');

          setLastSyncFull(`${dayName}, ${date} ${monthName} ${year} | ${h}:${m}:${s} WIB`);
        }
      } catch (error) { 
        console.error("Gagal mengambil data hardware:", error); 
        setIsOnline(false);
        setLastSyncFull('Sistem Offline / Gagal memuat data');
      }
    };
    
    fetchHardwareData();
    // Dipercepat menjadi 3 detik agar aksi pompa yang sebentar tidak terlewat
    const interval = setInterval(fetchHardwareData, 3000); 
    return () => clearInterval(interval);
  }, []);

  // Memisahkan logika pembacaan status relay
  const isPhUpActive = telemetry.relay_ph_up === 1;
  const isDoserAActive = telemetry.relay_doser_a === 1;
  const isDoserBActive = telemetry.relay_doser_b === 1;

  return (
    <main className="p-6 md:p-12 w-full flex flex-col gap-10 pb-12 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* HEADER HALAMAN */}
      <div className="flex justify-between items-end mb-2 px-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">Hardware Status</h1>
          <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-mono">Device Diagnostics & Peripherals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        
        {/* KOLOM KIRI: RELAY MODULES */}
        <div className="flex flex-col gap-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 px-2">Relay Modules</h2>
          
          <HardwareCard 
            icon={<Activity size={32} className={isOnline && isPhUpActive ? "text-[#10B981]" : "text-slate-500"} />}
            title="Pompa Sirkulasi Utama / pH Up"
            subtitle="ACTIVE RUNNING (RELAY PIN GPIO)"
            value={!isOnline ? "OFFLINE" : isPhUpActive ? "INJECTING" : "STANDBY"}
            isActive={isOnline && isPhUpActive}
            isOffline={!isOnline}
            activeColor="bg-[#10B981]"
            activeTextColor="text-[#10B981]"
          />

          <HardwareCard 
            icon={<Droplets size={32} className={isDoserAActive ? "text-purple-400" : "text-slate-500"} />}
            title="Doser Nutrisi A"
            subtitle="AUTO DOSING SYSTEM (RELAY A)"
            value={!isOnline ? "OFFLINE" : isDoserAActive ? "DOSING A" : "STANDBY"}
            isActive={isDoserAActive}
            isOffline={!isOnline}
            activeColor="bg-purple-500"
            activeTextColor="text-purple-400"
          />

          <HardwareCard 
            icon={<Droplets size={32} className={isDoserBActive ? "text-blue-400" : "text-slate-500"} />}
            title="Doser Nutrisi B"
            subtitle="AUTO DOSING SYSTEM (RELAY B)"
            value={!isOnline ? "OFFLINE" : isDoserBActive ? "DOSING B" : "STANDBY"}
            isActive={isDoserBActive}
            isOffline={!isOnline}
            activeColor="bg-blue-500"
            activeTextColor="text-blue-400"
          />
        </div>

        {/* KOLOM KANAN: POWER & CONTROLLER */}
        <div className="flex flex-col gap-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 px-2">Power & Controller</h2>
          
          <div className="bg-[#1f2021] rounded-[24px] p-6 md:p-8 border border-white/5 shadow-xl flex items-center justify-between transition-colors hover:border-white/10">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/5 rounded-2xl text-[#63f7ff]">
                <Zap size={32} />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-100">Sumber Daya Aktif</h3>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mt-1.5">Adaptor / Power Supply</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className={`text-3xl md:text-4xl font-black tracking-tight ${isOnline ? "text-[#63f7ff]" : "text-slate-500"}`}>
                {isOnline ? `${telemetry.voltaseBaterai?.toFixed(1)}V` : '-- V'}
              </span>
              <span className="text-xs font-mono text-slate-400 mt-2">{isOnline ? `${telemetry.energiSolar} mA` : '-- mA'}</span>
            </div>
          </div>

          <div className={`bg-[#1f2021] rounded-[24px] p-6 md:p-8 border shadow-xl flex items-center justify-between transition-colors ${isOnline ? 'border-white/5 hover:border-emerald-500/30' : 'border-red-500/20'}`}>
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${isOnline ? "bg-emerald-500/10 text-[#10B981]" : "bg-red-500/10 text-red-400"}`}>
                <Cpu size={32} />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-100">ESP32 Microcontroller</h3>
                <p className={`text-xs font-mono mt-2 ${isOnline ? "text-slate-400" : "text-red-400/80"}`}>
                  Last Sync: <span className="font-semibold text-white/90">{lastSyncFull}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-[#10B981] animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-slate-600"}`}></div>
              <span className={`text-xs font-bold uppercase tracking-widest ${isOnline ? "text-[#10B981]" : "text-slate-500"}`}>
                {isOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function HardwareCard({ icon, title, subtitle, value, isActive, isOffline, activeColor, activeTextColor }) {
  let borderClass = 'border-white/5 hover:border-white/10';
  let shadowClass = '';
  
  if (isActive) {
    if (activeColor.includes('purple')) {
      borderClass = 'border-purple-500/40 bg-purple-500/5';
      shadowClass = 'shadow-[0_0_20px_rgba(168,85,247,0.15)]';
    }
    else if (activeColor.includes('blue')) {
      borderClass = 'border-blue-500/40 bg-blue-500/5';
      shadowClass = 'shadow-[0_0_20px_rgba(59,130,246,0.15)]';
    }
    else {
      borderClass = 'border-emerald-500/40 bg-emerald-500/5';
      shadowClass = 'shadow-[0_0_20px_rgba(16,185,129,0.15)]';
    }
  }

  return (
    <div className={`bg-[#1f2021] rounded-[24px] p-6 md:p-7 border flex items-center justify-between transition-all duration-300 ${borderClass} ${shadowClass}`}>
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl ${isActive ? 'bg-white/10' : 'bg-white/5'}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-base md:text-lg font-bold text-slate-100">{title}</h3>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mt-1.5">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${isOffline ? "bg-slate-600" : isActive ? `${activeColor} animate-pulse shadow-lg` : "bg-slate-500"}`}></div>
        <span className={`text-xs font-bold uppercase tracking-widest ${isOffline ? "text-slate-500" : isActive ? activeTextColor : "text-slate-400"}`}>
          {value}
        </span>
      </div>
    </div>
  );
}