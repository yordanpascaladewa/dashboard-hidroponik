'use client';
import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Power, Activity, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function HardwareStatusPage() {
  const [telemetry, setTelemetry] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('--:--:--');

  useEffect(() => {
    const fetchHardwareStatus = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          const latest = json.data[0];
          setTelemetry(latest);

          const dataTime = new Date(latest.timestamp).getTime();
          const currentTime = new Date().getTime();
          const diffMinutes = (currentTime - dataTime) / (1000 * 60);

          setIsOnline(diffMinutes <= 3);

          // FORMAT PRESISI HH:mm:ss
          setLastUpdate(new Date(latest.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }));
        }
      } catch (error) {
        console.error('Gagal mengambil status hardware:', error);
        setIsOnline(false);
      }
    };

    fetchHardwareStatus();
    const interval = setInterval(fetchHardwareStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const isDosingActive = telemetry?.relay_doser_a === 1 || telemetry?.relay_doser_b === 1 || telemetry?.relay_ph_up === 1;

  return (
    <main className="p-8 md:p-10 w-full flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Hardware Status</h1>
        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Device Diagnostics & Peripherals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* KIRI: RELAY MODULES */}
        <div className="flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Relay Modules</h2>
          
          <div className={`bg-[#1f2021] rounded-2xl p-6 border shadow-lg flex justify-between items-center transition-all ${isOnline ? 'border-white/5' : 'border-red-500/20 opacity-80'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isOnline ? 'bg-emerald-500/10 text-[#10B981]' : 'bg-slate-800 text-slate-500'}`}>
                <Activity size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-200">Pompa Sirkulasi Utama</h3>
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

          <div className={`bg-[#1f2021] rounded-2xl p-6 border shadow-lg flex justify-between items-center transition-all ${isOnline ? 'border-white/5' : 'border-red-500/20 opacity-80'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${!isOnline ? 'bg-slate-800 text-slate-500' : isDosingActive ? 'bg-purple-500/20 text-purple-400 animate-bounce' : 'bg-purple-500/10 text-[#8B5CF6]'}`}>
                <RefreshCw size={24} className={isDosingActive && isOnline ? 'animate-spin' : ''} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-200">Doser Nutrisi A & B</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {!isOnline ? 'SYSTEM OFFLINE' : isDosingActive ? 'INJECTING NUTRIENT...' : 'AUTO DOSING SYSTEM'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${!isOnline ? 'bg-red-500' : isDosingActive ? 'bg-purple-400 animate-ping' : 'bg-slate-500'}`}></span>
              <span className={`text-xs font-bold uppercase tracking-widest ${!isOnline ? 'text-red-400' : isDosingActive ? 'text-purple-400' : 'text-slate-400'}`}>
                {!isOnline ? 'OFFLINE' : isDosingActive ? 'INJECTING' : 'STANDBY'}
              </span>
            </div>
          </div>
        </div>

        {/* KANAN: POWER & CONTROLLER */}
        <div className="flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Power & Controller</h2>
          
          <div className={`bg-[#1f2021] rounded-2xl p-6 border shadow-lg flex justify-between items-center transition-all ${isOnline ? 'border-white/5' : 'border-red-500/20 opacity-80'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isOnline ? 'bg-cyan-500/10 text-[#63f7ff]' : 'bg-slate-800 text-slate-500'}`}>
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-200">Sumber Daya Aktif</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">ADAPTOR / POWER SUPPLY</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xl font-black font-mono ${isOnline ? 'text-[#63f7ff]' : 'text-red-400'}`}>
                {isOnline && telemetry ? `${telemetry.voltaseBaterai?.toFixed(1)}V` : '-- V'}
              </span>
              <p className="text-[10px] text-slate-500 font-mono">
                {isOnline && telemetry ? `${telemetry.energiSolar || 0} mA` : 'OFFLINE'}
              </p>
            </div>
          </div>

          <div className={`bg-[#1f2021] rounded-2xl p-6 border shadow-lg flex justify-between items-center transition-all ${isOnline ? 'border-white/5' : 'border-red-500/20 opacity-80'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isOnline ? 'bg-emerald-500/10 text-[#10B981]' : 'bg-red-500/10 text-red-500'}`}>
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-200">ESP32 Microcontroller</h3>
                <p className={`text-xs font-mono mt-0.5 ${isOnline ? 'text-slate-500' : 'text-red-400'}`}>
                  Last Sync: {lastUpdate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-red-500'}`}></span>
              <span className={`text-xs font-bold uppercase tracking-widest ${isOnline ? 'text-[#10B981]' : 'text-red-400'}`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}