'use client';
import React, { useState, useEffect } from 'react';
import { FlaskConical, Droplets, Thermometer } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('24H'); // '24H', '7D', '40D'
  const [rawData, setRawData] = useState([]);
  const [averages, setAverages] = useState({ ph: 0, tds: 0, suhu: 0 });
  const [chartData, setChartData] = useState([]);

  // 1. Fetch data dari API MongoDB saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setRawData(json.data);
          processAnalyticsData(json.data, '24H');
        }
      } catch (error) {
        console.error('Gagal memuat data analytics:', error);
      }
    };
    fetchData();
  }, []);

  // 2. Fungsi untuk memproses rata-rata dan data grafik berdasarkan tab waktu
  const processAnalyticsData = (data, tab) => {
    const now = new Date().getTime();
    let timeLimit = 24 * 60 * 60 * 1000; // Default 24 Jam

    if (tab === '7D') {
      timeLimit = 7 * 24 * 60 * 60 * 1000;
    } else if (tab === '40D') {
      timeLimit = 40 * 24 * 60 * 60 * 1000;
    }

    // Filter data berdasarkan rentang waktu
    const filtered = data.filter(item => {
      const itemTime = new Date(item.timestamp).getTime();
      return now - itemTime <= timeLimit;
    });

    const targetData = filtered.length > 0 ? filtered : data;

    // Hitung rata-rata
    const totalPh = targetData.reduce((acc, curr) => acc + (curr.ph || 0), 0);
    const totalTds = targetData.reduce((acc, curr) => acc + (curr.tds || 0), 0);
    const totalSuhu = targetData.reduce((acc, curr) => acc + (curr.suhu || 0), 0);
    const count = targetData.length;

    setAverages({
      ph: count > 0 ? (totalPh / count).toFixed(1) : '0.0',
      tds: count > 0 ? Math.round(totalTds / count) : 0,
      suhu: count > 0 ? (totalSuhu / count).toFixed(1) : '0.0',
    });

    // Format data untuk Recharts
    const formattedChart = targetData.slice(0, 30).reverse().map(item => ({
      waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      pH: parseFloat((item.ph || 0).toFixed(2)),
      TDS: Math.round(item.tds || 0),
    }));

    setChartData(formattedChart);
  };

  // Handler saat user ganti tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    processAnalyticsData(rawData, tab);
  };

  return (
    <main className="p-8 md:p-10 w-full flex flex-col gap-8 pb-12">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analisis Data</h1>
        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Historical Averages & Statistics</p>
      </div>

      {/* TAB FILTER WAKTU */}
      <div className="flex bg-[#1f2021] p-1.5 rounded-2xl w-fit border border-white/5 shadow-md">
        <button 
          onClick={() => handleTabChange('24H')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === '24H' ? 'bg-[#10B981] text-[#0d0e0f] shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          24 JAM
        </button>
        <button 
          onClick={() => handleTabChange('7D')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === '7D' ? 'bg-[#10B981] text-[#0d0e0f] shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          7 HARI
        </button>
        <button 
          onClick={() => handleTabChange('40D')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === '40D' ? 'bg-[#10B981] text-[#0d0e0f] shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          40 HARI
        </button>
      </div>

      {/* KARTU RATA-RATA (METRICS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1f2021] rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rata-Rata pH</span>
            <div className="p-2.5 rounded-xl bg-white/5 text-[#10B981]">
              <FlaskConical size={24} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono tracking-tight">{averages.ph}</span>
            <span className="text-xs font-bold text-[#10B981]">pH</span>
          </div>
        </div>

        <div className="bg-[#1f2021] rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rata-Rata TDS</span>
            <div className="p-2.5 rounded-xl bg-white/5 text-[#8B5CF6]">
              <Droplets size={24} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono tracking-tight">{averages.tds}</span>
            <span className="text-xs font-bold text-[#8B5CF6]">PPM</span>
          </div>
        </div>

        <div className="bg-[#1f2021] rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rata-Rata Suhu</span>
            <div className="p-2.5 rounded-xl bg-white/5 text-[#63f7ff]">
              <Thermometer size={24} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono tracking-tight">{averages.suhu}</span>
            <span className="text-xs font-bold text-[#63f7ff]">°C</span>
          </div>
        </div>
      </div>

      {/* KOTAK GRAFIK ANALISIS HISTORIS */}
      <div className="bg-[#1f2021] rounded-2xl p-7 border border-white/5 shadow-lg min-h-[400px] flex flex-col">
        <h2 className="text-lg font-bold mb-2">Grafik Tren Historis ({activeTab})</h2>
        <p className="text-xs text-slate-400 mb-6 font-mono">Visualisasi data akumulasi dari database MongoDB Atlas</p>
        <div className="flex-1 w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPhAna" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorTdsAna" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="waktu" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
              <YAxis yId="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} domain={[5, 9]} />
              <YAxis yId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} domain={[800, 1600]} />
              <Tooltip contentStyle={{ backgroundColor: '#121315', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Area isAnimationActive={true} yId="left" type="monotone" dataKey="pH" stroke="#10B981" strokeWidth={3} fill="url(#colorPhAna)" />
              <Area isAnimationActive={true} yId="right" type="monotone" dataKey="TDS" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorTdsAna)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}