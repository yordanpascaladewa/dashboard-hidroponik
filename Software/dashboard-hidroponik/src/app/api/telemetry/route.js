import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Telemetry from '@/models/Telemetry';

// FUNGSI POST: Untuk menerima data dari hardware ESP32
export async function POST(request) {
  try {
    // Nangkap data JSON yang dikirim dari ESP32
    const { suhu, ph, tds, usia, status } = await request.json();
    
    // Buka koneksi ke database
    await connectMongoDB();
    
    // Simpan data ke MongoDB pakai schema yang udah kita benerin tadi
    await Telemetry.create({ suhu, ph, tds, usia, status });
    
    return NextResponse.json({ message: "Data hidroponik berhasil disimpan!" }, { status: 201 });
  } catch (error) {
    console.error("Error POST:", error);
    return NextResponse.json({ message: "Gagal menyimpan data", error: error.message }, { status: 500 });
  }
}

// FUNGSI GET: Untuk narik data ke dashboard website lu (misal buat nampilin grafik/tabel)
export async function GET() {
  try {
    await connectMongoDB();
    
    // Ambil 50 data terbaru dari database, diurutkan dari yang paling baru
    const data = await Telemetry.find().sort({ timestamp: -1 }).limit(50);
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error GET:", error);
    return NextResponse.json({ message: "Gagal mengambil data", error: error.message }, { status: 500 });
  }
}