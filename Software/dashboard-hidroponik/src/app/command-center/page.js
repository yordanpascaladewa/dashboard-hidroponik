'use client';
import React, { useState } from 'react';
import { 
  Power, Zap, Lightbulb, Wind, 
  Settings2, AlertCircle, RefreshCw, 
  Activity, Droplets, ChevronRight
} from 'lucide-react';

export default function CommandCenterPage() {
  const [actuators, setActuators] = useState({
    pump: false,
    lights: false,
    doser: false,
    fan: false
  });

  const toggleActuator = (key) => {
    setActuators(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] p-8 ml-64">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">HUB KONTROL MANUAL</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pusat Komando</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
          <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SISTEM SIAGA</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Manual Actuator Controls */}
        <div className="col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Settings2 size={20} />
              </div>
              <h2 className="font-bold text-lg text-slate-800">Kontrol Aktuator Manual</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ControlCard 
                label="Pompa Air Utama" 
                subtext="Sirkulasi Nutrisi"
                icon={<Activity size={24} />}
                isActive={actuators.pump}
                onToggle={() => toggleActuator('pump')}
              />
              <ControlCard 
                label="Lampu Pertumbuhan" 
                subtext="Spektrum Penuh LED"
                icon={<Lightbulb size={24} />}
                isActive={actuators.lights}
                onToggle={() => toggleActuator('lights')}
              />
              <ControlCard 
                label="Doser Nutrisi A/B" 
                subtext="Injeksi Otomatis"
                icon={<Droplets size={24} />}
                isActive={actuators.doser}
                onToggle={() => toggleActuator('doser')}
              />
              <ControlCard 
                label="Kipas Ventilasi" 
                subtext="Kontrol Iklim Mikro"
                icon={<Wind size={24} />}
                isActive={actuators.fan}
                onToggle={() => toggleActuator('fan')}
              />
            </div>
          </section>

          {/* Real-time Hardware Status */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Zap size={20} />
              </div>
              <h2 className="font-bold text-lg text-slate-800">Status Perangkat Keras Waktu Nyata</h2>
            </div>
            
            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="text-left px-8 py-4 font-bold">Komponen</th>
                    <th className="text-left px-8 py-4 font-bold">Status</th>
                    <th className="text-right px-8 py-4 font-bold">Beban Listrik</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  <StatusRow label="Pompa Air Utama" icon={<Activity size={18}/>} status={actuators.pump ? 'AKTIF' : 'MATI'} load={actuators.pump ? '12.4 W' : '0.0 W'} />
                  <StatusRow label="Array LED Spektrum" icon={<Lightbulb size={18}/>} status={actuators.lights ? 'AKTIF' : 'MATI'} load={actuators.lights ? '45.0 W' : '0.0 W'} />
                  <StatusRow label="Modul Doser A/B" icon={<Droplets size={18}/>} status={actuators.doser ? 'AKTIF' : 'SIAGA'} load={actuators.doser ? '5.2 W' : '0.0 W'} />
                  <StatusRow label="Sistem Ventilasi" icon={<Wind size={18}/>} status={actuators.fan ? 'AKTIF' : 'MATI'} load={actuators.fan ? '8.2 W' : '0.0 W'} />
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          {/* Automation Settings */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <RefreshCw size={20} />
              </div>
              <h2 className="font-bold text-lg text-slate-800">Pengaturan Otomatisasi</h2>
            </div>
            
            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
              <InputGroup label="TARGET PH" unit="pH" defaultValue="6.0" />
              <InputGroup label="TARGET TDS" unit="ppm" defaultValue="1000" />
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2">
                Simpan & Terapkan
              </button>
            </div>
          </section>

          {/* Emergency Override */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <AlertCircle size={20} />
              </div>
              <h2 className="font-bold text-lg text-red-600">Penggantian Sistem</h2>
            </div>
            
            <div className="bg-white rounded-[32px] border border-red-100 p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Power size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Berhenti Darurat</h3>
              <p className="text-xs text-slate-400 mb-8 px-4 leading-relaxed">
                Memutus aliran listrik ke semua aktuator dan memaksa sistem masuk ke mode aman manual.
              </p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-3 uppercase tracking-wider text-[10px]">
                AKTIFKAN OVERRIDE
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ControlCard({ label, subtext, icon, isActive, onToggle }) {
  return (
    <div className={`p-8 rounded-[32px] border transition-all duration-300 cursor-pointer group ${isActive ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/20' : 'bg-white border-slate-100 text-slate-800 hover:border-emerald-200'}`} onClick={onToggle}>
      <div className="flex justify-between items-start mb-10">
        <div className={`p-3 rounded-2xl transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-50 text-slate-400 group-hover:text-emerald-500'}`}>
          {icon}
        </div>
        <div className={`w-12 h-6 rounded-full relative transition-colors ${isActive ? 'bg-emerald-400' : 'bg-slate-100'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${isActive ? 'bg-white right-1' : 'bg-slate-300 left-1'}`} />
        </div>
      </div>
      <h3 className="font-bold text-lg mb-1">{label}</h3>
      <p className={`text-xs ${isActive ? 'text-white/70' : 'text-slate-400'}`}>{subtext}</p>
    </div>
  );
}

function StatusRow({ label, icon, status, load }) {
  const isAktif = status === 'AKTIF';
  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
      <td className="px-8 py-6">
        <div className="flex items-center gap-3 text-slate-600 font-bold">
          <span className="text-slate-300">{icon}</span>
          <span>{label}</span>
        </div>
      </td>
      <td className="px-8 py-6">
        <span className={`px-4 py-1 rounded-lg text-[10px] font-bold ${isAktif ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
          {status}
        </span>
      </td>
      <td className="px-8 py-6 text-right font-black text-slate-400">{load}</td>
    </tr>
  );
}

function InputGroup({ label, unit, defaultValue }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 pl-1">{label}</label>
      <div className="relative group">
        <input 
          type="text" 
          defaultValue={defaultValue}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-right font-black text-slate-800 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all"
        />
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300 uppercase">{unit}</span>
      </div>
    </div>
  );
}