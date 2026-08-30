'use client';
import React, { useState, useEffect } from 'react';
import { Activity, RefreshCcw, Zap, Cpu } from 'lucide-react';

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

          // FORMATTER TANGGAL LENGKAP INDONESIA
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
    const interval = setInterval(fetchHardwareData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Logika pembacaan status relay dari database (0 = OFF, 1 = ON)
  const isDoserActive = telemetry.relay_doser_a === 1 || telemetry.relay_doser_b === 1;
  const isPhUpActive = telemetry.relay_ph_up === 1;

  return (
    <main className="p-5 md:p-10 w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
      
      {/* HEADER HALAMAN */}
      <div className="flex justify-between items-end mb-2 px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 md:mb-2">Hardware Status</h1>
          <p className="text-[10px] md:text-[11px] text-slate-500 uppercase tracking-widest font-mono">Device Diagnostics & Peripherals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* KOLOM KIRI: RELAY MODULES */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Relay Modules</h2>
          
          <HardwareCard 
            icon={<Activity size={24} className={isOnline ? "text-[#10B981]" : "text-slate-500"} />}
            title="Pompa Sirkulasi Utama / pH Up"
            subtitle="ACTIVE RUNNING (RELAY PIN GPIO)"
            value={!isOnline ? "OFFLINE" : isPhUpActive ? "INJECTING" : "STANDBY"}
            isActive={isOnline && isPhUpActive}
            isOffline={!isOnline}
          />

          <HardwareCard 
            icon={<RefreshCcw size={24} className={isDoserActive ? "text-purple-400" : "text-slate-500"} />}
            title="Doser Nutrisi A & B"
            subtitle="AUTO DOSING SYSTEM"
            value={!isOnline ? "OFFLINE" : isDoserActive ? "DOSING" : "STANDBY"}
            isActive={isDoserActive}
            isOffline={!isOnline}
            activeColor="bg-purple-500"
            activeTextColor="text-purple-400"
          />
        </div>

        {/* KOLOM KANAN: POWER & CONTROLLER */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Power & Controller</h2>
          
          {/* Card Sumber Daya */}
          <div className="bg-[#1f2021] rounded-2xl p-5 md:p-6 border border-white/5 shadow-lg flex items-center justify-between transition-colors hover:border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl text-[#63f7ff]">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Sumber Daya Aktif</h3>
                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-mono mt-1">Adaptor / Power Supply</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className={`text-xl font-black ${isOnline ? "text-[#63f7ff]" : "text-slate-500"}`}>
                {isOnline ? `${telemetry.voltaseBaterai?.toFixed(1)}V` : '-- V'}
              </span>
              <span className="text-[9px] font-mono text-slate-500 mt-1">{isOnline ? `${telemetry.energiSolar} mA` : '-- mA'}</span>
            </div>
          </div>

          {/* CARD ESP32 DENGAN TANGGAL FULL */}
          <div className={`bg-[#1f2021] rounded-2xl p-5 md:p-6 border shadow-lg flex items-center justify-between transition-colors ${isOnline ? 'border-white/5 hover:border-emerald-500/30' : 'border-red-500/20'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isOnline ? "bg-emerald-500/10 text-[#10B981]" : "bg-red-500/10 text-red-400"}`}>
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">ESP32 Microcontroller</h3>
                {/* INI BAGIAN TANGGAL FULL-NYA */}
                <p className={`text-[10px] font-mono mt-1.5 ${isOnline ? "text-slate-400" : "text-red-400/80"}`}>
                  Last Sync: <span className="font-semibold">{lastSyncFull}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-[#10B981] animate-pulse" : "bg-slate-600"}`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isOnline ? "text-[#10B981]" : "text-slate-500"}`}>
                {isOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

// Komponen Card Bantuan Biar Rapi
function HardwareCard({ icon, title, subtitle, value, isActive, isOffline, activeColor = "bg-[#10B981]", activeTextColor = "text-[#10B981]" }) {
  return (
    <div className={`bg-[#1f2021] rounded-2xl p-5 md:p-6 border shadow-lg flex items-center justify-between transition-colors ${isActive ? `border-${activeColor.split('-')[1]}-500/30` : 'border-white/5 hover:border-white/10'}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-xl">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-200">{title}</h3>
          <p className="text-[9px] uppercase tracking-widest text-slate-500 font-mono mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isOffline ? "bg-slate-600" : isActive ? `${activeColor} animate-pulse` : "bg-slate-500"}`}></div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isOffline ? "text-slate-500" : isActive ? activeTextColor : "text-slate-400"}`}>
          {value}
        </span>
      </div>
    </div>
  );
}