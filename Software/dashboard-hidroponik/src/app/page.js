'use client';
import { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Thermometer, Droplets, FlaskConical, Calendar, 
  Settings, Bell, User, LayoutDashboard, BarChart3, 
  Sliders, BookOpen, Activity, HelpCircle, LogOut,
  ChevronDown, RefreshCw, Send
} from 'lucide-react';

export default function AeroGrowDashboard() {
  const [data, setData] = useState({ suhu: 0.0, ph: 0.0, tds: 0, usia: 0, status: "STANDBY", timestamp: null });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetTanaman, setTargetTanaman] = useState("SELADA");
  const [isSyncing, setIsSyncing] = useState(false);

  // Data target berdasarkan komoditas
  const plantTargets = {
    SELADA: { ph: "6.0 - 6.5", tds: "800 - 1200 PPM" },
    PAKCOY: { ph: "6.5 - 7.0", tds: "1050 - 1400 PPM" },
    BAYAM: { ph: "6.0 - 7.0", tds: "1260 - 1540 PPM" },
    KANGKUNG: { ph: "5.5 - 6.5", tds: "1000 - 1200 PPM" }
  };

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
    const interval = setInterval(fetchData, 5000); // Polling setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  const handleKirimKomando = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetTanaman }),
      });
    } catch (error) {
      console.error("Error sending command:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FB] font-sans text-slate-900">
      
      {/* SIDE NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">System Alpha</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Monitoring</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <NavItem icon={<BarChart3 size={18} />} label="Analytics" />
          <NavItem icon={<Sliders size={18} />} label="Command Center" />
          <NavItem icon={<BookOpen size={18} />} label="Growth Log" />
          <NavItem icon={<Activity size={18} />} label="System Health" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
            <RefreshCw size={16} />
            Export Data
          </button>
          <div className="mt-4 space-y-1">
            <NavItem icon={<HelpCircle size={18} />} label="Support" />
            <NavItem icon={<LogOut size={18} />} label="Logout" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* TOP BAR */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">AeroGrow Pro - Telemetri DFT</h2>
            <p className="text-slate-500 text-sm">Monitor dan kontrol nutrisi otomatis real-time.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wide
              ${data.status !== 'STANDBY' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
              <div className={`w-2 h-2 rounded-full ${data.status !== 'STANDBY' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>Sistem {data.status}</span>
            </div>
            <div className="flex gap-4">
              <IconButton icon={<Bell size={20} />} />
              <IconButton icon={<Settings size={20} />} />
              <IconButton icon={<User size={20} />} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: METRICS & CHARTS */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* METRIC CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={<Thermometer className="text-slate-400" size={18} />} 
                label="SUHU AIR" 
                value={data.suhu.toFixed(1)} 
                unit="°C" 
              />
              <StatCard 
                icon={<FlaskConical className="text-slate-400" size={18} />} 
                label="TINGKAT PH" 
                value={data.ph.toFixed(1)} 
                unit="" 
              />
              <StatCard 
                icon={<Droplets className="text-slate-400" size={18} />} 
                label="NUTRISI (TDS)" 
                value={data.tds} 
                unit="PPM" 
              />
              <StatCard 
                icon={<Calendar className="text-slate-400" size={18} />} 
                label="FASE TUMBUH" 
                value={data.usia > 0 ? `Hari ${data.usia}` : 'Hari --'} 
                unit="" 
              />
            </div>

            {/* MAIN ANALYTICS CHART */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-lg">Tren Kualitas Air (24 Jam)</h3>
                  <p className="text-slate-400 text-xs">Korelasi pH dan konsentrasi TDS</p>
                </div>
                <div className="flex gap-6 text-xs font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-emerald-500 rounded-full" />
                    <span className="text-slate-500">pH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-slate-300 rounded-full" />
                    <span className="text-slate-500">TDS</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.length > 0 ? chartData : defaultChartData}>
                    <defs>
                      <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="waktu" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#94A3B8'}} 
                      tickMargin={15}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="pH" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPh)" />
                    <Area type="monotone" dataKey="TDS" stroke="#CBD5E1" strokeWidth={2} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: COMMAND CENTER */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Settings className="text-slate-700" size={20} />
                </div>
                <h3 className="font-bold text-lg">Pusat Kendali</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
                    Pilih Komoditas
                  </label>
                  <div className="relative">
                    <select 
                      value={targetTanaman}
                      onChange={(e) => setTargetTanaman(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                    >
                      <option value="SELADA">Selada Air (Lettuce)</option>
                      <option value="PAKCOY">Pakcoy (Bok Choy)</option>
                      <option value="BAYAM">Bayam Hijau</option>
                      <option value="KANGKUNG">Kangkung Air</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Parameter Target</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FlaskConical size={16} />
                        <span className="text-xs font-medium">pH Ideal</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{plantTargets[targetTanaman].ph}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Droplets size={16} />
                        <span className="text-xs font-medium">TDS Ideal</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{plantTargets[targetTanaman].tds}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleKirimKomando}
                  disabled={isSyncing}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  {isSyncing ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Sinkronisasi Sistem</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      active 
        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function IconButton({ icon }) {
  return (
    <button className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 bg-white">
      {icon}
    </button>
  );
}

function StatCard({ icon, label, value, unit }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-slate-800 tracking-tight">
          {value}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
        </h4>
      </div>
    </div>
  );
}

const defaultChartData = [
  { waktu: '00:00', pH: 0.0, TDS: 0 },
  { waktu: '06:00', pH: 0.0, TDS: 0 },
  { waktu: '12:00', pH: 0.0, TDS: 0 },
  { waktu: '18:00', pH: 0.0, TDS: 0 },
  { waktu: 'Sekarang', pH: 0.0, TDS: 0 },
];