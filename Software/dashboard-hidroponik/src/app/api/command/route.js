import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; 

// 1. Endpoint GET: Dibaca oleh ESP32 (TIDAK DIKUNCI)
export async function GET() {
  try {
    // Bangun koneksi langsung menggunakan Mongoose (Bypass Error client.db)
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const db = mongoose.connection.useDb("hidroponik");
    const collection = db.collection('commands');

    let command = await collection.findOne({}, { sort: { _id: -1 } });

    if (!command) {
      command = { tanaman: "PAKCOY", usia_hari: 1, aktif: true, timestamp: new Date().toISOString() };
    }

    return NextResponse.json(command, { status: 200 });
  } catch (error) {
    console.error("Error GET Command:", error);
    return NextResponse.json({ tanaman: "PAKCOY", usia_hari: 1, aktif: true }, { status: 200 });
  }
}

// 2. Endpoint POST: Menyimpan pilihan dari Website (DIKUNCI KHUSUS ADMIN)
export async function POST(request) {
  try {
    // --- BLOK KEAMANAN RBAC (ROLE-BASED ACCESS CONTROL) ---
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses Ditolak! Hanya Administrator yang berhak mengubah konfigurasi komoditas." }, 
        { status: 403 }
      );
    }
    // --------------------------------------------------------

    const body = await request.json();
    
    // Bangun koneksi langsung menggunakan Mongoose (Bypass Error client.db)
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const db = mongoose.connection.useDb("hidroponik");
    const collection = db.collection('commands');

    const newCommand = {
      tanaman: body.tanaman || "PAKCOY",
      usia_hari: parseInt(body.usia_hari) || 1,
      aktif: body.aktif ?? true,
      timestamp: new Date().toISOString() // Simpan jadi teks biar ESP32 nggak bingung
    };

    await collection.insertOne(newCommand);

    return NextResponse.json({ 
      success: true, 
      message: "Perintah berhasil disimpan secara permanen di MongoDB", 
      data: newCommand 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error POST Command:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}