'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BarChart3, Cpu, LogOut, Sprout } from 'lucide-react';

// Tangkap prop isOpen dari layout tadi
export default function Sidebar({ isOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'BERANDA', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'ANALISIS DATA', icon: <BarChart3 size={20} />, path: '/analytics' },
    { name: 'STATUS SISTEM', icon: <Cpu size={20} />, path: '/hardware-status' },
  ];

  return (
    // Tambahin class translate-x buat efek nge-slide ke kiri pas ditutup
    <aside className={`w-[280px] h-screen bg-[#121315] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* Header Logo */}
      <div className="h-[100px] flex items-center px-8">
        <div className="flex items-center gap-2">
          <Sprout size={28} className="text-[#10B981]" />
          <span className="text-xl font-bold text-white tracking-tight">AeroGrow<span className="text-[#10B981]">Pro</span></span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                isActive 
                  ? 'bg-white/5 border-l-4 border-[#10B981] text-[#10B981]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-l-4 border-transparent'
              }`}>
                {item.icon}
                <span className="font-bold text-sm tracking-widest">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-8 border-t border-white/5">
        <button 
          onClick={() => router.push('/login')}
          className="flex items-center gap-4 text-slate-400 hover:text-red-500 transition-colors w-full"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm tracking-widest uppercase">Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}