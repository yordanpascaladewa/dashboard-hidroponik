import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongodb';
import Telemetry from '../../../models/Telemetry';

// Inisialisasi memori global untuk antrean command (Remote Control)
if (typeof global.pendingCommand === 'undefined') {
  global.pendingCommand = null;
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store'; 

export async function GET() {
  try {
    await connectMongoDB();
    const data = await Telemetry.find().sort({ _id: -1 }).limit(15);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil data telemetri", error: String(error) }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Menangkap data secara komprehensif dari payload ESP32
    const { 
      suhu, 
      ph, 
      tds, 
      voltaseBaterai, 
      energiSolar,
      usia_hari,
      tanaman,
      raw_volt_ph,
      raw_volt_tds,
      raw_adc_ph,
      raw_adc_tds
    } = body;
    
    await connectMongoDB();
    
    // Menyimpan data lengkap ke MongoDB
    await Telemetry.create({ 
      suhu, 
      ph, 
      tds, 
      voltaseBaterai, 
      energiSolar,
      usia_hari,
      tanaman,
      raw_volt_ph,
      raw_volt_tds,
      raw_adc_ph,
      raw_adc_tds
    });

    // ==========================================
    // LOGIKA REMOTE CONTROL UNTUK ESP32
    // ==========================================
    // Cek apakah ada command ngantre dari Dashboard Web
    const commandData = global.pendingCommand 
      ? global.pendingCommand 
      : { command: "NONE", tanaman: "STANDBY", usia: 0 };
    
    // Hapus command dari antrean setelah dibaca supaya tidak tereksekusi berkali-kali
    if (global.pendingCommand) {
      global.pendingCommand = null; 
    }

    // Kembalikan response JSON ke ESP32. 
    // Dibuat ringan (hanya command) agar memori StaticJsonDocument<256> di ESP32 tidak over-limit
    return NextResponse.json(
      { 
        status: 'success',
        command: commandData.command,
        tanaman: commandData.tanaman,
        usia: commandData.usia
      }, 
      { status: 201 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menyimpan data", error: String(error) }, 
      { status: 500 }
    );
  }
}