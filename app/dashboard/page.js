'use client'

import { createClient } from '../utils/supabase/client';
import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaHeart, FaCalendarAlt, FaStar, FaArrowLeft, FaClock,
  FaInfoCircle, FaTimes, FaCheckCircle,
  FaRegHeart, FaExpand, FaUsers, FaChevronDown, FaCrown, FaChild,
  FaImages, FaHistory, FaEnvelope, FaHandHoldingHeart, FaRegCalendarAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { updateActivityStatuses } from '../utils/activityHelpers';
import { useProfile } from '../context/ProfileContext';
import dynamic from 'next/dynamic';

const ChildProfileModal = dynamic(() => import('../components/ChildProfileModal'), { ssr: false });

/* ========================================== */
/* HELPERS                                    */
/* ========================================== */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return { text: 'صباح الخير' };
  if (h >= 12 && h < 17) return { text: 'مرحباً بعودتك' };
  if (h >= 17 && h < 21) return { text: 'مساء الخير' };
  return { text: 'مساء النور' };
};

const arabicDate = () =>
  new Intl.DateTimeFormat('ar', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date());

const CACHE_KEY = 'qudwa_dashboard_cache';
const CACHE_TTL = 5 * 60 * 1000;

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
};

const writeCache = (data) => {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
};

/* ========================================== */
/* SKELETON UI                               */
/* ========================================== */
const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-4 md:px-8 lg:px-12 bg-base-100">
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="mb-14 space-y-4">
          <div className="h-3 w-44 bg-base-300 rounded-full" />
          <div className="h-11 w-72 bg-base-300 rounded-2xl" />
          <div className="h-10 w-52 bg-base-300 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-base-300 rounded-3xl" />
          ))}
        </div>
        <div className="h-[400px] bg-base-300 rounded-[3rem] mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-36 bg-base-300 rounded-[2rem]" />
          ))}
        </div>
      </div>
    </main>
  );
});

/* ========================================== */
/* LIKE BUTTON                               */
/* ========================================== */
const LikeButton = memo(function LikeButton({ activityId, userId }) {
  const [isLiked, setIsLiked]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const [animating, setAnimating] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('likes').select('id')
          .eq('user_id', userId).eq('activity_id', activityId).maybeSingle();
        if (error) throw error;
        if (isMounted && data) setIsLiked(true);
      } catch (e) { console.error(e); }
      finally { if (isMounted) setLoading(false); }
    })();
    return () => { isMounted = false; };
  }, [activityId, userId, supabase]);

  const toggleLike = useCallback(async () => {
    if (loading) return;
    const prev = isLiked;
    setIsLiked(!prev);
    setAnimating(true);
    try {
      if (!prev) {
        const { error } = await supabase.from('likes').insert([{ user_id: userId, activity_id: activityId }]);
        if (error && error.code !== '23505') throw error;
      } else {
        const { error } = await supabase.from('likes').delete()
          .eq('user_id', userId).eq('activity_id', activityId);
        if (error) throw error;
      }
    } catch { setIsLiked(prev); toast.error('حدث خطأ'); }
    finally { setTimeout(() => setAnimating(false), 400); }
  }, [loading, isLiked, supabase, userId, activityId]);

  return (
    <motion.button
      onClick={toggleLike}
      whileTap={{ scale: 0.9 }}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-500 border ${
        isLiked
          ? 'bg-accent/10 border-accent/30 text-accent shadow-sm'
          : 'bg-white/50 border-slate-200/60 text-slate-400 hover:border-accent/40 hover:text-accent'
      }`}
    >
      <motion.div
        animate={animating ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}}
        transition={{ duration: 0.45, ease: 'backOut' }}
      >
        {isLiked ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
      </motion.div>
      <span className="font-bold text-xs tracking-wide">أعجبني</span>
    </motion.button>
  );
});

/* ========================================== */
/* SECTION HEADER                            */
/* ========================================== */
const SectionHeader = memo(function SectionHeader({ title, count, actionLabel, actionHref }) {
  return (
    <div className="flex items-end justify-between mb-8 px-1">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{title}</h3>
          {count > 0 && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-lg border border-primary/10">
              {count}
            </span>
          )}
        </div>
        <div className="w-10 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors"
        >
          {actionLabel}
          <FaArrowLeft className="text-[10px] transition-transform group-hover:-translate-x-1" />
        </Link>
      )}
    </div>
  );
});

/* ========================================== */
/* SMALL ACTIVITY CARD                       */
/* ========================================== */
const SmallActivityCard = memo(function SmallActivityCard({ activity, onClick, isUpcoming = false }) {
  return (
    <motion.div
      className="group relative bg-white/70 backdrop-blur-md border border-white/50 rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer overflow-hidden"
      onClick={() => onClick(activity)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex gap-4 h-32 md:h-36">
        <div className="w-28 sm:w-36 md:w-40 shrink-0 rounded-[1.5rem] overflow-hidden relative">
          {activity.image_url ? (
            <>
              <Image src={activity.image_url} alt={activity.title}
                fill sizes="(max-width: 768px) 160px, 160px"
                className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          ) : (
            <div className="w-full h-full bg-base-200 flex items-center justify-center">
              <FaStar className="text-2xl text-primary/30" />
            </div>
          )}
        </div>
        <div className="flex-1 py-2 flex flex-col justify-center min-w-0 pr-1">
          {isUpcoming && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] text-primary font-black uppercase tracking-widest">قادم قريباً</span>
            </div>
          )}
          <h4 className="font-bold text-slate-800 text-base md:text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {activity.title}
          </h4>
          <p className="text-slate-500 text-xs md:text-sm line-clamp-2 leading-relaxed mb-3">
            {activity.short_description}
          </p>
          {activity.activity_date && (
            <div className="mt-auto flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-400">
              <FaCalendarAlt className="text-primary/60" />
              {activity.activity_date}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

/* ========================================== */
/* BOTTOM SHEET MODAL                        */
/* ========================================== */
const BottomSheetModal = memo(function BottomSheetModal({ children, onClose }) {
  const dragControls  = useDragControls();
  const dragOffset    = useMotionValue(0);
  const backdropOpacity = useTransform(dragOffset, [0, 300], [0.5, 0]);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-neutral/60 backdrop-blur-sm"
        style={{ opacity: backdropOpacity }}
        onClick={onClose}
      />
      <motion.div
        className="bg-white w-full sm:max-w-4xl rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl relative z-10 max-h-[94vh] sm:max-h-[85vh] flex flex-col border border-white/20 overflow-hidden"
        initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0, y: 20 }}
        animate={isMobile ? { y: 0 }     : { scale: 1, opacity: 1, y: 0 }}
        exit={isMobile   ? { y: '100%' } : { scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        drag={isMobile ? 'y' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(_, info) => { if (info.offset.y > 150) onClose(); else dragOffset.set(0); }}
        onDrag={(_, info) => dragOffset.set(Math.max(0, info.offset.y))}
      >
        {isMobile && (
          <div
            className="flex flex-col items-center py-4 cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="w-12 h-1.5 bg-base-300 rounded-full mb-1" />
          </div>
        )}
        <div className="overflow-y-auto flex-1 overscroll-contain">{children}</div>
      </motion.div>
    </motion.div>
  );
});

/* ========================================== */
/* MAIN DASHBOARD                            */
/* ========================================== */
export default function Dashboard() {
  const [recentActivities,   setRecentActivities]   = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [selectedActivity,   setSelectedActivity]   = useState(null);
  const [isRegistered,       setIsRegistered]       = useState(false);
  const [registering,        setRegistering]        = useState(false);
  const [expandedImage,      setExpandedImage]      = useState(null);
  const [attendees,          setAttendees]          = useState([]);
  const [attendeesLoading,   setAttendeesLoading]   = useState(false);
  const [showAttendees,      setShowAttendees]      = useState(false);
  const [childrenMap,        setChildrenMap]        = useState({});
  const [selectedChildProfile, setSelectedChildProfile] = useState(null);
  const [statsData, setStatsData] = useState({ registrations: 0, childrenCount: 0 });

  const [supabase] = useState(() => createClient());
  const router = useRouter();
  const { profile: currentProfile, user } = useProfile();
  const isCurrentUserAdmin = currentProfile?.role === 'admin';

  useEffect(() => {
    if (currentProfile === undefined) return;
    if (!user) { router.replace('/login'); return; }

    let isMounted = true;

    const loadData = async () => {
      const cached = readCache();
      if (cached) {
        setRecentActivities(cached.recentActivities);
        setUpcomingActivities(cached.upcomingActivities);
        setStatsData(cached.statsData);
        setLoading(false);
      }

      try {
        updateActivityStatuses(supabase).catch(console.error);

        const cols = 'id,title,short_description,image_url,activity_date,is_upcoming,registration_form_url,start_time,end_time,full_report,notable_notes';
        const [pastRes, upRes, regRes] = await Promise.all([
          supabase.from('activities').select(cols).eq('is_upcoming', false).order('activity_date', { ascending: false }).limit(3),
          supabase.from('activities').select(cols).eq('is_upcoming', true).order('activity_date', { ascending: true }).limit(5),
          supabase.from('activity_registrations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        ]);

        if (!isMounted) return;

        const freshData = {
          recentActivities:   pastRes.data  || [],
          upcomingActivities: upRes.data    || [],
          statsData: {
            registrations:  regRes.count || 0,
            childrenCount:  currentProfile?.children?.length || 0,
          },
        };
        setRecentActivities(freshData.recentActivities);
        setUpcomingActivities(freshData.upcomingActivities);
        setStatsData(freshData.statsData);
        writeCache(freshData);
      } catch (e) { console.error('Load error:', e); }
      finally     { if (isMounted) setLoading(false); }
    };

    loadData();
    return () => { isMounted = false; };
  }, [user, currentProfile, router, supabase]);

  useEffect(() => {
    if (!selectedActivity || !user) return;
    let cancelled = false;

    const checkState = async () => {
      setAttendeesLoading(true);
      try {
        const [regCheck, attCheck] = await Promise.all([
          supabase.from('activity_registrations').select('*').eq('user_id', user.id).eq('activity_id', selectedActivity.id).maybeSingle(),
          supabase.from('attendance').select('id,child_name,child_age,parent_id,is_honored').eq('activity_id', selectedActivity.id),
        ]);
        if (cancelled) return;
        if (regCheck.data) setIsRegistered(true);
        if (attCheck.data) {
          const sorted = [...attCheck.data.filter(a => a.is_honored), ...attCheck.data.filter(a => !a.is_honored)];
          setAttendees(sorted);
          const parentIds = [...new Set(attCheck.data.map(a => a.parent_id).filter(Boolean))];
          if (parentIds.length) {
            const { data: children } = await supabase.from('children').select('*').in('parent_id', parentIds);
            const map = {};
            children?.forEach(c => { map[`${c.parent_id}-${c.name}`] = c; });
            setChildrenMap(map);
          }
        }
      } finally { if (!cancelled) setAttendeesLoading(false); }
    };

    document.body.style.overflow = 'hidden';
    checkState();
    return () => {
      cancelled = true;
      document.body.style.overflow = 'unset';
      setIsRegistered(false);
      setAttendees([]);
      setShowAttendees(false);
    };
  }, [selectedActivity, user, supabase]);

  const handleRegister = useCallback(async () => {
    if (!user || !selectedActivity) return;
    if (selectedActivity.registration_form_url) {
      window.open(selectedActivity.registration_form_url, '_blank');
    } else {
      toast.error('رابط التسجيل غير متوفر حالياً');
    }
    if (isRegistered) return;
    setRegistering(true);
    try {
      const { error } = await supabase.from('activity_registrations').insert([{ user_id: user.id, activity_id: selectedActivity.id }]);
      if (!error || error.code === '23505') setIsRegistered(true);
    } finally { setRegistering(false); }
  }, [user, selectedActivity, isRegistered, supabase]);

  const firstName        = useMemo(() => currentProfile?.parent_name?.split(' ')[0] || '', [currentProfile]);
  const greeting         = useMemo(() => getGreeting(), []);
  const heroUpcoming     = useMemo(() => upcomingActivities[0] || null, [upcomingActivities]);
  const additionalUpcoming = useMemo(() => upcomingActivities.slice(1), [upcomingActivities]);
  const heroRecent       = useMemo(() => recentActivities[0]   || null, [recentActivities]);
  const additionalRecent = useMemo(() => recentActivities.slice(1), [recentActivities]);
  const arabicDateStr    = useMemo(() => arabicDate(), []);

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 md:px-8 lg:px-12 bg-base-100 relative overflow-hidden">

      {/* ── Ambient background blobs ── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10 pointer-events-none -translate-x-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* ════════════════════════════════
          WELCOME HEADER
      ════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-6xl mx-auto mb-14"
      >
        <div className="flex flex-col gap-6">
          <div className="space-y-1.5">
            <p className="text-xs text-primary/70 font-bold tracking-wider">{arabicDateStr}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              {greeting.text}{' '}
              {firstName && (
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-secondary">
                  {firstName}
                </span>
              )}
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex self-start bg-white/80 backdrop-blur-xl border border-primary/20 shadow-sm rounded-full px-6 py-3"
          >
            <p className="text-lg md:text-xl text-primary font-slogan font-bold tracking-wide">
              ✦ جيلٌ يبني، أثرٌ يبقى ✦
            </p>
          </motion.div>
        </div>
      </motion.header>

      {/* ════════════════════════════════
          QUICK STATS
      ════════════════════════════════ */}
      <motion.section
        className="max-w-6xl mx-auto mb-16"
        initial="hidden" animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
              <FaCalendarAlt className="text-primary text-xl" />
            </div>
            <div className="text-3xl font-black text-slate-800">{statsData.registrations}</div>
            <div className="text-xs text-slate-500 font-bold mt-1">نشاطات مسجلة</div>
          </motion.div>

          {currentProfile?.user_type === 'parent' && (
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-3">
                <FaChild className="text-secondary text-xl" />
              </div>
              <div className="text-3xl font-black text-slate-800">{statsData.childrenCount}</div>
              <div className="text-xs text-slate-500 font-bold mt-1">أبناء مسجلين</div>
            </motion.div>
          )}

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-full">
            <Link href="/activities" className="block h-full bg-primary/[0.04] backdrop-blur-xl border border-primary/20 rounded-3xl p-5 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary transition-colors duration-300">
                <FaHistory className="text-primary text-xl group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors relative z-10">سجل النشاطات</div>
              <div className="text-xs text-slate-500 font-medium mt-1 relative z-10">تصفح الأرشيف كاملاً</div>
            </Link>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-full">
            <Link href="/gallery" className="block h-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-3">
                <FaImages className="text-accent text-xl" />
              </div>
              <div className="text-lg font-bold text-slate-800 group-hover:text-accent transition-colors">معرض الصور</div>
              <div className="text-xs text-slate-500 font-medium mt-1">لحظاتنا المميزة</div>
            </Link>
          </motion.div>

        </div>
      </motion.section>

      {/* ════════════════════════════════
          UPCOMING ACTIVITIES
      ════════════════════════════════ */}
      {upcomingActivities.length > 0 && (
        <motion.section
          className="max-w-6xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <SectionHeader title="النشاطات القادمة" count={upcomingActivities.length} />

          {heroUpcoming && (
            <div
              className="relative w-full rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] mb-6 cursor-pointer group h-[400px] md:h-[500px]"
              onClick={() => setSelectedActivity(heroUpcoming)}
            >
              {heroUpcoming.image_url
                ? <Image src={heroUpcoming.image_url} alt={heroUpcoming.title}
                    fill priority sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                : <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
              }
              <div className="absolute inset-0 bg-gradient-to-t from-neutral via-neutral/40 to-transparent opacity-90" />

              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white text-xs font-bold flex items-center gap-2 border border-white/20">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" /> قريباً جداً
                  </div>
                  {heroUpcoming.activity_date && (
                    <div className="text-white/90 text-sm font-bold flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <FaCalendarAlt /> {heroUpcoming.activity_date}
                    </div>
                  )}
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg max-w-3xl">
                  {heroUpcoming.title}
                </h2>
                <p className="text-white/80 text-sm md:text-lg max-w-2xl line-clamp-2 mb-8 font-light leading-relaxed">
                  {heroUpcoming.short_description}
                </p>
                <div>
                  <button className="bg-white text-neutral font-black py-4 px-8 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-sm">
                    التفاصيل والتسجيل <FaArrowLeft />
                  </button>
                </div>
              </div>
            </div>
          )}

          {additionalUpcoming.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalUpcoming.map(act => (
                <SmallActivityCard key={act.id} activity={act} onClick={setSelectedActivity} isUpcoming />
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* ════════════════════════════════
          RECENT ACTIVITIES
      ════════════════════════════════ */}
      {recentActivities.length > 0 && (
        <motion.section
          className="max-w-6xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <SectionHeader title="أحدث الإنجازات" actionLabel="تصفح الأرشيف" actionHref="/activities" />

          {heroRecent && (
            <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[3rem] shadow-[0_10px_40px_rgb(0,0,0,0.03)] overflow-hidden mb-6 group transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1">
                  <div className="inline-flex w-max items-center gap-2 bg-accent/10 text-accent font-bold px-4 py-2 rounded-xl mb-6 border border-accent/20">
                    <FaStar className="text-sm" /> تم الإنجاز بنجاح
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-800 mb-5 leading-snug">
                    {heroRecent.title}
                  </h2>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 font-medium">
                    {heroRecent.short_description}
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <button
                      onClick={() => setSelectedActivity(heroRecent)}
                      className="bg-neutral text-white font-bold px-6 py-3 rounded-xl hover:bg-primary transition-colors flex items-center gap-2 text-sm shadow-md"
                    >
                      قراءة التقرير <FaArrowLeft className="text-xs" />
                    </button>
                    <div className="flex-1" />
                    <LikeButton activityId={heroRecent.id} userId={user.id} />
                  </div>
                </div>
                {heroRecent.image_url && (
                  <div className="w-full lg:w-1/2 h-[280px] lg:h-auto relative overflow-hidden order-1 lg:order-2 cursor-pointer p-4 lg:p-6 lg:pl-0">
                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-base-300">
                      <Image src={heroRecent.image_url} alt={heroRecent.title}
                        fill sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); setExpandedImage(heroRecent.image_url); }}
                      >
                        <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-300 shadow-xl">
                          <FaExpand className="text-white text-xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {additionalRecent.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalRecent.map(act => (
                <SmallActivityCard key={act.id} activity={act} onClick={setSelectedActivity} />
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* ════════════════════════════════
          EMPTY STATE
      ════════════════════════════════ */}
      {recentActivities.length === 0 && upcomingActivities.length === 0 && (
        <motion.section
          className="max-w-4xl mx-auto mb-20 text-center"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-white/60">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaRegCalendarAlt className="text-4xl text-primary/40" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4">مرحباً بك في منصتك!</h3>
            <p className="text-slate-500 text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed">
              نحن نعمل حالياً على تجهيز نشاطات وفعاليات رائعة. في هذه الأثناء، تفضل باستكشاف الجمعية أو تواصل معنا.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/about"
                className="bg-neutral text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-primary transition-colors shadow-lg flex items-center gap-2">
                <FaUsers /> تعرف علينا
              </Link>
              <Link href="/contact"
                className="bg-white text-slate-700 font-bold border border-base-300 px-8 py-3.5 rounded-2xl hover:bg-base-200 transition-colors shadow-sm flex items-center gap-2">
                <FaEnvelope /> تواصل معنا
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* ════════════════════════════════
          QUICK LINKS
      ════════════════════════════════ */}
      <motion.section
        className="max-w-4xl mx-auto mb-10"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      >
        <div className="bg-white/60 backdrop-blur-xl rounded-full p-2 md:p-3 shadow-sm border border-primary/10 mx-auto w-max max-w-full overflow-x-auto">
          <div className="flex items-center gap-1 md:gap-2 px-2">
            {[
              { href: '/profile',  icon: FaChild,           label: 'ملفي الشخصي' },
              { href: '/contact',  icon: FaEnvelope,        label: 'راسل الإدارة' },
              { href: '/donate',   icon: FaHandHoldingHeart, label: 'ادعمنا' },
              { href: '/about',    icon: FaUsers,           label: 'عن الجمعية' },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-slate-500 hover:text-primary hover:bg-base-200 transition-all font-bold text-xs md:text-sm whitespace-nowrap"
              >
                <Icon className="text-lg opacity-70" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ════════════════════════════════
          ACTIVITY DETAIL MODAL
      ════════════════════════════════ */}
      <AnimatePresence>
        {selectedActivity && (
          <BottomSheetModal onClose={() => setSelectedActivity(null)}>
            <div className="relative pb-10">
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-6 left-6 w-12 h-12 rounded-full bg-neutral/30 backdrop-blur-md flex items-center justify-center text-white z-20 hover:bg-neutral/50 transition-all shadow-lg border border-white/10"
              >
                <FaTimes className="text-lg" />
              </button>

              {selectedActivity.image_url ? (
                <div
                  className="w-full h-[35vh] sm:h-[45vh] relative cursor-pointer group"
                  onClick={() => setExpandedImage(selectedActivity.image_url)}
                >
                  <Image src={selectedActivity.image_url} alt={selectedActivity.title} fill sizes="100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-neutral/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                    <FaExpand className="text-2xl" />
                  </div>
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-primary/10 to-secondary/10" />
              )}

              <div className={`px-6 sm:px-12 max-w-4xl mx-auto ${selectedActivity.image_url ? '-mt-20 relative z-10' : 'pt-8'}`}>
                <h3 className="text-3xl sm:text-5xl font-black text-slate-800 mb-6 leading-tight">
                  {selectedActivity.title}
                </h3>
                {selectedActivity.short_description && (
                  <p className="text-slate-600 text-lg sm:text-xl font-medium leading-relaxed mb-10">
                    {selectedActivity.short_description}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {selectedActivity.activity_date && (
                    <div className="bg-base-100 border border-base-300 p-5 rounded-[2rem] flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary/10 text-primary rounded-[1.2rem] flex items-center justify-center shrink-0">
                        <FaCalendarAlt className="text-xl" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">تاريخ النشاط</div>
                        <div className="font-black text-slate-800 text-lg">{selectedActivity.activity_date}</div>
                      </div>
                    </div>
                  )}
                  {selectedActivity.start_time && (
                    <div className="bg-base-100 border border-base-300 p-5 rounded-[2rem] flex items-center gap-4">
                      <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-[1.2rem] flex items-center justify-center shrink-0">
                        <FaClock className="text-xl" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">التوقيت</div>
                        <div className="font-black text-slate-800 text-lg">
                          {selectedActivity.start_time.slice(0, 5)}
                          {selectedActivity.end_time && ` - ${selectedActivity.end_time.slice(0, 5)}`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-10">
                  <h4 className="font-black text-xl text-slate-800 mb-5 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FaInfoCircle className="text-primary text-sm" />
                    </span>
                    التفاصيل الكاملة
                  </h4>
                  <div className="prose prose-lg prose-slate max-w-none bg-base-100 p-8 rounded-[2.5rem] border border-base-300 leading-loose">
                    {selectedActivity.full_report
                      ? <p className="whitespace-pre-wrap">{selectedActivity.full_report}</p>
                      : <p className="text-slate-400 italic">لا توجد تفاصيل إضافية مسجلة.</p>
                    }
                  </div>
                </div>

                {selectedActivity.notable_notes && (
                  <div className="bg-accent/10 border border-accent/20 p-8 rounded-[2.5rem] mb-10 flex gap-5">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <FaStar className="text-accent text-xl" />
                    </div>
                    <div>
                      <h5 className="font-black text-accent text-lg mb-2">ملاحظات هامة للنشاط</h5>
                      <p className="text-accent/80 text-base leading-relaxed whitespace-pre-wrap">{selectedActivity.notable_notes}</p>
                    </div>
                  </div>
                )}

                {/* Attendees */}
                {!attendeesLoading && attendees.length > 0 && (
                  <div className="bg-base-100 border border-base-300 rounded-[2.5rem] overflow-hidden mb-10">
                    <button
                      onClick={() => setShowAttendees(!showAttendees)}
                      className="w-full flex items-center justify-between p-6 hover:bg-base-200 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white shadow-sm text-primary rounded-2xl flex items-center justify-center">
                          <FaUsers className="text-xl" />
                        </div>
                        <div className="text-right">
                          <h4 className="font-black text-slate-800 text-lg">سجل الحضور</h4>
                          <p className="text-sm font-bold text-slate-500 mt-1">{attendees.length} مسجلين</p>
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300 ${showAttendees ? 'rotate-180' : ''}`}>
                        <FaChevronDown className="text-slate-500 text-sm" />
                      </div>
                    </button>
                    <AnimatePresence>
                      {showAttendees && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="border-t border-base-300"
                        >
                          <div className="p-6 space-y-3 max-h-72 overflow-y-auto">
                            {attendees.map(a => {
                              const childRec = a.parent_id ? childrenMap[`${a.parent_id}-${a.child_name}`] : null;
                              return (
                                <div
                                  key={a.id}
                                  className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border border-base-300 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
                                  onClick={() => childRec && setSelectedChildProfile({ record: childRec, parentId: a.parent_id })}
                                >
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    a.is_honored ? 'bg-accent/10 text-accent' : 'bg-base-200 text-primary'
                                  }`}>
                                    {a.is_honored ? <FaCrown className="text-lg" /> : <FaChild />}
                                  </div>
                                  <div className="flex-1">
                                    <span className="font-bold text-base text-slate-800 group-hover:text-primary transition-colors">{a.child_name}</span>
                                    {a.child_age && <div className="text-xs font-bold text-slate-400 mt-0.5">{a.child_age} سنوات</div>}
                                  </div>
                                  {childRec && <FaArrowLeft className="text-slate-300 group-hover:text-primary transition-colors text-sm opacity-0 group-hover:opacity-100" />}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Register CTA */}
                {selectedActivity.is_upcoming && (
                  <div className="sticky bottom-6 z-20 mt-8">
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className={`w-full py-5 rounded-[2rem] shadow-2xl text-white font-black text-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                        isRegistered
                          ? 'bg-emerald-500 shadow-emerald-500/30'
                          : 'bg-gradient-to-l from-primary to-secondary shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {registering ? (
                        <><div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> جاري التأكيد...</>
                      ) : isRegistered ? (
                        <><FaCheckCircle className="text-2xl" /> تم التسجيل بنجاح</>
                      ) : (
                        <>تأكيد التسجيل <FaArrowLeft className="text-lg" /></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </BottomSheetModal>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════
          IMAGE LIGHTBOX
      ════════════════════════════════ */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
          >
            <div className="absolute inset-0 bg-neutral/95 backdrop-blur-2xl" />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-6 left-6 z-30 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10"
            >
              <FaTimes className="text-2xl" />
            </button>
            <motion.img
              src={expandedImage} alt="صورة مكبرة"
              className="relative z-20 max-w-full max-h-[90vh] object-contain rounded-3xl shadow-2xl border border-white/10"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════
          CHILD PROFILE MODAL
      ════════════════════════════════ */}
      {selectedChildProfile && (
        <ChildProfileModal
          child={selectedChildProfile.record}
          parentId={selectedChildProfile.parentId}
          isAdmin={isCurrentUserAdmin}
          isOwner={user?.id === selectedChildProfile.parentId}
          onClose={() => setSelectedChildProfile(null)}
          onUpdate={() => setSelectedChildProfile(null)}
        />
      )}
    </main>
  );
}