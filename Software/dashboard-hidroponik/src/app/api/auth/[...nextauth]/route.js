import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          
          // Sistem cerdas pendeteksi format database Vercel
          // (Mengatasi error: "collection is not a function")
          const db = typeof client.db === 'function' ? client.db() : (client.db || client);
          
          const user = await db.collection("users").findOne({ username: credentials.username });
          
          if (!user) throw new Error("Akun tidak ditemukan!");

          // Cek password (bisa format Hash Bcrypt atau Plain Text)
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