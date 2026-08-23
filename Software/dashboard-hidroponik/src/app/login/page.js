'use client';
import React from 'react';
import { X, Sprout } from 'lucide-react';

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
      // TODO: Ganti URL di bawah dengan path foto background lu (misal: '/bg-panel.jpg')
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=2000&auto=format&fit=crop')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Modal Container: Diperkecil dikit max-w nya karena isinya lebih padat/sedikit */}
      <div className="relative z-10 w-full max-w-[480px] bg-black sm:rounded-[2rem] p-6 sm:p-10 min-h-screen sm:min-h-0 flex flex-col shadow-2xl border border-white/10">
        
        {/* Header: Tombol Close & Logo */}
        <div className="flex items-center justify-between mb-10 w-full">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white">
            <X size={20} />
          </button>
          
          <div className="flex-1 flex justify-center mr-8">
            <Sprout size={36} className="text-[#10B981]" />
          </div>
        </div>

        {/* Form Content Wrapper */}
        <div className="w-full max-w-[320px] mx-auto flex flex-col pb-8">
          <h1 className="text-[32px] font-bold text-white mb-8 tracking-tight">
            Sign in to AeroGrow
          </h1>
          
          {/* Form Input (Murni Username & Password) */}
          <form className="flex flex-col gap-5">
            <div>
              <input 
                type="text" 
                id="username"
                placeholder="Username" 
                className="w-full bg-transparent border border-gray-600 rounded p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors"
                required
              />
            </div>
            
            <div>
              <input 
                type="password" 
                id="password"
                placeholder="Password" 
                className="w-full bg-transparent border border-gray-600 rounded p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors"
                required
              />
            </div>
            
            {/* Tombol Login */}
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
  );
}