'use client'
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) checkAdmin(user.id);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
      else setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (data?.role === 'admin') setIsAdmin(true);
  };

  // --- THIS IS THE FIX ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Send them to Login page
    router.refresh();      // Clear the data
  };
  // -----------------------

  return (
    // NAVBAR CONTAINER (Absolute + Glass)
    <div className="navbar absolute top-6 left-4 right-4 w-auto rounded-3xl glass-panel shadow-sm z-50">
      <div className="flex-1 mr-4">
        
        {/* LOGO + BRAND NAME */}
        <Link href="/" className="btn btn-ghost hover:bg-transparent normal-case gap-3 group px-0">
          {/* 1. Logo Image */}
          <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
            <img 
              src="/logo.png" 
              alt="Qudwa Logo" 
              className="w-full h-full object-contain drop-shadow-md rounded-full" 
            />
          </div>

          {/* 2. Text (Calligraphy) */}
          <div className="flex flex-col items-start">
             <span className="text-3xl text-primary pt-2 drop-shadow-sm" style={{ fontFamily: 'var(--font-nastaliq)' }}>
                قُدوَة
             </span>
          </div>
        </Link>

        {/* ADMIN BUTTON (Only visible to Admin) */}
        {isAdmin && (
          <Link href="/admin" className="hidden md:flex btn btn-xs btn-outline btn-accent mr-4 rounded-lg gap-1">
            <FaShieldAlt /> الإدارة
          </Link>
        )}
      </div>

      {/* RIGHT SIDE (User Menu) */}
      <div className="flex-none gap-2 ml-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder border-2 border-primary/20">
              <div className="bg-primary/10 text-primary rounded-full w-10">
                <span className="text-lg font-bold">{user.email[0].toUpperCase()}</span>
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content glass-panel rounded-2xl w-52 border border-white/50 text-right">
              <li className="menu-title px-4 py-2 text-xs text-primary">{user.email}</li>
              {isAdmin && <li><Link href="/admin">لوحة التحكم</Link></li>}
              <li><button onClick={handleLogout} className="text-error gap-2"><FaSignOutAlt /> خروج</button></li>
            </ul>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary rounded-2xl px-6 shadow-md hover:shadow-lg transition-all text-white">
            دخول
          </Link>
        )}
      </div>
    </div>
  );
}