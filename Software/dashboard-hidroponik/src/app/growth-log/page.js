'use client';
import React from 'react';
import { 
  Calendar, Clock, Plus, Image as ImageIcon, 
  ChevronRight, BookOpen, Camera, CheckCircle2,
  TrendingUp, Leaf
} from 'lucide-react';

export default function GrowthLogPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FB] p-8 ml-64">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Growth Log</h1>
        <p className="text-slate-400 mt-1">Jurnal Digital & Dokumentasi Panen</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Timeline Section */}
        <div className="col-span-2 space-y-8">
          <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <h2 className="font-bold text-lg text-slate-800">Timeline Pertumbuhan</h2>
            </div>

            <div className="relative space-y-12 pl-8">
              {/* Vertical Line */}
              <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-slate-100" />
              
              <TimelineItem 
                week="Minggu 4" 
                title="Fase Berbunga" 
                desc="Nutrisi disesuaikan untuk memaksimalkan pembentukan bunga. Kelembaban diturunkan ke 45%." 
                isActive 
              />
              <TimelineItem 
                week="Minggu 2-3" 
                title="Fase Vegetatif" 
                desc="Pertumbuhan daun sangat cepat. Sistem akar sehat dan putih." 
              />
              <TimelineItem 
                week="Minggu 1" 
                title="Penyemaian" 
                desc="Benih mulai berkecambah. Lampu diset ke intensitas rendah." 
              />
            </div>
          </section>

          {/* Daily Logs */}
          <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <BookOpen size={20} />
                </div>
                <h2 className="font-bold text-lg text-slate-800">Catatan Harian</h2>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-xl hover:bg-emerald-100 transition-all">
                <Plus size={16} /> Tambah
              </button>
            </div>

            <div className="space-y-4">
              <LogCard 
                time="Hari ini, 08:30" 
                text="pH air sedikit naik ke 6.2. Menambahkan 5ml pH Down. Daun terlihat hijau pekat dan sehat." 
                isToday
              />
              <LogCard 
                time="Kemarin, 19:15" 
                text="Pengecekan rutin malam. Suhu ruangan stabil di 22°C. Semua pompa berfungsi normal." 
              />
            </div>
          </section>
        </div>

        {/* Sidebar Gallery & Stats */}
        <div className="space-y-8">
          <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Camera size={20} />
              </div>
              <h2 className="font-bold text-lg text-slate-800">Galeri Pertumbuhan</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-slate-200 rounded-2xl" />
              <div className="aspect-square bg-slate-100 rounded-2xl" />
              <div className="aspect-square bg-slate-50 rounded-2xl" />
              <button className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                <Plus size={24} />
              </button>
            </div>
          </section>

          <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="font-bold text-lg text-slate-800">Log Panen</h2>
            </div>
            
            <div className="space-y-4">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="text-left pb-4">Tanggal</th>
                    <th className="text-right pb-4">Hasil (kg)</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-600">
                  <tr className="border-b border-slate-50">
                    <td className="py-4">12 Okt</td>
                    <td className="py-4 text-right text-emerald-600">4.2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ week, title, desc, isActive }) {
  return (
    <div className="relative">
      <div className={`absolute -left-[37px] top-1 w-5 h-5 rounded-full border-4 border-white z-10 ${isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-slate-200'}`} />
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>{week}</p>
        <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function LogCard({ time, text, isToday }) {
  return (
    <div className={`p-6 rounded-[24px] border ${isToday ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50/50 border-slate-100'}`}>
      <span className={`text-[11px] font-bold ${isToday ? 'text-emerald-600' : 'text-slate-400'}`}>{time}</span>
      <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">{text}</p>
    </div>
  );
}