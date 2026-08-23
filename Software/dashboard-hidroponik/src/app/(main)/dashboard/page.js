'use client';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, FlaskConical, Calendar, Zap, BatteryCharging, Sprout } from 'lucide-react';

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState({
    suhu: 0, ph: 0, tds: 0, voltaseBaterai: 0, energiSolar: 0, usia_hari: 0, tanaman: 'STANDBY'
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setTelemetry(json.data[0]);
          const history = json.data.slice(0, 20).reverse().map(item => ({
            waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            pH: parseFloat(item.ph.toFixed(2)),
            TDS: Math.round(item.tds)
          }));
          setChartData(history);
        }
      } catch (error) { console.error(error); }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-8 md:p-10 w-full flex flex-col gap-8 pb-12">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">System Overview</h1>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Live Telemetry Data</p>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard label="Suhu Air" value={telemetry.suhu?.toFixed(1) || '--'} unit="°C" icon={<Thermometer size={24}/>} color="#63f7ff" />
        <MetricCard label="Tingkat pH" value={telemetry.ph?.toFixed(1) || '--'} unit="pH" icon={<FlaskConical size={24}/>} color="#10B981" />
        <MetricCard label="Nutrisi (TDS)" value={telemetry.tds || '--'} unit="PPM" icon={<Droplets size={24}/>} color="#8B5CF6" />
        <MetricCard label="Fase Tumbuh" value={telemetry.usia_hari || 0} unit="Hari" icon={<Calendar size={24}/>} color="#dfed1a" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAFIK */}
        <div className="lg:col-span-2 bg-[#1f2021] rounded-2xl p-7 border border-white/5 shadow-lg min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold mb-8">Tren Kualitas Air (Real-Time)</h2>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorTds" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="waktu" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                <YAxis yId="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} domain={[0, 14]} />
                <YAxis yId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} domain={[0, 2000]} />
                <Tooltip contentStyle={{ backgroundColor: '#121315', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area isAnimationActive={false} yId="left" type="monotone" dataKey="pH" stroke="#10B981" strokeWidth={3} fill="url(#colorPh)" />
                <Area isAnimationActive={false} yId="right" type="monotone" dataKey="TDS" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorTds)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QUICK HARDWARE INFO */}
        <div className="bg-[#1f2021] rounded-2xl p-7 border border-white/5 shadow-lg flex flex-col gap-6">
          <h3 className="text-lg font-bold border-b border-white/5 pb-4">Info Singkat</h3>
          
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Komoditas Aktif</span>
              <span className="text-3xl font-black uppercase text-[#10B981] tracking-tight">{telemetry.tanaman || 'STANDBY'}</span>
            </div>
            <Sprout size={56} className="text-white/10 absolute right-4 bottom-2 -rotate-12" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-center flex flex-col justify-center items-center gap-3">
              <BatteryCharging size={28} className="text-[#63f7ff]" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tegangan</span>
                <span className="text-xl font-black">{telemetry.voltaseBaterai?.toFixed(1) || '--'} V</span>
              </div>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-center flex flex-col justify-center items-center gap-3">
              <Zap size={28} className="text-[#dfed1a]" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Arus Listrik</span>
                <span className="text-xl font-black">{telemetry.energiSolar || '--'} mA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricCard({ label, value, unit, icon, color }) {
  return (
    <div className="bg-[#1f2021] rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col gap-4 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</span>
        <div className="p-2.5 rounded-xl bg-white/5" style={{ color: color }}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black font-mono tracking-tight">{value}</span>
        <span className="text-xs font-bold text-slate-500" style={{ color }}>{unit}</span>
      </div>
    </div>
  );
}