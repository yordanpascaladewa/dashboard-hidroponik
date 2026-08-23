'use client';
import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Power, Activity, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function HardwareStatusPage() {
  const [telemetry, setTelemetry] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('--');

  useEffect(() => {
    const fetchHardwareStatus = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          const latest = json.data[0];
          setTelemetry(latest);

          // Cek apakah ESP32 online (berdasarkan timestamp data terakhir masuk)
          const dataTime = new Date(latest.timestamp).getTime();
          const currentTime = new Date().getTime();
          const diffMinutes = (currentTime - dataTime) / (1000 * 60);

          // Kalau data terakhir masuk kurang dari 3 menit lalu, berarti ESP32 online
          if (diffMinutes <= 3) {
            setIsOnline(true);
          } else {
            setIsOnline(false);
          }

          setLastUpdate(new Date(latest.timestamp).toLocaleTimeString('id-ID'));
        }
      } catch (error) {
        console.error('Gagal mengambil status hardware:', error);
        setIsOnline(false);
      }
    };

    fetchHardwareStatus();
    // Refresh otomatis tiap 10 detik
    const interval = setInterval(fetchHardwareStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-8 md:p-10 w-full flex flex-col gap-8 pb-12">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Hardware Status</h1>
        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Device Diagnostics & Peripherals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* KIRI: RELAY MODULES (Pompa & Doser) */}
        <div className="flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Relay Modules</h2>
          
          {/* Pompa Sirkulasi */}
          <div className="bg-[#1f2021] rounded-2xl p-6 border border-white/5 shadow-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-[#10B981] rounded-xl">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base">Pompa Sirkulasi Utama</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {isOnline ? 'ACTIVE RUNNING (RELAY PIN GPIO)' : 'SYSTEM OFFLINE'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-red-500'}`}></span>
              <span className={`text-xs font-bold uppercase ${isOnline ? 'text-[#10B981]' : 'text-red-400'}`}>
                {isOnline ? 'RUNNING' : 'OFF'}
              </span>
            </div>
          </div>

          {/* Doser Nutrisi */}
          <div className="bg-[#1f2021] rounded-2xl p-6 border border-white/5 shadow-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 text-[#8B5CF6] rounded-xl">
                <RefreshCw size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base">Doser Nutrisi A & B</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">AUTO DOSING SYSTEM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <span className="text-xs font-bold text-slate-400 uppercase">STANDBY</span>
            </div>
          </div>
        </div>

        {/* KANAN: POWER & CONTROLLER (Sumber Daya & ESP32) */}
        <div className="flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Power & Controller</h2>
          
          {/* Sumber Daya */}
          <div className="bg-[#1f2021] rounded-2xl p-6 border border-white/5 shadow-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 text-[#63f7ff] rounded-xl">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base">Sumber Daya Aktif</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">ADAPTOR / POWER SUPPLY</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black font-mono text-[#63f7ff]">
                {telemetry ? `${telemetry.voltaseBaterai?.toFixed(1)}V` : '--'}
              </span>
              <p className="text-[10px] text-slate-500 font-mono">
                {telemetry ? `${telemetry.energiSolar || 0} mA` : '--'}
              </p>
            </div>
          </div>

          {/* ESP32 Microcontroller */}
          <div className="bg-[#1f2021] rounded-2xl p-6 border border-white/5 shadow-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-[#10B981] rounded-xl">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base">ESP32 Microcontroller</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Last Sync: {lastUpdate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-red-500'}`}></span>
              <span className={`text-xs font-bold uppercase ${isOnline ? 'text-[#10B981]' : 'text-red-400'}`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}