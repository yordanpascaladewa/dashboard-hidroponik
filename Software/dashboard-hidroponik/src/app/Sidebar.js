'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BarChart3, Cpu, LogOut, Sprout } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'BERANDA', icon: <LayoutDashboard size={22} />, path: '/dashboard' },
    { name: 'ANALISIS DATA', icon: <BarChart3 size={22} />, path: '/analytics' },
    { name: 'STATUS SISTEM', icon: <Cpu size={22} />, path: '/hardware-status' },
  ];

  return (
    <aside className="w-[280px] h-screen bg-[#121315] border-r border-white/5 flex flex-col">
      <div className="h-[90px] flex items-center px-8 shrink-0">
        <div className="flex items-center gap-2.5">
          <Sprout size={32} className="text-[#10B981]" />
          <span className="text-2xl font-bold text-white tracking-tight">AeroGrow<span className="text-[#10B981]">Pro</span></span>
        </div>
      </div>

      <nav className="flex-1 px-5 py-6 flex flex-col gap-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-white/5 border-l-4 border-[#10B981] text-[#10B981]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-l-4 border-transparent'
              }`}>
                {item.icon}
                <span className="font-bold text-[13px] tracking-widest">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-white/5 shrink-0">
        <button 
          onClick={() => router.push('/login')}
          className="flex items-center gap-4 text-slate-400 hover:text-red-500 hover:bg-white/5 p-4 rounded-xl transition-all w-full cursor-pointer"
        >
          <LogOut size={22} />
          <span className="font-bold text-[13px] tracking-widest uppercase">Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}