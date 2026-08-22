'use client';
import { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#121315] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#1f2021] rounded-[32px] border border-white/10 shadow-2xl p-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AeroGrow Pro</h1>
          <p className="text-slate-500 text-sm mt-1">System Access Gateway</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">OPERATOR ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input type="text" className="w-full bg-[#121315] border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500 transition-all text-white" placeholder="Operator ID" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">SECURITY KEY</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input type={showPassword ? "text" : "password"} className="w-full bg-[#121315] border border-white/5 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-emerald-500 transition-all text-white" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>

          <Link href="/dashboard" className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#0d0e0f] font-black py-4 rounded-2xl flex items-center justify-center transition-all uppercase tracking-widest mt-8">Initialize Connection</Link>
        </form>
      </div>
    </div>
  );
}