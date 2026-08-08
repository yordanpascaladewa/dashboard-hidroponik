import React from 'react';

export default function DashboardPage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen w-full bg-[#f7f9fb]">
      {/* Top App Bar */}
      <header className="pt-6 pb-4 md:pt-8 flex justify-between items-center px-4 md:px-10 w-full">
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] md:text-[22px] font-bold text-slate-800 tracking-tight hidden sm:block">
            AeroGrow Pro - Telemetri DFT
          </h1>
          <h1 className="text-[20px] font-bold text-slate-800 tracking-tight sm:hidden">
            Telemetri DFT
          </h1>
          <p className="text-slate-500 text-[13px]">
            Monitor dan kontrol nutrisi otomatis real-time.
          </p>
        </div>
      </header>

      {/* Dashboard Canvas */}
      <div className="px-4 md:px-10 md:pt-4 grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 flex-1 pb-20 lg:pb-6">
        {/* Main Full Column (Metrics & Chart) */}
        <div className="xl:col-span-12 flex flex-col gap-4 md:gap-6">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1 - Suhu Air */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">SUHU AIR</span>
                <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-600">
                    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[32px] md:text-[36px] text-slate-800 font-bold tracking-tight">0.0</span>
                <span className="text-slate-500 text-sm">°C</span>
              </div>
            </div>

            {/* Metric 2 - Tingkat pH */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">TINGKAT PH</span>
                <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-600">
                    <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
                    <path d="M6.453 15h11.094" />
                    <path d="M8.5 2h7" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[32px] md:text-[36px] text-slate-800 font-bold tracking-tight">0.0</span>
              </div>
            </div>

            {/* Metric 3 - Nutrisi TDS */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">NUTRISI (TDS)</span>
                <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-600">
                    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[32px] md:text-[36px] text-slate-800 font-bold tracking-tight">0</span>
                <span className="text-slate-500 text-sm">PPM</span>
              </div>
            </div>

            {/* Metric 4 - Fase Tumbuh */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">FASE TUMBUH</span>
                <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-600">
                    <path d="M8 2v3" />
                    <path d="M16 2v3" />
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[24px] md:text-[28px] text-slate-800 font-bold tracking-tight">Hari --</span>
              </div>
            </div>

            {/* Metric 5 - Komoditas */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow lg:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">KOMODITAS</span>
                <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-500">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[24px] md:text-[28px] font-bold text-slate-800">SELADA</span>
              </div>
            </div>

            {/* Metric 6 - Tegangan (Sensor INA219) */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">TEGANGAN</span>
                <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-600 text-[18px]">bolt</span>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[32px] md:text-[36px] text-slate-800 font-bold tracking-tight">0.0</span>
                <span className="text-slate-500 text-sm">V</span>
              </div>
            </div>

            {/* Metric 7 - Arus (Sensor INA219) */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 md:p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">ARUS</span>
                <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-600 text-[18px]">electric_bolt</span>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[32px] md:text-[36px] text-slate-800 font-bold tracking-tight">0</span>
                <span className="text-slate-500 text-sm">mA</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            
            {/* Analytics Card */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 md:p-6 flex-1 flex flex-col min-h-[350px] md:min-h-[450px] lg:col-span-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-[18px] font-bold text-slate-800">Tren Kualitas Air (24 Jam)</h2>
                  <p className="text-[13px] text-slate-500 mt-1">Korelasi pH dan konsentrasi TDS</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] text-slate-500 font-bold">PH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-slate-300 rounded-full"></div>
                    <span className="text-[10px] text-slate-500 font-bold">TDS</span>
                  </div>
                </div>
              </div>
              
              {/* Minimalist Chart Area */}
              <div className="flex-1 relative w-full h-full min-h-[250px]">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] text-slate-400 h-full font-mono">
                  <span>4</span>
                  <span>3</span>
                  <span>2</span>
                  <span>1</span>
                  <span>0</span>
                </div>
                {/* X-Axis Labels */}
                <div className="absolute bottom-0 left-6 md:left-8 right-0 flex justify-between text-[10px] md:text-[11px] text-slate-400 font-mono">
                  <span>00:00</span>
                  <span className="hidden sm:inline">06:00</span>
                  <span>12:00</span>
                  <span className="hidden sm:inline">18:00</span>
                  <span>Sekarang</span>
                </div>
                {/* Grid Lines */}
                <div className="absolute inset-0 left-6 md:left-8 bottom-6 md:bottom-8 flex flex-col justify-between">
                  <div className="w-full h-px border-b border-dashed border-slate-200"></div>
                  <div className="w-full h-px border-b border-dashed border-slate-200"></div>
                  <div className="w-full h-px border-b border-dashed border-slate-200"></div>
                  <div className="w-full h-px border-b border-dashed border-slate-200"></div>
                  <div className="w-full h-[2px] bg-slate-300"></div>
                </div>
                {/* SVG Chart Lines */}
                <svg className="absolute inset-0 left-6 md:left-8 bottom-6 md:bottom-8 w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] h-[calc(100%-1.5rem)] md:h-[calc(100%-2rem)]" preserveAspectRatio="none" viewBox="0 0 1000 300">
                  <path d="M0,298 L1000,298" fill="none" stroke="#10b981" strokeLinecap="round" strokeWidth="3" />
                </svg>
              </div>
            </div>

            {/* Calibration Hub Card */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-4 md:p-6 flex flex-col gap-4 lg:col-span-1">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M14 17H5" />
                    <path d="M19 7h-9" />
                    <circle cx="17" cy="17" r="3" />
                    <circle cx="7" cy="7" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800">Pusat Kalibrasi</h3>
                  <p className="text-[12px] text-slate-500">Pengingat fisik</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-800 uppercase">Sensor pH</span>
                    <span className="text-[12px] text-red-600 font-medium">Perlu Kalibrasi</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Terakhir: 30 hr lalu</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-800 uppercase">Sensor TDS</span>
                    <span className="text-[12px] text-emerald-500 font-medium">Akurat</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Terakhir: 2 hr lalu</span>
                </div>
              </div>
              <div className="mt-auto pt-2">
                <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-bold">Catatan:</span> Kalibrasi dilakukan manual via hardware. Ini hanya riwayat pemantauan.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}