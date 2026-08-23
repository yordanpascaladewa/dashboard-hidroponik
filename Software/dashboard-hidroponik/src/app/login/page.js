'use client';
import React from 'react';

export default function LoginPage() {
  return (
    // Tambah p-4 atau p-6 disini biar di layar kecil/laptop ngga nempel ujung layar
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans antialiased p-6">
      
      {/* Container utama diperkecil dari max-w-6xl ke 5xl, dan tingginya diset ke 650px (sebelumnya 900px) */}
      <main className="flex flex-col md:flex-row w-full max-w-5xl min-h-[600px] md:h-[650px] bg-white overflow-hidden shadow-2xl rounded-2xl">
        
        {/* Bagian Kiri: Diubah proporsinya jadi w-1/2 biar seimbang sama form */}
        <section className="relative w-full md:w-1/2 text-white p-10 md:p-12 flex flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#1e2491_0%,#3b43c6_50%,#5e67ed_100%)]">
          
          {/* Decorative Pattern Overlay */}
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 100% 50%, transparent 20%, rgba(255,255,255,0.3) 21%, rgba(255,255,255,0.3) 34%, transparent 35%, transparent), radial-gradient(circle at 0% 50%, transparent 20%, rgba(255,255,255,0.3) 21%, rgba(255,255,255,0.3) 34%, transparent 35%, transparent)',
              backgroundSize: '400px 400px'
            }}
          ></div>
          
          {/* Top Content: Logo and Greeting */}
          <div className="relative z-10 flex flex-col gap-8 mt-4">
            {/* Brand Icon */}
            <svg className="text-white" fill="none" height="56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="56">
              <line x1="12" x2="12" y1="2" y2="22"></line>
              <line x1="2" x2="22" y1="12" y2="12"></line>
              <line x1="4.93" x2="19.07" y1="4.93" y2="19.07"></line>
              <line x1="4.93" x2="19.07" y1="19.07" y2="4.93"></line>
            </svg>
            <div>
              {/* Ukuran teks disesuaikan sedikit biar proporsional dengan tinggi baru */}
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                Hello<br/>SaleSkip! <span aria-label="waving hand" role="img">👋🏼</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-md leading-relaxed font-light">
                Skip repetitive and manual sales-marketing tasks. Get highly productive through automation and save tons of time!
              </p>
            </div>
          </div>
          
          {/* Bottom Content: Copyright */}
          <div className="relative z-10 text-blue-200 text-sm mt-8">
            © 2022 SaleSkip. All rights reserved.
          </div>
        </section>

        {/* Bagian Kanan (Form): Diubah jadi w-1/2 biar lebih lega */}
        <section className="w-full md:w-1/2 p-10 md:p-12 flex flex-col bg-white">
          
          {/* Header Branding - Margin bottom dikurangin biar form ngga terlalu ke bawah */}
          <header className="mb-12 mt-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">SaleSkip</h2>
          </header>
          
          {/* Login Form Container */}
          <div className="flex-grow flex flex-col justify-center w-full max-w-md mx-auto">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Don't have an account?{' '}
                <a className="text-gray-900 font-semibold underline decoration-2 underline-offset-2 hover:text-gray-700 transition-colors" href="#">
                  Create a new account now
                </a>
                , it's FREE! Takes less than a minute.
              </p>
            </div>
            
            <form className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="sr-only" htmlFor="email">Email address</label>
                <input 
                  autoComplete="email" 
                  className="block w-full border-0 border-b-2 border-gray-900 bg-gray-50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:border-gray-900 sm:text-sm font-medium transition-colors outline-none" 
                  id="email" 
                  name="email" 
                  placeholder="Email address" 
                  required 
                  type="email" 
                  defaultValue="hisalim.ux@gmail.com"
                />
              </div>
              
              {/* Password Input */}
              <div>
                <label className="sr-only" htmlFor="password">Password</label>
                <input 
                  autoComplete="current-password" 
                  className="block w-full border-0 border-b border-gray-300 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:border-gray-900 sm:text-sm transition-colors outline-none" 
                  id="password" 
                  name="password" 
                  placeholder="Password" 
                  required 
                  type="password" 
                />
              </div>
              
              {/* Login Buttons */}
              <div className="pt-6 space-y-3">
                <button 
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all" 
                  type="submit"
                >
                  Login Now
                </button>
                <button 
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all" 
                  type="button"
                >
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  Login with Google
                </button>
              </div>
            </form>
            
            {/* Forgot Password Link */}
            <div className="mt-8 text-center text-sm text-gray-500">
              Forget password? <a className="font-semibold text-gray-900 underline decoration-1 underline-offset-2 hover:text-gray-700 transition-colors" href="#">Click here</a>
            </div>
          </div>
          
        </section>
        
      </main>
    </div>
  );
}