"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const [tanaman, setTanaman] = useState("Selada");
  const [isDark, setIsDark] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Fetch data dari API kita setiap 3 detik biar lebih cepet responsnya pas simulasi
  const { data, error, isLoading, mutate } = useSWR("/api/sensor", fetcher, {
    refreshInterval: 3000,
  });

  const profilTanaman = {
    Selada: { targetEC: 800, targetPH: 6.0 },
    Cabai: { targetEC: 1200, targetPH: 6.5 },
  };

  const currentData = data?.data || [];
  const latestSensor = currentData.length > 0 ? currentData[currentData.length - 1] : { ph: 0, ec: 0, suhu: 0 };

  // FUNGSI BUAT NEMBAK DATA BOHONGAN KE MONGODB
  const tembakDataBohongan = async () => {
    setIsSimulating(true);
    const dataBohongan = {
      ph: parseFloat((Math.random() * (7.5 - 5.5) + 5.5).toFixed(2)), // Random pH 5.5 - 7.5
      ec: Math.floor(Math.random() * (1500 - 500) + 500), // Random EC 500 - 1500
      suhu: parseFloat((Math.random() * (32 - 24) + 24).toFixed(1)) // Random Suhu 24 - 32
    };

    try {
      await fetch('/api/sensor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataBohongan)
      });
      mutate(); // Paksa grafik langsung update tanpa nunggu 3 detik
    } catch (err) {
      console.error("Gagal ngirim data simulasi", err);
    }
    setIsSimulating(false);
  };

  return (
    // Wrapper utama buat nerapin class "dark"
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-300">
                Dashboard Fertigasi
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">Sistem Hidroponik Adaptif Multi-Komoditas</p>
            </div>
            
            {/* Control Panel Kanan */}
            <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
              
              {/* Tombol Simulasi */}
              <button 
                onClick={tembakDataBohongan}
                disabled={isSimulating}
                className="flex items-center gap-2 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                {isSimulating ? "Mengirim..." : "🚀 Simulasi Data"}
              </button>

              {/* Toggle Dark Mode */}
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
              >
                {isDark ? "☀️" : "🌙"}
              </button>

              {/* Selektor Profil */}
              <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-semibold px-3">🌱</span>
                <select 
                  className="bg-transparent border-none text-slate-700 dark:text-slate-200 text-sm font-semibold focus:ring-0 p-1 outline-none cursor-pointer"
                  value={tanaman}
                  onChange={(e) => setTanaman(e.target.value)}
                >
                  <option className="dark:bg-slate-800" value="Selada">Selada (EC: 800)</option>
                  <option className="dark:bg-slate-800" value="Cabai">Cabai (EC: 1200)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              title="pH Air (Kadar Asam)" 
              value={latestSensor.ph} 
              unit="pH" 
              target={`Target: ${profilTanaman[tanaman].targetPH}`}
              color="text-blue-500 dark:text-blue-400"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
              borderColor="border-blue-100 dark:border-blue-900/30"
              icon="💧"
            />
            <Card 
              title="Nutrisi (EC / TDS)" 
              value={latestSensor.ec} 
              unit="µS" 
              target={`Target: ${profilTanaman[tanaman].targetEC}`}
              color="text-emerald-500 dark:text-emerald-400" 
              bgColor="bg-emerald-50 dark:bg-emerald-900/20"
              borderColor="border-emerald-100 dark:border-emerald-900/30"
              icon="🌿"
            />
            <Card 
              title="Suhu Lingkungan" 
              value={latestSensor.suhu} 
              unit="°C" 
              target="Optimal: 25°C"
              color="text-amber-500 dark:text-amber-400" 
              bgColor="bg-amber-50 dark:bg-amber-900/20"
              borderColor="border-amber-100 dark:border-amber-900/30"
              icon="🌡️"
            />
          </div>

          {/* Chart Section */}
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">📊 Grafik Monitoring Real-time</h2>
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE DATA
              </span>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-80">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : error ? (
              <p className="text-center text-red-500 py-10 font-medium">⚠️ Gagal mengambil data dari database.</p>
            ) : currentData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-400 dark:text-slate-500 font-medium">Belum ada data. Klik tombol 🚀 Simulasi Data di atas.</p>
              </div>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} 
                      tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis yAxisId="left" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#f1f5f9',
                        borderRadius: '16px', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                        color: isDark ? '#f8fafc' : '#0f172a',
                        fontWeight: 600 
                      }}
                      labelFormatter={(label) => new Date(label).toLocaleString()} 
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}/>
                    <Line yAxisId="left" type="monotone" dataKey="ec" stroke="#10b981" name="Nutrisi (EC)" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    <Line yAxisId="right" type="monotone" dataKey="ph" stroke="#3b82f6" name="Kadar pH" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function Card({ title, value, unit, target, color, bgColor, borderColor, icon }) {
  return (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border ${borderColor} hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 group`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bgColor} ${color} group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{target}</span>
      </div>
      
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-extrabold ${color} tracking-tight`}>
            {value !== undefined && value !== null ? value : 0}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-semibold">{unit}</span>
        </div>
      </div>
    </div>
  );
}