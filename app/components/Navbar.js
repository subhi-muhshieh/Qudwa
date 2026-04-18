'use client'

import { useState, useEffect, useRef, useCallback } from 'react'; 
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '../utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import {
  LogOut, Shield, History, Mail, User,
  Settings, Images, Menu, X, Info, LogIn, Heart
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import useModalA11y from '../hooks/useModalA11y';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile } = useProfile();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  
  const isAdmin = profile?.role === 'admin';

  // Scroll-aware compact variant
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  // Close dropdown + drawer on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsDrawerOpen(false);
  }, [pathname]);

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

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
    <>
    <nav 
      className={`fixed left-4 right-4 md:left-8 md:right-8 lg:max-w-7xl lg:mx-auto backdrop-blur-2xl border rounded-[2rem] z-50 px-4 md:px-6 transition-all duration-300 ease-out ${
        isScrolled
          ? 'top-3 bg-white/90 border-white/70 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.14)] py-1'
          : 'top-6 bg-white/80 border-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] py-2'
      }`}
      role="navigation"
      aria-label="القائمة الرئيسية"
    >
      <div className={`flex items-center justify-between w-full transition-[height] duration-300 ${isScrolled ? 'h-12' : 'h-14'}`}>
        
        {/* ======== LEFT SIDE: Logo & Links ======== */}
        <div className="flex items-center gap-6">
          
          {/* Logo (Optically centered for Nastaliq baseline) */}
          <Link 
            href={user ? "/dashboard" : "/"} 
            className="group flex items-center gap-2 active:scale-95 transition-transform"
            aria-label="الصفحة الرئيسية"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[5deg]">
              <Image
                src="/logo.png"
                alt="شعار جمعية قدوة"
                fill
                priority
                sizes="48px"
                className="object-contain drop-shadow-sm"
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
              icon={<History className="text-lg" />}
              label="سجل النشاطات"
              isActive={pathname === '/activities'}
            />

            <NavLink 
              href="/gallery" 
              icon={<Images className="text-lg" />}
              label="معرض الصور"
              isActive={pathname === '/gallery'}
            />

            {user && (
              <NavLink 
                href="/contact"
                icon={<Mail className="text-lg" />}
                label="راسل الإدارة"
                isActive={pathname === '/contact'}
              />
            )}

            <NavLink 
              href="/about" 
              icon={<Info className="text-lg" />}
              label="عن الجمعية"
              isActive={pathname === '/about'}
            />

            <NavLink 
              href="/donate" 
              icon={<Heart className="text-lg" />}
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
                <Shield /> 
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
                  <Image
                    src={profile.avatar_url}
                    alt="صورة الملف الشخصي"
                    width={44}
                    height={44}
                    sizes="44px"
                    className="w-full h-full object-cover"
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
                    <User className="text-primary/70 text-lg" /> الملف الشخصي
                  </Link>
                </li>
                <li role="none">
                  <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                    <Settings className="text-primary/70 text-lg" /> الإعدادات
                  </Link>
                </li>
                
                {/* Mobile-only links */}
                <div className="lg:hidden">
                  <div className="h-px bg-slate-100 my-2 mx-4" aria-hidden="true" />
                  <li role="none">
                    <Link href="/activities" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <History className="text-slate-400 text-lg" /> سجل النشاطات
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/gallery" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <Images className="text-slate-400 text-lg" /> معرض الصور
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/contact" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <Mail className="text-slate-400 text-lg" /> راسل الإدارة
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/about" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary font-bold text-sm transition-colors" role="menuitem">
                      <Info className="text-slate-400 text-lg" /> عن الجمعية
                    </Link>
                  </li>
                  <li role="none">
                    <Link href="/donate" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 text-slate-600 hover:text-red-500 font-bold text-sm transition-colors" role="menuitem">
                      <Heart className="text-red-400 text-lg" /> ادعمنا
                    </Link>
                  </li>
                </div>
                
                {isAdmin && (
                  <>
                    <div className="h-px bg-slate-100 my-2 mx-4" aria-hidden="true" />
                    <li role="none">
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-900 hover:text-white text-slate-900 font-black text-sm transition-colors" role="menuitem">
                        <Shield className="text-lg" /> لوحة الإدارة
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
                    <LogOut className="text-lg" /> تسجيل الخروج
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

              {/* Mobile hamburger → slide-over drawer */}
              <button
                onClick={toggleDrawer}
                aria-label="قائمة التنقل"
                aria-expanded={isDrawerOpen}
                aria-controls="mobile-nav-drawer"
                aria-haspopup="dialog"
                className="lg:hidden w-10 h-10 rounded-[1.2rem] bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
              >
                {isDrawerOpen ? <X className="text-lg" /> : <Menu className="text-lg" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>

    <MobileNavDrawer
      open={isDrawerOpen}
      onClose={closeDrawer}
      pathname={pathname}
    />
    </>
  );
}

// ──────────────────────────────────────────────
// Mobile slide-over drawer (guest / unauthenticated)
// ──────────────────────────────────────────────
function MobileNavDrawer({ open, onClose, pathname }) {
  const containerRef = useModalA11y({ open, onClose });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const items = [
    { href: '/activities', label: 'سجل النشاطات', icon: <History /> },
    { href: '/gallery', label: 'معرض الصور', icon: <Images /> },
    { href: '/about', label: 'عن الجمعية', icon: <Info /> },
    { href: '/contact', label: 'تواصل معنا', icon: <Mail /> },
    { href: '/donate', label: 'ادعمنا', icon: <Heart />, tone: 'red' },
  ];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="إغلاق القائمة"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 w-full h-full bg-neutral/40 backdrop-blur-md cursor-default"
          />

          {/* Panel — slides in from the left edge (where hamburger sits in RTL) */}
          <motion.aside
            id="mobile-nav-drawer"
            ref={containerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="قائمة التنقل"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute top-0 bottom-0 left-0 w-[86%] max-w-sm bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)] flex flex-col pb-safe"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <Image src="/logo.png" alt="" fill sizes="40px" className="object-contain" />
                </div>
                <span className="text-3xl font-nastaliq text-primary leading-none -mt-2">
                  قُدوَة
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors active:scale-95"
              >
                <X />
              </button>
            </div>

            {/* Nav list */}
            <nav
              aria-label="روابط الموقع"
              className="flex-1 overflow-y-auto overscroll-contain px-3 py-4"
            >
              <p className="px-3 pb-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                تصفح الموقع
              </p>
              <ul className="space-y-1">
                {items.map(({ href, label, icon, tone }) => {
                  const isActive = pathname === href;
                  const isRed = tone === 'red';
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={onClose}
                        aria-current={isActive ? 'page' : undefined}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                          isActive
                            ? isRed
                              ? 'bg-red-50 text-red-500'
                              : 'bg-primary/10 text-primary'
                            : isRed
                              ? 'text-slate-600 hover:bg-red-50 hover:text-red-500'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                        }`}
                      >
                        <span
                          className={`text-lg transition-transform group-hover:scale-110 ${
                            isRed ? 'text-red-400' : 'text-primary/70'
                          }`}
                        >
                          {icon}
                        </span>
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer CTA */}
            <div className="px-4 pt-3 pb-4 border-t border-slate-100">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <LogIn /> تسجيل الدخول
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Helper component for nav links with animated active pill (framer layoutId)
function NavLink({ href, icon, label, isActive, color = "primary" }) {
  const isRed = color === "red";

  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-[1.2rem] text-sm font-bold transition-colors duration-300 ${
        isActive
          ? isRed ? 'text-red-500' : 'text-primary'
          : isRed
            ? 'text-slate-500 hover:text-red-500'
            : 'text-slate-500 hover:text-primary'
      }`}
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          aria-hidden="true"
          className={`absolute inset-0 rounded-[1.2rem] z-0 ${
            isRed ? 'bg-red-50 shadow-sm' : 'bg-primary/10 shadow-sm'
          }`}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      {!isActive && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-[1.2rem] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isRed ? 'bg-red-50' : 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
          }`}
        />
      )}
      <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      <span className="relative z-10">{label}</span>
    </Link>
  );
}