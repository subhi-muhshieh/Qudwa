'use client'
import { useState, useEffect, memo } from 'react';
import { createClient } from '../utils/supabase/client';
import { useProfile } from '../context/ProfileContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBell, FaCheckDouble, FaArrowRight } from 'react-icons/fa';
import EmptyState from '../components/EmptyState';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion } from 'framer-motion';

/* ========================================== */
/* SKELETON UI                               */
/* ========================================== */
const NotificationsSkeleton = memo(function NotificationsSkeleton() {
  return (
    <div className="min-h-screen bg-base-200 pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-base-300 rounded-full" />
            <div className="h-8 w-32 bg-base-300 rounded-xl" />
            <div className="h-6 w-16 bg-base-300 rounded-full" />
          </div>
          <div className="h-8 w-28 bg-base-300 rounded-xl" />
        </div>

        {/* Notification items skeleton */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-base-100 rounded-2xl p-5 border border-base-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-base-300 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-base-300 rounded" />
                  <div className="h-3 w-full bg-base-300 rounded" />
                  <div className="h-3 w-2/3 bg-base-300 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default function NotificationsPage() {
  const { user } = useProfile();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;
    
    const fetchAll = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (data) setNotifications(data);
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      });

      if (!response.ok) return;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {
      // Silent fail to preserve current UX
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return <NotificationsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-base-200 pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">

        <Link href="/dashboard" className="btn btn-ghost btn-sm rounded-xl gap-2 mb-6">
          <FaArrowRight /> العودة
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
            <FaBell /> الإشعارات
            {unreadCount > 0 && (
              <span className="badge badge-error badge-sm">{unreadCount} جديد</span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn btn-ghost btn-sm gap-2 text-primary">
              <FaCheckDouble /> تحديد الكل كمقروء
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={<FaBell />}
            title="لا توجد إشعارات"
            description="سنخبرك هنا عندما يكون هناك جديد."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={n.link || '/dashboard'}
                  className={`block bg-base-100 rounded-2xl p-5 border transition-colors hover:shadow-md ${
                    !n.is_read 
                      ? 'border-primary/20 bg-primary/5' 
                      : 'border-base-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      !n.is_read ? 'bg-primary/10 text-primary' : 'bg-base-200 text-base-content/40'
                    }`}>
                      <FaBell />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold text-sm ${!n.is_read ? 'text-primary' : 'text-base-content'}`}>
                          {n.title}
                        </h3>
                        {!n.is_read && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                      </div>
                      <p className="text-sm text-base-content/70 leading-relaxed">{n.message}</p>
                      <p className="text-xs text-base-content/40 mt-2">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ar })}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}