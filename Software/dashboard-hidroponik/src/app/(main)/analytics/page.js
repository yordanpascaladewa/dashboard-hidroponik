'use client';
import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, FlaskConical, BarChart2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('24h');
  const [averages, setAverages] = useState({ ph: 0, tds: 0, suhu: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi fetch data historis (di real apps, API backend lu yg harus ngitung atau ngebalikin array panjang)
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/telemetry'); // Ambil data
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          // Dummy calculation for UI logic (Karena API lo skrg cuma limit 15-20 data terbaru)
          // Di TA lu, lu bisa update API-nya buat query spesifik tanggal.
          const avgPh = json.data.reduce((acc, curr) => acc + curr.ph, 0) / json.data.length;
          const avgTds = json.data.reduce((acc, curr) => acc + curr.tds, 0) / json.data.length;
          const avgSuhu = json.data.reduce((acc, curr) => acc + curr.suhu, 0) / json.data.length;
          
          setAverages({ ph: avgPh, tds: avgTds, suhu: avgSuhu });
        }
      } catch (error) { console.error(error); }
      setIsLoading(false);
    };
    fetchAnalytics();
  }, [timeframe]);

  return (
    <main className="p-8 md:p-12 w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analisis Data</h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Historical Averages</p>
      </div>

      {/* TIMEFRAME SELECTOR */}
      <div className="flex gap-4 p-1.5 bg-[#1f2021] rounded-xl w-fit border border-white/10">
        {['24h', '7d', '40d'].map((tf) => (
          <button 
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-8 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
              timeframe === tf ? 'bg-[#10B981] text-black shadow-lg' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            {tf === '24h' ? '24 Jam' : tf === '7d' ? '7 Hari' : '40 Hari'}
          </button>
        ))}
      </div>

      {/* AVERAGES RESULT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AvgCard label="Rata-rata pH" value={averages.ph} unit="pH" icon={<FlaskConical size={24}/>} color="#10B981" loading={isLoading} />
        <AvgCard label="Rata-rata TDS" value={averages.tds} unit="PPM" icon={<Droplets size={24}/>} color="#8B5CF6" loading={isLoading} />
        <AvgCard label="Rata-rata Suhu" value={averages.suhu} unit="°C" icon={<Thermometer size={24}/>} color="#63f7ff" loading={isLoading} />
      </div>

      {/* PLACEHOLDER VISUALIZATION */}
      <div className="w-full bg-[#1f2021] rounded-2xl p-10 border border-white/10 flex flex-col items-center justify-center min-h-[300px] text-slate-500">
        <BarChart2 size={48} className="mb-4 opacity-50" />
        <p className="font-bold tracking-widest uppercase text-sm">Visualisasi Mode {timeframe === '24h' ? '24 Jam' : timeframe === '7d' ? '7 Hari' : '40 Hari'} Aktif</p>
        <p className="text-xs mt-2 font-mono">Data terakumulasi dari MongoDB Atlas</p>
      </div>
    </main>
  );
}

function AvgCard({ label, value, unit, icon, color, loading }) {
  return (
    <div className="bg-[#1f2021] rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <span className="text-5xl font-black font-mono">
          {loading ? '--' : value?.toFixed(1)}
        </span>
        <span className="text-sm font-bold text-slate-500 ml-2" style={{ color }}>{unit}</span>
      </div>
    </div>
  );
}