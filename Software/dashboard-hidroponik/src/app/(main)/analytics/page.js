'use client';
import React, { useState, useEffect } from 'react';
import { FlaskConical, Droplets, Thermometer, Database } from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('24H'); // '24H', '7D', '40D'
  const [rawData, setRawData] = useState([]);
  const [averages, setAverages] = useState({ ph: 0, tds: 0, suhu: 0 });

  // 1. Fetch data dari API MongoDB saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setRawData(json.data);
          calculateAverages(json.data, '24H');
        }
      } catch (error) {
        console.error('Gagal memuat data analytics:', error);
      }
    };
    fetchData();
  }, []);

  // 2. Fungsi untuk memfilter data berdasarkan tab waktu dan menghitung rata-rata
  const calculateAverages = (data, tab) => {
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

    // Jika data kosong pada rentang tersebut, fallback ke semua data atau 0
    const targetData = filtered.length > 0 ? filtered : data;

    // Hitung total dan rata-rata pakai reduce
    const totalPh = targetData.reduce((acc, curr) => acc + (curr.ph || 0), 0);
    const totalTds = targetData.reduce((acc, curr) => acc + (curr.tds || 0), 0);
    const totalSuhu = targetData.reduce((acc, curr) => acc + (curr.suhu || 0), 0);
    const count = targetData.length;

    setAverages({
      ph: count > 0 ? (totalPh / count).toFixed(1) : '0.0',
      tds: count > 0 ? Math.round(totalTds / count) : 0,
      suhu: count > 0 ? (totalSuhu / count).toFixed(1) : '0.0',
    });
  };

  // Handler saat user ganti tab (24 Jam, 7 Hari, 40 Hari)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    calculateAverages(rawData, tab);
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
        {/* RATA-RATA PH */}
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

        {/* RATA-RATA TDS */}
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

        {/* RATA-RATA SUHU */}
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

      {/* INFO FOOTER */}
      <div className="bg-[#1f2021] rounded-2xl p-10 border border-white/5 shadow-lg flex flex-col items-center justify-center text-center gap-3">
        <Database size={32} className="text-[#10B981] animate-pulse" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Visualisasi Mode {activeTab === '24H' ? '24 Jam' : activeTab === '7D' ? '7 Hari' : '40 Hari'} Aktif
        </h3>
        <p className="text-xs text-slate-500 font-mono">
          Data dikalkulasi secara otomatis dari database MongoDB Atlas berdasarkan rentang waktu terpilih.
        </p>
      </div>
    </main>
  );
}