'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';

export default function AuthNav() {
  const { user, isStaff, ready } = useAuth();
  if (!ready) return null;
  return (<>
    {isStaff && <Link href="/admin">Admin</Link>}
    {user ? <Link href="/account">My account</Link> : <Link href="/login">Sign in</Link>}
  </>);
}
