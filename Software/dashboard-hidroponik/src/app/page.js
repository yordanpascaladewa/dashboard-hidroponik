import { redirect } from 'next/navigation';

export default function Home() {
  // Langsung arahkan user yang membuka web ke halaman login
  redirect('/login');
}