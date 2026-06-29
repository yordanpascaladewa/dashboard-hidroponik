import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    // Mencegah pembuatan koneksi baru jika sudah terhubung (penting untuk Vercel)
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }
    
    // Pastikan MONGODB_URI sudah dipasang di Vercel Environment Variables
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Berhasil connect ke MongoDB Atlas");
  } catch (error) {
    console.error("Error koneksi ke MongoDB: ", error);
  }
};

export default connectMongoDB;