import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Telemetry from '@/models/Telemetry'; // Pastikan T-nya besar!

// FUNGSI POST (Dari ESP32)
export async function POST(request) {
  try {
    const { suhu, ph, tds, usia, status } = await request.json();
    await connectMongoDB();
    await Telemetry.create({ suhu, ph, tds, usia, status });
    return NextResponse.json({ message: "Data hidroponik berhasil disimpan!" }, { status: 201 });
  } catch (error) {
    console.error("Error POST:", error);
    return NextResponse.json({ message: "Gagal menyimpan data", error: String(error) }, { status: 500 });
  }
}

// FUNGSI GET (Ke Dashboard Web)
export async function GET() {
  try {
    await connectMongoDB();
    
    // Tarik 50 data terbaru
    const data = await Telemetry.find().sort({ timestamp: -1 }).limit(50);
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error GET:", error);
    return NextResponse.json({ message: "Gagal mengambil data", error: String(error) }, { status: 500 });
  }
}