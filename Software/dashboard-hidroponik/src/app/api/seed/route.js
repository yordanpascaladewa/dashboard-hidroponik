import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Karena clientPromise langsung menghasilkan objek database
    const db = await clientPromise;
    const collection = db.collection('users');

    // Cek apakah akun sudah ada biar tidak dobel
    const exist = await collection.findOne({ username: 'admin_kebun' });
    if (exist) {
      return NextResponse.json({ message: "Akun sudah pernah dibuat sebelumnya!" });
    }

    // Enkripsi password "rahasia123" pakai bcrypt
    const hashedPassword = await bcrypt.hash('rahasia123', 10);

    // Masukkan 2 akun sekaligus ke MongoDB
    await collection.insertMany([
      { 
        username: 'admin_kebun', 
        password: hashedPassword, 
        role: 'admin' 
      },
      { 
        username: 'petani_harian', 
        password: hashedPassword, 
        role: 'user' 
      }
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Berhasil! Akun Admin dan User sudah masuk ke database." 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}