'use client'
import React from 'react'; 
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaSignOutAlt, FaShieldAlt, FaHistory, FaEnvelope, FaUser } from 'react-icons/fa';
import { useProfile } from '../context/ProfileContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile } = useProfile();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (data?.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin:', error);
      }
    };

    checkAdmin();
  }, [user]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login'); 
    router.refresh();      
  };

  const scrollToContact = () => {
    const messageBox = document.getElementById('message-box');
    const input = document.getElementById('contact-input');
    
    if (messageBox) {
      messageBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        if (input) input.focus();
      }, 500);
    }
  };

 // --- HIDE NAVBAR LOGIC ---
const hiddenPages = ['/login', '/reset-password', '/'];
if (hiddenPages.includes(pathname)) {
  return null;
}
  // -------------------------

  return (
    <div className="navbar absolute top-6 left-4 right-4 w-auto rounded-3xl glass-panel shadow-sm z-50 px-4 md:px-6">
      
      <div className="flex-1 flex items-center gap-6">
        
        <Link 
          href={user ? "/dashboard" : "/"} 
          className="btn btn-ghost hover:bg-transparent normal-case gap-3 group px-0 flex items-center"
        >
          <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <img 
              src="/logo.png" 
              alt="Qudwa Logo" 
              className="w-full h-full object-contain drop-shadow-md rounded-full" 
            />
          </div>

          <div className="flex flex-col items-start justify-center h-12">
             <span 
                className="text-3xl text-primary -mt-3 drop-shadow-sm leading-none transition-all duration-300 group-hover:text-secondary group-hover:scale-105 origin-right" 
                style={{ fontFamily: 'var(--font-nastaliq)' }}
             >
                قُدوَة
             </span>
          </div>
        </Link>

        {user && (
          <div className="hidden md:block h-8 w-px bg-primary/10 rounded-full mx-1"></div>
        )}

        <div className="hidden md:flex items-center gap-3">
            {user && (
              <>
                <Link 
                  href="/activities" 
                  className="btn btn-sm btn-ghost hover:bg-primary/5 text-neutral font-bold rounded-xl gap-2 transition-all hover:pr-4"
                >
                  <FaHistory className="text-secondary opacity-70" />
                  سجل الإنجازات
                </Link>

                <button 
                  onClick={scrollToContact}
                  className="btn btn-sm btn-ghost hover:bg-primary/5 text-neutral font-bold rounded-xl gap-2 transition-all"
                >
                  <FaEnvelope className="text-secondary opacity-70" />
                  راسل الإدارة
                </button>
              </>
            )}

            {isAdmin && (
              <Link 
                href="/admin" 
                className="btn btn-sm btn-outline btn-primary rounded-xl gap-2 hover:shadow-md transition-all"
              >
                <FaShieldAlt /> 
                الإدارة
              </Link>
            )}
        </div>

      </div>

      <div className="flex-none gap-2 ml-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder border-2 border-primary/20 hover:border-primary transition-colors">
              <div className="bg-primary/10 text-primary rounded-full w-10 overflow-hidden">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold flex items-center justify-center h-full">
                    {user.email[0].toUpperCase()}
                  </span>
                )}
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-white rounded-2xl w-56 border border-gray-200 text-right">
              <li className="menu-title px-4 py-2 text-xs text-primary/70">
                {profile?.parent_name || user.email}
              </li>
              
              <li>
                <Link href="/profile" className="gap-2">
                  <FaUser className="text-primary" /> الملف الشخصي
                </Link>
              </li>
              
              <li className="md:hidden"><Link href="/activities"><FaHistory /> سجل الإنجازات</Link></li>
              <li className="md:hidden"><button onClick={scrollToContact} className="w-full"><FaEnvelope /> راسل الإدارة</button></li>
              {isAdmin && <li className="md:hidden"><Link href="/admin"><FaShieldAlt /> لوحة الإدارة</Link></li>}
              
              <div className="divider my-1 opacity-50"></div>
              <li><button onClick={handleLogout} className="text-error gap-2 hover:bg-error/10"><FaSignOutAlt /> خروج</button></li>
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