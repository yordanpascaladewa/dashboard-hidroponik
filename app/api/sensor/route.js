import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sensor from '@/models/Sensor';

export async function GET() {
  await connectDB();
  try {
    // Ambil 20 data terbaru, urutkan dari yang paling lama ke baru untuk grafik
    const data = await Sensor.find({}).sort({ timestamp: -1 }).limit(20);
    const sortedData = data.sort((a, b) => a.timestamp - b.timestamp);
    return NextResponse.json({ success: true, data: sortedData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const sensorData = await Sensor.create(body);
    return NextResponse.json({ success: true, data: sensorData }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}