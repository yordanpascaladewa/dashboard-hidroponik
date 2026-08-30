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
          if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI);
          }
          
          // 1. PAKSA nembak ke database 'hidroponik' (jaga-jaga Vercel nyasar ke DB 'test')
          const db = mongoose.connection.useDb("hidroponik");
          
          // 2. Hapus spasi yang nggak sengaja keketik di form login
          const safeUsername = credentials.username.trim();
          
          const user = await db.collection("users").findOne({ username: safeUsername });
          
          if (!user) throw new Error("Akun tidak ditemukan!");

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