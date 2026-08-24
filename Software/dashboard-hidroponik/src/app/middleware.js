import { NextResponse } from 'next/server';

export function middleware(request) {
  // Mengecek apakah pengunjung punya tiket/cookie "auth_session"
  const isAuthenticated = request.cookies.get('auth_session');
  const path = request.nextUrl.pathname;

  // JIKA BELUM LOGIN:
  // Cegah masuk ke halaman manapun selain halaman /login dan /api
  if (!isAuthenticated && !path.startsWith('/login') && !path.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // JIKA SUDAH LOGIN:
  // Kalau user iseng buka halaman /login lagi padahal udah masuk, tendang ke /dashboard
  if (isAuthenticated && path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika aman, biarkan lanjut buka halamannya
  return NextResponse.next();
}

// Config ini memastikan middleware mengecek semua halaman kecuali aset static/gambar bawaan nextjs
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};