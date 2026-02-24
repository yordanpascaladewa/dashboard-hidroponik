import { Poppins } from "next/font/google";
import "./globals.css";

// Setup font Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Dashboard Hidroponik",
  description: "Sistem Fertigasi Pintar Multi-Komoditas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${poppins.className} bg-slate-50 text-slate-800`}>
        {children}
      </body>
    </html>
  );
}