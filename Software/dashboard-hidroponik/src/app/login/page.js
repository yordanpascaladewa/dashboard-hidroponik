'use client';
import React, { useState } from 'react';
import { X, Sprout, LogIn, Cpu } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import { useRouter } from 'next/navigation';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default function LoginPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden flex flex-col bg-[#121315] ${montserrat.className}`}>
      
      {/* Overlay gelap cuma muncul pas modal pop-up kebuka */}
      {isLoginOpen && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300"></div>
      )}

      {/* ========================================== */}
      {/* 1. HEADER (LOGO DI TENGAH ATAS)              */}
      {/* ========================================== */}
      <header className="absolute top-0 w-full flex justify-center items-center py-8 z-20">
        <div className="flex items-center gap-3">
          <Sprout size={32} className="text-[#10B981]" />
          <span className="text-2xl font-bold text-white tracking-tight">AeroGrow<span className="text-[#10B981]">Pro</span></span>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. LANDING PAGE CONTENT                      */}
      {/* ========================================== */}
      {!isLoginOpen && (
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in duration-700">
          
          <div className="max-w-4xl mx-auto flex flex-col items-center mt-24">
            
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1f2021] border border-white/10 text-[#10B981] text-xs font-bold tracking-widest uppercase mb-8 shadow-lg">
              Tugas Akhir Teknik Elektro UNDIP
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              Sistem Hidroponik <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3b82f6]">Universal</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10 font-light">
              Dikembangkan oleh mahasiswa Teknik Elektro Universitas Diponegoro
            </p>
            
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="bg-[#10B981] hover:bg-[#059669] text-[#0d0e0f] font-bold py-4 px-10 rounded-full flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <LogIn size={20} /> Masuk ke Dashboard
            </button>
            
          </div>

        </main>
      )}

      {/* ========================================== */}
      {/* 3. TECH STACK BADGES (THEMA DARK)            */}
      {/* ========================================== */}
      {!isLoginOpen && (
        <div className="relative z-10 w-full flex flex-wrap justify-center items-center gap-4 px-6 pb-12 animate-in fade-in duration-700 mt-auto">
          
          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-5 py-2.5 rounded-full shadow-lg hover:border-white/20 transition-colors cursor-default">
            {/* Logo Next.js diubah fill-nya jadi putih biar keliatan di background gelap */}
            <svg viewBox="0 0 256 256" className="w-5 h-5" fill="white">
              <circle cx="128" cy="128" r="128" fill="transparent" stroke="white" strokeWidth="10"/>
              <path d="M168 180l-60-80v80H90V76h20l60 80V76h18v104z" fill="white"/>
            </svg>
            <span className="text-[13px] font-bold text-slate-200">Next.js</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-5 py-2.5 rounded-full shadow-lg hover:border-white/20 transition-colors cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-5 h-5" />
            <span className="text-[13px] font-bold text-slate-200">React</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-5 py-2.5 rounded-full shadow-lg hover:border-white/20 transition-colors cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-5 h-5" />
            <span className="text-[13px] font-bold text-slate-200">Tailwind CSS</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-5 py-2.5 rounded-full shadow-lg hover:border-white/20 transition-colors cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-5 h-5" />
            <span className="text-[13px] font-bold text-slate-200">MongoDB</span>
          </div>

          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-5 py-2.5 rounded-full shadow-lg hover:border-white/20 transition-colors cursor-default">
            <Cpu size={18} className="text-slate-200" />
            <span className="text-[13px] font-bold text-slate-200">ESP32</span>
          </div>

          <div className="flex items-center gap-2 bg-[#1f2021] border border-white/10 px-5 py-2.5 rounded-full shadow-lg hover:border-white/20 transition-colors cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" className="w-5 h-5" />
            <span className="text-[13px] font-bold text-slate-200">C++</span>
          </div>
          
        </div>
      )}

      {/* ========================================== */}
      {/* 4. MODAL POP-UP LOGIN                        */}
      {/* ========================================== */}
      {isLoginOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="w-full max-w-[420px] bg-[#1f2021] sm:rounded-[2rem] p-8 sm:p-10 flex flex-col shadow-2xl border border-white/10 relative">
            
            {/* Tombol Close */}
            <div className="absolute top-6 right-6">
              <button 
                onClick={() => setIsLoginOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Logo Sprout */}
            <div className="flex justify-center mb-8">
              <Sprout size={42} className="text-[#10B981]" />
            </div>

            <div className="w-full mx-auto flex flex-col pb-2">
              <h1 className="text-[28px] font-bold text-white mb-8 tracking-tight text-center">
                Sign in to AeroGrow
              </h1>
              
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                <div>
                  <input 
                    type="text" 
                    id="username"
                    placeholder="Username" 
                    className="w-full bg-[#121315] border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors font-medium"
                    required
                  />
                </div>
                
                <div>
                  <input 
                    type="password" 
                    id="password"
                    placeholder="Password" 
                    className="w-full bg-[#121315] border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors font-medium"
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-[#10B981] text-[#0d0e0f] py-4 mt-4 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
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