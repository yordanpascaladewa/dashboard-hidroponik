import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongodb';
import Settings from '../../../models/Settings';

export const dynamic = 'force-dynamic';

// GET: Dipanggil oleh ESP32 untuk mengambil target terbaru
export async function GET() {
  try {
    await connectMongoDB();
    let config = await Settings.findOne({ settingId: 'GLOBAL_CONFIG' });
    if (!config) {
      config = await Settings.create({ targetTanaman: 'SELADA' });
    }
    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error("Error GET Settings:", error);
    return NextResponse.json({ message: "Gagal mengambil setting" }, { status: 500 });
  }
}

// POST: Dipanggil oleh Dashboard Web saat tombol "Sinkronisasi" diklik
export async function POST(request) {
  try {
    const { targetTanaman } = await request.json();
    await connectMongoDB();
    
    const updatedConfig = await Settings.findOneAndUpdate(
      { settingId: 'GLOBAL_CONFIG' },
      { targetTanaman, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ message: "Berhasil", data: updatedConfig }, { status: 200 });
  } catch (error) {
    console.error("Error POST Settings:", error);
    return NextResponse.json({ message: "Gagal update" }, { status: 500 });
  }
}