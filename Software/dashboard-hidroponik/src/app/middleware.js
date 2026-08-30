import { withAuth } from "next-auth/middleware";

// Menggunakan perlindungan otomatis dari NextAuth
export default withAuth({
  pages: {
    signIn: "/login", // Jika belum login, lempar ke sini
  },
});

// BAGIAN PALING PENTING UNTUK ESP32:
// Kita HANYA mengunci folder /dashboard.
// Jalur /api/telemetry dan /api/command DIBIARKAN TERBUKA LEBAR agar ESP32 tidak diblokir (Error POST -11).
export const config = {
  matcher: ["/dashboard/:path*"],
};