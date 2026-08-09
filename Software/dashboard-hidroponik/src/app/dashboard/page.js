import React from 'react';

export default function DashboardPage() {
  return (
    <>
      {/* Mengimpor Font Icon langsung agar tidak error jadi teks */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* MAIN CONTENT AREA SAJA (Tanpa Sidebar) */}
      <main className="flex-1 flex flex-col min-h-screen w-full bg-gradient-to-br from-emerald-50 to-slate-50 text-slate-800 font-sans pb-20 lg:pb-0">
        
        {/* Top App Bar */}
        <header className="pt-6 pb-4 md:pt-8 flex justify-between items-center px-4 md:px-10 w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] md:text-[22px] font-bold text-slate-800 tracking-tight hidden sm:block">AeroGrow Pro - Telemetri DFT</h1>
            <h1 className="text-[20px] font-bold text-slate-800 tracking-tight sm:hidden">Telemetri DFT</h1>
            <p className="text-slate-600 text-[13px]">Monitor dan kontrol nutrisi otomatis real-time.</p>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="px-4 md:px-10 md:pt-4 grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 flex-1">
          
          <div className="xl:col-span-12 flex flex-col gap-4 md:gap-6">
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
              
              {/* Metric 1 - Suhu Air */}
              <div className="rounded-3xl shadow-sm backdrop-blur-sm p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow bg-blue-100/80 border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-blue-900 uppercase tracking-wider font-bold">SUHU AIR</span>
                  <div className="bg-blue-200 w-8 h-8 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-700">
                      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[32px] md:text-[36px] text-blue-950 font-bold tracking-tight">0.0</span>
                  <span className="text-blue-800 text-sm">°C</span>
                </div>
              </div>

              {/* Metric 2 - pH */}
              <div className="rounded-3xl shadow-sm backdrop-blur-sm p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow bg-emerald-100/80 border border-emerald-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-emerald-900 uppercase tracking-wider font-bold">TINGKAT PH</span>
                  <div className="bg-emerald-200 w-8 h-8 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-700">
                      <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
                      <path d="M6.453 15h11.094" />
                      <path d="M8.5 2h7" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[32px] md:text-[36px] text-emerald-950 font-bold tracking-tight">0.0</span>
                </div>
              </div>

              {/* Metric 3 - TDS */}
              <div className="rounded-3xl shadow-sm backdrop-blur-sm p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow bg-purple-100/80 border border-purple-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-purple-900 uppercase tracking-wider font-bold">NUTRISI (TDS)</span>
                  <div className="bg-purple-200 w-8 h-8 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-700">
                      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[32px] md:text-[36px] text-purple-950 font-bold tracking-tight">0</span>
                  <span className="text-purple-800 text-sm">PPM</span>
                </div>
              </div>

              {/* Metric 4 - Fase Tumbuh */}
              <div className="rounded-3xl shadow-sm backdrop-blur-sm p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow bg-amber-100/80 border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-amber-900 uppercase tracking-wider font-bold">FASE TUMBUH</span>
                  <div className="bg-amber-200 w-8 h-8 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-700">
                      <path d="M8 2v3" />
                      <path d="M16 2v3" />
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[24px] md:text-[28px] text-amber-950 font-bold tracking-tight">Hari --</span>
                </div>
              </div>

              {/* Metric 5 - Komoditas */}
              <div className="rounded-3xl shadow-sm backdrop-blur-sm p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow lg:col-span-2 bg-teal-100/80 border border-teal-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-teal-900 uppercase tracking-wider font-bold">KOMODITAS</span>
                  <div className="bg-teal-200 w-8 h-8 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-teal-700">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[24px] md:text-[28px] font-bold text-teal-950">SELADA</span>
                </div>
              </div>

              {/* Metric 6 - Tegangan INA219 */}
              <div className="rounded-3xl shadow-sm backdrop-blur-sm p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow bg-orange-100/80 border border-orange-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-orange-900 uppercase tracking-wider font-bold">TEGANGAN</span>
                  <div className="bg-orange-200 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-orange-700" style={{ fontVariationSettings: '"FILL" 1, "wght" 700' }}>bolt</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[32px] md:text-[36px] text-orange-950 font-bold tracking-tight">12.4</span>
                  <span className="text-orange-800 text-sm">V</span>
                </div>
              </div>

              {/* Metric 7 - Arus INA219 */}
              <div className="rounded-3xl shadow-sm backdrop-blur-sm p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow bg-rose-100/80 border border-rose-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-rose-900 uppercase tracking-wider font-bold">ARUS</span>
                  <div className="bg-rose-200 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-rose-700" style={{ fontVariationSettings: '"FILL" 1, "wght" 700' }}>electric_bolt</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[32px] md:text-[36px] text-rose-950 font-bold tracking-tight">450</span>
                  <span className="text-rose-800 text-sm">mA</span>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
              
              {/* Analytics Chart */}
              <div className="rounded-3xl shadow-sm border border-slate-200 p-4 md:p-6 flex-1 flex flex-col min-h-[350px] md:min-h-[450px] lg:col-span-3 backdrop-blur-sm bg-gradient-to-br from-emerald-50 to-teal-100/80">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                  <div>
                    <h2 className="text-[18px] font-bold text-slate-800">Tren Kualitas Air (24 Jam)</h2>
                    <p className="text-[13px] text-slate-500 mt-1">Korelasi pH dan konsentrasi TDS</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-1 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">PH</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-1 bg-slate-500 rounded-full"></div>
                      <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">TDS</span>
                    </div>
                  </div>
                </div>
                
                {/* Graphic Area */}
                <div className="flex-1 relative w-full h-full min-h-[250px]">
                  {/* Y-Axis Labels */}
                  <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between font-mono text-[11px] text-slate-500/60 h-full pb-8">
                    <span>4.0</span>
                    <span>3.0</span>
                    <span>2.0</span>
                    <span>1.0</span>
                    <span>0.0</span>
                  </div>
                  {/* X-Axis Labels */}
                  <div className="absolute bottom-0 left-8 right-0 flex justify-between font-mono text-[10px] md:text-[11px] text-slate-500/60">
                    <span>00:00</span>
                    <span className="hidden sm:inline">06:00</span>
                    <span>12:00</span>
                    <span className="hidden sm:inline">18:00</span>
                    <span>Sekarang</span>
                  </div>
                  {/* Grid Lines */}
                  <div className="absolute inset-0 left-8 bottom-8 flex flex-col justify-between">
                    <div className="w-full h-px border-b border-dashed border-slate-300"></div>
                    <div className="w-full h-px border-b border-dashed border-slate-300"></div>
                    <div className="w-full h-px border-b border-dashed border-slate-300"></div>
                    <div className="w-full h-px border-b border-dashed border-slate-300"></div>
                    <div className="w-full h-[2px] bg-slate-300"></div>
                  </div>
                  
                  {/* SVG Chart Lines */}
                  <svg className="absolute inset-0 left-8 bottom-8 w-[calc(100%-2rem)] h-[calc(100%-2rem)]" preserveAspectRatio="none" viewBox="0 0 1000 300">
                    <defs>
                      <linearGradient id="grad-ph" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.2 }} />
                        <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
                      </linearGradient>
                      <linearGradient id="grad-tds" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#64748b', stopOpacity: 0.1 }} />
                        <stop offset="100%" style={{ stopColor: '#64748b', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    
                    {/* TDS Area & Line */}
                    <path d="M0,220 C100,210 200,240 300,230 C400,220 500,180 600,190 C700,200 800,160 900,170 L1000,150 L1000,300 L0,300 Z" fill="url(#grad-tds)" />
                    <path d="M0,220 C100,210 200,240 300,230 C400,220 500,180 600,190 C700,200 800,160 900,170 L1000,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />
                    
                    {/* pH Area & Line */}
                    <path d="M0,150 C150,140 250,180 400,160 C550,140 700,100 850,120 L1000,90 L1000,300 L0,300 Z" fill="url(#grad-ph)" />
                    <path d="M0,150 C150,140 250,180 400,160 C550,140 700,100 850,120 L1000,90" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Live Data Dot */}
                    <circle cx="1000" cy="90" r="4" fill="#10b981" className="animate-pulse" />
                  </svg>
                </div>
              </div>

              {/* Calibration Hub Panel */}
              <div className="rounded-3xl shadow-sm border border-slate-200 p-4 md:p-6 flex flex-col gap-4 lg:col-span-1 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M14 17H5" />
                      <path d="M19 7h-9" />
                      <circle cx="17" cy="17" r="3" />
                      <circle cx="7" cy="7" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-800">Pusat Kalibrasi</h3>
                    <p className="text-[12px] text-slate-500">Pengingat kalibrasi fisik</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-red-900 uppercase">Sensor pH</span>
                      <span className="text-[12px] text-red-600 font-medium">Perlu Kalibrasi</span>
                    </div>
                    <span className="text-[10px] text-red-700/70">Terakhir: 30 hari lalu</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-emerald-900 uppercase">Sensor TDS</span>
                      <span className="text-[12px] text-emerald-600 font-medium">Akurat</span>
                    </div>
                    <span className="text-[10px] text-emerald-700/70">Terakhir: 2 hari lalu</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-2">
                  <p className="text-[11px] text-slate-500 bg-slate-100 p-3 rounded-lg border border-slate-200">
                    <span className="font-bold">Catatan:</span> Kalibrasi sensor dilakukan secara manual pada perangkat keras. Harap perbarui status setelah kalibrasi fisik selesai.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}