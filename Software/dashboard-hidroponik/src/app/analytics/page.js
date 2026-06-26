'use client';
import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  LayoutDashboard, BarChart2, Sliders, BookOpen, Activity, 
  Settings, HelpCircle, FlaskConical, Droplets, Box, 
  TrendingUp, Sparkles, Printer, Download, CheckCircle 
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [data, setData] = useState({ suhu: 0.0, ph: 0.0, tds: 0, usia: 0, status: "STANDBY", timestamp: null });
  const [chartData, setChartData] = useState([]);
  const [showToast, setShowToast] = useState(false);

  // Tarik data dari API Telemetry
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

  // Simulasi Toast Notification saat pertama render
  useEffect(() => {
    setTimeout(() => setShowToast(true), 1500);
    setTimeout(() => setShowToast(false), 6500);
  }, []);

  const isRunning = data.status !== 'STANDBY';

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex antialiased">
      
      {/* SIDEBAR */}
      <aside className="flex flex-col h-screen w-64 border-r border-[#bbcabf]/30 bg-[#f7f9fb] shrink-0 sticky top-0 hidden lg:flex">
        <div className="px-6 py-8">
          <div className="text-xl font-bold text-[#10b981] tracking-tight">AeroGrow Pro</div>
          <div className="text-[#3c4a42] text-[10px] font-semibold tracking-wider mt-1 uppercase opacity-70">
            Precision DFT Telemetry
          </div>
        </div>
        
        <nav className="flex-1 px-4 mt-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem icon={<BarChart2 size={20} />} label="Analytics" active />
          <SidebarItem icon={<Sliders size={20} />} label="Command Center" />
          <SidebarItem icon={<BookOpen size={20} />} label="Growth Log" />
          <SidebarItem icon={<Activity size={20} />} label="System Health" />
        </nav>
        
        <div className="p-4 border-t border-[#bbcabf]/30">
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
          <SidebarItem icon={<HelpCircle size={20} />} label="Support" />
          
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#f7f9fb] p-6 md:p-10 space-y-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-end w-full">
          <div>
            <h1 className="text-3xl font-bold text-[#191c1e] tracking-tight">Overview Kinerja</h1>
            <p className="text-[#3c4a42] text-sm mt-1">Sistem Hidroponik Zona A — Laporan Analitik Real-time</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white p-1 rounded-full shadow-sm border border-[#bbcabf]/30">
            <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#3c4a42] hover:bg-[#eceef0] transition-colors">24 Jam</button>
            <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#10b981] text-white shadow-sm">7 Hari</button>
            <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#3c4a42] hover:bg-[#eceef0] transition-colors">30 Hari</button>
          </div>
        </header>

        {/* METRICS ROW */}
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
            <div className="h-1.5 w-full bg-[#eceef0] rounded-full overflow-hidden">
              <div className="h-full bg-[#10b981] w-[92%]"></div>
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
            <div className="flex items-center text-[#10b981] text-xs font-bold gap-1">
              <TrendingUp size={14} />
              <span>+2.4% vs minggu lalu</span>
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
            <div className="text-[#3c4a42] text-sm font-medium">Estimasi habis: 5 hari</div>
          </div>
        </div>

        {/* CHART SECTION */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#bbcabf]/10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-[#191c1e]">Tren Parameter Historis</h3>
              <p className="text-sm text-[#3c4a42] mt-1">Fluktuasi TDS (Total Dissolved Solids) dan pH - 7 Hari Terakhir</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                <span className="text-[10px] font-bold text-[#3c4a42] uppercase tracking-wider">pH</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#cbd5e1]"></span>
                <span className="text-[10px] font-bold text-[#3c4a42] uppercase tracking-wider">TDS</span>
              </div>
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
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e0e3e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                <Area yAxisId="left" type="monotone" dataKey="pH" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPh)" />
                <Area yAxisId="right" type="monotone" dataKey="TDS" stroke="#cbd5e1" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* BOTTOM ROW BENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#bbcabf]/20">
            <h4 className="text-[10px] font-bold text-[#3c4a42] uppercase tracking-wider mb-6">Efisiensi Nutrisi</h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Senyawa A</span>
                  <span className="font-medium text-[#3c4a42]">92%</span>
                </div>
                <div className="h-2 w-full bg-[#eceef0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#10b981] w-[92%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Senyawa B</span>
                  <span className="font-medium text-[#3c4a42]">78%</span>
                </div>
                <div className="h-2 w-full bg-[#eceef0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#565e74] w-[78%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mikro Nutrisi</span>
                  <span className="font-medium text-[#3c4a42]">96%</span>
                </div>
                <div className="h-2 w-full bg-[#eceef0] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[96%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#10b981]/5 p-6 rounded-2xl shadow-sm border border-[#10b981]/20 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#10b981]/10 rounded-full blur-3xl group-hover:scale-125 transition-transform"></div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#10b981]" />
              <h4 className="text-lg font-bold text-[#10b981]">Sistem Wawasan (AI)</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-white/80 p-4 rounded-xl border border-[#10b981]/10 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded uppercase">Tip AI: Optimasi pH</span>
                <p className="text-sm mt-2 text-[#191c1e] leading-relaxed">
                  Mendeteksi tren penurunan pH di pagi hari. Disarankan menaikkan aerasi 10% selama jam 06:00 - 08:00 untuk menstabilkan level CO2.
                </p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-[#10b981]/10 backdrop-blur-sm">
                <p className="text-sm text-[#191c1e] leading-relaxed">
                  Pertumbuhan Bayam Hijau 5% lebih cepat dari siklus sebelumnya. Waktu panen diprediksi dalam 4 hari ke depan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#bbcabf]/20 overflow-hidden">
            <h4 className="text-[10px] font-bold text-[#3c4a42] uppercase tracking-wider mb-6">Perbandingan Siklus</h4>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-[#eceef0]">
                  <tr className="text-[10px] font-bold text-[#3c4a42]/60 uppercase tracking-wider">
                    <th className="pb-3">Siklus</th>
                    <th className="pb-3 text-center">Durasi</th>
                    <th className="pb-3 text-right">Yield</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-[#191c1e]">
                  <tr className="border-b border-[#eceef0]/50">
                    <td className="py-4 font-medium">Batch 14 (Aktual)</td>
                    <td className="py-4 text-center">{data.usia > 0 ? `${data.usia} Hari` : '18 Hari'}</td>
                    <td className="py-4 text-right font-bold text-[#10b981]">—</td>
                  </tr>
                  <tr className="border-b border-[#eceef0]/50">
                    <td className="py-4 font-medium">Batch 13</td>
                    <td className="py-4 text-center">22 Hari</td>
                    <td className="py-4 text-right">4.2kg</td>
                  </tr>
                  <tr className="opacity-60">
                    <td className="py-4 font-medium">Batch 12</td>
                    <td className="py-4 text-center">24 Hari</td>
                    <td className="py-4 text-right">3.8kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="flex flex-col sm:flex-row justify-between items-center py-6 border-t border-[#bbcabf]/20 gap-4">
          <div className="text-sm text-[#3c4a42]">
            Pembaruan terakhir: Hari ini, {data.timestamp ? new Date(data.timestamp).toLocaleTimeString('id-ID') : new Date().toLocaleTimeString('id-ID')}
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 border border-[#bbcabf] rounded-full text-xs font-bold uppercase tracking-wider text-[#3c4a42] hover:bg-[#eceef0] transition-colors">
              <Printer size={16} />
              <span>Cetak Laporan</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#10b981] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity active:scale-95">
              <Download size={16} />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </footer>
      </main>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-8 right-8 bg-white/90 backdrop-blur-md border border-[#e0e3e5] px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <CheckCircle className="text-[#10b981] w-6 h-6" />
        <span className="text-sm font-medium text-[#191c1e]">Data analitik terbaru telah disinkronkan.</span>
      </div>

    </div>
  );
}

// Komponen Pembantu
function SidebarItem({ icon, label, active }) {
  return (
    <button className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors w-full ${
      active 
        ? 'bg-[#10b981] text-white border-r-4 border-[#00422b]' 
        : 'text-[#3c4a42] hover:bg-[#eceef0] hover:text-[#191c1e]'
    }`}>
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

const defaultChartData = [
  { waktu: '00:00', pH: 0.0, TDS: 0 },
  { waktu: '06:00', pH: 6.1, TDS: 800 },
  { waktu: '12:00', pH: 6.3, TDS: 840 },
  { waktu: '18:00', pH: 6.2, TDS: 820 },
  { waktu: 'Sekarang', pH: 6.2, TDS: 840 },
];