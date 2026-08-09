"use client"; // Wajib ada karena kita pakai useState buat logika hide nav
import React, { useState } from 'react';

export default function DashboardPage() {
  // State untuk logika buka-tutup Navigasi
  const [isNavOpen, setIsNavOpen] = useState(true);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* =========================================
          SIDEBAR NAVIGATION (Dengan Logika Hide)
          ========================================= */}
      <aside 
        className={`fixed left-0 top-0 h-full w-72 bg-[#1f2021] border-r border-[rgba(255,255,255,0.12)] z-50 flex flex-col p-6 transition-transform duration-300 ease-in-out ${
          isNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 mb-12">
          <span className="material-symbols-outlined text-[#10B981] text-3xl">eco</span>
          <span className="text-[24px] font-bold tracking-tighter text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif' }}>
            AeroGrow <span className="text-[#10B981]">Pro</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-[#10B981] bg-[#10B981]/10 text-[#10B981] transition-all duration-300 shadow-[inset_4px_0_0_0_rgba(16,185,129,1)]">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[12px] uppercase tracking-[0.1em] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Beranda</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
            <span className="material-symbols-outlined">monitoring</span>
            <span className="text-[12px] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Analisis Data</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
            <span className="material-symbols-outlined">settings_input_component</span>
            <span className="text-[12px] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Pusat Kendali</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
            <span className="material-symbols-outlined">database</span>
            <span className="text-[12px] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Riwayat Tanam</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
            <span className="material-symbols-outlined">health_and_safety</span>
            <span className="text-[12px] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Status Sistem</span>
          </a>
        </nav>

        <div className="mt-auto border-t border-[rgba(255,255,255,0.12)] pt-6">
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-[#c8c8ac] hover:text-[#ffb4ab] hover:bg-[#93000a]/20">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-[12px] uppercase tracking-[0.1em] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Keluar Sesi</span>
          </a>
        </div>
      </aside>


      {/* =========================================
          MAIN CONTENT WRAPPER
          Otomatis nyesuain padding kalau Nav di-hide
          ========================================= */}
      <div 
        className={`transition-all duration-300 ease-in-out w-full min-h-screen bg-[#121315] ${
          isNavOpen ? 'lg:pl-72' : 'pl-0'
        }`}
      >
        
        {/* HEADER BAR */}
        <header 
          className={`fixed top-0 right-0 h-16 bg-[#1f2021]/90 backdrop-blur-md z-40 flex items-center justify-between px-6 border-b border-[rgba(255,255,255,0.12)] transition-all duration-300 ease-in-out ${
            isNavOpen ? 'left-0 lg:left-72' : 'left-0'
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Tombol Toggle Hide Nav */}
            <button 
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="flex items-center justify-center p-2 rounded-lg bg-[#292a2b] border border-[rgba(255,255,255,0.12)] text-[#e3e2e3] hover:text-[#10B981] hover:border-[#10B981]/50 transition-all duration-300 shadow-sm"
              title="Toggle Sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isNavOpen ? 'menu_open' : 'menu'}
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#343536] rounded-full border border-[rgba(255,255,255,0.12)]">
              <span className="w-2 h-2 rounded-full bg-[#00dce5] animate-pulse"></span>
              <span className="font-mono text-[10px] text-[#e3e2e3] font-bold tracking-[0.1em] uppercase">SYSTEM ONLINE</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#c8c8ac] hover:text-[#ffffff] cursor-pointer">search</span>
              <span className="material-symbols-outlined text-[#c8c8ac] hover:text-[#ffffff] cursor-pointer">notifications</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ffffff] flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <span className="material-symbols-outlined text-[#00363b] text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* DASHBOARD KONTEN */}
        <main className="relative pt-16 min-h-screen bg-[#121315]">
          <div className="flex flex-col w-full gap-10 p-6 md:p-12 relative overflow-hidden">
            
            {/* Title Section */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end relative z-10 w-full mb-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative z-10">
              
              {/* Metric 1 - Suhu */}
              <div className="bg-[#1f2021] rounded-xl p-6 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col justify-between h-[160px]">
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Suhu Air</span>
                  <span className="material-symbols-outlined text-[#63f7ff] text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>water_drop</span>
                </div>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-5xl font-black text-[#ffffff] leading-none tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>24.5</span>
                  <span className="text-[16px] text-[#00dce5] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>°C</span>
                </div>
                <div className="w-full h-1 bg-[#343536] rounded-full mt-2 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-[#63f7ff] w-[45%] rounded-full shadow-[0_0_10px_rgba(99,247,255,0.5)]"></div>
                </div>
              </div>

              {/* Metric 2 - pH */}
              <div className="bg-[#1f2021] rounded-xl p-6 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col justify-between h-[160px]">
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Tingkat pH</span>
                  <span className="material-symbols-outlined text-[#10B981] text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>science</span>
                </div>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-5xl font-black text-[#ffffff] leading-none tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>6.2</span>
                  <span className="text-[16px] text-[#10B981] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>pH</span>
                </div>
                <div className="w-full h-1 bg-[#343536] rounded-full mt-2 relative overflow-hidden">
                  <div className="absolute left-[30%] top-0 h-full bg-[#10B981] w-[20%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>

              {/* Metric 3 - TDS */}
              <div className="bg-[#1f2021] rounded-xl p-6 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col justify-between h-[160px]">
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Nutrisi (TDS)</span>
                  <span className="material-symbols-outlined text-[#8B5CF6] text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>spa</span>
                </div>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-5xl font-black text-[#ffffff] leading-none tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>840</span>
                  <span className="text-[16px] text-[#8B5CF6] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>PPM</span>
                </div>
                <div className="w-full h-1 bg-[#343536] rounded-full mt-2 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-[#8B5CF6] w-[75%] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                </div>
              </div>

              {/* Metric 4 - Fase */}
              <div className="bg-[#1f2021] rounded-xl p-6 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col justify-between h-[160px]">
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Fase Tumbuh</span>
                  <span className="material-symbols-outlined text-[#dfed1a] text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>calendar_month</span>
                </div>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-5xl font-black text-[#ffffff] leading-none tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>14</span>
                  <span className="text-[16px] text-[#dfed1a] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>Hari</span>
                </div>
                <div className="w-full h-1 bg-[#343536] rounded-full mt-2 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-[#dfed1a] w-[40%] rounded-full shadow-[0_0_10px_rgba(223,237,26,0.5)]"></div>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full relative z-10 mt-2">
              
              {/* Analytics Area Chart */}
              <div className="lg:col-span-8 bg-[#1f2021] rounded-2xl p-8 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col gap-6 relative">
                <div className="flex justify-between items-center w-full border-b border-[rgba(255,255,255,0.12)] pb-4">
                  <h2 className="text-[20px] md:text-[24px] font-semibold text-[#ffffff] m-0 tracking-[-0.02em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Tren Kualitas Air <span className="text-[#e3e2e3] font-normal text-[14px] md:text-[16px] ml-2">(24 Jam Terakhir)</span>
                  </h2>
                  <div className="hidden sm:flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                      <span className="text-[12px] font-bold text-[#e3e2e3]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>pH Level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
                      <span className="text-[12px] font-bold text-[#e3e2e3]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>TDS (PPM)</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full h-[320px] relative mt-4">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 300">
                    <defs>
                      <linearGradient id="ph-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"></stop>
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0"></stop>
                      </linearGradient>
                      <linearGradient id="tds-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25"></stop>
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"></stop>
                      </linearGradient>
                      <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"></path>
                      </pattern>
                    </defs>
                    <rect fill="url(#grid)" height="100%" width="100%"></rect>
                    
                    <line stroke="rgba(255,255,255,0.15)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="800" y1="240" y2="240"></line>
                    <line stroke="rgba(255,255,255,0.15)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="800" y1="160" y2="160"></line>
                    <line stroke="rgba(255,255,255,0.15)" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="800" y1="80" y2="80"></line>
                    
                    <path d="M0,280 L0,200 C100,180 200,220 300,190 C400,160 500,210 600,150 C700,90 800,130 800,130 L800,280 Z" fill="url(#tds-gradient)"></path>
                    <path d="M0,200 C100,180 200,220 300,190 C400,160 500,210 600,150 C700,90 800,130 800,130" fill="none" stroke="#8B5CF6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                    
                    <path d="M0,280 L0,150 C150,140 250,90 400,110 C500,125 600,70 700,100 C750,115 800,80 800,80 L800,280 Z" fill="url(#ph-gradient)"></path>
                    <path d="M0,150 C150,140 250,90 400,110 C500,125 600,70 700,100 C750,115 800,80 800,80" fill="none" stroke="#10B981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                    
                    <circle cx="400" cy="110" fill="#121315" r="6" stroke="#10B981" strokeWidth="3"></circle>
                    <circle cx="600" cy="70" fill="#121315" r="6" stroke="#10B981" strokeWidth="3"></circle>
                    <circle cx="300" cy="190" fill="#121315" r="6" stroke="#8B5CF6" strokeWidth="3"></circle>
                    <circle cx="600" cy="150" fill="#121315" r="6" stroke="#8B5CF6" strokeWidth="3"></circle>
                  </svg>
                  <div className="absolute bottom-[-15px] left-0 w-full flex justify-between px-2 pt-3 text-[10px] md:text-[12px] font-bold text-[#e3e2e3]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <span>00:00</span>
                    <span>04:00</span>
                    <span>08:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                    <span>20:00</span>
                    <span>NOW</span>
                  </div>
                </div>
              </div>

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
                          <span className="text-[24px] md:text-[28px] font-black text-[#63f7ff]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>12.4</span>
                          <span className="text-[12px] font-bold text-[#63f7ff]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>V</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-5 bg-[#292a2b] rounded-xl border border-[rgba(255,255,255,0.12)] text-center">
                        <span className="text-[10px] md:text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Arus</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[24px] md:text-[28px] font-black text-[#63f7ff]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>450</span>
                          <span className="text-[12px] font-bold text-[#63f7ff]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>mA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Calibration Hub Area */}
            <div className="w-full bg-[#1f2021] rounded-2xl p-8 border border-[rgba(255,255,255,0.12)] shadow-sm flex flex-col gap-6 relative mt-4 z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full border-b border-[rgba(255,255,255,0.12)] pb-4 gap-4">
                <h3 className="text-[20px] md:text-[24px] font-semibold text-[#ffffff] m-0 flex items-center gap-3 tracking-[-0.02em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Calibration Hub
                  <span className="px-3 py-1 bg-[#343536] rounded-full border border-[rgba(255,255,255,0.12)] text-[10px] md:text-[12px] font-bold text-[#ffffff] uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    3 Sensors Online
                  </span>
                </h3>
                <button className="px-5 py-2.5 bg-[#10B981] text-[#0d0e0f] text-[12px] rounded-lg hover:bg-[#10B981]/90 transition-colors duration-300 uppercase tracking-[0.1em] font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Run Diagnostics
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Temp Sensor */}
                <div className="p-5 bg-[#292a2b] rounded-xl border border-[rgba(255,255,255,0.12)] hover:bg-[#343536] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#343536] border border-[rgba(255,255,255,0.12)] flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-[#63f7ff] text-[20px]">thermostat</span>
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)] border-2 border-[#292a2b]"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] md:text-[16px] font-bold text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif' }}>Sensor Suhu Air</span>
                      <span className="text-[10px] md:text-[12px] text-[#e3e2e3] font-semibold tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Last cal: 14 days ago</span>
                    </div>
                  </div>
                  <span className="text-[10px] md:text-[12px] text-[#10B981] font-bold uppercase tracking-[0.1em] px-3 py-1 bg-[#10B981]/10 rounded-full border border-[#10B981]/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Akurat</span>
                </div>

                {/* pH Sensor (Warning Status) */}
                <div className="p-5 bg-[#292a2b] rounded-xl border border-[rgba(255,180,171,0.3)] hover:bg-[#343536] transition-colors flex items-center justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#ffb4ab]/10"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#343536] border border-[rgba(255,255,255,0.12)] flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-[#10B981] text-[20px]">science</span>
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.8)] border-2 border-[#292a2b] animate-pulse"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] md:text-[16px] font-bold text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif' }}>Probe pH</span>
                      <span className="text-[10px] md:text-[12px] text-[#e3e2e3] font-semibold tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Last cal: 45 days ago</span>
                    </div>
                  </div>
                  <span className="text-[10px] md:text-[12px] text-[#ffb4ab] font-bold uppercase tracking-[0.1em] px-3 py-1 bg-[#ffb4ab]/10 rounded-full border border-[rgba(255,180,171,0.3)] relative z-10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Perlu Kalibrasi</span>
                </div>

                {/* TDS Sensor */}
                <div className="p-5 bg-[#292a2b] rounded-xl border border-[rgba(255,255,255,0.12)] hover:bg-[#343536] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#343536] border border-[rgba(255,255,255,0.12)] flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-[#8B5CF6] text-[20px]">water_ph</span>
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)] border-2 border-[#292a2b]"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] md:text-[16px] font-bold text-[#ffffff]" style={{ fontFamily: 'Inter, sans-serif' }}>TDS Meter</span>
                      <span className="text-[10px] md:text-[12px] text-[#e3e2e3] font-semibold tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Last cal: 5 days ago</span>
                    </div>
                  </div>
                  <span className="text-[10px] md:text-[12px] text-[#10B981] font-bold uppercase tracking-[0.1em] px-3 py-1 bg-[#10B981]/10 rounded-full border border-[#10B981]/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Akurat</span>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}