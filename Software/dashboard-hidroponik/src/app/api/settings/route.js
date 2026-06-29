import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongodb';
import Settings from '../../../models/Settings';

// Memaksa Vercel agar TIDAK melakukan caching pada endpoint IoT ini
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    await connectMongoDB();
    let config = await Settings.findOne({ settingId: 'GLOBAL_CONFIG' });
    if (!config) {
      config = await Settings.create({ targetTanaman: 'SELADA', targetHari: 30 });
    }
    
    // Tambahkan header khusus agar browser dan Vercel CDN selalu mengirim data terbaru
    const response = NextResponse.json(config, { status: 200 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (error) {
    console.error("Error GET Settings:", error);
    return NextResponse.json({ message: "Gagal mengambil setting" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json(); 
    await connectMongoDB();
    
    const updatedConfig = await Settings.findOneAndUpdate(
      { settingId: 'GLOBAL_CONFIG' },
      { $set: { ...body, updatedAt: Date.now() } },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ message: "Berhasil", data: updatedConfig }, { status: 200 });
  } catch (error) {
    console.error("Error POST Settings:", error);
    return NextResponse.json({ message: "Gagal update" }, { status: 500 });
  }
}