'use client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export type Role = 'member' | 'moderator' | 'admin';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let on = true;
    async function load(u: User | null) {
      let r: Role | null = null;
      if (u) { const { data } = await supabase.from('profiles').select('role').eq('id', u.id).maybeSingle(); r = (data?.role as Role) ?? 'member'; }
      if (on) { setUser(u); setRole(r); setReady(true); }
    }
    supabase.auth.getSession().then(({ data }) => load(data.session?.user ?? null));
    // defer: supabase calls must not run inside the auth callback itself
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setTimeout(() => load(s?.user ?? null), 0); });
    return () => { on = false; sub.subscription.unsubscribe(); };
  }, []);
  return { user, role, ready, isStaff: role === 'admin' || role === 'moderator', isAdmin: role === 'admin' };
}
