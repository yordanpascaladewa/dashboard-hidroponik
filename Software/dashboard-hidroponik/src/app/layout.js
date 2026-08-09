export const metadata = {
  title: 'AeroGrow Pro - Telemetri',
  description: 'Sistem Monitoring dan Kontrol Nutrisi Hidroponik Real-time',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#121315] m-0 p-0 antialiased overflow-x-hidden">
        {/* Konten tiap halaman (Login, Dashboard, dll) akan masuk ke sini */}
        {children}
      </body>
    </html>
  );
}