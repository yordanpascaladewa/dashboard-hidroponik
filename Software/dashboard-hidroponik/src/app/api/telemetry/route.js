import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongodb';
import Telemetry from '../../../models/Telemetry';

export const dynamic = 'force-dynamic';
// Tambahan wajib biar fungsi GET bener-bener narik data baru tiap detik (nggak kena cache)
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
    
    // Tangkap SEMUA data yang dikirim dari payload JSON ESP32
    const { 
      suhu, 
      ph, 
      tds, 
      voltaseBaterai, 
      energiSolar,
      usia_hari,
      tanaman,
      raw_volt_ph,
      raw_volt_tds
    } = body;
    
    await connectMongoDB();
    
    // Simpan semua data tersebut ke MongoDB sesuai laci schema yang baru
    const newData = await Telemetry.create({ 
      suhu, 
      ph, 
      tds, 
      voltaseBaterai, 
      energiSolar,
      usia_hari,
      tanaman,
      raw_volt_ph,
      raw_volt_tds
    });
    
    return NextResponse.json(
      { status: 'success', newData }, 
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menyimpan data", error: String(error) }, 
      { status: 500 }
    );
  }
}