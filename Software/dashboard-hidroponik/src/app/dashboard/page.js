import React from 'react';

export default function DashboardPage() {
  return (
    <div className="bg-slate-950 font-sans text-slate-200 min-h-screen">
      
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12">
          <span className="material-symbols-outlined text-emerald-500 text-3xl">eco</span>
          <span className="text-2xl font-bold tracking-tighter text-white">
            AeroGrow <span className="text-emerald-500">Pro</span>
          </span>
        </div>
        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-emerald-500 bg-emerald-500/10 text-emerald-500 transition-all duration-300">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-mono text-xs uppercase tracking-widest font-bold">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-slate-400 hover:bg-slate-800 hover:text-white">
            <span className="material-symbols-outlined">monitoring</span>
            <span className="font-mono text-xs uppercase tracking-widest font-semibold">Analytics</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-slate-400 hover:bg-slate-800 hover:text-white">
            <span className="material-symbols-outlined">settings_input_component</span>
            <span className="font-mono text-xs uppercase tracking-widest font-semibold">Command Center</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-slate-400 hover:bg-slate-800 hover:text-white">
            <span className="material-symbols-outlined">database</span>
            <span className="font-mono text-xs uppercase tracking-widest font-semibold">Growth Log</span>
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-r-xl border-l-4 border-transparent transition-all duration-300 text-slate-400 hover:bg-slate-800 hover:text-white">
            <span className="material-symbols-outlined">health_and_safety</span>
            <span className="font-mono text-xs uppercase tracking-widest font-semibold">System Health</span>
          </a>
        </nav>
        <div className="mt-auto border-t border-slate-800 pt-6">
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-slate-400 hover:text-red-500 hover:bg-red-500/10">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-mono text-xs uppercase tracking-widest font-semibold">Logout</span>
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="pl-72">
        
        {/* HEADER */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-slate-900/90 backdrop-blur-md z-40 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-mono text-[10px] text-slate-300 font-bold tracking-widest">SYSTEM ONLINE</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-slate-400 hover:text-white cursor-pointer">search</span>
              <span className="material-symbols-outlined text-slate-400 hover:text-white cursor-pointer">notifications</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-900 text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="relative pt-16 min-h-screen bg-slate-950">
          <div className="flex flex-col w-full gap-8 p-8 relative overflow-hidden">
            
            {/* Title Section */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end w-full">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                  <h1 className="text-4xl font-bold text-white m-0 tracking-tight">System Overview</h1>
                </div>
                <p className="font-mono text-[12px] text-slate-400 m-0 uppercase tracking-widest">
                  AeroGrow Pro // Node 04 // Live Telemetry
                </p>
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                <span className="font-mono text-[10px] text-sky-500 tracking-widest uppercase font-bold">Realtime Sync Active</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              
              {/* Metric 1 - Suhu Air */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between h-[150px]">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-widest">Suhu Air</span>
                  <span className="material-symbols-outlined text-sky-400 text-[24px]">water_drop</span>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-[42px] font-bold text-white leading-none tracking-tight">24.5</span>
                  <span className="text-base text-sky-500 font-bold">°C</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-sky-400 w-[45%] rounded-full"></div>
                </div>
              </div>

              {/* Metric 2 - Tingkat pH */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between h-[150px]">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-widest">Tingkat pH</span>
                  <span className="material-symbols-outlined text-emerald-500 text-[24px]">science</span>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-[42px] font-bold text-white leading-none tracking-tight">6.2</span>
                  <span className="text-base text-emerald-500 font-bold">pH</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[40%] rounded-full ml-[20%]"></div>
                </div>
              </div>

              {/* Metric 3 - Nutrisi TDS */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between h-[150px]">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-widest">Nutrisi (TDS)</span>
                  <span className="material-symbols-outlined text-purple-500 text-[24px]">spa</span>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-[42px] font-bold text-white leading-none tracking-tight">840</span>
                  <span className="text-base text-purple-500 font-bold">PPM</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-purple-500 w-[75%] rounded-full"></div>
                </div>
              </div>

              {/* Metric 4 - Fase Tumbuh */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between h-[150px]">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-widest">Fase Tumbuh</span>
                  <span className="material-symbols-outlined text-lime-400 text-[24px]">calendar_month</span>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-[42px] font-bold text-white leading-none tracking-tight">14</span>
                  <span className="text-base text-lime-400 font-bold">Hari</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-lime-400 w-[40%] rounded-full"></div>
                </div>
              </div>

            </div>

            {/* Analytics & Hardware Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mt-2">
              
              {/* Line Chart Component */}
              <div className="lg:col-span-8 bg-slate-900 rounded-xl p-8 border border-slate-800 flex flex-col gap-6">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white m-0">Tren Kualitas Air</h2>
                    <span className="text-[14px] text-slate-400">(24 Jam Terakhir)</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-mono text-[11px] text-slate-300 font-bold uppercase tracking-wider">pH Level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="font-mono text-[11px] text-slate-300 font-bold uppercase tracking-wider">TDS (PPM)</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[280px] relative mt-2">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 280">
                    <defs>
                      <linearGradient id="ph-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="tds-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                      </linearGradient>
                      <filter id="glow-emerald">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <filter id="glow-purple">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    {/* Horizontal Grid Lines */}
                    <line x1="0" y1="56" x2="800" y2="56" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="0" y1="112" x2="800" y2="112" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="0" y1="168" x2="800" y2="168" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="0" y1="224" x2="800" y2="224" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />
                    {/* Vertical Grid Lines */}
                    <line x1="133" y1="0" x2="133" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="266" y1="0" x2="266" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="400" y1="0" x2="400" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="533" y1="0" x2="533" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="666" y1="0" x2="666" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    {/* TDS Area & Line (Purple) */}
                    <path d="M0,190 Q100,170 200,200 T400,160 T600,140 T800,120 L800,260 L0,260 Z" fill="url(#tds-gradient)" />
                    <path d="M0,190 Q100,170 200,200 T400,160 T600,140 T800,120" fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" filter="url(#glow-purple)" />
                    {/* pH Area & Line (Emerald) */}
                    <path d="M0,140 Q150,130 300,100 T500,90 T700,70 T800,65 L800,260 L0,260 Z" fill="url(#ph-gradient)" />
                    <path d="M0,140 Q150,130 300,100 T500,90 T700,70 T800,65" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" filter="url(#glow-emerald)" />
                    {/* Data Points */}
                    <circle cx="400" cy="160" r="4" fill="#8B5CF6" stroke="#121315" strokeWidth="2" />
                    <circle cx="600" cy="140" r="4" fill="#8B5CF6" stroke="#121315" strokeWidth="2" />
                    <circle cx="300" cy="100" r="4" fill="#10B981" stroke="#121315" strokeWidth="2" />
                    <circle cx="500" cy="90" r="4" fill="#10B981" stroke="#121315" strokeWidth="2" />
                  </svg>
                  <div className="absolute bottom-[-10px] left-0 w-full flex justify-between px-2 font-mono text-[10px] text-slate-400 font-bold tracking-widest uppercase">
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
                <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white m-0">Hardware Status</h3>
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">memory</span>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    
                    <div className="flex items-center justify-between p-5 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[11px] text-slate-400 font-bold uppercase tracking-widest">Komoditas</span>
                        <span className="text-[24px] text-white tracking-widest leading-none uppercase font-bold">Selada</span>
                      </div>
                      <div className="w-12 h-12 rounded-lg border border-slate-700 flex items-center justify-center bg-slate-800">
                        <span className="material-symbols-outlined text-lime-500 text-[24px]">grass</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Tegangan INA219 */}
                      <div className="flex flex-col gap-2 p-5 bg-slate-800 rounded-xl border border-slate-700">
                        <span className="font-mono text-[11px] text-slate-400 font-bold uppercase tracking-widest">Tegangan</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[24px] font-bold text-sky-400">12.4</span>
                          <span className="font-mono text-xs text-sky-400 font-bold">V</span>
                        </div>
                      </div>
                      {/* Arus INA219 */}
                      <div className="flex flex-col gap-2 p-5 bg-slate-800 rounded-xl border border-slate-700">
                        <span className="font-mono text-[11px] text-slate-400 font-bold uppercase tracking-widest">Arus</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[24px] font-bold text-sky-400">450</span>
                          <span className="font-mono text-xs text-sky-400 font-bold">mA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calibration Hub Footer */}
            <div className="w-full bg-slate-900 rounded-xl p-8 border border-slate-800 mt-6">
              <div className="flex justify-between items-center w-full mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-white m-0">Calibration Hub</h3>
                  <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-[10px] font-mono text-slate-300 font-bold uppercase tracking-widest">3 Sensors Online</span>
                </div>
                <button className="px-4 py-2 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-mono text-[11px] rounded-lg hover:bg-emerald-500/30 transition-colors duration-300 uppercase tracking-widest font-bold">
                  Run Diagnostics
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Temp Sensor Cal */}
                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sky-400 text-[20px]">thermostat</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-white font-semibold">Sensor Suhu Air</span>
                      <span className="text-[12px] text-slate-400">Last cal: 14 days ago</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-widest px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">Akurat</span>
                </div>

                {/* pH Sensor Cal (Warning) */}
                <div className="p-4 bg-red-900/10 rounded-xl border border-red-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-500 text-[20px]">science</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-white font-semibold">Probe pH</span>
                      <span className="text-[12px] text-slate-400">Last cal: 45 days ago</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-red-500 font-bold uppercase tracking-widest px-2 py-1 bg-red-500/10 rounded border border-red-500/30">Perlu Kalibrasi</span>
                </div>

                {/* TDS Sensor Cal */}
                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-purple-500 text-[20px]">water_ph</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-white font-semibold">TDS Meter</span>
                      <span className="text-[12px] text-slate-400">Last cal: 5 days ago</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-widest px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">Akurat</span>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}