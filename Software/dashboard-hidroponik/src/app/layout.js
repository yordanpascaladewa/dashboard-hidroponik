import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from './Sidebar'; // Memanggil komponen sidebar yang baru dibikin

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AeroGrow Pro - Telemetri',
  description: 'Sistem Fertigasi Hidroponik Otomatis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* flex digunakan untuk membagi layar jadi 2 kolom (kiri sidebar, kanan konten utama) */}
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex`}>
        
        {/* Memunculkan Sidebar di Kiri */}
        <Sidebar />
        
        {/* Konten Halaman Utama di Kanan (Dashboard, Analytics, dll) */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
      </body>
    </html>
  );
}