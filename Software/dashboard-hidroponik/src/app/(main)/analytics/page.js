'use client';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, FlaskConical, History, RefreshCcw } from 'lucide-react';

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState([]);
  const [averages, setAverages] = useState({ ph: 0, tds: 0, suhu: 0 });
  const [isOnline, setIsOnline] = useState(false);
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          const latest = json.data[0];
          
          // Cek Online / Offline
          const dataTime = new Date(latest.timestamp).getTime();
          const currentTime = new Date().getTime();
          const diffMinutes = (currentTime - dataTime) / (1000 * 60);
          setIsOnline(diffMinutes <= 3);

          // Ambil maksimal 100 data riwayat
          const historyData = json.data.slice(0, 100).reverse();
          setTotalData(historyData.length);
          
          let sumPh = 0, sumTds = 0, sumSuhu = 0;
          
          // Kalkulasi rata-rata asli dan formatting data untuk grafik
          const formattedData = historyData.map(item => {
            sumPh += item.ph;
            sumTds += item.tds;
            sumSuhu += item.suhu;

            return {
              waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              pH: parseFloat(item.ph.toFixed(2)),
              TDS: Math.round(item.tds),
            };
          });

          // Set rata-rata (Dengan pencegahan pembagian 0 jika database kosong)
          const dataCount = historyData.length || 1;
          setAverages({
            ph: sumPh / dataCount,
            tds: sumTds / dataCount,
            suhu: sumSuhu / dataCount
          });

          setChartData(formattedData);
        }
      } catch (error) {
        console.error(error);
        setIsOnline(false);
      }
    };
    
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-5 md:p-10 w-full flex flex-col gap-6 md:gap-8 pb-12">
      <div className="flex justify-between items-end mb-2 px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 md:mb-2">Data Analytics</h1>
          <p className="text-[10px] md:text-[11px] text-slate-500 uppercase tracking-widest font-mono">Historical Trends & Averages</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono text-slate-400">
          <RefreshCcw size={14} className={isOnline ? 'animate-spin' : ''} />
          {totalData} Data Points
        </div>
      </div>

      {/* RATA-RATA HISTORIS (NILAI ASLI DARI MONGODB) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#1f2021] rounded-2xl p-5 md:p-6 border border-white/5 shadow-lg flex items-center gap-4 md:gap-6">
          <div className="p-3 md:p-4 rounded-2xl bg-cyan-500/10 text-[#63f7ff]">
            <Thermometer size={28} className="md:w-8 md:h-8" />
          </div>
          <div>
            <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Rata-rata Suhu</span>
            <div className="flex items-baseline gap-1 md:gap-2">
              <span className="text-3xl md:text-4xl font-black font-mono">{averages.suhu.toFixed(1)}</span>
              <span className="text-xs font-bold text-[#63f7ff]">°C</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1f2021] rounded-2xl p-5 md:p-6 border border-white/5 shadow-lg flex items-center gap-4 md:gap-6">
          <div className="p-3 md:p-4 rounded-2xl bg-emerald-500/10 text-[#10B981]">
            <FlaskConical size={28} className="md:w-8 md:h-8" />
          </div>
          <div>
            <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Rata-rata pH</span>
            <div className="flex items-baseline gap-1 md:gap-2">
              <span className="text-3xl md:text-4xl font-black font-mono">{averages.ph.toFixed(2)}</span>
              <span className="text-xs font-bold text-[#10B981]">pH</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1f2021] rounded-2xl p-5 md:p-6 border border-white/5 shadow-lg flex items-center gap-4 md:gap-6">
          <div className="p-3 md:p-4 rounded-2xl bg-purple-500/10 text-[#8B5CF6]">
            <Droplets size={28} className="md:w-8 md:h-8" />
          </div>
          <div>
            <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Rata-rata TDS</span>
            <div className="flex items-baseline gap-1 md:gap-2">
              <span className="text-3xl md:text-4xl font-black font-mono">{Math.round(averages.tds)}</span>
              <span className="text-xs font-bold text-[#8B5CF6]">PPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRAFIK HISTORIS YANG SUDAH DIPERBESAR DI HP */}
      <div className="bg-[#1f2021] rounded-2xl p-5 md:p-8 border border-white/5 shadow-lg flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <div>
            <h2 className="text-base md:text-xl font-bold flex items-center gap-2">
              <History size={20} className="text-[#10B981]" /> Grafik Tren Historis (24H)
            </h2>
            <p className="text-[10px] md:text-xs text-slate-500 font-mono mt-1">Visualisasi data murni dari database MongoDB Atlas</p>
          </div>
        </div>
        
        {/* FIX: TINGGI GRAFIK HARUS FIXED h-[300px] atau flex-1 AGAR RESPONSIVECONTAINER TIDAK MENGHILANG */}
        <div className="flex-1 w-full h-[300px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPhHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTdsHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="waktu" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} dy={10} minTickGap={20} />
              
              <YAxis yId="left" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} domain={[5, 9]} ticks={[5, 6, 7, 8, 9]} tickFormatter={(val) => val.toFixed(1)} />
              <YAxis yId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} domain={[800, 1600]} ticks={[800, 1000, 1200, 1400, 1600]} tickFormatter={(val) => Math.round(val)} />
              
              <Tooltip contentStyle={{ backgroundColor: '#121315', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }} />
              <Area isAnimationActive={false} yId="left" type="monotone" dataKey="pH" stroke="#10B981" strokeWidth={3} fill="url(#colorPhHist)" />
              <Area isAnimationActive={false} yId="right" type="monotone" dataKey="TDS" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorTdsHist)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}