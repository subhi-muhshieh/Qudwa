'use client'
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { useProfile } from '../context/ProfileContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBell, FaCheckDouble, FaArrowRight, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion } from 'framer-motion';

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
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllAsRead: true })
    });
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
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
          <div className="text-center py-20 text-base-content/50">
            <FaBell className="text-5xl mx-auto mb-4 text-base-content/20" />
            <p className="text-lg font-medium">لا توجد إشعارات</p>
          </div>
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