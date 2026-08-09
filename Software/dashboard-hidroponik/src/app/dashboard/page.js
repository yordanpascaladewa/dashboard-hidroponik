import React from 'react';

export default function DashboardPage() {
  return (
    <>
      {/* Script ini wajib ada biar icon Google Material-nya muncul (nggak jadi teks) */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />

      <div className="bg-[#121315] font-sans text-[#e3e2e3] min-h-screen">
        
        {/* SIDEBAR */}
        <aside className="fixed left-0 top-0 h-full w-72 bg-[#1f2021] border-r border-white/10 z-50 flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12">
            <span className="material-symbols-outlined text-[#10B981] text-3xl">eco</span>
            <span className="font-sans text-[24px] font-bold tracking-tighter text-[#ffffff]">
              AeroGrow <span className="text-[#10B981]">Pro</span>
            </span>
          </div>
          
          <nav className="flex-1 space-y-2">
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-[#10B981] bg-[#10B981]/10 text-[#10B981] transition-all duration-300">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.1em]">Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
              <span className="material-symbols-outlined">monitoring</span>
              <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.1em]">Analytics</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
              <span className="material-symbols-outlined">settings_input_component</span>
              <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.1em]">Command Center</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
              <span className="material-symbols-outlined">database</span>
              <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.1em]">Growth Log</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-[#c8c8ac] hover:bg-[#292a2b] hover:text-[#ffffff]">
              <span className="material-symbols-outlined">health_and_safety</span>
              <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.1em]">System Health</span>
            </a>
          </nav>
          
          <div className="mt-auto border-t border-white/10 pt-6">
            <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-[#c8c8ac] hover:text-[#ffb4ab] hover:bg-[#93000a]/20">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.1em]">Logout</span>
            </a>
          </div>
        </aside>

        {/* MAIN CONTENT WRAPPER */}
        <div className="pl-72">
          
          {/* HEADER BAR */}
          <header className="fixed top-0 left-72 right-0 h-16 bg-[#1f2021]/90 backdrop-blur-md z-40 flex items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#343536] rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="font-mono text-[10px] text-[#e3e2e3] font-bold tracking-[0.1em] uppercase">SYSTEM ONLINE</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#c8c8ac] hover:text-[#ffffff] cursor-pointer">search</span>
                <span className="material-symbols-outlined text-[#c8c8ac] hover:text-[#ffffff] cursor-pointer">notifications</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#ffffff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00363b] text-[18px]">person</span>
              </div>
            </div>
          </header>

          {/* DASHBOARD CONTENT */}
          <main className="relative pt-16 min-h-screen bg-[#121315]">
            <div className="flex flex-col w-full gap-8 p-8 relative overflow-hidden">
              
              {/* Title Section */}
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end w-full">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-1.5 h-6 bg-[#10B981] rounded-full"></span>
                    <h1 className="text-[32px] md:text-[42px] font-bold text-[#ffffff] m-0 tracking-tight leading-none">
                      System Overview
                    </h1>
                  </div>
                  <p className="font-mono text-[12px] font-semibold text-[#c8c8ac] m-0 uppercase tracking-[0.1em]">
                    AeroGrow Pro // Node 04 // Live Telemetry
                  </p>
                </div>
                <div className="bg-[#343536] px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00dce5]"></span>
                  <span className="font-mono text-[10px] text-[#00dce5] tracking-[0.1em] uppercase font-bold">Realtime Sync Active</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                
                {/* Metric 1 - Suhu Air */}
                <div className="bg-[#1f2021] rounded-xl p-6 border border-white/10 shadow-sm flex flex-col justify-between h-[150px]">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[12px] text-[#c8c8ac] font-bold uppercase tracking-[0.1em]">Suhu Air</span>
                    <span className="material-symbols-outlined text-[#63f7ff] text-[24px]">water_drop</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-[42px] font-bold text-[#ffffff] leading-none tracking-tight">24.5</span>
                    <span className="text-[16px] text-[#00dce5] font-bold">°C</span>
                  </div>
                  <div className="w-full h-1 bg-[#343536] rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-[#63f7ff] w-[45%] rounded-full"></div>
                  </div>
                </div>

                {/* Metric 2 - Tingkat pH */}
                <div className="bg-[#1f2021] rounded-xl p-6 border border-white/10 shadow-sm flex flex-col justify-between h-[150px]">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[12px] text-[#c8c8ac] font-bold uppercase tracking-[0.1em]">Tingkat pH</span>
                    <span className="material-symbols-outlined text-[#10B981] text-[24px]">science</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-[42px] font-bold text-[#ffffff] leading-none tracking-tight">6.2</span>
                    <span className="text-[16px] text-[#10B981] font-bold">pH</span>
                  </div>
                  <div className="w-full h-1 bg-[#343536] rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-[#10B981] w-[40%] rounded-full ml-[20%]"></div>
                  </div>
                </div>

                {/* Metric 3 - Nutrisi TDS */}
                <div className="bg-[#1f2021] rounded-xl p-6 border border-white/10 shadow-sm flex flex-col justify-between h-[150px]">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[12px] text-[#c8c8ac] font-bold uppercase tracking-[0.1em]">Nutrisi (TDS)</span>
                    <span className="material-symbols-outlined text-[#8B5CF6] text-[24px]">spa</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-[42px] font-bold text-[#ffffff] leading-none tracking-tight">840</span>
                    <span className="text-[16px] text-[#8B5CF6] font-bold">PPM</span>
                  </div>
                  <div className="w-full h-1 bg-[#343536] rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-[#8B5CF6] w-[75%] rounded-full"></div>
                  </div>
                </div>

                {/* Metric 4 - Fase Tumbuh */}
                <div className="bg-[#1f2021] rounded-xl p-6 border border-white/10 shadow-sm flex flex-col justify-between h-[150px]">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[12px] text-[#c8c8ac] font-bold uppercase tracking-[0.1em]">Fase Tumbuh</span>
                    <span className="material-symbols-outlined text-[#dfed1a] text-[24px]">calendar_month</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-[42px] font-bold text-[#ffffff] leading-none tracking-tight">14</span>
                    <span className="text-[16px] text-[#dfed1a] font-bold">Hari</span>
                  </div>
                  <div className="w-full h-1 bg-[#343536] rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-[#dfed1a] w-[40%] rounded-full"></div>
                  </div>
                </div>

              </div>

              {/* Analytics & Hardware Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mt-2">
                
                {/* Line Chart */}
                <div className="lg:col-span-8 bg-[#1f2021] rounded-xl p-8 border border-white/10 flex flex-col gap-6">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-3">
                      <h2 className="text-[20px] font-bold text-[#ffffff] m-0">Tren Kualitas Air</h2>
                      <span className="text-[14px] text-[#c8c8ac]">(24 Jam Terakhir)</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                        <span className="font-mono text-[11px] text-[#e3e2e3] font-bold uppercase tracking-wider">pH Level</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                        <span className="font-mono text-[11px] text-[#e3e2e3] font-bold uppercase tracking-wider">TDS (PPM)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-[280px] relative mt-2">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 280">
                      <defs>
                        <linearGradient id="ph-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"></stop>
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0"></stop>
                        </linearGradient>
                        <linearGradient id="tds-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"></stop>
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"></stop>
                        </linearGradient>
                        <filter id="glow-emerald">
                          <feGaussianBlur stdDeviation="2" result="blur"></feGaussianBlur>
                          <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                        </filter>
                        <filter id="glow-purple">
                          <feGaussianBlur stdDeviation="2" result="blur"></feGaussianBlur>
                          <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                        </filter>
                      </defs>
                      {/* Horizontal Grid Lines */}
                      <line x1="0" y1="56" x2="800" y2="56" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"></line>
                      <line x1="0" y1="112" x2="800" y2="112" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"></line>
                      <line x1="0" y1="168" x2="800" y2="168" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"></line>
                      <line x1="0" y1="224" x2="800" y2="224" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"></line>
                      {/* Vertical Grid Lines */}
                      <line x1="133" y1="0" x2="133" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></line>
                      <line x1="266" y1="0" x2="266" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></line>
                      <line x1="400" y1="0" x2="400" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></line>
                      <line x1="533" y1="0" x2="533" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></line>
                      <line x1="666" y1="0" x2="666" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></line>
                      
                      {/* TDS Area & Line (Purple) */}
                      <path d="M0,190 Q100,170 200,200 T400,160 T600,140 T800,120 L800,260 L0,260 Z" fill="url(#tds-gradient)"></path>
                      <path d="M0,190 Q100,170 200,200 T400,160 T600,140 T800,120" fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" filter="url(#glow-purple)"></path>
                      
                      {/* pH Area & Line (Emerald) */}
                      <path d="M0,140 Q150,130 300,100 T500,90 T700,70 T800,65 L800,260 L0,260 Z" fill="url(#ph-gradient)"></path>
                      <path d="M0,140 Q150,130 300,100 T500,90 T700,70 T800,65" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" filter="url(#glow-emerald)"></path>
                      
                      {/* Data Points */}
                      <circle cx="400" cy="160" r="4" fill="#8B5CF6" stroke="#121315" strokeWidth="2"></circle>
                      <circle cx="600" cy="140" r="4" fill="#8B5CF6" stroke="#121315" strokeWidth="2"></circle>
                      <circle cx="300" cy="100" r="4" fill="#10B981" stroke="#121315" strokeWidth="2"></circle>
                      <circle cx="500" cy="90" r="4" fill="#10B981" stroke="#121315" strokeWidth="2"></circle>
                    </svg>
                    <div className="absolute bottom-[-10px] left-0 w-full flex justify-between px-2 font-mono text-[10px] text-[#c8c8ac] font-bold tracking-[0.1em] uppercase">
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
                <div className="lg:col-span-4 flex flex-col">
                  <div className="bg-[#1f2021] rounded-xl p-8 border border-white/10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-[20px] font-bold text-[#ffffff] m-0">Hardware Status</h3>
                      <span className="material-symbols-outlined text-[#c8c8ac] text-[20px]">memory</span>
                    </div>
                    <div className="flex flex-col gap-4 flex-1">
                      
                      {/* Komoditas */}
                      <div className="flex items-center justify-between p-5 bg-[#292a2b] rounded-xl border border-white/10">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[11px] text-[#c8c8ac] font-bold uppercase tracking-[0.1em]">Komoditas</span>
                          <span className="text-[24px] text-[#ffffff] tracking-widest leading-none uppercase font-bold">Selada</span>
                        </div>
                        <div className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center bg-[#343536]">
                          <span className="material-symbols-outlined text-[#c3d000] text-[24px]">grass</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Tegangan */}
                        <div className="flex flex-col gap-2 p-5 bg-[#292a2b] rounded-xl border border-white/10">
                          <span className="font-mono text-[11px] text-[#c8c8ac] font-bold uppercase tracking-[0.1em]">Tegangan</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[24px] font-bold text-[#63f7ff]">12.4</span>
                            <span className="font-mono text-[12px] text-[#63f7ff] font-bold">V</span>
                          </div>
                        </div>
                        {/* Arus */}
                        <div className="flex flex-col gap-2 p-5 bg-[#292a2b] rounded-xl border border-white/10">
                          <span className="font-mono text-[11px] text-[#c8c8ac] font-bold uppercase tracking-[0.1em]">Arus</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[24px] font-bold text-[#63f7ff]">450</span>
                            <span className="font-mono text-[12px] text-[#63f7ff] font-bold">mA</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

              {/* Calibration Hub Footer */}
              <div className="w-full bg-[#1f2021] rounded-xl p-8 border border-white/10 mt-6">
                <div className="flex justify-between items-center w-full mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[20px] font-bold text-[#ffffff] m-0">Calibration Hub</h3>
                    <span className="px-3 py-1 bg-[#343536] rounded-full border border-white/10 text-[10px] font-mono text-[#e3e2e3] font-bold uppercase tracking-widest">
                      3 Sensors Online
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-mono text-[11px] rounded-lg hover:bg-[#10B981]/30 transition-colors duration-300 uppercase tracking-widest font-bold">
                    Run Diagnostics
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Temp Sensor Cal */}
                  <div className="p-4 bg-[#292a2b] rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#343536] border border-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#63f7ff] text-[20px]">thermostat</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] text-[#ffffff] font-semibold">Sensor Suhu Air</span>
                        <span className="text-[12px] text-[#c8c8ac]">Last cal: 14 days ago</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#10B981] font-bold uppercase tracking-widest px-2 py-1 bg-[#10B981]/10 rounded border border-[#10B981]/20">Akurat</span>
                  </div>

                  {/* pH Sensor Cal (Warning) */}
                  <div className="p-4 bg-[#93000a]/20 rounded-xl border border-[#ffb4ab]/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#343536] border border-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#10B981] text-[20px]">science</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] text-[#ffffff] font-semibold">Probe pH</span>
                        <span className="text-[12px] text-[#c8c8ac]">Last cal: 45 days ago</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#ffb4ab] font-bold uppercase tracking-widest px-2 py-1 bg-[#ffb4ab]/10 rounded border border-[#ffb4ab]/30">Perlu Kalibrasi</span>
                  </div>

                  {/* TDS Sensor Cal */}
                  <div className="p-4 bg-[#292a2b] rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#343536] border border-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#8B5CF6] text-[20px]">water_ph</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] text-[#ffffff] font-semibold">TDS Meter</span>
                        <span className="text-[12px] text-[#c8c8ac]">Last cal: 5 days ago</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#10B981] font-bold uppercase tracking-widest px-2 py-1 bg-[#10B981]/10 rounded border border-[#10B981]/20">Akurat</span>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
}