"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false); // State buat Dark Mode
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Sistem verifikasi sederhana buat demo Tugas Akhir
    if (username === "admin" && password === "admin123") {
      router.push("/dashboard");
    } else {
      setError("Username atau password salah bro!");
    }
  };

  return (
    // Wrapper utama buat nerapin class "dark"
    <div className={isDark ? "dark" : ""}>
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-300">
        
        {/* Tombol Toggle Dark/Light Mode di Pojok Kanan Atas */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-md hover:scale-110 transition-transform backdrop-blur-sm border border-slate-200 dark:border-slate-700"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 w-full max-w-md transform transition-all">
          
          {/* Header Logo & Judul */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-300">
              Fertigasi Pintar
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
              Sistem Hidroponik Adaptif Multi-Komoditas
            </p>
          </div>

          {/* Form Login */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 p-3 rounded-xl text-sm font-semibold text-center border border-red-100 dark:border-red-800/50 animate-pulse">
                ⚠️ {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                // Bagian text-slate-900 dan placeholder-slate-400 ini yang bikin tulisan jadi keliatan jelas!
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all font-medium"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
            >
              Masuk ke Dashboard
            </button>
          </form>

          {/* Footer Nama */}
          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
              TUGAS AKHIR © 2026<br/>
              Yordan Pascaladewa<br/>
              Raditya Jordy Anargya Rizki<br/>
              Farras Mahdyan Indarto<br/>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}