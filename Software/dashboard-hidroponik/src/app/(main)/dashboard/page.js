'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, FlaskConical, Calendar, Zap, BatteryCharging, Sprout, Send, Lock, WifiOff } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === 'admin'; 

  const [telemetry, setTelemetry] = useState({
    suhu: 0, ph: 0, tds: 0, voltaseBaterai: 0, energiSolar: 0, usia_hari: 0, tanaman: 'STANDBY WAIT'
  });
  const [chartData, setChartData] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  
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
          
          const dataTime = new Date(latest.timestamp).getTime();
          const currentTime = new Date().getTime();
          const diffSeconds = (currentTime - dataTime) / 1000;
          const currentOnlineStatus = diffSeconds <= 35;
          setIsOnline(currentOnlineStatus);

          setTelemetry(latest);

          const history = json.data.slice(0, 20).reverse().map((item) => {
            return {
              waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              pH: parseFloat(item.ph.toFixed(2)),
              TDS: Math.round(item.tds)
            };
          });
          
          setChartData(history);
        }
      } catch (error) { 
        console.error(error); 
        setIsOnline(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateTanaman = async (e) => {
    e.preventDefault();
    if (isLocked || !isOnline || !isAdmin) return; 

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
        setStatusMessage('Gagal mengirim perintah. Pastikan Anda Admin.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Terjadi kesalahan koneksi.');
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 font-mono text-sm">Memuat Dashboard...</div>;
  }

  return (
    <main className="p-5 md:p-10 w-full flex flex-col gap-6 md:gap-8 pb-12">
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-end mb-1 px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 md:mb-2">System Overview</h1>
          <p className="text-[10px] md:text-[11px] text-slate-500 uppercase tracking-widest font-mono">Live Telemetry Data & Control</p>
        </div>
      </div>

      {/* 2. METRIC CARDS (Dipindah ke atas agar fokus ke monitoring data) */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-500 ${isOnline ? 'opacity-100' : 'opacity-50 grayscale-[30%]'}`}>
        <MetricCard label="Suhu Air" value={telemetry.suhu?.toFixed(1) || '--'} unit="°C" icon={<Thermometer size={20} className="md:w-6 md:h-6"/>} color="#63f7ff" />
        <MetricCard label="Tingkat pH" value={telemetry.ph?.toFixed(2) || '--'} unit="pH" icon={<FlaskConical size={20} className="md:w-6 md:h-6"/>} color="#10B981" />
        <MetricCard label="Nutrisi" value={telemetry.tds || '--'} unit="PPM" icon={<Droplets size={20} className="md:w-6 md:h-6"/>} color="#8B5CF6" />
        <MetricCard label="Fase" value={telemetry.usia_hari || 0} unit="Hari" icon={<Calendar size={20} className="md:w-6 md:h-6"/>} color="#dfed1a" />
      </div>

      {/* 3. CHART & INFO SINGKAT (Area visualisasi utama) */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${isOnline ? 'opacity-100' : 'opacity-50 grayscale-[30%]'}`}>
        
        {/* GRAFIK UKURAN FLEKSIBEL */}
        <div className="lg:col-span-2 bg-[#1f2021] rounded-2xl p-5 md:p-7 border border-white/5 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base md:text-lg font-bold">Tren Kualitas Air (Real-Time)</h2>
            {!isOnline && <span className="text-[9px] md:text-xs font-mono text-red-400 border border-red-500/20 bg-red-500/10 px-2 py-1 rounded">PAUSED</span>}
          </div>
          
          <div className="w-full min-h-[250px] md:min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorTds" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="waktu" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} dy={10} minTickGap={20} />
                <YAxis yId="left" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} domain={[5, 9]} ticks={[5, 6, 7, 8, 9]} tickFormatter={(val) => val.toFixed(1)} />
                <YAxis yId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} domain={[800, 1600]} ticks={[800, 1000, 1200, 1400, 1600]} tickFormatter={(val) => Math.round(val)} />
                <Tooltip contentStyle={{ backgroundColor: '#121315', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }} />
                <Area isAnimationActive={isOnline} yId="left" type="monotone" dataKey="pH" stroke="#10B981" strokeWidth={3} fill="url(#colorPh)" />
                <Area isAnimationActive={isOnline} yId="right" type="monotone" dataKey="TDS" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorTds)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QUICK HARDWARE INFO */}
        <div className="bg-[#1f2021] rounded-2xl p-5 md:p-7 border border-white/5 shadow-lg flex flex-col gap-5 md:gap-6">
          <h3 className="text-base md:text-lg font-bold border-b border-white/5 pb-3 md:pb-4">Info Singkat</h3>
          
          <div className="p-5 md:p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Komoditas Aktif</span>
              <span className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${!isOnline ? 'text-red-400' : 'text-[#10B981]'}`}>
                {!isOnline ? 'OFFLINE' : telemetry.tanaman || 'STANDBY'}
              </span>
            </div>
            <Sprout size={48} className="text-white/10 absolute right-3 bottom-2 -rotate-12 md:w-14 md:h-14" />
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-4 md:p-5 bg-white/5 rounded-2xl border border-white/5 text-center flex flex-col justify-center items-center gap-2 md:gap-3">
              <BatteryCharging size={24} className={`md:w-7 md:h-7 ${isOnline ? 'text-[#63f7ff]' : 'text-slate-500'}`} />
              <div>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase block mb-0.5 md:mb-1">Tegangan</span>
                <span className="text-lg md:text-xl font-black">{telemetry.voltaseBaterai?.toFixed(1) || '--'} V</span>
              </div>
            </div>
            <div className="p-4 md:p-5 bg-white/5 rounded-2xl border border-white/5 text-center flex flex-col justify-center items-center gap-2 md:gap-3">
              <Zap size={24} className={`md:w-7 md:h-7 ${isOnline ? 'text-[#dfed1a]' : 'text-slate-500'}`} />
              <div>
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase block mb-0.5 md:mb-1">Arus Listrik</span>
                <span className="text-lg md:text-xl font-black">{telemetry.energiSolar || '--'} mA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PANEL KONTROL (Dipindah ke bawah sebagai area Action) */}
      <div className={`mt-2 bg-[#1f2021] rounded-2xl p-5 md:p-6 border shadow-lg flex flex-col gap-4 relative transition-colors ${
        !isOnline ? 'border-red-500/30' : isLocked ? 'border-amber-500/30' : 'border-white/5'
      }`}>
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sprout size={18} className="text-[#10B981]" /> Kontrol Komoditas
          </h2>
          
          {!isOnline ? (
            <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[11px] font-mono border border-red-500/20">
              <WifiOff size={13} /> <span className="hidden md:inline">DIBLOKIR</span> (OFFLINE)
            </div>
          ) : isLocked ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[11px] font-mono border border-amber-500/20">
              <Lock size={13} /> TERKUNCI <span className="hidden md:inline">(AKTIF)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-[#10B981] px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[11px] font-mono border border-emerald-500/20">
              <span>UNLOCKED</span>
            </div>
          )}
        </div>
        
        {/* LOGIKA RBAC KONDISIONAL (ADMIN VS USER) */}
        {!isAdmin ? (
          <div className="flex flex-col items-center justify-center p-6 bg-[#121315] border border-white/5 rounded-xl gap-2 mt-2">
            <Lock size={28} className="text-red-400/80 mb-1" />
            <span className="text-sm font-bold text-slate-300">Akses Ditolak</span>
            <span className="text-[10px] md:text-xs text-slate-500 text-center max-w-md">Akun Anda <b>(User)</b> hanya memiliki hak akses pantauan pasif (Read-Only). Hubungi <b>Administrator</b> untuk mengubah setpoint nutrisi komoditas.</span>
          </div>
        ) : (
          <>
            <form onSubmit={handleUpdateTanaman} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 items-end mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Komoditas Tanaman</label>
                <select 
                  value={selectedTanaman}
                  onChange={(e) => setSelectedTanaman(e.target.value)}
                  disabled={isLocked || !isOnline}
                  className={`w-full bg-[#121315] border rounded-xl p-3 text-white font-medium text-sm transition-all ${
                    isLocked || !isOnline ? 'opacity-50 cursor-not-allowed border-white/5' : 'border-white/10 focus:outline-none focus:border-[#10B981]'
                  }`}
                >
                  {daftarTanaman.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Umur Bibit (Hari)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="60"
                  value={selectedUsia}
                  onChange={(e) => setSelectedUsia(e.target.value)}
                  disabled={isLocked || !isOnline}
                  className={`w-full bg-[#121315] border rounded-xl p-3 text-white font-medium text-sm transition-all ${
                    isLocked || !isOnline ? 'opacity-50 cursor-not-allowed border-white/5' : 'border-white/10 focus:outline-none focus:border-[#10B981]'
                  }`}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isLocked || !isOnline}
                className={`font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-wider ${
                  isLocked || !isOnline 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50 border border-white/5' 
                    : 'bg-[#10B981] hover:bg-[#059669] text-[#0d0e0f] shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer'
                }`}
              >
                <Send size={18} /> Terapkan
              </button>
            </form>

            {isLocked && isOnline && (
              <p className="text-[10px] md:text-[11px] font-mono text-amber-400/80 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 leading-relaxed mt-1">
                ⚠️ <b>Pemberitahuan:</b> Komoditas dan umur bibit terkunci. Untuk mengubahnya, lakukan <b>reset manual</b> pada alat fisik menggunakan tombol <i>rotary encoder</i> (tekan lama).
              </p>
            )}

            {statusMessage && (
              <p className={`text-xs font-mono mt-1 animate-pulse ${statusMessage.includes('Gagal') || statusMessage.includes('kesalahan') ? 'text-red-400' : 'text-[#10B981]'}`}>
                {statusMessage}
              </p>
            )}
          </>
        )}
      </div>

    </main>
  );
}

function MetricCard({ label, value, unit, icon, color }) {
  return (
    <div className="bg-[#1f2021] rounded-2xl p-4 md:p-6 border border-white/5 shadow-lg flex flex-col gap-3 md:gap-4 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</span>
        <div className="p-2 md:p-2.5 rounded-xl bg-white/5" style={{ color: color }}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1.5 md:gap-2">
        <span className="text-2xl md:text-4xl font-black font-mono tracking-tight">{value}</span>
        <span className="text-[10px] md:text-xs font-bold text-slate-500" style={{ color }}>{unit}</span>
      </div>
    </div>
  );
}