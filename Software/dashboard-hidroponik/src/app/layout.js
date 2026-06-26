import { Inter } from 'next/font/google';
import './globals.css'; // Ini sekarang bakal dibaca oleh Next.js!

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AeroGrow Pro',
  description: 'Precision DFT Telemetry System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}