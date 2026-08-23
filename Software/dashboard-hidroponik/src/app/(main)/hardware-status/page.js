'use client';
import React, { useState, useEffect } from 'react';
import { Cpu, Power, Plug, Battery, Waves, TestTube2 } from 'lucide-react';

export default function HardwareStatusPage() {
  const [telemetry, setTelemetry] = useState({ voltaseBaterai: 0, energiSolar: 0 });
  const [pumpStatus, setPumpStatus] = useState('STANDBY'); // Mock status
  const [doserStatus, setDoserStatus] = useState('STANDBY');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setTelemetry(json.data[0]);
          
          // Simple mock logic: Kalo TDS/pH tiba2 nge-drop/naik ekstrim, asumsikan doser lagi kerja
          // Di alat asli, lu bisa nambahin variabel JSON "doser: ON" dari ESP32.
          setPumpStatus(json.data[0].voltaseBaterai > 5 ? 'ACTIVE RUNNING' : 'STANDBY');
          setDoserStatus('STANDBY WAIT');
        }
      } catch (error) { console.error(error); }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Logic nentuin power supply (Misal kalo > 10V pake power supply/adaptor, kalo kurang pake batre)
  const isPowerSupply = telemetry.voltaseBaterai > 10.0;

  return (
    <main className="p-8 md:p-12 w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Hardware Status</h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Device Diagnostics & Peripherals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* RELAY & POMPA */}
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-bold border-b border-white/5 pb-2">Relay Modules</h2>
          
          <StatusBox 
            title="Pompa Sirkulasi Utama" 
            status={pumpStatus} 
            icon={<Waves size={24} />} 
            isActive={pumpStatus.includes('ACTIVE')} 
          />
          <StatusBox 
            title="Doser Nutrisi A & B" 
            status={doserStatus} 
            icon={<TestTube2 size={24} />} 
            isActive={doserStatus.includes('INJECT')} 
          />
        </div>

        {/* SUMBER DAYA & ESP32 */}
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-bold border-b border-white/5 pb-2">Power & Controller</h2>
          
          <div className="p-6 bg-[#1f2021] border border-white/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isPowerSupply ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                {isPowerSupply ? <Plug size={24} /> : <Battery size={24} />}
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">Sumber Daya Aktif</p>
                <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  {isPowerSupply ? 'Adaptor / Power Supply' : 'Baterai Cadangan'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black font-mono">{telemetry.voltaseBaterai?.toFixed(1) || '--'}V</p>
              <p className="text-xs text-slate-500 font-bold">{telemetry.energiSolar || '--'} mA</p>
            </div>
          </div>

          <StatusBox 
            title="ESP32 Microcontroller" 
            status="ONLINE (DUAL-CORE)" 
            icon={<Cpu size={24} />} 
            isActive={true} 
          />
        </div>

      </div>
    </main>
  );
}

function StatusBox({ title, status, icon, isActive }) {
  return (
    <div className="p-6 bg-[#1f2021] border border-white/10 rounded-2xl flex items-center justify-between transition-colors hover:border-white/20">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${isActive ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-white/5 text-slate-500'}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-white mb-1">{title}</p>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#10B981] animate-pulse' : 'bg-slate-500'}`}></div>
            <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: isActive ? '#10B981' : '#64748b' }}>
              {status}
            </p>
          </div>
        </div>
      </div>
      {isActive ? <Power size={20} className="text-[#10B981]" /> : <Power size={20} className="text-slate-600" />}
    </div>
  );
}