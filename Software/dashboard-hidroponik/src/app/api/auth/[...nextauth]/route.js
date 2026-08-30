import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          // 1. Langsung pakai Mongoose (Bypass file lokal lib/mongodb yang error)
          if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI);
          }
          
          // 2. Ambil objek database asli (native db) dari Mongoose
          const db = mongoose.connection.db;
          
          // 3. Cari user di koleksi 'users'
          const user = await db.collection("users").findOne({ username: credentials.username });
          
          if (!user) throw new Error("Akun tidak ditemukan!");

          // 4. Cek password (bisa format Hash Bcrypt atau Teks Biasa)
          let isValid = false;
          if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            isValid = await bcrypt.compare(credentials.password, user.password);
          } else {
            isValid = (credentials.password === user.password);
          }

          if (!isValid) throw new Error("Password salah!");

          return { id: user._id.toString(), username: user.username, role: user.role };
        } catch (error) {
          console.error("Auth Error:", error.message);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "rahasia_skripsi_dft_2026",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };