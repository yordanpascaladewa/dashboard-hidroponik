import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Telemetry from '@/models/Telemetry';

// FUNGSI POST: Menerima data dari ESP32
export async function POST(request) {
  try {
    const { suhu, ph, tds, usia, status } = await request.json();
    
    await connectMongoDB();
    await Telemetry.create({ suhu, ph, tds, usia, status });
    
    return NextResponse.json({ message: "Data hidroponik berhasil disimpan!" }, { status: 201 });
  } catch (error) {
    console.error("Error POST:", error);
    return NextResponse.json({ message: "Gagal menyimpan data", error: error.message }, { status: 500 });
  }
}

// FUNGSI GET: Menarik data untuk ditampilkan di dashboard lu
export async function GET() {
  try {
    await connectMongoDB();
    
    // Ambil 50 data terbaru dari database
    const data = await Telemetry.find().sort({ timestamp: -1 }).limit(50);
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error GET:", error);
    return NextResponse.json({ message: "Gagal mengambil data", error: error.message }, { status: 500 });
  }
}