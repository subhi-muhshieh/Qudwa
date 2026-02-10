'use client'
import React, { useState, useEffect, useRef } from 'react'; 
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { FaSignOutAlt, FaShieldAlt, FaHistory, FaEnvelope, FaUser, FaCog, FaImages } from 'react-icons/fa';
import { useProfile } from '../context/ProfileContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const contextData = useProfile(); // Get the whole context object
  const { user, profile } = contextData;
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Debugging: See exactly what we are getting
  useEffect(() => {
    if (user) {
        console.log("Navbar Context Data:", contextData);
        console.log("User Role:", profile?.role);
    }
  }, [user, profile, contextData]);

  // Safer Admin Check
  const isAdmin = profile && profile.role === 'admin';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login'); 
    router.refresh();      
  };

  const hiddenPages = ['/login', '/reset-password', '/'];
  if (hiddenPages.includes(pathname)) {
    return null;
  }

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
                className="text-3xl text-primary -mt-3 drop-shadow-sm leading-none transition-all duration-300 group-hover:text-secondary group-hover:scale-105 origin-right font-nastaliq" 
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
                  سجل النشاطات
                </Link>

                <Link 
                  href="/contact"
                  className="btn btn-sm btn-ghost hover:bg-primary/5 text-neutral font-bold rounded-xl gap-2 transition-all"
                >
                  <FaEnvelope className="text-secondary opacity-70" />
                  راسل الإدارة
                </Link>

                <Link 
                  href="/gallery" 
                  className="btn btn-sm btn-ghost hover:bg-primary/5 text-neutral font-bold rounded-xl gap-2 transition-all hover:pr-4"
                >
                  <FaImages className="text-secondary opacity-70" />
                  معرض الصور
                </Link>
              </>
            )}

            {/* ADMIN BUTTON */}
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
          <div className="relative" ref={dropdownRef}>
            
            <div 
                role="button" 
                onClick={toggleDropdown}
                className="btn btn-ghost btn-circle avatar placeholder border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="bg-primary/10 text-primary rounded-full w-10 overflow-hidden">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold flex items-center justify-center h-full">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </span>
                )}
              </div>
            </div>
            
            <ul 
                className={`
                  absolute left-0 mt-3 p-2 shadow-lg menu menu-sm bg-white rounded-2xl w-56 border border-gray-200 text-right z-50
                  origin-top-left transition-all duration-200 ease-in-out
                  ${isDropdownOpen 
                    ? 'opacity-100 scale-100 visible translate-y-0' 
                    : 'opacity-0 scale-95 invisible -translate-y-2 pointer-events-none'}
                `}
                onClick={(e) => {
                   if(e.target.tagName === 'A' || e.target.closest('a') || e.target.tagName === 'BUTTON') {
                       closeDropdown();
                   }
                }}
            >
              <li className="menu-title px-4 py-2 text-xs text-primary/70 border-b border-gray-100 mb-2">
                {profile?.parent_name || user.email}
              </li>
              
              <li>
                <Link href="/profile" className="gap-2 py-2">
                  <FaUser className="text-primary" /> الملف الشخصي
                </Link>
              </li>
              <li>
                <Link href="/settings" className="gap-2 py-2">
                  <FaCog className="text-primary" /> الإعدادات
                </Link>
              </li>
              
              <li className="md:hidden"><Link href="/activities" className="py-2"><FaHistory /> سجل الإنجازات</Link></li>
              
              <li className="md:hidden">
                <Link href="/contact" className="w-full py-2">
                  <FaEnvelope /> راسل الإدارة
                </Link>
              </li>

              <li className="md:hidden">
                <Link href="/gallery" className="py-2">
                  <FaImages /> معرض الصور
                </Link>
              </li>
              
              {/* ADMIN LINK IN DROPDOWN (For Mobile) */}
              {isAdmin && (
                <li className="border-t border-gray-100 mt-1 pt-1">
                  <Link href="/admin" className="py-2 text-primary font-bold">
                    <FaShieldAlt /> لوحة الإدارة
                  </Link>
                </li>
              )}
              
              <div className="divider my-1 opacity-50"></div>
              <li><button onClick={handleLogout} className="text-error gap-2 hover:bg-error/10 py-2"><FaSignOutAlt /> خروج</button></li>
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