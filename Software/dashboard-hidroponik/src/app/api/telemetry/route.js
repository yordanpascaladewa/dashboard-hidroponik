import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongodb';
import Telemetry from '../../../models/Telemetry';

export const dynamic = 'force-dynamic';

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
    // Tambahkan voltaseBaterai dan energiSolar tangkapan dari firmware ESP32
    const { suhu, ph, tds, voltaseBaterai, energiSolar } = body;
    
    await connectMongoDB();
    
    const newData = await Telemetry.create({ 
      suhu, 
      ph, 
      tds, 
      voltaseBaterai, 
      energiSolar 
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