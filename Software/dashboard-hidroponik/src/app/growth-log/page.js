'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, BarChart2, Sliders, BookOpen, Activity, 
  Settings, HelpCircle, LogOut, Download, Bell, User, 
  Cpu, Wifi, Zap, Crosshair, FlaskConical, Droplets, 
  ClipboardList, Droplet, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function SystemHealth() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex antialiased">
      <aside className="w-64 bg-white border-r border-[#bbcabf]/30 flex-col h-screen sticky top-0 shrink-0 hidden lg:flex">
        <div className="px-6 py-8">
          <h2 className="text-xl font-bold text-[#10b981] tracking-tight">System Alpha</h2>
          <p className="text-[14px] font-medium text-[#565e74] opacity-70 mt-1">Active Monitoring</p>
        </div>
        
        <nav className="flex-1 px-4 mt-2 space-y-2 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={<BarChart2 size={20} />} label="Analytics" href="/analytics" />
          <SidebarItem icon={<Sliders size={20} />} label="Command Center" href="/command-center" />
          <SidebarItem icon={<BookOpen size={20} />} label="Growth Log" href="/growth-log" />
          <SidebarItem icon={<Activity size={20} />} label="System Health" href="/system-health" active />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen w-full lg:w-[calc(100%-260px)]">
        <main className="flex-1 p-6 md:p-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-[#191c1e] tracking-tight">System Health & Diagnostics</h1>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#bbcabf]/20 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-[#f2f4f6] rounded-xl text-[#10b981]"><Cpu size={24} /></div>
                    <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider">CPU LOAD</span>
                  </div>
                  <div className="text-4xl font-bold text-[#191c1e] tracking-tight mb-2">24<span className="text-xl">%</span></div>
                  <div className="w-full bg-[#eceef0] rounded-full h-1.5 overflow-hidden mb-2">
                    <div className="bg-[#10b981] h-full transition-all duration-1000" style={{ width: isLoaded ? '24%' : '0%' }}></div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#bbcabf]/20 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-[#f2f4f6] rounded-xl text-[#10b981]"><Wifi size={24} /></div>
                    <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider">SIGNAL</span>
                  </div>
                  <div className="text-4xl font-bold text-[#191c1e] tracking-tight mb-2">-52<span className="text-xl">dBm</span></div>
                  <div className="w-full bg-[#eceef0] rounded-full h-1.5 overflow-hidden mb-2">
                    <div className="bg-[#10b981] h-full transition-all duration-1000" style={{ width: isLoaded ? '85%' : '0%' }}></div>
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

function SidebarItem({ icon, label, active, href }) {
  return (
    <Link href={href} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors w-full ${
      active ? 'bg-[#10b981] text-white' : 'text-[#565e74] hover:bg-[#e0e3e5]/30 hover:text-[#191c1e]'
    }`}>
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}