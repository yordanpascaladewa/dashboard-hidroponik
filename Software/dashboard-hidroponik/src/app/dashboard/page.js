'use client';
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Thermometer, Droplets, FlaskConical, Calendar, 
  Settings, Bell, User, ChevronDown, RefreshCw, Send,
  Activity, MemoryStick
} from 'lucide-react';

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState({
    suhu: 0, ph: 0, tds: 0, voltaseBaterai: 0, energiSolar: 0, usia_hari: 0, tanaman: 'STANDBY'
  });
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          const latest = json.data[0];
          setTelemetry(latest);
          
          // PERBAIKAN 1: Tambahkan 'second: 2-digit' agar setiap 10 detik punya label unik di X-Axis
          const history = json.data.slice(0, 20).reverse().map(item => ({
            waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            }),
            pH: parseFloat(item.ph.toFixed(2)),
            TDS: Math.round(item.tds)
          }));
          
          setChartData(history);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex-1 w-full flex flex-col gap-10 p-6 md:p-12 bg-[#121315] min-h-screen text-white">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end w-full mb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.8)] rounded-full"></span>
            <h1 className="text-[32px] md:text-[42px] font-bold tracking-tight">System Overview</h1>
          </div>
          <p className="text-[14px] text-slate-400 uppercase tracking-widest font-mono">AeroGrow Pro // Node 04 // Live Telemetry</p>
        </div>
        <div className="flex items-center gap-3 bg-[#1f2021] px-4 py-2 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${telemetry.tanaman !== 'STANDBY' ? 'bg-[#10B981] animate-pulse' : 'bg-slate-500'}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
            {telemetry.tanaman !== 'STANDBY' ? 'System Online' : 'System Standby'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <MetricCard label="Suhu Air" value={telemetry.suhu ? telemetry.suhu.toFixed(1) : '--'} unit="°C" icon={<Thermometer size={24}/>} color="#63f7ff" progress={(telemetry.suhu / 40) * 100} />
        <MetricCard label="Tingkat pH" value={telemetry.ph ? telemetry.ph.toFixed(1) : '--'} unit="pH" icon={<FlaskConical size={24}/>} color="#10B981" progress={(telemetry.ph / 14) * 100} />
        <MetricCard label="Nutrisi (TDS)" value={telemetry.tds || '--'} unit="PPM" icon={<Droplets size={24}/>} color="#8B5CF6" progress={(telemetry.tds / 2000) * 100} />
        <MetricCard label="Fase Tumbuh" value={telemetry.usia_hari || 0} unit="Hari" icon={<Calendar size={24}/>} color="#dfed1a" progress={Math.min((telemetry.usia_hari / 30) * 100, 100)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        <div className="lg:col-span-8 bg-[#1f2021] rounded-2xl p-8 border border-white/10 flex flex-col gap-8 min-h-[450px]">
          <div className="flex justify-between items-center w-full border-b border-white/5 pb-6">
            <div><h2 className="text-xl font-bold">Tren Kualitas Air</h2><p className="text-sm text-slate-500 mt-1 font-mono uppercase">Live Telemetry Data (10s Interval)</p></div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorTds" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="waktu" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis yId="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} domain={[0, 14]} />
                <YAxis yId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} domain={[0, 2000]} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2021', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                {/* PERBAIKAN 2: Tambahkan isAnimationActive={false} supaya re-render mulus */}
                <Area isAnimationActive={false} yId="left" type="monotone" dataKey="pH" stroke="#10B981" strokeWidth={3} fill="url(#colorPh)" />
                <Area isAnimationActive={false} yId="right" type="monotone" dataKey="TDS" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorTds)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1f2021] rounded-2xl p-8 border border-white/10 flex flex-col gap-8 h-full relative overflow-hidden">
            <h3 className="text-xl font-bold tracking-tight flex items-center justify-between border-b border-white/5 pb-6">Hardware Status <MemoryStick className="text-slate-500" size={20} /></h3>
            <div className="flex flex-col gap-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">Current Commodity</span>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black tracking-widest uppercase font-mono">{telemetry.tanaman || 'STANDBY'}</span>
                  <Activity className="text-[#dfed1a]" size={24} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <PowerMetric label="Tegangan" value={telemetry.voltaseBaterai?.toFixed(1) || '--'} unit="V" color="#63f7ff" />
                <PowerMetric label="Arus" value={telemetry.energiSolar || '--'} unit="mA" color="#63f7ff" />
              </div>
              <button className="w-full mt-auto py-5 bg-[#10B981] text-[#0d0e0f] rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all">Run Diagnostics</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricCard({ label, value, unit, icon, color, progress }) {
  return (
    <div className="bg-[#1f2021] rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col justify-between h-[180px] hover:border-white/20 transition-all">
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">{label}</span>
        <div style={{ color: color }}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black font-mono">{value}</span>
        <span className="text-sm font-bold text-slate-500" style={{ color: color }}>{unit}</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
      </div>
    </div>
  );
}

function PowerMetric({ label, value, unit, color }) {
  return (
    <div className="flex flex-col items-center gap-2 p-5 bg-white/5 rounded-2xl border border-white/5 text-center">
      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{label}</span>
      <div className="flex items-baseline gap-1"><span className="text-2xl font-black font-mono" style={{ color: color }}>{value}</span><span className="text-[10px] font-bold" style={{ color: color }}>{unit}</span></div>
    </div>
  );
}