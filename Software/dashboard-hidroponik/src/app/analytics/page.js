'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Link from 'next/link';
import { 
  LayoutDashboard, BarChart2, Sliders, BookOpen, Activity, 
  Settings, HelpCircle, FlaskConical, Droplets, Box, 
  TrendingUp, Sparkles, Printer, Download, CheckCircle 
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [data, setData] = useState({ suhu: 0.0, ph: 0.0, tds: 0, usia: 0, status: "STANDBY", timestamp: null });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/telemetry');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          setData(result.data[0]);
          
          const formattedChart = result.data.map(item => ({
            waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            pH: item.ph,
            TDS: item.tds
          })).reverse();
          
          setChartData(formattedChart);
        }
      } catch (error) {
        console.error("Error fetching telemetry:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex antialiased">
      <aside className="flex flex-col h-screen w-64 border-r border-[#bbcabf]/30 bg-[#f7f9fb] shrink-0 sticky top-0 hidden lg:flex">
        <div className="px-6 py-8">
          <div className="text-xl font-bold text-[#10b981] tracking-tight">AeroGrow Pro</div>
          <div className="text-[#3c4a42] text-[10px] font-semibold tracking-wider mt-1 uppercase opacity-70">
            Precision DFT Telemetry
          </div>
        </div>
        
        <nav className="flex-1 px-4 mt-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={<BarChart2 size={20} />} label="Analytics" href="/analytics" />
          <SidebarItem icon={<Sliders size={20} />} label="Command Center" href="/command-center" />
          <SidebarItem icon={<BookOpen size={20} />} label="Growth Log" href="/growth-log" />
          <SidebarItem icon={<Activity size={20} />} label="System Health" href="/system-health" />
        </nav>
        
        <div className="p-4 border-t border-[#bbcabf]/30">
          <SidebarItem icon={<Settings size={20} />} label="Settings" href="#" />
          <SidebarItem icon={<HelpCircle size={20} />} label="Support" href="#" />
          
          <div className="mt-6 flex items-center gap-4 px-4 pb-4">
            <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white font-bold">
              YP
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">Admin</div>
              <div className="text-[10px] text-[#3c4a42]">Zona A Operator</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#f7f9fb] p-6 md:p-10 space-y-8">
        <header className="flex justify-between items-end w-full">
          <div>
            <h1 className="text-3xl font-bold text-[#191c1e] tracking-tight">Overview Kinerja</h1>
            <p className="text-[#3c4a42] text-sm mt-1">Sistem Hidroponik Zona A — Laporan Analitik Real-time</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4 border border-[#bbcabf]/20">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#3c4a42] uppercase tracking-wider">Rata-Rata pH</span>
              <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
                <FlaskConical size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#10b981] tracking-tight">{data.ph > 0 ? data.ph.toFixed(1) : '6.2'}</span>
              <span className="text-sm text-[#3c4a42]">Target: 6.0 - 6.5</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4 border border-[#bbcabf]/20">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#3c4a42] uppercase tracking-wider">Rata-Rata TDS</span>
              <div className="w-8 h-8 rounded-lg bg-[#565e74]/10 flex items-center justify-center text-[#565e74]">
                <Droplets size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#191c1e] tracking-tight">{data.tds > 0 ? data.tds : '840'}</span>
              <span className="text-sm text-[#3c4a42]">ppm</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4 border border-[#bbcabf]/20">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#3c4a42] uppercase tracking-wider">Konsumsi Nutrisi</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Box size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#191c1e] tracking-tight">12.4</span>
              <span className="text-sm text-[#3c4a42]">Liter</span>
            </div>
          </div>
        </div>

        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#bbcabf]/10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-[#191c1e]">Tren Parameter Historis</h3>
              <p className="text-sm text-[#3c4a42] mt-1">Fluktuasi TDS dan pH</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : defaultChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef0" />
                <XAxis dataKey="waktu" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#565e74'}} tickMargin={12} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#565e74'}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#565e74'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e0e3e5' }} />
                <Area yAxisId="left" type="monotone" dataKey="pH" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPh)" />
                <Area yAxisId="right" type="monotone" dataKey="TDS" stroke="#cbd5e1" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

      </main>
    </div>
  );
}

function SidebarItem({ icon, label, href }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors w-full ${
        active 
          ? 'bg-[#10b981] text-white border-r-4 border-[#00422b]' 
          : 'text-[#3c4a42] hover:bg-[#eceef0] hover:text-[#191c1e]'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}

const defaultChartData = [
  { waktu: '00:00', pH: 0.0, TDS: 0 },
  { waktu: '06:00', pH: 6.1, TDS: 800 },
  { waktu: '12:00', pH: 6.3, TDS: 840 },
  { waktu: '18:00', pH: 6.2, TDS: 820 },
  { waktu: 'Sekarang', pH: 6.2, TDS: 840 },
];