import './globals.css';
import { Inter } from 'next/font/google';

// Mengatur font bawaan (opsional, biar rapi)
const inter = Inter({ subsets: ['latin'] });

// Meta tags untuk judul web di tab browser lu
export const metadata = {
  title: 'AeroGrow Pro - Telemetri DFT',
  description: 'Dashboard Sistem Fertigasi Hidroponik Otomatis Berbasis IoT',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* children di sini bakal langsung nampilin isi dari page.js secara full tanpa gangguan sidebar */}
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}