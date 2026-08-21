'use client'; // Wajib ditambahin di Next.js App Router buat pake useState & useEffect

import React, { useState, useEffect } from 'react';

export default function DashboardPage() {
  // Bikin state buat nyimpen data dari database
  const [telemetry, setTelemetry] = useState({
    suhu: 0,
    ph: 0,
    tds: 0,
    voltaseBaterai: 0,
    energiSolar: 0 // Asumsi arus (mA) masuk ke sini
  });

  // Fungsi buat ngambil data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        
        // Mengambil data terbaru (index 0) dari array hasil database
        if (json.data && json.data.length > 0) {
          setTelemetry(json.data[0]);
        }
      } catch (error) {
        console.error("Gagal ngambil data telemetry:", error);
      }
    };

    // Panggil saat pertama kali web dibuka
    fetchData();

    // Setup interval biar web nge-refresh data otomatis tiap 1 menit (60000 ms)
    // Biar lu ga perlu pencet F5 terus-terusan
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex-1 w-full flex flex-col gap-10 p-6 md:p-12 relative">
      
      {/* Title Section (Tetap sama) */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end w-full mb-2">
        {/* ... (bagian title tidak ada yang diubah) ... */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.8)] rounded-full"></span>
            <h1 className="text-[36px] md:text-[48px] font-bold text-[#ffffff] m-0 tracking-[-0.04em] leading-[1.1]" style={{ fontFamily: 'Inter, sans-serif' }}>
              System Overview
            </h1>
          </div>
          <p className="text-[14px] md:text-[16px] font-medium text-[#e3e2e3] m-0 uppercase tracking-[0.02em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            AeroGrow Pro // Node 04 // Live Telemetry
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        
        {/* Metric 1 - Suhu */}
        <div className="bg-[#1f2021] rounded-xl p-6 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Suhu Air</span>
            <span className="material-symbols-outlined text-[#63f7ff] text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>water_drop</span>
          </div>
          <div className="flex items-baseline gap-2">
            {/* INI YANG DIGANTI: Nampilin data dari state */}
            <span className="text-5xl font-black text-[#ffffff] leading-none tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {telemetry.suhu ? telemetry.suhu.toFixed(1) : '--'}
            </span>
            <span className="text-[16px] text-[#00dce5] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>°C</span>
          </div>
          <div className="w-full h-1 bg-[#343536] rounded-full mt-2 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-[#63f7ff] w-[45%] rounded-full shadow-[0_0_10px_rgba(99,247,255,0.5)]"></div>
          </div>
        </div>

        {/* Metric 2 - pH */}
        <div className="bg-[#1f2021] rounded-xl p-6 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Tingkat pH</span>
            <span className="material-symbols-outlined text-[#10B981] text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>science</span>
          </div>
          <div className="flex items-baseline gap-2">
            {/* INI YANG DIGANTI */}
            <span className="text-5xl font-black text-[#ffffff] leading-none tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {telemetry.ph ? telemetry.ph.toFixed(1) : '--'}
            </span>
            <span className="text-[16px] text-[#10B981] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>pH</span>
          </div>
          <div className="w-full h-1 bg-[#343536] rounded-full mt-2 relative overflow-hidden">
            <div className="absolute left-[30%] top-0 h-full bg-[#10B981] w-[20%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          </div>
        </div>

        {/* Metric 3 - TDS */}
        <div className="bg-[#1f2021] rounded-xl p-6 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Nutrisi (TDS)</span>
            <span className="material-symbols-outlined text-[#8B5CF6] text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>spa</span>
          </div>
          <div className="flex items-baseline gap-2">
            {/* INI YANG DIGANTI */}
            <span className="text-5xl font-black text-[#ffffff] leading-none tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {telemetry.tds || '--'}
            </span>
            <span className="text-[16px] text-[#8B5CF6] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>PPM</span>
          </div>
          <div className="w-full h-1 bg-[#343536] rounded-full mt-2 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-[#8B5CF6] w-[75%] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
          </div>
        </div>

        {/* Metric 4 - Fase (Contoh ini biarin manual dulu kalau ga dari database) */}
        <div className="bg-[#1f2021] rounded-xl p-6 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Fase Tumbuh</span>
            <span className="material-symbols-outlined text-[#dfed1a] text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>calendar_month</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-[#ffffff] leading-none tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>14</span>
            <span className="text-[16px] text-[#dfed1a] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>Hari</span>
          </div>
          <div className="w-full h-1 bg-[#343536] rounded-full mt-2 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-[#dfed1a] w-[40%] rounded-full shadow-[0_0_10px_rgba(223,237,26,0.5)]"></div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mt-2">
        
        {/* ... (Bagian Grafik Area Chart ga gua ubah biar ga kepanjangan) ... */}
        
        {/* Hardware Status Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1f2021] rounded-2xl p-8 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col gap-6 h-full relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #00f4fe 0%, transparent 50%)' }}></div>
            
            <h3 className="text-[20px] md:text-[24px] font-semibold text-[#ffffff] m-0 border-b border-[rgba(255,255,255,0.12)] pb-4 w-full flex items-center justify-between tracking-[-0.02em]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Hardware Status
              <span className="material-symbols-outlined text-[#e3e2e3] text-[20px]">memory</span>
            </h3>
            
            <div className="flex flex-col gap-5 flex-1 justify-center">
              <div className="flex items-center justify-between p-5 bg-[#292a2b] rounded-xl border border-[rgba(255,255,255,0.12)] z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Komoditas</span>
                  <span className="text-[24px] md:text-[28px] font-black text-[#ffffff] tracking-[0.1em] leading-none uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Selada</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center bg-[#343536] shadow-sm">
                  <span className="material-symbols-outlined text-[#dfed1a] text-[24px]" style={{ fontVariationSettings: '"FILL" 1' }}>grass</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 z-10">
                <div className="flex flex-col items-center gap-2 p-5 bg-[#292a2b] rounded-xl border border-[rgba(255,255,255,0.12)] text-center">
                  <span className="text-[10px] md:text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Tegangan</span>
                  <div className="flex items-baseline gap-1">
                    {/* INI YANG DIGANTI */}
                    <span className="text-[24px] md:text-[28px] font-black text-[#63f7ff]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {telemetry.voltaseBaterai ? telemetry.voltaseBaterai.toFixed(1) : '--'}
                    </span>
                    <span className="text-[12px] font-bold text-[#63f7ff]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>V</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 p-5 bg-[#292a2b] rounded-xl border border-[rgba(255,255,255,0.12)] text-center">
                  <span className="text-[10px] md:text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Arus</span>
                  <div className="flex items-baseline gap-1">
                    {/* INI YANG DIGANTI */}
                    <span className="text-[24px] md:text-[28px] font-black text-[#63f7ff]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {telemetry.energiSolar || '--'}
                    </span>
                    <span className="text-[12px] font-bold text-[#63f7ff]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>mA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ... (Bagian Calibration Hub ke bawah tetep sama, ga perlu diubah dulu) ... */}

    </main>
  );
}