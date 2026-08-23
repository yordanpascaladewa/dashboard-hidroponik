'use client';
import React, { useState } from 'react';
import { X, Sprout, LogIn, Cpu } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import { useRouter } from 'next/navigation'; // <-- Import router untuk navigasi pindah halaman

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default function LoginPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter(); // <-- Inisialisasi router

  // Fungsi untuk menangani saat tombol 'Log in' di pop-up dipencet
  const handleLoginSubmit = (e) => {
    e.preventDefault(); // Mencegah halaman ke-refresh
    
    // (Opsional: Nanti lu bisa tambahin logika ngecek password di sini)
    
    // Langsung pindah ke halaman dashboard
    router.push('/dashboard');
  };

  return (
    <div 
      className={`min-h-screen relative bg-cover bg-center overflow-x-hidden flex flex-col ${montserrat.className}`}
      // TODO: Ganti URL di bawah dengan path foto background alat hidroponik lu
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=2000&auto=format&fit=crop')" }}
    >
      {/* Dark Overlay */}
      <div className={`absolute inset-0 transition-all duration-500 ${isLoginOpen ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/60'}`}></div>

      {/* ========================================== */}
      {/* 1. HEADER (LOGO DI TENGAH ATAS)              */}
      {/* ========================================== */}
      {/* Menggunakan absolute agar tidak menggeser titik tengah dari konten utama */}
      <header className="absolute top-0 w-full flex justify-center items-center py-8 z-20">
        <div className="flex items-center gap-2">
          <Sprout size={32} className="text-[#10B981]" />
          <span className="text-2xl font-bold text-white tracking-tight">AeroGrow<span className="text-[#10B981]">Pro</span></span>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. LANDING PAGE CONTENT (TENTANG SISTEM)     */}
      {/* ========================================== */}
      {!isLoginOpen && (
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in duration-700">
          
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-[#10B981] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
              Tugas Akhir Teknik Elektro UNDIP
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              Sistem Hidroponik <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3b82f6]">Universal</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed mb-10 font-light">
              Dikembangkan oleh Raditya Jordy Anargya R. Sistem ini memadukan perangkat keras IoT cerdas dengan pemrosesan sinyal tingkat lanjut untuk mengotomatisasi nutrisi dan pemantauan tanaman hidroponik secara *real-time*.
            </p>
            
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="bg-[#10B981] hover:bg-[#059669] text-black font-bold py-3.5 px-8 rounded-full flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <LogIn size={20} /> Masuk ke Dashboard
            </button>
            
          </div>

        </main>
      )}

      {/* ========================================== */}
      {/* 3. TECH STACK BADGES (CENTER BAWAH)          */}
      {/* ========================================== */}
      {!isLoginOpen && (
        <div className="relative z-10 w-full flex flex-wrap justify-center items-center gap-3 px-6 pb-10 animate-in fade-in duration-700">
          
          <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
            <svg viewBox="0 0 256 256" className="w-5 h-5" fill="black"><circle cx="128" cy="128" r="128"/><path d="M168 180l-60-80v80H90V76h20l60 80V76h18v104z" fill="white"/></svg>
            <span className="text-[13px] font-semibold text-gray-800">Next.js</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-5 h-5" />
            <span className="text-[13px] font-semibold text-gray-800">React</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-5 h-5" />
            <span className="text-[13px] font-semibold text-gray-800">Tailwind CSS</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-5 h-5" />
            <span className="text-[13px] font-semibold text-gray-800">MongoDB</span>
          </div>

          <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
            <Cpu size={18} className="text-gray-800" />
            <span className="text-[13px] font-semibold text-gray-800">ESP32</span>
          </div>

          <div className="flex items-center gap-2 bg-[#f4f4f5] px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-default">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" className="w-5 h-5" />
            <span className="text-[13px] font-semibold text-gray-800">C++</span>
          </div>
          
        </div>
      )}

      {/* ========================================== */}
      {/* 4. MODAL POP-UP LOGIN                        */}
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
              
              {/* Tambahkan onSubmit memanggil handleLoginSubmit */}
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
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