'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiGrid, FiBarChart2, FiSliders, FiBookOpen, 
  FiActivity, FiLogOut, FiHelpCircle, FiRefreshCw 
} from 'react-icons/fi';

export default function Sidebar() {
  const pathname = usePathname();
  
  // Sidebar gak akan muncul di halaman login
  if (pathname === '/login' || pathname === '/') return null;

  return (
    <aside className="w-[260px] bg-white border-r border-gray-100 hidden md:flex flex-col justify-between h-screen sticky top-0 p-5 shrink-0">
      <div>
        {/* Area Logo */}
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shadow-sm border border-red-100">
            <FiActivity className="text-xl font-bold" />
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900 text-lg leading-tight">System Alpha</h1>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Alat Terputus</p>
          </div>
        </div>

        {/* Menu Navigasi Sesuai Poin Rancangan Lu */}
        <nav className="space-y-1.5">
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${pathname === '/dashboard' ? 'bg-[#00c48c] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <FiGrid className="text-lg" /> Dashboard
          </Link>
          <Link href="/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${pathname === '/analytics' ? 'bg-[#00c48c] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <FiBarChart2 className="text-lg" /> Analytics
          </Link>
          <Link href="/command-center" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${pathname === '/command-center' ? 'bg-[#00c48c] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <FiSliders className="text-lg" /> Command Center
          </Link>
          <Link href="/growth-log" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${pathname === '/growth-log' ? 'bg-[#00c48c] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <FiBookOpen className="text-lg" /> Growth Log
          </Link>
          <Link href="/system-health" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${pathname === '/system-health' ? 'bg-[#00c48c] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <FiActivity className="text-lg" /> System Health
          </Link>
        </nav>
      </div>

      {/* Area Tombol Bawah */}
      <div className="space-y-2 pb-4">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-emerald-600 bg-emerald-50 rounded-xl font-semibold transition-colors">
          <FiRefreshCw className="text-lg" /> Export Data
        </button>
        <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:bg-gray-50 rounded-xl font-semibold transition-colors">
          <FiHelpCircle className="text-lg" /> Support
        </button>
        <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-colors mt-2">
          <FiLogOut className="text-lg" /> Logout
        </button>
      </div>
    </aside>
  );
}