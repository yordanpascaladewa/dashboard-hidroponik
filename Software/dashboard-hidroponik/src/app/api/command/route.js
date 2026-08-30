import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next"; // Import pengecek sesi dari NextAuth
import { authOptions } from "../auth/[...nextauth]/route"; // Panggil konfigurasi Auth lu

// 1. Endpoint GET: Dibaca oleh ESP32 & Website (TIDAK DIKUNCI)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('commands');

    let command = await collection.findOne({}, { sort: { _id: -1 } });

    if (!command) {
      command = { tanaman: "PAKCOY", usia_hari: 1, aktif: true };
    }

    return NextResponse.json(command, { status: 200 });
  } catch (error) {
    return NextResponse.json({ tanaman: "PAKCOY", usia_hari: 1, aktif: true }, { status: 200 });
  }
}

// 2. Endpoint POST: Menyimpan pilihan (DIKUNCI KHUSUS ADMIN)
export async function POST(request) {
  try {
    // --- BLOK KEAMANAN RBAC (ROLE-BASED ACCESS CONTROL) ---
    const session = await getServerSession(authOptions);

    // Jika yang request belum login, ATAU rolenya bukan admin, tolak mentah-mentah!
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses Ditolak! Hanya Administrator yang berhak mengubah konfigurasi komoditas." }, 
        { status: 403 }
      );
    }
    // --------------------------------------------------------

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