import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const db = mongoose.connection.useDb("hidroponik");
    // Asumsi nama collection database lu adalah 'telemetries'
    const collection = db.collection('telemetries'); 

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'realtime';

    // Jika mode Live/Realtime, cukup ambil 20 data terakhir
    if (range === 'realtime') {
      const data = await collection.find({}).sort({ _id: -1 }).limit(20).toArray();
      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    // Jika mode 24H, 7D, 30D, hitung batas waktunya
    const now = new Date();
    let pastDate = new Date();
    
    if (range === '24h') pastDate.setHours(now.getHours() - 24);
    else if (range === '7d') pastDate.setDate(now.getDate() - 7);
    else if (range === '30d') pastDate.setDate(now.getDate() - 30);

    const query = {
      $or: [
        { timestamp: { $gte: pastDate } },
        { timestamp: { $gte: pastDate.toISOString() } }
      ]
    };

    // Trik Cerdas: Gunakan $sample agar MongoDB otomatis memilih 100 titik data 
    // yang tersebar rata di rentang waktu tersebut biar grafik tidak berat/ngelag
    const data = await collection.aggregate([
      { $match: query },
      { $sample: { size: 100 } },
      { $sort: { timestamp: -1 } } 
    ]).toArray();

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error) {
    console.error("Error API Telemetry:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const db = mongoose.connection.useDb("hidroponik");
    const collection = db.collection('telemetries');

    body.timestamp = new Date(); 
    await collection.insertOne(body);

    return NextResponse.json({ success: true, message: "Data tersimpan" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}