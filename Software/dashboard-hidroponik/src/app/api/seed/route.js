import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const db = await clientPromise;
    const collection = db.collection('users');

    const exist = await collection.findOne({ username: 'admin_kebun' });
    if (exist) {
      return NextResponse.json({ message: "Akun sudah pernah dibuat sebelumnya!" });
    }

    const hashedPassword = await bcrypt.hash('rahasia123', 10);

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