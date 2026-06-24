import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Telemetry from '@/models/Telemetry';

export async function GET() {
  await connectToDatabase();
  const data = await Telemetry.findOne().sort({ timestamp: -1 });
  return NextResponse.json({ data });
}

export async function POST(request) {
  const body = await request.json();
  await connectToDatabase();
  const newData = await Telemetry.create(body);
  return NextResponse.json({ status: 'success', newData });
}