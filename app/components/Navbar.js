'use client'

import { useState, useEffect, useRef, useCallback } from 'react'; 
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FaSignOutAlt, FaShieldAlt, FaHistory, FaEnvelope, FaUser, 
  FaCog, FaImages, FaBars, FaTimes, FaInfoCircle, FaSignInAlt, FaHeart 
} from 'react-icons/fa';
import { useProfile } from '../context/ProfileContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile } = useProfile();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const isAdmin = profile?.role === 'admin';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }, [router]);

  // Hide navbar on certain pages
  const hiddenPages = ['/login', '/reset-password'];
  if (hiddenPages.includes(pathname)) {
    return null;
  }

  return (
    <nav 
      className="absolute top-6 left-4 right-4 md:left-8 md:right-8 lg:max-w-7xl lg:mx-auto bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-[2rem] z-50 px-4 md:px-6 py-2 transition-all duration-300"
      role="navigation"
      aria-label="القائمة الرئيسية"
    >
      <div className="flex items-center justify-between w-full h-14">
        
        {/* ======== LEFT SIDE: Logo & Links ======== */}
        <div className="flex items-center gap-6">
          
          {/* Logo (Optically centered for Nastaliq baseline) */}
          <Link 
            href={user ? "/dashboard" : "/"} 
            className="group flex items-center gap-2 active:scale-95 transition-transform"
            aria-label="الصفحة الرئيسية"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[5deg]">
              <img 
                src="/logo.png" 
                alt="شعار جمعية قدوة" 
                className="w-full h-full object-contain drop-shadow-sm" 
                loading="eager"
                width={48}
                height={48}
              />
            </div>
            <div className="flex items-center">
              {/* Notice the -mt-3 and md:-mt-4 here. This pulls the text UP to align with the center of the image. */}
              <span className="text-4xl md:text-5xl text-primary drop-shadow-sm leading-none transition-colors duration-300 group-hover:text-secondary font-nastaliq -mt-3 md:-mt-4">
                قُدوَة
              </span>
            </div>
          </Link>

          {/* Separator */}
          <div className="hidden md:block h-6 w-px bg-slate-200 rounded-full mx-2" aria-hidden="true"></div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1.5" role="menubar">
            <NavLink 
              href="/activities" 
              icon={<FaHistory className="text-lg" />}
              label="سجل النشاطات"
              isActive={pathname === '/activities'}
            />

            <NavLink 
              href="/gallery" 
              icon={<FaImages className="text-lg" />}
              label="معرض الصور"
              isActive={pathname === '/gallery'}
            />

            {user && (
              <NavLink 
                href="/contact"
                icon={<FaEnvelope className="text-lg" />}
                label="راسل الإدارة"
                isActive={pathname === '/contact'}
              />
            )}

            <NavLink 
              href="/about" 
              icon={<FaInfoCircle className="text-lg" />}
              label="عن الجمعية"
              isActive={pathname === '/about'}
            />

            <NavLink 
              href="/donate" 
              icon={<FaHeart className="text-lg" />}
              label="ادعمنا"
              isActive={pathname === '/donate'}
              color="red"
            />

            {isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ml-2"
                role="menuitem"
              >
                <FaShieldAlt /> 
                الإدارة
              </Link>
            )}
          </div>
        </div>

        {/* ======== RIGHT SIDE: Auth & Actions ======== */}
        <div className="flex items-center gap-3">
          
          {user && <NotificationBell />}
          
          {user ? (
            /* ===== LOGGED-IN: Avatar Dropdown ===== */
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown();
                  }
                }}
                aria-label="قائمة المستخدم"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                className="w-10 h-10 md:w-11 md:h-11 rounded-[1.2rem] overflow-hidden border-2 border-white shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer active:scale-95"
              >
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="صورة الملف الشخصي" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={44}
                    height={44}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary font-black text-lg">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                )}
              </button>
              
              {/* Premium Dropdown Menu */}
              <ul 
                role="menu"
                className={`
                  absolute left-0 mt-4 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-3xl rounded-[2rem] w-64 border border-slate-100 text-right z-50
                  origin-top-left transition-all duration-300 ease-out
                  ${isDropdownOpen 
                    ? 'opacity-100 scale-100 visible translate-y-0' 
                    : 'opacity-0 scale-95 invisible -translate-y-4 pointer-events-none'}
                `}
                onClick={(e) => {
                  const target = e.target;
                  if (target.tagName === 'A' || target.closest('a') || target.tagName === 'BUTTON') {
                    closeDropdown();
                  }
                }}
              >
                <div className="px-4 py-3 border-b border-slate-100 mb-2">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">حسابك</p>
                  <p className="text-sm font-black text-slate-800 truncate">
                    {profile?.parent_name || user.email}
                  </p>
                </div>
                
                <li role="none">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                    <FaUser className="text-primary/70 text-lg" /> الملف الشخصي
                  </Link>
                </li>
                <li role="none">
                  <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                    <FaCog className="text-primary/70 text-lg" /> الإعدادات
                  </Link>
                </li>
                
                {/* Mobile-only links */}
                <div className="lg:hidden">
                  <div className="h-px bg-slate-100 my-2 mx-4" aria-hidden="true" />
                  <li role="none">
                    <Link href="/activities" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <FaHistory className="text-slate-400 text-lg" /> سجل النشاطات
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/gallery" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <FaImages className="text-slate-400 text-lg" /> معرض الصور
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/contact" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <FaEnvelope className="text-slate-400 text-lg" /> راسل الإدارة
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/about" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <FaInfoCircle className="text-slate-400 text-lg" /> عن الجمعية
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/donate" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 text-slate-600 hover:text-red-500 font-bold text-sm transition-colors" role="menuitem">
                      <FaHeart className="text-red-400 text-lg" /> ادعمنا
                    </Link>
                  </li>
                </div>
                
                {isAdmin && (
                  <>
                    <div className="h-px bg-slate-100 my-2 mx-4" aria-hidden="true" />
                    <li role="none">
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-900 hover:text-white text-slate-900 font-black text-sm transition-colors" role="menuitem">
                        <FaShieldAlt className="text-lg" /> لوحة الإدارة
                      </Link>
                    </li>
                  </>
                )}
                
                <div className="h-px bg-slate-100 my-2 mx-4" aria-hidden="true" />
                <li role="none">
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 text-red-500 font-bold text-sm transition-colors"
                    role="menuitem"
                  >
                    <FaSignOutAlt className="text-lg" /> تسجيل الخروج
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            /* ===== GUEST: Login button + mobile hamburger ===== */
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="hidden md:flex items-center justify-center bg-primary text-white font-bold px-6 py-2.5 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                تسجيل الدخول
              </Link>

              {/* Mobile hamburger */}
              <div className="relative lg:hidden" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  aria-label="قائمة التنقل"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  className="w-10 h-10 rounded-[1.2rem] bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
                >
                  {isDropdownOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                </button>

                <ul 
                  role="menu"
                  className={`
                    absolute left-0 mt-4 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-3xl rounded-[2rem] w-64 border border-slate-100 text-right z-50
                    origin-top-left transition-all duration-300 ease-out
                    ${isDropdownOpen 
                      ? 'opacity-100 scale-100 visible translate-y-0' 
                      : 'opacity-0 scale-95 invisible -translate-y-4 pointer-events-none'}
                  `}
                  onClick={(e) => {
                    const target = e.target;
                    if (target.tagName === 'A' || target.closest('a') || target.tagName === 'BUTTON') {
                      closeDropdown();
                    }
                  }}
                >
                  <div className="px-4 py-3 border-b border-slate-100 mb-2">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">تصفح الموقع</p>
                  </div>
                  <li role="none">
                    <Link href="/activities" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <FaHistory className="text-primary/70 text-lg" /> سجل النشاطات
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/gallery" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <FaImages className="text-primary/70 text-lg" /> معرض الصور
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/about" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <FaInfoCircle className="text-primary/70 text-lg" /> عن الجمعية
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/donate" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 text-slate-600 hover:text-red-500 font-bold text-sm transition-colors" role="menuitem">
                      <FaHeart className="text-red-400 text-lg" /> ادعمنا
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/contact" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <FaEnvelope className="text-primary/70 text-lg" /> تواصل معنا
                    </Link>
                  </li>
                  
                  <div className="h-px bg-slate-100 my-2 mx-4" aria-hidden="true" />
                  
                  <li role="none">
                    <Link href="/login" className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 shadow-md shadow-primary/20 transition-all" role="menuitem">
                      <FaSignInAlt className="text-lg" /> تسجيل الدخول
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// Helper component for nav links (Stripped of DaisyUI to fix hover issues)
function NavLink({ href, icon, label, isActive, color = "primary" }) {
  const isRed = color === "red";
  
  return (
    <Link 
      href={href} 
      className={`group flex items-center gap-2 px-4 py-2.5 rounded-[1.2rem] text-sm font-bold transition-all duration-300 ${
        isActive 
          ? isRed 
            ? 'bg-red-50 text-red-500 shadow-sm' 
            : 'bg-primary/10 text-primary shadow-sm'
          : isRed 
            ? 'text-slate-500 hover:bg-red-50 hover:text-red-500'
            : 'text-slate-500 hover:bg-white hover:text-primary hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
      }`}
      role="menuitem"
    >
      <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}