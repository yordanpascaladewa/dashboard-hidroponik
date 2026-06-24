import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    // Biar gak bikin koneksi baru terus-terusan kalau udah nyambung
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }
    
    // Pastikan di Vercel bagian Environment Variables udah ada MONGODB_URI
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Berhasil connect ke MongoDB Atlas");
  } catch (error) {
    console.log("Error koneksi ke MongoDB: ", error);
  }
};

export default connectMongoDB;