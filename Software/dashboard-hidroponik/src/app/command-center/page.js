'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, BarChart2, Sliders, BookOpen, Activity, 
  Settings, HelpCircle, Search, Bell, Thermometer, Wifi, 
  Waves, Lightbulb, FlaskConical, Wind, Bot, AlertTriangle 
} from 'lucide-react';

export default function CommandCenter() {
  const [actuators, setActuators] = useState({ pump: true, led: true, doser: false, fan: true });
  const [targets, setTargets] = useState({ ph: "6.0", tds: "1000" });

  // Tarik data status hardware terakhir dari database saat halaman dibuka
  useEffect(() => {
    const fetchActuatorState = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.actuators) {
          setActuators(data.actuators);
        }
      } catch (error) {
        console.error("Error fetching actuator settings:", error);
      }
    };
    fetchActuatorState();
  }, []);

  // Fungsi toggle yang terhubung langsung ke API MongoDB
  const toggleActuator = async (key) => {
    // Optimistic UI Update: Ubah di layar web seketika agar terasa responsif
    const newState = !actuators[key];
    const updatedActuators = { ...actuators, [key]: newState };
    setActuators(updatedActuators);

    try {
      // Tembakkan payload ke API backend
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actuators: updatedActuators }),
      });
    } catch (error) {
      console.error("Gagal mengirim instruksi ke hardware:", error);
      // Rollback jika gagal koneksi ke server
      setActuators(prev => ({ ...prev, [key]: !newState }));
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex antialiased">
      <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col py-8 px-4 z-50 hidden lg:flex">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-emerald-700 tracking-tight">System Alpha</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">AeroGrow Pro Active</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={<BarChart2 size={20} />} label="Analytics" href="/analytics" />
          <SidebarItem icon={<Sliders size={20} />} label="Command Center" href="/command-center" />
          <SidebarItem icon={<BookOpen size={20} />} label="Growth Log" href="/growth-log" />
          <SidebarItem icon={<Activity size={20} />} label="System Health" href="/system-health" />
        </nav>
        
        <div className="mt-auto space-y-1 border-t border-slate-200 pt-6">
          <SidebarItem icon={<HelpCircle size={20} />} label="Support" href="#" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" href="#" />
          <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-sm hover:bg-red-700">
            Emergency Stop
          </button>
        </div>
      </aside>

      <div className="lg:ml-64 w-full min-h-screen flex flex-col">
        <header className="sticky top-0 w-full h-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center px-6 md:px-10 z-40">
          <h2 className="text-xl font-bold text-slate-900">Pusat Komando</h2>
        </header>

        <main className="flex-1 p-6 md:p-10">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActuatorCard 
                  title="Pompa Air Utama" 
                  subtitle="Sirkulasi Nutrisi" 
                  icon={<Waves size={28} />} 
                  isActive={actuators.pump} 
                  onToggle={() => toggleActuator('pump')} 
                />
                <ActuatorCard 
                  title="Lampu Pertumbuhan" 
                  subtitle="Spektrum Penuh LED" 
                  icon={<Lightbulb size={28} />} 
                  isActive={actuators.led} 
                  onToggle={() => toggleActuator('led')} 
                />
                <ActuatorCard 
                  title="Doser Nutrisi A/B" 
                  subtitle="Injeksi Otomatis" 
                  icon={<FlaskConical size={28} />} 
                  isActive={actuators.doser} 
                  onToggle={() => toggleActuator('doser')} 
                />
                <ActuatorCard 
                  title="Kipas Ventilasi" 
                  subtitle="Kontrol Iklim Mikro" 
                  icon={<Wind size={28} />} 
                  isActive={actuators.fan} 
                  onToggle={() => toggleActuator('fan')} 
                />
              </div>
            </div>

            <div className="xl:col-span-4 space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <Bot className="text-emerald-600 w-6 h-6" />
                  <h3 className="text-xl font-bold text-slate-900">Automation Settings</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target pH</label>
                    <div className="relative">
                      <input className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-4 px-5 text-lg font-medium outline-none transition-all" type="text" value={targets.ph} onChange={(e) => setTargets({...targets, ph: e.target.value})} />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">pH</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target TDS</label>
                    <div className="relative">
                      <input className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-4 px-5 text-lg font-medium outline-none transition-all" type="text" value={targets.tds} onChange={(e) => setTargets({...targets, tds: e.target.value})} />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">ppm</span>
                    </div>
                  </div>
                  <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-95 shadow-emerald-600/20 shadow-md">
                    Simpan & Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, href }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${
        active 
          ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function ActuatorCard({ title, subtitle, icon, isActive, onToggle }) {
  return (
    <div className={`bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-3xl shadow-sm flex flex-col justify-between h-48 transition-all hover:shadow-md border ${isActive ? 'border-emerald-500/50 ring-2 ring-emerald-500/10' : 'border-slate-200'}`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl transition-transform ${isActive ? 'bg-emerald-100 text-emerald-600 scale-110' : 'bg-slate-100 text-slate-400'}`}>
          {icon}
        </div>
        <button onClick={onToggle} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm font-medium text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}