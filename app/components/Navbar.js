'use client'
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) checkAdmin(user.id);
    };
    getUser();

    // 2. Listen for changes (Login/Logout) instantly
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
      else setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const checkAdmin = async (userId) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (data?.role === 'admin') setIsAdmin(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-10 z-50 sticky top-0">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-2xl text-primary font-bold">Qudwa</Link>
        {/* Only show this link if user is Admin */}
        {isAdmin && (
          <Link href="/admin" className="btn btn-sm btn-secondary ml-4">
            Admin Dashboard
          </Link>
        )}
      </div>
      <div className="flex-none gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span>{user.email ? user.email[0].toUpperCase() : 'U'}</span>
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="px-4 py-2 text-xs text-gray-500">{user.email}</li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm rounded-full">Login</Link>
        )}
      </div>
    </div>
  );
}