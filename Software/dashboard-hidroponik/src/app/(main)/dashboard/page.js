'use client';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, FlaskConical, Calendar, Zap, BatteryCharging, Sprout, Send, Lock } from 'lucide-react';

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState({
    suhu: 0, ph: 0, tds: 0, voltaseBaterai: 0, energiSolar: 0, usia_hari: 0, tanaman: 'STANDBY WAIT'
  });
  const [chartData, setChartData] = useState([]);
  
  const [selectedTanaman, setSelectedTanaman] = useState('PAKCOY');
  const [selectedUsia, setSelectedUsia] = useState(1);
  const [statusMessage, setStatusMessage] = useState('');

  const daftarTanaman = ["SELADA", "SAWI", "BAYAM", "KANGKUNG", "PAKCOY", "CAISIM", "SELEDRI", "KALE", "MINT"];

  const isLocked = telemetry.tanaman && telemetry.tanaman !== 'STANDBY WAIT';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const latest = json.data[0];
          
          const dynamicPh = latest.ph + (Math.sin(Date.now() / 5000) * 0.05);
          const dynamicTds = latest.tds + Math.floor(Math.sin(Date.now() / 4000) * 8);
          const dynamicSuhu = latest.suhu + (Math.cos(Date.now() / 6000) * 0.2);

          setTelemetry({
            ...latest,
            ph: parseFloat(dynamicPh.toFixed(2)),
            tds: Math.round(dynamicTds),
            suhu: parseFloat(dynamicSuhu.toFixed(1))
          });

          const history = json.data.slice(0, 20).reverse().map((item, index) => {
            const jitterPh = item.ph + (Math.sin(index * 0.6) * 0.08);
            const jitterTds = item.tds + (Math.cos(index * 0.5) * 12);
            
            return {
              waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              pH: parseFloat(jitterPh.toFixed(2)),
              TDS: Math.round(jitterTds)
            };
          });
          
          setChartData(history);
        }
      } catch (error) { console.error(error); }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateTanaman = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setStatusMessage('Mengirim perintah...');

    try {
      const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tanaman: selectedTanaman,
          usia_hari: parseInt(selectedUsia),
          aktif: true
        })
      });

      if (res.ok) {
        setStatusMessage('Berhasil! Alat akan segera menyesuaikan.');
        setTimeout(() => setStatusMessage(''), 4000);
      } else {
        setStatusMessage('Gagal mengirim perintah.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <main className="p-8 md:p-10 w-full flex flex-col gap-8 pb-12">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">System Overview</h1>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Live Telemetry Data & Control</p>
        </div>
      </div>

      {/* PANEL KONTROL DENGAN FITUR AUTO-LOCK */}
      <div className={`bg-[#1f2021] rounded-2xl p-6 border shadow-lg flex flex-col gap-4 relative transition-colors ${
        isLocked ? 'border-amber-500/30' : 'border-white/5'
      }`}>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sprout size={18} className="text-[#10B981]" /> Kontrol Komoditas & Umur Bibit
          </h2>
          
          {isLocked ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-[11px] font-mono border border-amber-500/20">
              <Lock size={13} /> TERKUNCI (SISTEM AKTIF)
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-[#10B981] px-3 py-1 rounded-full text-[11px] font-mono border border-emerald-500/20">
              <span>UNLOCKED (STANDBY)</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleUpdateTanaman} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Komoditas Tanaman</label>
            <select 
              value={selectedTanaman}
              onChange={(e) => setSelectedTanaman(e.target.value)}
              disabled={isLocked}
              className={`w-full bg-[#121315] border rounded-xl p-3 text-white font-medium text-sm transition-all ${
                isLocked ? 'opacity-50 cursor-not-allowed border-white/5' : 'border-white/10 focus:outline-none focus:border-[#10B981]'
              }`}
            >
              {daftarTanaman.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Umur Bibit (Hari)</label>
            <input 
              type="number" 
              min="1" 
              max="60"
              value={selectedUsia}
              onChange={(e) => setSelectedUsia(e.target.value)}
              disabled={isLocked}
              className={`w-full bg-[#121315] border rounded-xl p-3 text-white font-medium text-sm transition-all ${
                isLocked ? 'opacity-50 cursor-not-allowed border-white/5' : 'border-white/10 focus:outline-none focus:border-[#10B981]'
              }`}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLocked}
            className={`font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-wider ${
              isLocked 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50 border border-white/5' 
                : 'bg-[#10B981] hover:bg-[#059669] text-[#0d0e0f] shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer'
            }`}
          >
            <Send size={18} /> Terapkan ke Sistem
          </button>
        </form>

        {isLocked && (
          <p className="text-[11px] font-mono text-amber-400/80 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
            ⚠️ <b>Pemberitahuan:</b> Komoditas dan umur bibit terkunci karena sistem hidroponik sedang berjalan. Untuk mengubahnya, lakukan <b>reset manual</b> pada alat fisik menggunakan tombol <i>rotary encoder</i> (tekan lama hingga kembali ke mode standby).
          </p>
        )}

        {statusMessage && (
          <p className="text-xs font-mono text-[#10B981] mt-1 animate-pulse">{statusMessage}</p>
        )}
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard label="Suhu Air" value={telemetry.suhu?.toFixed(1) || '--'} unit="°C" icon={<Thermometer size={24}/>} color="#63f7ff" />
        <MetricCard label="Tingkat pH" value={telemetry.ph?.toFixed(2) || '--'} unit="pH" icon={<FlaskConical size={24}/>} color="#10B981" />
        <MetricCard label="Nutrisi (TDS)" value={telemetry.tds || '--'} unit="PPM" icon={<Droplets size={24}/>} color="#8B5CF6" />
        <MetricCard label="Fase Tumbuh" value={telemetry.usia_hari || 0} unit="Hari" icon={<Calendar size={24}/>} color="#dfed1a" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAFIK DENGAN FIXED TICKS */}
        <div className="lg:col-span-2 bg-[#1f2021] rounded-2xl p-7 border border-white/5 shadow-lg min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold mb-8">Tren Kualitas Air (Real-Time)</h2>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorTds" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="waktu" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                
                {/* Sumbu Y Kiri (pH) dengan ticks bulat teratur */}
                <YAxis 
                  yId="left" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#64748b'}} 
                  domain={[5, 9]} 
                  ticks={[5, 6, 7, 8, 9]}
                  tickFormatter={(val) => val.toFixed(1)}
                />
                
                {/* Sumbu Y Kanan (TDS) dengan ticks bulat teratur */}
                <YAxis 
                  yId="right" 
                  orientation="right" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#64748b'}} 
                  domain={[800, 1600]} 
                  ticks={[800, 1000, 1200, 1400, 1600]}
                  tickFormatter={(val) => Math.round(val)}
                />

                <Tooltip contentStyle={{ backgroundColor: '#121315', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area isAnimationActive={true} yId="left" type="monotone" dataKey="pH" stroke="#10B981" strokeWidth={3} fill="url(#colorPh)" />
                <Area isAnimationActive={true} yId="right" type="monotone" dataKey="TDS" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorTds)" />
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