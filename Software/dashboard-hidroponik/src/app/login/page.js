'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi loading 1 detik sebelum masuk dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e0e3e5] p-8 md:p-10">
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 bg-[#10b981] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-[#10b981]/20">
            <Activity size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight mb-2">AeroGrow Pro</h1>
          <p className="text-sm text-[#565e74] font-medium">Precision DFT Telemetry System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#565e74] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bbcabf] w-5 h-5" />
              <input 
                type="email" 
                required
                defaultValue="Hidroponik"
                className="w-full bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all text-[#191c1e]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#565e74] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bbcabf] w-5 h-5" />
              <input 
                type="password" 
                required
                defaultValue="123456"
                className="w-full bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all text-[#191c1e]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#10b981] hover:bg-[#006c49] text-white font-semibold rounded-xl py-3.5 mt-4 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>Secure Login</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#e0e3e5] pt-6">
          <p className="text-[10px] font-bold text-[#6c7a71] uppercase tracking-widest">
            Tugas Akhir Teknik Elektro
          </p>
        </div>

      </div>
    </div>
  );
}