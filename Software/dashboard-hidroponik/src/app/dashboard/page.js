'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Link from 'next/link';
import { 
  Activity, LayoutDashboard, BarChart2, Sliders, BookOpen, 
  RefreshCw, HelpCircle, LogOut, Bell, Settings, User, 
  Thermometer, FlaskConical, Droplets, Calendar, ChevronDown, Send,
  Menu, X 
} from 'lucide-react';

export default function AeroGrowDashboard() {
  const [data, setData] = useState({ suhu: 0.0, ph: 0.0, tds: 0, usia: 0, status: "STANDBY", timestamp: null });
  const [chartData, setChartData] = useState([]);
  
  // State untuk Pusat Kendali (Dropdown form)
  const [targetTanaman, setTargetTanaman] = useState("SELADA");
  const [targetHari, setTargetHari] = useState(30); 
  
  // State BARU untuk Indikator Status Profil yang benar-benar sedang aktif di alat
  const [activeProfile, setActiveProfile] = useState("SELADA");

  const [isSyncing, setIsSyncing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const plantTargets = {
    SELADA: { ph: "6.0 - 6.5", tds: "800 - 1200 PPM" },
    PAKCOY: { ph: "6.5 - 7.0", tds: "1050 - 1400 PPM" },
    BAYAM: { ph: "6.2 - 7.0", tds: "1260 - 1540 PPM" },
    KANGKUNG: { ph: "6.0 - 6.5", tds: "1000 - 1200 PPM" }
  };

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const response = await fetch('/api/telemetry');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          setData(result.data[0]);
          const formattedChart = result.data.map(item => ({
            waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            pH: item.ph,
            TDS: item.tds
          })).reverse();
          setChartData(formattedChart);
        }
      } catch (error) {
        console.error("Error fetching telemetry:", error);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const setRes = await res.json();
        if (setRes.targetTanaman) {
          setTargetTanaman(setRes.targetTanaman);
          setActiveProfile(setRes.targetTanaman); // Simpan profil yang sedang aktif dari database
        }
        if (setRes.targetHari) setTargetHari(setRes.targetHari);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleKirimKomando = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetTanaman, targetHari }), 
      });
      // Update profil aktif di UI bagian atas kalau sukses sinkronisasi
      setActiveProfile(targetTanaman);
      setTimeout(() => setIsSyncing(false), 1500);
    } catch (error) {
      console.error("Error sending command:", error);
      setIsSyncing(false);
    }
  };

  const handleHariChange = (e) => {
    let val = parseInt(e.target.value);
    if (val > 40) val = 40;
    if (val < 1) val = 1;
    setTargetHari(isNaN(val) ? '' : val);
  };

  const isRunning = data.status !== 'STANDBY';

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex antialiased">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#191c1e]/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#f7f9fb] border-r border-[#bbcabf]/30 flex flex-col h-screen transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-4 p-2 text-[#565e74] hover:bg-[#e0e3e5] rounded-xl lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center text-white shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold leading-tight">System Alpha</span>
            <span className="text-[10px] text-[#565e74] tracking-wider font-semibold uppercase">Active Monitoring</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
          <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={<BarChart2 className="w-5 h-5" />} label="Analytics" href="/analytics" />
          <SidebarItem icon={<Sliders className="w-5 h-5" />} label="Command Center" href="/command-center" />
          <SidebarItem icon={<BookOpen className="w-5 h-5" />} label="Growth Log" href="/growth-log" />
          <SidebarItem icon={<Activity className="w-5 h-5" />} label="System Health" href="/system-health" />
        </nav>
        
        <div className="p-4 flex flex-col gap-1">
          <button className="flex items-center gap-3 px-4 py-3 bg-[#10b981]/10 text-[#10b981] rounded-xl font-medium transition-colors hover:bg-[#10b981]/20">
            <RefreshCw className="w-5 h-5" />
            Export Data
          </button>
          <SidebarItem icon={<HelpCircle className="w-5 h-5" />} label="Support" href="#" />
          <SidebarItem icon={<LogOut className="w-5 h-5" />} label="Logout" href="/login" />
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen w-full lg:w-[calc(100%-260px)]">
        
        <header className="bg-[#f7f9fb] pt-6 pb-4 flex justify-between items-center px-4 md:px-10 w-full sticky top-0 z-30 border-b border-[#bbcabf]/30 lg:border-none lg:pt-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#3c4a42] hover:bg-[#e0e3e5] rounded-xl lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col gap-1">
              <h1 className="text-[22px] font-bold tracking-tight hidden sm:block">AeroGrow Pro - Telemetri</h1>
              <h1 className="text-[18px] font-bold tracking-tight sm:hidden">Telemetri DFT</h1>
              <div className="flex items-center gap-2">
                <p className="text-[#3c4a42] text-[13px] hidden sm:block">Monitor dan kontrol nutrisi otomatis real-time.</p>
                
                {/* Indikator Profil Aktif untuk tampilan HP/Mobile */}
                <div className="sm:hidden flex items-center bg-[#10b981]/10 px-2 py-0.5 rounded-md border border-[#10b981]/30">
                  <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider">
                    🌱 {activeProfile}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* Indikator Profil Aktif untuk tampilan Desktop/Laptop */}
            <div className="hidden sm:flex items-center gap-2 bg-[#10b981]/10 px-4 py-2 rounded-full border border-[#10b981]/20 shadow-sm">
              <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider">
                🌱 PROFIL AKTIF: {activeProfile}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-[#f8fafc] px-4 py-2 rounded-full border border-[#bbcabf]/30">
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#10b981] animate-pulse' : 'bg-[#565e74]'}`}></div>
              <span className="text-[10px] font-semibold text-[#565e74] uppercase tracking-wider">
                SISTEM {data.status.replace(/_/g, ' ')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <IconButton icon={<Bell className="w-5 h-5" />} />
              <IconButton icon={<Settings className="w-5 h-5" />} hiddenOnMobile />
              <IconButton icon={<User className="w-5 h-5" />} />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10 md:pt-4 grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
          <div className="xl:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <MetricCard icon={<Thermometer className="w-4 h-4 text-[#565e74]" />} label="SUHU AIR" value={data.suhu.toFixed(1)} unit="°C" />
              <MetricCard icon={<FlaskConical className="w-4 h-4 text-[#565e74]" />} label="TINGKAT PH" value={data.ph.toFixed(1)} />
              <MetricCard icon={<Droplets className="w-4 h-4 text-[#565e74]" />} label="NUTRISI (TDS)" value={data.tds} unit="PPM" />
              <MetricCard icon={<Calendar className="w-4 h-4 text-[#565e74]" />} label="FASE TUMBUH" value={data.usia > 0 ? `Hari ${data.usia}` : 'Hari --'} isText />
            </div>

            <div className="bg-white border border-[#e0e3e5] shadow-sm rounded-[1.5rem] p-4 md:p-6 flex-1 flex flex-col min-h-[400px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-[16px] md:text-[18px] font-bold">Tren Kualitas Air (24 Jam)</h2>
                  <p className="text-[12px] md:text-[13px] text-[#565e74] mt-1">Korelasi pH dan konsentrasi TDS</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-[#10b981] rounded-full"></div>
                    <span className="text-[10px] text-[#565e74] font-bold">PH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-[#cbd5e1] rounded-full"></div>
                    <span className="text-[10px] text-[#565e74] font-bold">TDS</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full mt-4 h-full min-h-[250px] md:min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.length > 0 ? chartData : defaultChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e3e5" />
                    <XAxis dataKey="waktu" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#565e74'}} tickMargin={12} />
                    
                    <YAxis 
                      yAxisId="left" 
                      domain={[0, 14]} 
                      ticks={[0, 3, 6, 9, 12, 14]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#565e74'}} 
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      domain={[0, 2000]} 
                      ticks={[0, 500, 1000, 1500, 2000]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#565e74'}} 
                    />
                    
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e0e3e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', fontSize: '12px' }} />
                    <Area yAxisId="left" type="monotone" dataKey="pH" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPh)" />
                    <Area yAxisId="right" type="monotone" dataKey="TDS" stroke="#cbd5e1" strokeWidth={2} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 flex flex-col h-full gap-6">
            <div className="bg-white border border-[#e0e3e5] shadow-sm rounded-[1.5rem] p-6 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5" />
                <h2 className="text-[18px] font-bold">Pusat Kendali</h2>
              </div>
              
              <div className="flex flex-col gap-5 flex-grow">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-[#565e74] font-bold uppercase tracking-wider">PILIH KOMODITAS</label>
                  <div className="relative mt-1">
                    <select 
                      value={targetTanaman}
                      onChange={(e) => setTargetTanaman(e.target.value)}
                      className="w-full bg-[#f7f9fb] border border-[#bbcabf]/40 text-[14px] rounded-lg py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all cursor-pointer font-medium"
                    >
                      <option value="SELADA">Selada</option>
                      <option value="PAKCOY">Pakcoy</option>
                      <option value="BAYAM">Bayam</option>
                      <option value="KANGKUNG">Kangkung</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#565e74]">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <label className="text-[10px] text-[#565e74] font-bold uppercase tracking-wider">TARGET USIA PANEN (MAKS 40)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      min="1"
                      max="40"
                      value={targetHari}
                      onChange={handleHariChange}
                      className="w-full bg-[#f7f9fb] border border-[#bbcabf]/40 text-[14px] rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all font-medium"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#565e74]">
                      <span className="text-xs font-bold tracking-wider">HARI</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#bbcabf]/20 flex flex-col gap-5 mt-2">
                  <h3 className="text-[10px] text-[#565e74] font-bold uppercase tracking-wider border-b border-[#bbcabf]/20 pb-3">PARAMETER IDEAL</h3>
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center gap-2 text-[#565e74]">
                      <FlaskConical className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Target pH</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#10b981]">{plantTargets[targetTanaman].ph}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#565e74]">
                      <Droplets className="w-4 h-4" />
                      <span className="text-[13px] font-medium">Target TDS</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#10b981]">{plantTargets[targetTanaman].tds}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleKirimKomando}
                  disabled={isSyncing || targetHari === ''}
                  className={`w-full text-white font-semibold text-sm rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-sm
                    ${isSyncing || targetHari === '' ? 'bg-[#565e74] cursor-not-allowed' : 'bg-[#10b981] hover:bg-[#059669] hover:shadow-md active:scale-[0.98]'}`}
                >
                  <div className={`w-4 h-4 flex items-center justify-center ${isSyncing ? 'animate-spin' : ''}`}>
                    {isSyncing ? <RefreshCw className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  </div>
                  <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Sistem'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full ${
        active 
          ? 'bg-[#10b981] text-white' 
          : 'text-[#565e74] hover:bg-[#e0e3e5]/30 hover:text-[#191c1e]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function IconButton({ icon, hiddenOnMobile }) {
  return (
    <button className={`bg-white border border-[#bbcabf]/30 text-[#3c4a42] hover:bg-[#f2f4f6] p-2 rounded-full transition-colors active:scale-95 shadow-sm ${hiddenOnMobile ? 'hidden lg:block' : 'block'}`}>
      {icon}
    </button>
  );
}

function MetricCard({ icon, label, value, unit, isText }) {
  return (
    <div className="bg-white border border-[#e0e3e5] shadow-sm rounded-[1.5rem] p-4 flex flex-col gap-1 hover:shadow-md transition-shadow">
      <div className="bg-[#f2f4f6] w-8 h-8 rounded-full flex items-center justify-center mb-1">
        {icon}
      </div>
      <span className="text-[10px] text-[#3c4a42] uppercase tracking-wider font-bold">{label}</span>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`font-bold tracking-tight ${isText ? 'text-[20px] md:text-[24px]' : 'text-[28px] md:text-[32px]'}`}>
          {value}
        </span>
        {unit && <span className="text-[#565e74] text-sm">{unit}</span>}
      </div>
    </div>
  );
}

const defaultChartData = [
  { waktu: '00:00:00', pH: 0.0, TDS: 0 },
  { waktu: '06:00:00', pH: 0.0, TDS: 0 },
  { waktu: '12:00:00', pH: 0.0, TDS: 0 },
  { waktu: '18:00:00', pH: 0.0, TDS: 0 },
  { waktu: 'Sekarang', pH: 0.0, TDS: 0 },
];