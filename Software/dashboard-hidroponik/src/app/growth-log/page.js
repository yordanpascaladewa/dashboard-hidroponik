'use client';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, BarChart2, Sliders, BookOpen, Activity, 
  Settings, HelpCircle, LogOut, Download, Bell, User, 
  Cpu, Wifi, Zap, Crosshair, FlaskConical, Droplets, 
  ClipboardList, Droplet, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function SystemHealth() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Memicu animasi progress bar setelah komponen dimuat
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex antialiased">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-[#bbcabf]/30 flex-col h-screen sticky top-0 shrink-0 hidden lg:flex">
        <div className="px-6 py-8">
          <h2 className="text-xl font-bold text-[#10b981] tracking-tight">System Alpha</h2>
          <p className="text-[14px] font-medium text-[#565e74] opacity-70 mt-1">Active Monitoring</p>
        </div>
        
        <nav className="flex-1 px-4 mt-2 space-y-2 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem icon={<BarChart2 size={20} />} label="Analytics" />
          <SidebarItem icon={<Sliders size={20} />} label="Command Center" />
          <SidebarItem icon={<BookOpen size={20} />} label="Growth Log" />
          <SidebarItem icon={<Activity size={20} />} label="System Health" active />
        </nav>
        
        <div className="mt-auto flex flex-col gap-2 p-4 border-t border-[#bbcabf]/30">
          <button className="flex items-center gap-3 px-4 py-3 bg-[#10b981]/10 text-[#10b981] rounded-xl font-semibold mb-2 hover:bg-[#10b981]/20 transition-colors">
            <Download size={20} />
            <span className="text-sm">Export Data</span>
          </button>
          <SidebarItem icon={<HelpCircle size={20} />} label="Support" />
          <SidebarItem icon={<LogOut size={20} />} label="Logout" />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:w-[calc(100%-260px)]">
        
        {/* TOP NAVIGATION BAR */}
        <header className="sticky top-0 w-full z-40 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#bbcabf]/30 flex justify-between items-center px-6 md:px-10 h-16">
          <div className="flex items-center gap-2">
            <Activity className="text-[#10b981] w-6 h-6" />
            <span className="text-xl font-bold text-[#10b981] hidden sm:block">AeroGrow Pro</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-[#eceef0] px-4 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-wider text-[#565e74] uppercase">SISTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-4 text-[#565e74]">
              <Bell className="w-5 h-5 cursor-pointer hover:text-[#10b981] transition-colors" />
              <Settings className="w-5 h-5 cursor-pointer hover:text-[#10b981] transition-colors" />
              <div className="h-8 w-8 rounded-full overflow-hidden border border-[#bbcabf] bg-[#10b981]/20 flex items-center justify-center text-[#10b981] font-bold text-xs cursor-pointer">
                YP
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-[#191c1e] tracking-tight">System Health & Diagnostics</h1>
            <p className="text-base text-[#565e74] mt-2 max-w-2xl">
              Technical overview of controller performance, sensor accuracy calibrations, and automated maintenance scheduling.
            </p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: HARDWARE METRICS */}
            <div className="xl:col-span-8 flex flex-col gap-8">
              
              {/* HARDWARE OVERVIEW BENTO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* CPU LOAD */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#bbcabf]/20 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-[#f2f4f6] rounded-xl text-[#10b981]">
                      <Cpu size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider">CPU LOAD</span>
                  </div>
                  <div className="text-4xl font-bold text-[#191c1e] tracking-tight mb-2">
                    24<span className="text-xl">%</span>
                  </div>
                  <div className="w-full bg-[#eceef0] rounded-full h-1.5 overflow-hidden mb-2">
                    <div 
                      className="bg-[#10b981] h-full transition-all duration-1000 ease-out" 
                      style={{ width: isLoaded ? '24%' : '0%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-[#6c7a71] uppercase">
                    <span>NORMAL</span>
                    <span>PEAK: 42%</span>
                  </div>
                </div>

                {/* WI-FI SIGNAL */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#bbcabf]/20 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-[#f2f4f6] rounded-xl text-[#10b981]">
                      <Wifi size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider">SIGNAL</span>
                  </div>
                  <div className="text-4xl font-bold text-[#191c1e] tracking-tight mb-2">
                    -52<span className="text-xl">dBm</span>
                  </div>
                  <div className="w-full bg-[#eceef0] rounded-full h-1.5 overflow-hidden mb-2">
                    <div 
                      className="bg-[#10b981] h-full transition-all duration-1000 ease-out delay-100" 
                      style={{ width: isLoaded ? '85%' : '0%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-[#6c7a71] uppercase">
                    <span>EXCELLENT</span>
                    <span>STABLE</span>
                  </div>
                </div>

                {/* VOLTAGE */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#bbcabf]/20 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-[#f2f4f6] rounded-xl text-[#10b981]">
                      <Zap size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider">POWER</span>
                  </div>
                  <div className="text-4xl font-bold text-[#191c1e] tracking-tight mb-2">
                    12.1<span className="text-xl">V</span>
                  </div>
                  <div className="w-full bg-[#eceef0] rounded-full h-1.5 overflow-hidden mb-2">
                    <div 
                      className="bg-[#10b981] h-full transition-all duration-1000 ease-out delay-200" 
                      style={{ width: isLoaded ? '95%' : '0%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-[#6c7a71] uppercase">
                    <span>REGULATED</span>
                    <span>LINE: OK</span>
                  </div>
                </div>
              </div>

              {/* SENSOR CALIBRATION PANEL */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#bbcabf]/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <Crosshair className="text-[#10b981] w-6 h-6" />
                    <h3 className="text-xl font-bold text-[#191c1e]">Sensor Calibration</h3>
                  </div>
                  <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider bg-[#eceef0] px-3 py-1.5 rounded-md">
                    LAST SYNC: 14:00 Today
                  </span>
                </div>
                
                <div className="space-y-6">
                  {/* pH Sensor */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-[#f7f9fb] rounded-xl border border-[#bbcabf]/30">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="p-3 bg-[#10b981]/10 rounded-full text-[#10b981]">
                        <FlaskConical size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-[#191c1e]">pH Sensor (Analytic)</h4>
                        <p className="text-sm text-[#565e74] mt-0.5">Deviation: +0.02 pH | Drift: Low</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <button className="px-4 py-2 bg-[#e0e3e5] text-[10px] font-bold tracking-wider rounded-full hover:bg-[#d8dadc] transition-colors">
                        CALIBRATE 4.0
                      </button>
                      <button className="px-4 py-2 bg-[#e0e3e5] text-[10px] font-bold tracking-wider rounded-full hover:bg-[#d8dadc] transition-colors">
                        CALIBRATE 7.0
                      </button>
                      <button className="px-4 py-2 border border-[#ba1a1a] text-[#ba1a1a] text-[10px] font-bold tracking-wider rounded-full hover:bg-[#ba1a1a] hover:text-white transition-colors active:scale-95">
                        RESET
                      </button>
                    </div>
                  </div>

                  {/* TDS Sensor */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-[#f7f9fb] rounded-xl border border-[#bbcabf]/30">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="p-3 bg-[#10b981]/10 rounded-full text-[#10b981]">
                        <Droplets size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-[#191c1e]">TDS Sensor (Nutrient)</h4>
                        <p className="text-sm text-[#565e74] mt-0.5">Deviation: -5 PPM | Drift: Minimal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <button className="px-4 py-2 bg-[#e0e3e5] text-[10px] font-bold tracking-wider rounded-full hover:bg-[#d8dadc] transition-colors">
                        CALIBRATE (1382)
                      </button>
                      <button className="px-4 py-2 border border-[#ba1a1a] text-[#ba1a1a] text-[10px] font-bold tracking-wider rounded-full hover:bg-[#ba1a1a] hover:text-white transition-colors active:scale-95">
                        RESET
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATMOSPHERIC VISUAL ASSET */}
              <div className="relative h-48 rounded-2xl overflow-hidden bg-[#10b981]/10 border border-[#10b981]/20">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <div className="max-w-lg">
                    <h4 className="text-xl font-bold text-[#10b981] mb-2">Neural Optimization Active</h4>
                    <p className="text-sm font-medium text-[#3c4a42]">
                      The system is autonomously balancing nutrient uptake based on current health telemetry.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: MAINTENANCE & LOGS */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              
              {/* MAINTENANCE TASKS PANEL */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#bbcabf]/20 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <ClipboardList className="text-[#10b981] w-6 h-6" />
                  <h3 className="text-xl font-bold text-[#191c1e]">Maintenance Log</h3>
                </div>
                
                <div className="space-y-4 flex-grow">
                  {/* Pending Task 1 */}
                  <div className="p-4 rounded-xl border border-[#bbcabf]/50 bg-white flex gap-4 group hover:border-[#10b981] transition-colors cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#f2f4f6] rounded-lg flex items-center justify-center text-[#10b981]">
                      <Droplet size={20} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="text-sm font-bold text-[#191c1e]">Change Nutrient Water</h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">DUE SOON</span>
                      </div>
                      <p className="text-xs text-[#565e74] mb-2">Recommended every 14 days for optimal growth.</p>
                      <span className="text-[10px] font-mono text-[#6c7a71]">In 2 days (Oct 24)</span>
                    </div>
                  </div>

                  {/* Pending Task 2 */}
                  <div className="p-4 rounded-xl border border-[#bbcabf]/50 bg-white flex gap-4 group hover:border-[#10b981] transition-colors cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#f2f4f6] rounded-lg flex items-center justify-center text-[#10b981]">
                      <Sparkles size={20} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="text-sm font-bold text-[#191c1e]">Clean Reservoir Tank</h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#e0e3e5] text-[#6c7a71] rounded">SCHEDULED</span>
                      </div>
                      <p className="text-xs text-[#565e74] mb-2">Prevent algae buildup and mineral deposits.</p>
                      <span className="text-[10px] font-mono text-[#6c7a71]">Nov 02, 2026</span>
                    </div>
                  </div>

                  {/* Completed Task */}
                  <div className="p-4 rounded-xl border border-[#bbcabf]/30 bg-[#f2f4f6]/50 flex gap-4 opacity-70">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#10b981]/10 rounded-lg flex items-center justify-center text-[#10b981]">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="text-sm font-bold text-[#191c1e]">Firmware Update v2.4</h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] rounded">DONE</span>
                      </div>
                      <p className="text-xs text-[#565e74] mb-2">System-wide optimizations for TDS precision.</p>
                      <span className="text-[10px] font-mono text-[#6c7a71]">Completed Oct 18</span>
                    </div>
                  </div>
                  
                  {/* Image Placeholder */}
                  <div className="mt-6 rounded-xl overflow-hidden aspect-video border border-[#bbcabf]/50 shadow-inner bg-slate-200">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Hardware Controller View" 
                      src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
                    />
                  </div>
                </div>

                <button className="w-full mt-6 py-3.5 bg-[#10b981] text-white text-[10px] font-bold tracking-widest rounded-xl hover:bg-[#006c49] active:scale-[0.98] transition-all shadow-sm">
                  ADD MAINTENANCE TASK
                </button>
              </div>

            </div>
          </div>

          {/* FOOTER SYSTEM SPECS */}
          <footer className="mt-12 py-8 border-t border-[#bbcabf]/30 flex flex-col md:flex-row justify-between items-center gap-6 opacity-80">
            <div className="flex flex-wrap gap-8 justify-center md:justify-start">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#6c7a71] uppercase tracking-wider mb-1">CONTROLLER</span>
                <span className="font-mono text-xs text-[#191c1e] font-medium">ESP32-S3 WROOM-1-N16R8</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#6c7a71] uppercase tracking-wider mb-1">UPTIME</span>
                <span className="font-mono text-xs text-[#191c1e] font-medium">14d 06h 22m</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#6c7a71] uppercase tracking-wider mb-1">IP ADDRESS</span>
                <span className="font-mono text-xs text-[#191c1e] font-medium">192.168.1.144</span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-[#6c7a71] uppercase tracking-wider text-center md:text-right">
              © 2026 AEROGROW SYSTEMS LTD. PRECISION BIOLOGY UNIT.
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}

// Komponen Pembantu
function SidebarItem({ icon, label, active }) {
  return (
    <a href="#" className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors w-full ${
      active 
        ? 'bg-[#10b981] text-white' 
        : 'text-[#565e74] hover:bg-[#e0e3e5]/30 hover:text-[#191c1e]'
    }`}>
      {icon}
      <span className="text-sm">{label}</span>
    </a>
  );
}