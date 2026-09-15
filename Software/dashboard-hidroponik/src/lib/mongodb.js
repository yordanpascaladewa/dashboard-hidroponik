import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Berhasil connect ke MongoDB Atlas");
  } catch (error) {
    console.error("Error koneksi ke MongoDB: ", error);
  }
};

export default connectMongoDB;