import { redirect } from 'next/navigation';

export default function HomePage() {
  // Langsung arahkan pengunjung ke halaman login
  redirect('/login');
}