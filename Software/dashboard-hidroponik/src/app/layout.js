'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart, 
  Settings, 
  BookOpen, 
  Activity, 
  HelpCircle, 
  LogOut,
  Download
} from 'lucide-react';

export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F7F9FB]">
      <SideNavBar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function SideNavBar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { label: 'Analytics', icon: <BarChart size={20} />, href: '/analytics' },
    { label: 'Command Center', icon: <Settings size={20} />, href: '/command-center' },
    { label: 'Growth Log', icon: <BookOpen size={20} />, href: '/growth-log' },
    { label: 'System Health', icon: <Activity size={20} />, href: '/system-health' },
  ];

  const footerItems = [
    { label: 'Support', icon: <HelpCircle size={20} />, href: '/support' },
    { label: 'Logout', icon: <LogOut size={20} />, href: '/login' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col p-6 z-50">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
          <Activity size={18} />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 leading-tight">System Alpha</h2>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Monitoring</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        <button className="w-full bg-emerald-50 text-emerald-600 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors">
          <Download size={16} />
          Export Data
        </button>

        <div className="space-y-1">
          {footerItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}