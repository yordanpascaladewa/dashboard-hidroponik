'use client';
import { useState } from 'react';
import { 
  LayoutDashboard, BarChart2, Sliders, BookOpen, Activity, 
  Settings, HelpCircle, Search, Bell, Thermometer, Wifi, 
  Waves, Lightbulb, FlaskConical, Wind, Bot, AlertTriangle 
} from 'lucide-react';

export default function CommandCenter() {
  // State untuk kontrol saklar aktuator
  const [actuators, setActuators] = useState({
    pump: true,
    led: true,
    doser: false,
    fan: true
  });

  const [targets, setTargets] = useState({ ph: "6.0", tds: "1000" });

  // Fungsi toggle untuk switch
  const toggleActuator = (key) => {
    setActuators(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex antialiased">
      
      {/* SIDEBAR */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col py-8 px-4 z-50 hidden lg:flex">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-emerald-700 tracking-tight">System Alpha</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">AeroGrow Pro Active</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem icon={<BarChart2 size={20} />} label="Analytics" />
          <SidebarItem icon={<Sliders size={20} />} label="Command Center" active />
          <SidebarItem icon={<BookOpen size={20} />} label="Growth Log" />
          <SidebarItem icon={<Activity size={20} />} label="System Health" />
        </nav>
        
        <div className="mt-auto space-y-1 border-t border-slate-200 pt-6">
          <SidebarItem icon={<HelpCircle size={20} />} label="Support" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
          
          <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-sm hover:bg-red-700">
            Emergency Stop
          </button>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="lg:ml-64 w-full min-h-screen flex flex-col">
        
        {/* TOP NAVBAR */}
        <header className="sticky top-0 w-full h-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center px-6 md:px-10 z-40">
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-2 rounded-xl flex items-center border border-slate-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <Search className="text-slate-400 w-5 h-5 mx-2" />
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm w-48 md:w-64 outline-none text-slate-700 placeholder:text-slate-400" 
                placeholder="Search system metrics..." 
                type="text" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-5 text-slate-500">
              <Bell className="w-5 h-5 cursor-pointer hover:text-emerald-600 transition-colors" />
              <Thermometer className="w-5 h-5 cursor-pointer hover:text-emerald-600 transition-colors" />
              <Wifi className="w-5 h-5 cursor-pointer hover:text-emerald-600 transition-colors" />
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-slate-200 bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              YP
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-10">
          
          {/* HEADER SECTION */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pusat Komando</h2>
            <p className="text-base text-slate-500 mt-2">Hub Kontrol Manual Aktuator</p>
          </div>

          {/* BENTO LAYOUT */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* LEFT SIDE (8 COLUMNS) - CONTROLS */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* ACTUATOR GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* ACTUATOR CARD: POMPA */}
                <ActuatorCard 
                  title="Pompa Air Utama" 
                  subtitle="Sirkulasi Nutrisi" 
                  icon={<Waves size={28} />} 
                  isActive={actuators.pump} 
                  onToggle={() => toggleActuator('pump')} 
                />
                
                {/* ACTUATOR CARD: LAMPU */}
                <ActuatorCard 
                  title="Lampu Pertumbuhan" 
                  subtitle="Spektrum Penuh LED" 
                  icon={<Lightbulb size={28} />} 
                  isActive={actuators.led} 
                  onToggle={() => toggleActuator('led')} 
                />

                {/* ACTUATOR CARD: DOSER */}
                <ActuatorCard 
                  title="Doser Nutrisi A/B" 
                  subtitle="Injeksi Otomatis" 
                  icon={<FlaskConical size={28} />} 
                  isActive={actuators.doser} 
                  onToggle={() => toggleActuator('doser')} 
                />

                {/* ACTUATOR CARD: KIPAS */}
                <ActuatorCard 
                  title="Kipas Ventilasi" 
                  subtitle="Kontrol Iklim Mikro" 
                  icon={<Wind size={28} />} 
                  isActive={actuators.fan} 
                  onToggle={() => toggleActuator('fan')} 
                />
              </div>

              {/* HARDWARE STATUS TABLE */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Hardware Status</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last updated: 2m ago</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="border-b border-slate-100">
                      <tr>
                        <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Komponen</th>
                        <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Beban Listrik</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 text-sm">
                      <StatusRow name="Main Pump Controller" isActive={actuators.pump} load={actuators.pump ? "12.4 W" : "0.0 W"} />
                      <StatusRow name="LED Array V3" isActive={actuators.led} load={actuators.led ? "145.0 W" : "0.0 W"} />
                      <StatusRow name="Nutrient Dosing Module" isActive={actuators.doser} load={actuators.doser ? "4.5 W" : "0.0 W"} />
                      <StatusRow name="Extraction Fan Unit" isActive={actuators.fan} load={actuators.fan ? "8.2 W" : "0.0 W"} />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE (4 COLUMNS) - SETTINGS */}
            <div className="xl:col-span-4 space-y-8">
              
              {/* AUTOMATION SETTINGS */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <Bot className="text-emerald-600 w-6 h-6" />
                  <h3 className="text-xl font-bold text-slate-900">Automation Settings</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target pH</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-4 px-5 text-lg font-medium outline-none transition-all" 
                        type="text" 
                        value={targets.ph}
                        onChange={(e) => setTargets({...targets, ph: e.target.value})}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">pH</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target TDS</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-4 px-5 text-lg font-medium outline-none transition-all" 
                        type="text" 
                        value={targets.tds}
                        onChange={(e) => setTargets({...targets, tds: e.target.value})}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">ppm</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-95 shadow-emerald-600/20 shadow-md">
                    Simpan & Terapkan
                  </button>
                </div>
              </div>

              {/* EMERGENCY OVERRIDE */}
              <div className="bg-white rounded-3xl p-8 border-2 border-red-500 shadow-lg shadow-red-500/10">
                <div className="flex items-center gap-2 mb-4 text-red-600">
                  <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
                  <h3 className="text-xl font-bold">Berhenti Darurat</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-8 font-medium">
                  Mengaktifkan override akan memutus aliran listrik ke seluruh aktuator secara instan. Gunakan hanya dalam kondisi kritis.
                </p>
                <button className="w-full bg-red-600 text-white py-4 rounded-xl font-extrabold text-base transition-all hover:bg-red-700 active:scale-95 shadow-md uppercase tracking-wider">
                  Aktifkan Override
                </button>
              </div>

              {/* DECORATIVE IMAGE BANNER */}
              <div className="relative h-48 rounded-3xl overflow-hidden group border border-slate-200">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=1000&auto=format&fit=crop')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/40 to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Current Environment</span>
                    <p className="text-white font-bold text-lg">Zone 01 - Germination</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- KOMPONEN PEMBANTU ---

function SidebarItem({ icon, label, active }) {
  return (
    <a href="#" className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${
      active 
        ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}>
      {icon}
      <span>{label}</span>
    </a>
  );
}

function ActuatorCard({ title, subtitle, icon, isActive, onToggle }) {
  return (
    <div className={`bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-3xl shadow-sm flex flex-col justify-between h-48 transition-all hover:shadow-md border ${isActive ? 'border-emerald-500/50 ring-2 ring-emerald-500/10' : 'border-slate-200'}`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl transition-transform ${isActive ? 'bg-emerald-100 text-emerald-600 scale-110' : 'bg-slate-100 text-slate-400'}`}>
          {icon}
        </div>
        
        {/* Toggle Switch Custom */}
        <button 
          onClick={onToggle}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
        >
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

function StatusRow({ name, isActive, load }) {
  return (
    <tr>
      <td className="py-5 font-medium text-slate-700">{name}</td>
      <td className="py-5">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-bold text-[10px] tracking-wider ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
          {isActive ? 'AKTIF' : 'MATI'}
        </span>
      </td>
      <td className="py-5 text-right font-medium text-slate-600">{load}</td>
    </tr>
  );
}