'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Home, User, Settings, Bell, Image, History,
  Info, Heart, Shield, Mail, LogOut, X
} from 'lucide-react';

const commands = [
  { id: 'home', label: 'الرئيسية', icon: Home, href: '/dashboard', shortcut: '⌘H' },
  { id: 'profile', label: 'الملف الشخصي', icon: User, href: '/profile', shortcut: '⌘P' },
  { id: 'settings', label: 'الإعدادات', icon: Settings, href: '/settings', shortcut: '⌘S' },
  { id: 'notifications', label: 'الإشعارات', icon: Bell, href: '/notifications', shortcut: '⌘N' },
  { id: 'gallery', label: 'معرض الصور', icon: Image, href: '/gallery', shortcut: '⌘G' },
  { id: 'activities', label: 'سجل النشاطات', icon: History, href: '/activities', shortcut: '⌘A' },
  { id: 'about', label: 'عن الجمعية', icon: Info, href: '/about', shortcut: '' },
  { id: 'donate', label: 'ادعمنا', icon: Heart, href: '/donate', shortcut: '' },
  { id: 'contact', label: 'تواصل معنا', icon: Mail, href: '/contact', shortcut: '' },
  { id: 'admin', label: 'لوحة الإدارة', icon: Shield, href: '/admin', shortcut: '' },
  { id: 'logout', label: 'تسجيل الخروج', icon: LogOut, href: '/logout', shortcut: '' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle on ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = useCallback((href) => {
    if (href === '/logout') {
      // Handle logout
      window.location.href = '/logout';
    } else {
      router.push(href);
    }
    setOpen(false);
  }, [router]);

  return (
    <>
      {/* Keyboard shortcut hint */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 text-xs font-medium transition-colors"
        aria-label="فتح قائمة الأوامر"
      >
        <Search className="w-3.5 h-3.5" />
        <span>بحث</span>
        <kbd className="px-1.5 py-0.5 bg-white rounded text-[10px] font-sans border border-slate-200">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50"
              onClick={() => setOpen(false)}
            />
            {/* Content layer */}
            <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[20vh] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
              <Command className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-slate-400 [&_[cmdk-group]]:py-2 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-input]]:h-14 [&_[cmdk-input]]:px-4 [&_[cmdk-input]]:text-lg [&_[cmdk-list]]:max-h-[60vh] [&_[cmdk-list]]:overflow-y-auto">
                <div className="flex items-center border-b border-slate-100 px-4">
                  <Search className="w-5 h-5 text-slate-400" />
                  <Command.Input
                    placeholder="البحث في الموقع..."
                    className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-slate-800"
                    autoFocus
                  />
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <Command.List className="py-2">
                  <Command.Empty className="py-8 text-center text-slate-400">
                    لا توجد نتائج
                  </Command.Empty>

                  <Command.Group heading="الصفحات الرئيسية">
                    {commands.filter(c => c.shortcut).map((command) => (
                      <Command.Item
                        key={command.id}
                        onSelect={() => handleSelect(command.href)}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 aria-selected:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <command.icon className="w-5 h-5 text-slate-400" />
                          <span className="font-medium text-slate-700">{command.label}</span>
                        </div>
                        {command.shortcut && (
                          <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-sans text-slate-500">
                            {command.shortcut}
                          </kbd>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group heading="المزيد">
                    {commands.filter(c => !c.shortcut).map((command) => (
                      <Command.Item
                        key={command.id}
                        onSelect={() => handleSelect(command.href)}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 aria-selected:bg-slate-50 transition-colors"
                      >
                        <command.icon className="w-5 h-5 text-slate-400" />
                        <span className="font-medium text-slate-700">{command.label}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>

                <div className="flex items-center gap-4 px-4 py-3 border-t border-slate-100 text-xs text-slate-400 bg-slate-50/50">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-sans">↑↓</kbd>
                    <span>للتنقل</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-sans">↵</kbd>
                    <span>للاختيار</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-sans">Esc</kbd>
                    <span>للإغلاق</span>
                  </div>
                </div>
              </Command>
            </motion.div>
          </div>
        </>)}
      </AnimatePresence>
    </>
  );
}
