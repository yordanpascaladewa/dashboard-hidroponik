'use client';
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar
} from 'recharts';
import { 
  TrendingUp, Activity, Droplets, FlaskConical, 
  Sparkles, Lightbulb, ChevronRight, Calendar
} from 'lucide-react';

// StatCard Component
function StatCard({ label, value, unit, status, icon, color }) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-500 border-emerald-100',
    blue: 'bg-blue-50 text-blue-500 border-blue-100',
    slate: 'bg-slate-50 text-slate-500 border-slate-100'
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl font-black text-slate-800 tracking-tight">{value}</span>
        <span className="text-sm font-bold text-slate-400 uppercase">{unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-400' : 'bg-slate-400'}`} />
        <span className="text-xs font-bold text-slate-500">{status}</span>
      </div>
    </div>
  );
}

// InsightItem Component
function InsightItem({ type, title, desc, source }) {
  const dotColor = type === 'warning' ? 'bg-amber-400' : 'bg-emerald-400';
  return (
    <div className="flex justify-between items-start pt-6 border-t border-slate-50">
      <div className="flex gap-4">
        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${dotColor}`} />
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">{title}</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter whitespace-nowrap ml-4">
        SUMBER: {source}
      </span>
    </div>
  );
}

// Main Page Component
export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false);
  const [timeRange, setTimeRange] = useState('7 Hari');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const lineData = [
    { time: 'Sen', ph: 6.1, tds: 820 },
    { time: 'Sel', ph: 6.3, tds: 840 },
    { time: 'Rab', ph: 6.2, tds: 835 },
    { time: 'Kam', ph: 6.4, tds: 850 },
    { time: 'Jum', ph: 6.2, tds: 840 },
    { time: 'Sab', ph: 6.5, tds: 860 },
    { time: 'Min', ph: 6.2, tds: 840 },
  ];

  const barData = [
    { name: 'Mg1', actual: 12.4, target: 14.0 },
    { name: 'Mg2', actual: 13.1, target: 14.0 },
    { name: 'Mg3', actual: 12.8, target: 14.0 },
  ];

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#F7F9FB] p-8 ml-64">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Overview Kinerja</h1>
          <p className="text-slate-500 mt-1">Sistem Hidroponik Zona A</p>
        </div>
        <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
          {['24 Jam', '7 Hari', '30 Hari'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                timeRange === range 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard 
          label="RATA-RATA PH" 
          value="6.2" 
          unit="pH" 
          status="Optimal (±0.1 var)" 
          icon={<FlaskConical size={20} />}
          color="emerald"
        />
        <StatCard 
          label="RATA-RATA TDS" 
          value="840" 
          unit="ppm" 
          status="Stabil" 
          icon={<Droplets size={20} />}
          color="blue"
        />
        <StatCard 
          label="KONSUMSI NUTRISI" 
          value="12.4" 
          unit="L" 
          status="+2% vs Minggu Lalu" 
          icon={<TrendingUp size={20} />}
          color="slate"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="col-span-2 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg text-slate-800">Tren Parameter Historis</h3>
            <button className="text-slate-400 hover:text-slate-600">•••</button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  dy={10}
                />
                <YAxis hide domain={[600, 1000]} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="tds" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorPh)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Chart */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-8">Efisiensi Nutrisi</h3>
          <div className="h-[200px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="target" fill="#f1f5f9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-slate-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-slate-200" />
                Target Konsumsi
              </div>
              <span className="font-bold text-slate-700">14.0 L</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-emerald-500 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Aktual
              </div>
              <span className="font-bold text-slate-700">12.4 L</span>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Sistem Wawasan (AI)</h3>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100">
              ANALISIS BERHASIL
            </span>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl h-fit">
                <Lightbulb size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">Tip AI: Optimasi pH</p>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  Menurunkan suhu air sebesar 1-2°C di siang hari dapat membantu menstabilkan pH tanpa penambahan larutan asam.
                </p>
              </div>
            </div>
            
            <InsightItem 
              type="warning" 
              title="pH cenderung naik di siang hari" 
              desc="Suhu ruangan mencapai 28°C pada pukul 12:00-14:00, menyebabkan fluktuasi pH minor."
              source="SENSOR PH-01"
            />
            <InsightItem 
              type="success" 
              title="Serapan Nutrisi Stabil" 
              desc="Rasio TDS berbanding volume air menunjukkan serapan akar pada tingkat optimal 92%."
              source="KALKULASI TDS"
            />
          </div>
        </div>

        {/* Growth Comparison Table */}
        <div className="col-span-2 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Perbandingan Siklus Pertumbuhan</h3>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="text-left pb-4 font-bold">Siklus</th>
                <th className="text-left pb-4 font-bold">Hari Ke-</th>
                <th className="text-left pb-4 font-bold">TDS Rata-rata</th>
                <th className="text-left pb-4 font-bold">Est. Panen</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-emerald-600 font-bold">Saat Ini (B-42)</span>
                  </div>
                </td>
                <td className="py-4 text-slate-600">24</td>
                <td className="py-4 text-slate-600">840 ppm</td>
                <td className="py-4 text-slate-600">+12 Hari</td>
              </tr>
              <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 pl-5 text-slate-500 font-bold">Panen B-41</td>
                <td className="py-4 text-slate-500">35 (Final)</td>
                <td className="py-4 text-slate-500">865 ppm</td>
                <td className="py-4 text-slate-500 italic">Selesai</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 pl-5 text-slate-500 font-bold">Panen B-40</td>
                <td className="py-4 text-slate-500">34 (Final)</td>
                <td className="py-4 text-slate-500">850 ppm</td>
                <td className="py-4 text-slate-500 italic">Selesai</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}