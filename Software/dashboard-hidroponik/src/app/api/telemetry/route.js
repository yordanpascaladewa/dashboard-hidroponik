import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongodb';
import Telemetry from '../../../models/Telemetry';

// Wajib ditambahkan agar Next.js tidak melakukan caching statis pada Vercel
export const dynamic = 'force-dynamic';

// =========================================================================
// 1. FUNGSI GET: Menyediakan data untuk Dashboard & Analytics Web
// =========================================================================
export async function GET() {
  try {
    await connectMongoDB();
    
    // Mengambil 15 data telemetri terbaru untuk kebutuhan grafik tren historis
    // Diurutkan berdasarkan _id descending (-1) agar data terbaru berada di indeks [0]
    const data = await Telemetry.find().sort({ _id: -1 }).limit(15);
    
    // Dibungkus dalam object dengan key 'data' sesuai kebutuhan komponen frontend
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error GET Telemetry:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data telemetri", error: String(error) }, 
      { status: 500 }
    );
  }
}

// =========================================================================
// 2. FUNGSI POST: Menerima & Menyimpan data kiriman dari ESP32
// =========================================================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { suhu, ph, tds, usia, status } = body;
    
    await connectMongoDB();
    
    // Membuat dokumen baru di collection telemetri MongoDB Atlas
    const newData = await Telemetry.create({ 
      suhu, 
      ph, 
      tds, 
      usia, 
      status 
    });
    
    return NextResponse.json(
      { status: 'success', newData }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error POST Telemetry:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan data telemetri", error: String(error) }, 
      { status: 500 }
    );
  }
}