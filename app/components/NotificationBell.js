'use client'
import { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { useProfile } from '../context/ProfileContext';
import { FaBell, FaTimes, FaCheckDouble } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function NotificationBell() {
  const { user } = useProfile();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasViewedCurrent, setHasViewedCurrent] = useState(false);
  const supabaseRef = useRef(null);
  const channelRef = useRef(null);

  // Initialize Supabase client once
  if (!supabaseRef.current) {
    supabaseRef.current = createClient();
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user || !supabaseRef.current) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabaseRef.current
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    } catch (error) {
      // Silently fail to prevent console spam
    } finally {
      setLoading(false);
    }
  };

    // Fetch notifications initially
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Poll every 15 seconds for new notifications (reduced from 5s)
    const pollInterval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [user?.id]);

  // Mark as viewed when dropdown opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      setHasViewedCurrent(true);
    }
  }, [isOpen, unreadCount]);

  // Auto-mark all as read when dropdown closes
  useEffect(() => {
    if (!isOpen && hasViewedCurrent && unreadCount > 0) {
      const timer = setTimeout(() => {
        markAllAsRead();
        setHasViewedCurrent(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasViewedCurrent, unreadCount]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      // Handle error silently
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      // Handle error silently
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle relative hover:bg-base-200 transition-colors"
        aria-label="الإشعارات"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 mt-2 w-80 md:w-96 bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden z-50"
            >
              <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-200/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base-content">الإشعارات</h3>
                  {unreadCount > 0 && (
                    <span className="badge badge-error badge-sm">{unreadCount}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                      className="btn btn-ghost btn-xs gap-1 hover:text-primary"
                      title="تحديد الكل كمقروء"
                    >
                      <FaCheckDouble />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="btn btn-ghost btn-xs btn-circle hover:text-error"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-12 text-base-content/50">
                    <FaBell className="text-4xl mx-auto mb-3 text-base-content/20" />
                    <p className="font-medium">لا توجد إشعارات</p>
                    <p className="text-xs mt-1">سنخبرك عندما يكون هناك جديد</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.link || '/dashboard'}
                      onClick={() => handleNotificationClick(notification)}
                      className={`block p-4 border-b border-base-200 hover:bg-base-200/50 transition-colors cursor-pointer ${
                        !notification.is_read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-bold text-sm truncate ${!notification.is_read ? 'text-primary' : 'text-base-content'}`}>
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-base-content/40 mt-1.5">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: ar
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 border-t border-base-200 bg-base-200/50 text-center">
                  <Link
                    href="/notifications"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="text-sm text-primary hover:text-primary/70 font-medium hover:underline"
                  >
                    عرض جميع الإشعارات
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}