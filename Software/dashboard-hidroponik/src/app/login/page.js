'use client';
import React from 'react';
import { X, Sprout } from 'lucide-react';

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
      // TODO: Ganti URL di bawah dengan path foto lu (misal: '/background-alat.jpg' kalo ditaruh di folder public)
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=2000&auto=format&fit=crop')" }}
    >
      {/* Dark Overlay: Biar fotonya gelap dan kotak loginnya stand-out */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Modal Container: Warna hitam solid ala X */}
      <div className="relative z-10 w-full max-w-[600px] bg-black sm:rounded-[2rem] p-4 sm:p-10 min-h-screen sm:min-h-0 flex flex-col shadow-2xl">
        
        {/* Header: Tombol Close & Logo */}
        <div className="flex items-center justify-between mb-8 w-full">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white">
            <X size={20} />
          </button>
          
          <div className="flex-1 flex justify-center mr-8"> {/* mr-8 buat ngimbangin lebar tombol X biar logo beneran di tengah */}
            <Sprout size={36} className="text-[#10B981]" />
          </div>
        </div>

        {/* Form Content Wrapper: Dibuat agak sempit di tengah biar persis UI X */}
        <div className="w-full max-w-[320px] mx-auto flex flex-col pb-6">
          <h1 className="text-[32px] font-bold text-white mb-8 tracking-tight">
            Sign in to AeroGrow
          </h1>
          
          {/* Social Login Buttons */}
          <button className="w-full flex items-center justify-center gap-3 bg-white text-black py-2.5 rounded-full font-bold mb-4 hover:bg-gray-200 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          
          <button className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-full font-bold mb-4 hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.73-.76 1.48.06 2.6.68 3.32 1.83-2.92 1.6-2.42 5.56.36 6.74-.69 1.72-1.52 3.42-2.49 4.36zm-3.66-14.2c.49-1.92-1.06-3.8-2.96-3.87-.58 2.05 1.25 3.96 2.96 3.87z"/>
            </svg>
            Sign in with Apple
          </button>

          {/* Divider "or" */}
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-3 text-white text-sm">or</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* Form Input */}
          <div className="mt-4 flex flex-col gap-6">
            <input 
              type="text" 
              placeholder="Phone, email, or username" 
              className="w-full bg-transparent border border-gray-600 rounded p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors"
            />
            
            <button className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
              Next
            </button>
            
            <button className="w-full bg-transparent text-white py-3 rounded-full font-bold border border-gray-500 hover:bg-white/10 transition-colors">
              Forgot password?
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-12 text-[#71767B] text-[15px]">
            Don't have an account?{' '}
            <a href="#" className="text-[#1d9bf0] hover:underline">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
}