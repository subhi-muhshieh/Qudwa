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

  // Memoized callbacks (React 19 optimization)
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
      className="navbar absolute top-6 left-4 right-4 w-auto rounded-3xl glass-panel shadow-sm z-50 px-4 md:px-6"
      role="navigation"
      aria-label="القائمة الرئيسية"
    >
      <div className="flex-1 flex items-center gap-6">
        {/* Logo */}
        <Link 
          href={user ? "/dashboard" : "/"} 
          className="btn btn-ghost hover:bg-transparent normal-case gap-3 group px-0 flex items-center"
          aria-label="الصفحة الرئيسية"
        >
          <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <img 
              src="/logo.png" 
              alt="شعار جمعية قدوة" 
              className="w-full h-full object-contain drop-shadow-md rounded-full" 
              loading="eager"
              width={48}
              height={48}
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

        {/* Separator */}
        <div className="hidden md:block h-8 w-px bg-primary/10 rounded-full mx-1" aria-hidden="true"></div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-3" role="menubar">
          <NavLink 
            href="/activities" 
            icon={<FaHistory className="text-secondary opacity-70" />}
            label="سجل النشاطات"
            isActive={pathname === '/activities'}
          />

          <NavLink 
            href="/gallery" 
            icon={<FaImages className="text-secondary opacity-70" />}
            label="معرض الصور"
            isActive={pathname === '/gallery'}
          />

          {user && (
            <NavLink 
              href="/contact"
              icon={<FaEnvelope className="text-secondary opacity-70" />}
              label="راسل الإدارة"
              isActive={pathname === '/contact'}
            />
          )}

          <NavLink 
            href="/about" 
            icon={<FaInfoCircle className="text-secondary opacity-70" />}
            label="عن الجمعية"
            isActive={pathname === '/about'}
          />

          <NavLink 
            href="/donate" 
            icon={<FaHeart className="text-red-400 opacity-70" />}
            label="ادعمنا"
            isActive={pathname === '/donate'}
          />

          {isAdmin && (
            <Link 
              href="/admin" 
              className="btn btn-sm btn-outline btn-primary rounded-xl gap-2 hover:shadow-md transition-all"
              role="menuitem"
            >
              <FaShieldAlt /> 
              الإدارة
            </Link>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-none flex items-center gap-2 ml-2">
        {/* Notification Bell - Only show if logged in */}
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
              className="btn btn-ghost btn-circle avatar placeholder border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="bg-primary/10 text-primary rounded-full w-10 overflow-hidden">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="صورة الملف الشخصي" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={40}
                    height={40}
                  />
                ) : (
                  <span className="text-lg font-bold flex items-center justify-center h-full">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </span>
                )}
              </div>
            </button>
            
            <ul 
              role="menu"
              className={`
                absolute left-0 mt-3 p-2 shadow-lg menu menu-sm bg-base-100 rounded-2xl w-56 border border-base-200 text-right z-50
                origin-top-left transition-all duration-200 ease-in-out
                ${isDropdownOpen 
                  ? 'opacity-100 scale-100 visible translate-y-0' 
                  : 'opacity-0 scale-95 invisible -translate-y-2 pointer-events-none'}
              `}
              onClick={(e) => {
                const target = e.target;
                if (target.tagName === 'A' || target.closest('a') || target.tagName === 'BUTTON') {
                  closeDropdown();
                }
              }}
            >
              <li className="menu-title px-4 py-2 text-xs text-primary/70 border-b border-base-200 mb-2">
                {profile?.parent_name || user.email}
              </li>
              
              <li role="none">
                <Link href="/profile" className="gap-2 py-2" role="menuitem">
                  <FaUser className="text-primary" /> الملف الشخصي
                </Link>
              </li>
              <li role="none">
                <Link href="/settings" className="gap-2 py-2" role="menuitem">
                  <FaCog className="text-primary" /> الإعدادات
                </Link>
              </li>
              
              {/* Mobile-only links */}
              <li className="md:hidden" role="none">
                <Link href="/activities" className="py-2" role="menuitem">
                  <FaHistory /> سجل النشاطات
                </Link>
              </li>
              <li className="md:hidden" role="none">
                <Link href="/gallery" className="py-2" role="menuitem">
                  <FaImages /> معرض الصور
                </Link>
              </li>
              <li className="md:hidden" role="none">
                <Link href="/contact" className="py-2" role="menuitem">
                  <FaEnvelope /> راسل الإدارة
                </Link>
              </li>
              <li className="md:hidden" role="none">
                <Link href="/about" className="py-2" role="menuitem">
                  <FaInfoCircle /> عن الجمعية
                </Link>
              </li>
              <li className="md:hidden" role="none">
                <Link href="/donate" className="py-2" role="menuitem">
                  <FaHeart /> ادعمنا
                </Link>
              </li>
              
              {isAdmin && (
                <li className="border-t border-base-200 mt-1 pt-1" role="none">
                  <Link href="/admin" className="py-2 text-primary font-bold" role="menuitem">
                    <FaShieldAlt /> لوحة الإدارة
                  </Link>
                </li>
              )}
              
              <div className="divider my-1 opacity-50" aria-hidden="true"></div>
              <li role="none">
                <button 
                  onClick={handleLogout} 
                  className="text-error gap-2 hover:bg-error/10 py-2"
                  role="menuitem"
                >
                  <FaSignOutAlt /> خروج
                </button>
              </li>
            </ul>
          </div>
        ) : (
          /* ===== GUEST: Login button + mobile hamburger ===== */
          <div className="flex items-center gap-2">
            {/* Desktop login button */}
            <Link 
              href="/login" 
              className="hidden md:inline-flex btn btn-primary rounded-2xl px-6 shadow-md hover:shadow-lg transition-all text-white"
            >
              دخول
            </Link>

            {/* Mobile hamburger */}
            <div className="relative md:hidden" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                aria-label="قائمة التنقل"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                className="btn btn-ghost btn-circle border-2 border-primary/20 hover:border-primary transition-colors"
              >
                {isDropdownOpen ? (
                  <FaTimes className="text-lg text-primary" />
                ) : (
                  <FaBars className="text-lg text-primary" />
                )}
              </button>

              <ul 
                role="menu"
                className={`
                  absolute left-0 mt-3 p-2 shadow-lg menu menu-sm bg-base-100 rounded-2xl w-56 border border-base-200 text-right z-50
                  origin-top-left transition-all duration-200 ease-in-out
                  ${isDropdownOpen 
                    ? 'opacity-100 scale-100 visible translate-y-0' 
                    : 'opacity-0 scale-95 invisible -translate-y-2 pointer-events-none'}
                `}
                onClick={(e) => {
                  const target = e.target;
                  if (target.tagName === 'A' || target.closest('a') || target.tagName === 'BUTTON') {
                    closeDropdown();
                  }
                }}
              >
                <li className="menu-title px-4 py-2 text-xs text-primary/70 border-b border-base-200 mb-2">
                  تصفح الموقع
                </li>
                <li role="none">
                  <Link href="/activities" className="gap-2 py-2" role="menuitem">
                    <FaHistory className="text-primary" /> سجل النشاطات
                  </Link>
                </li>
                <li role="none">
                  <Link href="/gallery" className="gap-2 py-2" role="menuitem">
                    <FaImages className="text-primary" /> معرض الصور
                  </Link>
                </li>
                <li role="none">
                  <Link href="/about" className="gap-2 py-2" role="menuitem">
                    <FaInfoCircle className="text-primary" /> عن الجمعية
                  </Link>
                </li>
                <li role="none">
                  <Link href="/donate" className="gap-2 py-2" role="menuitem">
                    <FaHeart className="text-red-400" /> ادعمنا
                  </Link>
                </li>
                <li role="none">
                  <Link href="/contact" className="gap-2 py-2" role="menuitem">
                    <FaEnvelope className="text-primary" /> تواصل معنا
                  </Link>
                </li>
                <div className="divider my-1 opacity-50" aria-hidden="true"></div>
                <li role="none">
                  <Link href="/login" className="gap-2 py-2 text-primary font-bold" role="menuitem">
                    <FaSignInAlt /> تسجيل الدخول
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Helper component for nav links (React 19 pattern)
function NavLink({ href, icon, label, isActive }) {
  return (
    <Link 
      href={href} 
      className={`btn btn-sm btn-ghost hover:bg-primary/5 text-base-content font-bold rounded-xl gap-2 transition-all ${
        isActive ? 'bg-primary/10 text-primary' : ''
      }`}
      role="menuitem"
    >
      {icon}
      {label}
    </Link>
  );
}