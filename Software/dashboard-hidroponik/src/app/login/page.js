'use client';
import React, { useState } from 'react';
import { X, Sprout, LogIn, Cpu, Globe, Server } from 'lucide-react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default function LoginPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div 
      className={`min-h-screen relative bg-cover bg-center overflow-x-hidden flex flex-col ${montserrat.className}`}
      // TODO: Ganti URL di bawah dengan path foto background alat hidroponik lu
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=2000&auto=format&fit=crop')" }}
    >
      {/* Dark Overlay */}
      <div className={`absolute inset-0 transition-all duration-500 ${isLoginOpen ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/60'}`}></div>

      {/* ========================================== */}
      {/* 1. HEADER (LOGO & TOMBOL LOGIN ICON)         */}
      {/* ========================================== */}
      <header className="relative z-10 flex justify-between items-center w-full px-6 md:px-16 py-6">
        <div className="flex items-center gap-2">
          <Sprout size={28} className="text-[#10B981]" />
          <span className="text-xl font-bold text-white tracking-tight">AeroGrow<span className="text-[#10B981]">Pro</span></span>
        </div>
        
        {!isLoginOpen && (
          <button 
            onClick={() => setIsLoginOpen(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-full font-semibold transition-all backdrop-blur-md"
          >
            <LogIn size={18} />
            <span>Login Sistem</span>
          </button>
        )}
      </header>

      {/* ========================================== */}
      {/* 2. LANDING PAGE CONTENT (TENTANG SISTEM)     */}
      {/* ========================================== */}
      {!isLoginOpen && (
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in duration-700 pb-12">
          <div className="max-w-4xl mx-auto flex flex-col items-center mt-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#10B981] text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-md">
              Tugas Akhir Teknik Elektro UNDIP
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              Universal Hydroponic <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3b82f6]">System V5</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-12 font-light">
              Dikembangkan oleh Raditya Jordy Anargya R. Sistem ini memadukan perangkat keras IoT cerdas dengan pemrosesan sinyal tingkat lanjut untuk mengotomatisasi nutrisi dan pemantauan tanaman hidroponik secara *real-time*.
            </p>

            {/* Fitur Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
              <div className="flex flex-col items-center p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
                <Cpu size={32} className="text-[#10B981] mb-4" />
                <h3 className="text-white font-bold mb-2">ESP32 Dual-Core</h3>
                <p className="text-sm text-gray-400 font-medium">Multitasking stabil dengan FreeRTOS & filter ADC.</p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
                <Globe size={32} className="text-[#3b82f6] mb-4" />
                <h3 className="text-white font-bold mb-2">Next.js Dashboard</h3>
                <p className="text-sm text-gray-400 font-medium">Antarmuka web interaktif tanpa full-page reload.</p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
                <Server size={32} className="text-[#8b5cf6] mb-4" />
                <h3 className="text-white font-bold mb-2">MongoDB Atlas</h3>
                <p className="text-sm text-gray-400 font-medium">Penyimpanan telemetri yang aman dan terstruktur.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="bg-[#10B981] hover:bg-[#059669] text-black font-bold py-4 px-10 rounded-full flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <LogIn size={20} /> Masuk ke Dashboard
            </button>
          </div>

          {/* ========================================== */}
          {/* TECH STACK BADGES (DIUPDATE SESUAI PROJECT)  */}
          {/* ========================================== */}
          <div className="mt-20 md:mt-24 flex flex-wrap justify-center items-center gap-3 w-full">
            
            {/* Next.js */}
            <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
              <svg viewBox="0 0 256 256" className="w-5 h-5" fill="black"><circle cx="128" cy="128" r="128"/><path d="M168 180l-60-80v80H90V76h20l60 80V76h18v104z" fill="white"/></svg>
              <span className="text-[13px] font-semibold text-gray-800">Next.js</span>
            </div>
            
            {/* React */}
            <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-5 h-5" />
              <span className="text-[13px] font-semibold text-gray-800">React</span>
            </div>
            
            {/* Tailwind CSS */}
            <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-5 h-5" />
              <span className="text-[13px] font-semibold text-gray-800">Tailwind CSS</span>
            </div>
            
            {/* MongoDB Atlas */}
            <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-5 h-5" />
              <span className="text-[13px] font-semibold text-gray-800">MongoDB</span>
            </div>

            {/* ESP32 (Hardware) */}
            <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
              <Cpu size={18} className="text-gray-800" />
              <span className="text-[13px] font-semibold text-gray-800">ESP32</span>
            </div>

            {/* C++ (Firmware Language) */}
            <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" className="w-5 h-5" />
              <span className="text-[13px] font-semibold text-gray-800">C++</span>
            </div>
            
          </div>
        </main>
      )}

      {/* ========================================== */}
      {/* 3. MODAL POP-UP LOGIN                        */}
      {/* ========================================== */}
      {isLoginOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="w-full max-w-[480px] bg-black sm:rounded-[2rem] p-6 sm:p-10 flex flex-col shadow-2xl border border-white/10 relative">
            
            {/* Tombol Close */}
            <div className="flex items-center justify-between mb-10 w-full">
              <button 
                onClick={() => setIsLoginOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
              >
                <X size={20} />
              </button>
              
              <div className="flex-1 flex justify-center mr-8">
                <Sprout size={36} className="text-[#10B981]" />
              </div>
            </div>

            {/* Form Content Wrapper */}
            <div className="w-full max-w-[320px] mx-auto flex flex-col pb-8">
              <h1 className="text-[32px] font-bold text-white mb-8 tracking-tight text-center">
                Sign in to AeroGrow
              </h1>
              
              <form className="flex flex-col gap-5">
                <div>
                  <input 
                    type="text" 
                    id="username"
                    placeholder="Username" 
                    className="w-full bg-transparent border border-gray-600 rounded p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors font-medium"
                    required
                  />
                </div>
                
                <div>
                  <input 
                    type="password" 
                    id="password"
                    placeholder="Password" 
                    className="w-full bg-transparent border border-gray-600 rounded p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors font-medium"
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-white text-black py-3.5 mt-4 rounded-full font-bold hover:bg-gray-200 transition-colors text-[15px]"
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