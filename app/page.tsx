import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect root to the login page so app opens directly to authentication
  redirect('/login');
}