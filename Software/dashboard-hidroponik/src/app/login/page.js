'use client';
import React, { useState, useEffect } from 'react';
import { X, Sprout, LogIn, Cpu, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Import fungsi login dari NextAuth

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default function LoginPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // STATE UNTUK CEK STATUS ONLINE/OFFLINE
  const [isOnline, setIsOnline] = useState(false);
  const [lastSync, setLastSync] = useState('--:--:--');

  // FUNGSI CEK STATUS REAL-TIME
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const latest = json.data[0];
          const dataTime = new Date(latest.timestamp).getTime();
          const currentTime = new Date().getTime();
          const diffMinutes = (currentTime - dataTime) / (1000 * 60);
          
          setIsOnline(diffMinutes <= 3);
          setLastSync(new Date(latest.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }));
        }
      } catch (error) {
        setIsOnline(false);
      }
    };
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // FUNGSI LOGIN TERINTEGRASI NEXTAUTH & MONGODB
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username dan Password wajib diisi!');
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (result.error) {
        setErrorMessage('Username atau Password salah!');
      } else {
        setErrorMessage('');
        router.push('/dashboard'); // Lempar ke dashboard jika sukses
        router.refresh();
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan pada sistem login.');
    }
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden flex flex-col bg-[#121315] ${montserrat.className}`}>
      
      {isLoginOpen && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300"></div>
      )}

      {/* 1. HEADER DENGAN STATUS INDICATOR */}
      <header className="absolute top-0 w-full flex justify-between items-center py-6 px-8 z-20">
        <div className="flex items-center gap-3">
          <Sprout size={32} className="text-[#10B981]" />
          <span className="text-2xl font-bold text-white tracking-tight">AeroGrow<span className="text-[#10B981]">Pro</span></span>
        </div>

        {/* STATUS PILL (Hanya muncul jika modal login tertutup) */}
        {!isLoginOpen && (
          <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-colors ${
            isOnline ? 'bg-[#1f2021] border-white/10' : 'bg-red-500/10 border-red-500/20'
          }`}>
            {isOnline ? <Wifi size={14} className="text-[#10B981]" /> : <WifiOff size={14} className="text-red-400" />}
            <span className={`text-xs font-bold uppercase tracking-widest ${isOnline ? 'text-slate-300' : 'text-red-400'}`}>
              {isOnline ? `ONLINE - ${lastSync}` : `OFFLINE - ${lastSync}`}
            </span>
          </div>
        )}
      </header>

      {/* 2. LANDING PAGE CONTENT */}
      {!isLoginOpen && (
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center mt-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1f2021] border border-white/10 text-[#10B981] text-xs font-bold tracking-widest uppercase mb-8 shadow-lg">
              Tugas Akhir Teknik Elektro Universitas Diponegoro 2026
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              Sistem Hidroponik <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3b82f6]">Universal</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10 font-light">
              Dikembangkan oleh mahasiswa Teknik Elektro Universitas Diponegoro
            </p>
            
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="bg-[#10B981] hover:bg-[#059669] text-[#0d0e0f] font-bold py-4 px-10 rounded-full flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <LogIn size={20} /> Login
            </button>
          </div>
        </main>
      )}

      {/* 3. TECH STACK BADGES */}
      {!isLoginOpen && (
        <div className="relative z-10 w-full flex flex-wrap justify-center items-center gap-3 px-6 pb-12 mt-auto">
          <div className="flex items-center gap-2.5 bg-[#1f2021] border border-white/10 px-4 py-2 rounded-full shadow-lg cursor-default">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5">
              <svg viewBox="0 0 180 180" className="w-full h-full" fill="black">
                <path d="M149.316 157.19L84.82 72.8H70.1V126.9H81.3V86.7L142.1 165.7C144.5 163.2 147 160.3 149.316 157.19ZM110 72.8H121.5V126.9H110V72.8Z"/>
              </svg>
            </div>
            <span className="text-[13px] font-bold text-slate-200">Next.js</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-4 py-2 rounded-full shadow-lg cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-5 h-5" />
            <span className="text-[13px] font-bold text-slate-200">React</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-4 py-2 rounded-full shadow-lg cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-5 h-5" />
            <span className="text-[13px] font-bold text-slate-200">Tailwind CSS</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-4 py-2 rounded-full shadow-lg cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-5 h-5" />
            <span className="text-[13px] font-bold text-slate-200">MongoDB</span>
          </div>

          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-4 py-2 rounded-full shadow-lg cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" className="w-5 h-5" />
            <span className="text-[13px] font-bold text-slate-200">JavaScript</span>
          </div>

          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-4 py-2 rounded-full shadow-lg cursor-default">
            <Cpu size={18} className="text-slate-200" />
            <span className="text-[13px] font-bold text-slate-200">ESP32</span>
          </div>

          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-4 py-2 rounded-full shadow-lg cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" className="w-5 h-5" />
            <span className="text-[13px] font-bold text-slate-200">C++</span>
          </div>
        </div>
      )}

      {/* 4. MODAL POP-UP LOGIN */}
      {isLoginOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="w-full max-w-[420px] bg-[#1f2021] sm:rounded-[2rem] p-8 sm:p-10 flex flex-col shadow-2xl border border-white/10 relative">
            
            <div className="absolute top-6 right-6">
              <button 
                onClick={() => { setIsLoginOpen(false); setErrorMessage(''); }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex justify-center mb-4">
              <Sprout size={42} className="text-[#10B981]" />
            </div>

            {/* STATUS DI DALAM MODAL LOGIN */}
            <div className="flex justify-center mb-6">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-[#10B981]' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                 <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-red-500'}`}></span>
                 <span className="text-[10px] font-mono font-bold tracking-widest">{isOnline ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}</span>
              </div>
            </div>

            <div className="w-full mx-auto flex flex-col pb-2">
              <h1 className="text-[28px] font-bold text-white mb-6 tracking-tight text-center">
                Sign in to AeroGrow
              </h1>
              
              {errorMessage && (
                <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-semibold animate-in fade-in duration-300">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div>
                  <input 
                    type="text" 
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username" 
                    className="w-full bg-[#121315] border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors font-medium"
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="w-full bg-[#121315] border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors font-medium"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#10B981] text-[#0d0e0f] py-4 mt-2 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
                >
                  Log in
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}