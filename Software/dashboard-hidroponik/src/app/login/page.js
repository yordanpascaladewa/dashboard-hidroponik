'use client';
import { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-emerald-500/5 p-10">
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">AeroGrow Pro</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">System Access Gateway</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Input ID/Email */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">
              OPERATOR ID / EMAIL
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-medium text-slate-700"
                placeholder="Enter your credentials"
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                SECURITY KEY
              </label>
              <button type="button" className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">
                Forgot key?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-medium text-slate-700"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-3 px-1">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 transition-all checked:bg-emerald-500 checked:border-emerald-500" 
                id="remember" 
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <label htmlFor="remember" className="text-sm text-slate-500 font-medium cursor-pointer">Maintain active session</label>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] mt-2">
            Initialize Connection
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            NODE: US-EAST-1 • v2.4.1-stable
          </p>
        </div>
      </div>
    </div>
  );
}