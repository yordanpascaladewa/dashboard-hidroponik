import './globals.css';
import Providers from '@/components/Provider';

export const metadata = {
  title: 'AeroGrow Pro',
  description: 'Sistem Hidroponik Universal V5',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#121315] text-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}