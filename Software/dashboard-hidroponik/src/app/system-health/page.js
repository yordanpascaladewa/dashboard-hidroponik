'use client';
import React from 'react';
import { Cpu, Wifi, Zap, AlertTriangle, Settings2, Gauge, Info } from 'lucide-react';

function HealthMetric({ label, value, unit, status, progress, color }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{label}</p>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-5xl font-black text-slate-800 tracking-tighter">{value}</span>
        <span className="text-xs font-bold text-slate-400 uppercase">{unit}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
        <div className={`h-full rounded-full bg-emerald-500 transition-all duration-1000`} style={{ width: `${progress}%` }} />
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{status}</p>
    </div>
  );
}

export default function SystemHealthPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FB] p-8 ml-64">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kesehatan Sistem</h1>
          <p className="text-slate-400 mt-1">Diagnostik perangkat keras dan pemeliharaan hub.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Optimal</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
              <Cpu size={20} className="text-slate-400" />
              <h2 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Status Perangkat</h2>
            </div>
            <div className="grid grid-cols-3 gap-12">
              <HealthMetric label="CPU" value="12" unit="%" status="Normal • 42°C" progress={12} />
              <HealthMetric label="Wi-Fi" value="-45" unit="dBm" status="Kuat" progress={85} />
              <HealthMetric label="Power" value="24.1" unit="V" status="Stabil" progress={95} />
            </div>
          </section>
        </div>
        
        <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <Gauge size={20} className="text-slate-400" />
            <h2 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Kalibrasi</h2>
          </div>
          <div className="p-4 border border-slate-100 rounded-2xl mb-4">
            <h4 className="text-sm font-bold text-slate-800">Sensor pH</h4>
            <p className="text-[10px] text-emerald-500 font-bold mt-1">OPTIMAL</p>
          </div>
          <div className="p-4 border border-slate-100 rounded-2xl">
            <h4 className="text-sm font-bold text-slate-800">Sensor TDS</h4>
            <p className="text-[10px] text-amber-500 font-bold mt-1">40 HARI LALU</p>
          </div>
        </section>
      </div>
    </div>
  );
}