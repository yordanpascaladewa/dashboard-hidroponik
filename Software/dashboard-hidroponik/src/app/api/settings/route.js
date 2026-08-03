import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongodb';
import Settings from '../../../models/Settings';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    await connectMongoDB();
    let config = await Settings.findOne({ settingId: 'GLOBAL_CONFIG' });
    
    // Kalau belum ada data di MongoDB, bikin default-nya sesuai rancangan sistem
    if (!config) {
      config = await Settings.create({ 
        settingId: 'GLOBAL_CONFIG',
        isPlantingActive: false,
        komoditas: 'Pakcoy', 
        umurBibit: 1 
      });
    }
    
    const response = NextResponse.json(config, { status: 200 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (error) {
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
    return NextResponse.json({ message: "Gagal update" }, { status: 500 });
  }
}