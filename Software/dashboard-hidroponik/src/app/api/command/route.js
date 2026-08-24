import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// 1. Endpoint GET: Dibaca oleh ESP32 & Website untuk mengambil pengaturan tanaman terakhir dari MongoDB
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // Menggunakan database default dari connection string URI
    const collection = db.collection('commands');

    // Ambil dokumen perintah/setting terakhir yang disimpan
    let command = await collection.findOne({}, { sort: { _id: -1 } });

    if (!command) {
      // Nilai default jika database MongoDB masih kosong
      command = { tanaman: "PAKCOY", usia_hari: 1, aktif: true };
    }

    return NextResponse.json(command, { status: 200 });
  } catch (error) {
    // Fallback aman jika koneksi database ada kendala
    return NextResponse.json({ tanaman: "PAKCOY", usia_hari: 1, aktif: true }, { status: 200 });
  }
}

// 2. Endpoint POST: Menyimpan pilihan tanaman & umur dari Website langsung ke MongoDB Atlas
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('commands');

    const newCommand = {
      tanaman: body.tanaman || "PAKCOY",
      usia_hari: parseInt(body.usia_hari) || 1,
      aktif: body.aktif ?? true,
      timestamp: new Date()
    };

    // Masukkan data baru ke collection 'commands' di MongoDB
    await collection.insertOne(newCommand);

    return NextResponse.json({ 
      success: true, 
      message: "Perintah berhasil disimpan secara permanen di MongoDB", 
      data: newCommand 
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}