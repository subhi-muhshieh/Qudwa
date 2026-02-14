'use client'
import { createClient } from '../utils/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaHeart, FaPaperPlane, FaCalendarAlt, FaStar, FaArrowLeft, FaClock,
  FaInfoCircle, FaTimes, FaExternalLinkAlt, FaCheckCircle, FaSpinner,
  FaRegHeart, FaExpand, FaUsers, FaChevronDown, FaCrown, FaChild,
  FaImages, FaHistory, FaEnvelope, FaHandHoldingHeart, FaRegCalendarAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { updateActivityStatuses } from '../utils/activityHelpers';
import { useProfile } from '../context/ProfileContext';
import { getLevelDef } from '../utils/constants';
import ChildProfileModal from '../components/ChildProfileModal';

/* ========================================== */
/*  LIKE BUTTON                               */
/* ========================================== */
const LikeButton = ({ activityId, userId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase
        .from('likes').select('id')
        .eq('user_id', userId).eq('activity_id', activityId)
        .maybeSingle();
      if (data) setIsLiked(true);
      setLoading(false);
    };
    check();
  }, [activityId, userId]);

  const toggleLike = async () => {
    if (loading) return;
    const prev = isLiked;
    setIsLiked(!prev);
    setAnimating(true);
    if (!prev) {
      const { error } = await supabase.from('likes').insert([{ user_id: userId, activity_id: activityId }]);
      if (error) { setIsLiked(prev); toast.error("حدث خطأ"); }
    } else {
      const { error } = await supabase.from('likes').delete().eq('user_id', userId).eq('activity_id', activityId);
      if (error) { setIsLiked(prev); toast.error("حدث خطأ"); }
    }
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <motion.button onClick={toggleLike} whileTap={{ scale: 0.85 }}
      className={`btn rounded-xl px-5 transition-all duration-300 gap-2 border-2 ${
        isLiked ? 'btn-error bg-error/10 text-error border-error/20' : 'btn-outline border-base-300 hover:border-error/30 hover:text-error'
      }`}>
      <motion.div animate={animating ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}} transition={{ duration: 0.4 }}>
        {isLiked ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
      </motion.div>
      <span className="font-bold text-sm">أعجبني</span>
    </motion.button>
  );
};

/* ========================================== */
/*  HELPERS                                   */
/* ========================================== */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: 'صباح الخير', emoji: '☀️' };
  if (h >= 12 && h < 17) return { text: 'مرحباً بعودتك', emoji: '👋' };
  if (h >= 17 && h < 21) return { text: 'مساء الخير', emoji: '🌅' };
  return { text: 'مساء النور', emoji: '🌙' };
};

const arabicDate = () =>
  new Intl.DateTimeFormat('ar', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date());

/* ========================================== */
/*  ANIMATION VARIANTS                        */
/* ========================================== */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ========================================== */
/*  SECTION HEADER                            */
/* ========================================== */
const SectionHeader = ({ color = 'primary', title, count, actionLabel, actionHref }) => (
  <div className="flex items-center justify-between mb-5 md:mb-6 px-1">
    <div className="flex items-center gap-3">
      <div className={`w-1.5 h-8 bg-${color} rounded-full`} />
      <h3 className="text-lg md:text-2xl font-bold text-base-content">{title}</h3>
      {count > 0 && (
        <span className={`badge badge-sm badge-${color} badge-outline font-bold`}>{count}</span>
      )}
    </div>
    {actionLabel && actionHref && (
      <Link href={actionHref} className={`btn btn-ghost btn-sm text-${color} gap-1 text-xs md:text-sm`}>
        {actionLabel} <FaArrowLeft className="text-[10px]" />
      </Link>
    )}
  </div>
);

/* ========================================== */
/*  SMALL ACTIVITY CARD                       */
/* ========================================== */
const SmallActivityCard = ({ activity, onClick, isUpcoming = false }) => (
  <motion.div
    className={`bg-base-100 rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group active:scale-[0.98] ${
      isUpcoming ? 'border-primary/20 ring-1 ring-primary/5' : 'border-base-200'
    }`}
    onClick={() => onClick(activity)}
    whileHover={{ y: -3 }}
    variants={staggerItem}
  >
    <div className="flex flex-row h-32 sm:h-36 md:h-40">
      {activity.image_url ? (
        <div className="w-28 sm:w-36 md:w-44 shrink-0 overflow-hidden relative">
          <img src={activity.image_url} alt={activity.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          {isUpcoming && (
            <div className="absolute top-2 right-2">
              <span className="flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className={`w-28 sm:w-36 md:w-44 shrink-0 flex items-center justify-center ${
          isUpcoming ? 'bg-primary/5' : 'bg-base-200'
        }`}>
          {isUpcoming ? <FaCalendarAlt className="text-3xl text-primary/30" /> : <FaStar className="text-3xl text-base-300" />}
        </div>
      )}
      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center min-w-0">
        {isUpcoming && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] text-primary font-bold tracking-wide">قادم</span>
          </div>
        )}
        <h4 className="font-bold text-base-content text-sm sm:text-base md:text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {activity.title}
        </h4>
        <p className="text-base-content/50 text-[11px] sm:text-xs md:text-sm line-clamp-2 mb-2 leading-relaxed">
          {activity.short_description}
        </p>
        {activity.activity_date && (
          <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full w-fit ${
            isUpcoming ? 'text-primary bg-primary/10 font-medium' : 'text-base-content/40 bg-base-200/60'
          }`}>
            {activity.activity_date}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

/* ========================================== */
/*  BOTTOM SHEET MODAL (with drag-to-dismiss) */
/* ========================================== */
const DISMISS_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 500;

const BottomSheetModal = ({ children, onClose }) => {
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useMotionValue(0);
  const backdropDragOpacity = useTransform(dragOffset, [0, 400], [0.6, 0]);

  // Synchronous mobile check — safe because this component only
  // renders client-side (behind a truthy state gate).
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 640;

  const handleDragEnd = (_, info) => {
    if (
      info.offset.y > DISMISS_THRESHOLD ||
      info.velocity.y > VELOCITY_THRESHOLD
    ) {
      // Dismiss
      onClose();
    } else {
      // Snap back — reset offset BEFORE removing style control
      dragOffset.set(0);
      setIsDragging(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
    >
      {/* ---- Backdrop ---- */}
      {/* While idle: animate controls opacity (0 → 0.6).              */}
      {/* While dragging: motionValue overrides it so it fades in sync. */}
      <motion.div
        className="absolute inset-0 bg-black backdrop-blur-md"
        style={
          isMobile && isDragging
            ? { opacity: backdropDragOpacity }
            : undefined
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* ---- Sheet ---- */}
      <motion.div
        className="bg-base-100 w-full sm:max-w-3xl rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        initial={
          isMobile
            ? { y: '100%' }
            : { scale: 0.95, y: 30, opacity: 0 }
        }
        animate={
          isMobile
            ? { y: 0 }
            : { scale: 1, y: 0, opacity: 1 }
        }
        exit={
          isMobile
            ? { y: '100%' }
            : { scale: 0.95, y: 30, opacity: 0 }
        }
        transition={{ type: 'spring', damping: 30, stiffness: 280 }}
        /* Drag — mobile only, handle-initiated */
        drag={isMobile ? 'y' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragStart={() => setIsDragging(true)}
        onDrag={(_, info) =>
          dragOffset.set(Math.max(0, info.offset.y))
        }
        onDragEnd={handleDragEnd}
      >
        {/* ---- Drag handle (mobile) ---- */}
        {isMobile && (
          <div
            className="flex flex-col items-center pt-3 pb-2 sticky top-0 z-30 bg-base-100 cursor-grab active:cursor-grabbing touch-none select-none"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <motion.div
              className="w-12 h-1.5 bg-base-300 rounded-full"
              initial={{ scaleX: 0.5, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.35 }}
            />
            <motion.p
              className="text-[10px] text-base-content/30 mt-1 select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              اسحب للإغلاق
            </motion.p>
          </div>
        )}

        {/* ---- Scrollable content ---- */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 overscroll-contain">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ========================================== */
/*  DASHBOARD PAGE                            */
/* ========================================== */
export default function Dashboard() {
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [childrenMap, setChildrenMap] = useState({});
  const [selectedChildProfile, setSelectedChildProfile] = useState(null);

  const [statsData, setStatsData] = useState({ registrations: 0, childrenCount: 0 });

  const supabase = createClient();
  const router = useRouter();
  const { profile: currentProfile } = useProfile();
  const isCurrentUserAdmin = currentProfile?.role === 'admin';

  /* ---------- data fetch ---------- */
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }
      setUser(user);
      await updateActivityStatuses(supabase);

      const [pastRes, upRes, regRes, profRes] = await Promise.all([
        supabase.from('activities').select('*').eq('is_upcoming', false)
          .order('activity_date', { ascending: false }).limit(3),
        supabase.from('activities').select('*').eq('is_upcoming', true)
          .order('activity_date', { ascending: true }).limit(6),
        supabase.from('activity_registrations').select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase.from('profiles').select('children').eq('id', user.id).single(),
      ]);

      if (pastRes.data) setRecentActivities(pastRes.data);
      if (upRes.data) setUpcomingActivities(upRes.data);
      setStatsData({
        registrations: regRes.count || 0,
        childrenCount: profRes.data?.children?.length || 0,
      });
      setLoading(false);
    };
    load();
  }, [router]);

  /* ---------- modal side-effects ---------- */
  useEffect(() => {
    if (!selectedActivity || !user) return;
    let cancelled = false;

    const checkReg = async () => {
      setIsRegistered(false);
      const { data } = await supabase.from('activity_registrations').select('*')
        .eq('user_id', user.id).eq('activity_id', selectedActivity.id).maybeSingle();
      if (!cancelled && data) setIsRegistered(true);
    };
    const fetchAtt = async () => {
      setAttendeesLoading(true);
      const { data } = await supabase.from('attendance')
        .select('id, child_name, child_age, parent_name, parent_id, is_honored')
        .eq('activity_id', selectedActivity.id).order('child_name');
      if (!cancelled && data) {
        setAttendees([...data.filter(a => a.is_honored), ...data.filter(a => !a.is_honored)]);
        const pIds = [...new Set(data.map(a => a.parent_id).filter(Boolean))];
        if (pIds.length) {
          const { data: cd } = await supabase.from('children').select('*').in('parent_id', pIds);
          const m = {};
          (cd || []).forEach(c => { m[`${c.parent_id}-${c.name}`] = c; });
          if (!cancelled) setChildrenMap(m);
        }
      }
      if (!cancelled) setAttendeesLoading(false);
    };

    document.body.style.overflow = 'hidden';
    checkReg();
    fetchAtt();

    return () => {
      cancelled = true;
      document.body.style.overflow = 'unset';
      setAttendees([]);
      setShowAttendees(false);
      setChildrenMap({});
    };
  }, [selectedActivity, user]);

  useEffect(() => {
    if (expandedImage) document.body.style.overflow = 'hidden';
    else if (!selectedActivity) document.body.style.overflow = 'unset';
  }, [expandedImage, selectedActivity]);

  useEffect(() => {
    const esc = (e) => {
      if (e.key === 'Escape') {
        if (expandedImage) setExpandedImage(null);
        else if (selectedActivity) setSelectedActivity(null);
      }
    };
    if (selectedActivity || expandedImage) document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [selectedActivity, expandedImage]);

  /* ---------- registration ---------- */
  const handleRegister = async () => {
    if (!user || !selectedActivity) return;
    if (selectedActivity.registration_form_url) {
      window.open(selectedActivity.registration_form_url, '_blank');
    } else {
      toast.error("رابط التسجيل غير متوفر، ولكن تم تسجيل اهتمامك.");
    }
    if (isRegistered) return;
    setRegistering(true);
    const { error } = await supabase.from('activity_registrations')
      .insert([{ user_id: user.id, activity_id: selectedActivity.id }]);
    if (!error || error.code === '23505') {
      setIsRegistered(true);
      if (selectedActivity.registration_form_url) toast.success("جاري فتح النموذج...", { duration: 2000 });
      try {
        await fetch('/api/notifications/send', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userIds: [user.id], type: 'registration_confirmed',
            title: 'تم تأكيد التسجيل ✅',
            message: `تم تسجيلك بنجاح في نشاط: ${selectedActivity.title}`,
            link: '/dashboard', activityId: selectedActivity.id,
          }),
        });
      } catch (_) {}
    }
    setRegistering(false);
  };

  /* ---------- loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <span className="loading loading-ring loading-lg text-primary absolute inset-0" />
          </div>
          <p className="text-base-content/40 text-sm animate-pulse">جاري تحميل لوحتك…</p>
        </div>
      </div>
    );
  }

  /* ---------- derived ---------- */
  const firstName = currentProfile?.parent_name?.split(' ')[0] || '';
  const greeting = getGreeting();
  const heroUpcoming = upcomingActivities[0] || null;
  const additionalUpcoming = upcomingActivities.slice(1);
  const heroRecent = recentActivities[0] || null;
  const additionalRecent = recentActivities.slice(1);

  return (
<main className="min-h-screen pt-32 sm:pt-36 md:pt-40 pb-20 px-4 md:px-8 lg:px-10 overflow-hidden">
      {/* ======== WELCOME HEADER ======== */}
       <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-6xl mx-auto mb-10 md:mb-14"
  >
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Top row: greeting + date */}
      <div className="space-y-1.5">
        <p className="text-[11px] md:text-xs text-base-content/40 font-medium tracking-wide">
          {arabicDate()}
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-base-content leading-tight">
          {greeting.text}
          {firstName && (
            <>
              {' '}
              <span className="text-primary">{firstName}</span>
            </>
          )}
          {' '}
          <span className="inline-block">{greeting.emoji}</span>
        </h1>
        <p className="text-base-content/45 text-xs sm:text-sm mt-0.5">
          إليك ملخّص آخر المستجدات في منصة قدوة
        </p>
      </div>

      {/* Slogan — prominent */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-lg" />
        <div className="relative bg-gradient-to-r from-primary/[0.08] via-secondary/[0.06] to-accent/[0.08] border border-primary/20 rounded-2xl px-6 py-4 sm:px-8 sm:py-5 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3">
            <div className="hidden sm:block w-12 h-[1px] bg-gradient-to-r from-transparent to-primary/40" />
            <p className="text-lg sm:text-xl md:text-2xl text-primary font-slogan font-bold tracking-wide text-center">
              ✦ جيلٌ يبني، أثرٌ يبقى ✦
            </p>
            <div className="hidden sm:block w-12 h-[1px] bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>
      </motion.div>
    </div>
  </motion.header>

      {/* ======== QUICK STATS ======== */}
      <motion.section
        className="max-w-6xl mx-auto mb-10 md:mb-14"
        variants={staggerContainer} initial="hidden" animate="visible"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <motion.div variants={staggerItem}
            className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <FaCalendarAlt className="text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold text-primary tabular-nums">{statsData.registrations}</div>
              <div className="text-[10px] md:text-xs text-base-content/50 truncate">تسجيل في نشاطات</div>
            </div>
          </motion.div>

          {currentProfile?.user_type === 'parent' && (
            <motion.div variants={staggerItem}
              className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                <FaChild className="text-secondary" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-bold text-secondary tabular-nums">{statsData.childrenCount}</div>
                <div className="text-[10px] md:text-xs text-base-content/50 truncate">أبناء مسجلين</div>
              </div>
            </motion.div>
          )}

          <motion.div variants={staggerItem}>
            <Link href="/activities"
              className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-200 flex items-center gap-3 hover:shadow-md hover:border-primary/20 transition-all group h-full active:scale-[0.97]">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                <FaHistory className="text-accent group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-base-content group-hover:text-primary transition-colors truncate">سجل النشاطات</div>
                <div className="text-[10px] text-base-content/40 truncate">عرض الأرشيف</div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Link href="/gallery"
              className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-200 flex items-center gap-3 hover:shadow-md hover:border-primary/20 transition-all group h-full active:scale-[0.97]">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-warning transition-colors">
                <FaImages className="text-warning group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-base-content group-hover:text-primary transition-colors truncate">معرض الصور</div>
                <div className="text-[10px] text-base-content/40 truncate">لحظاتنا المميزة</div>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ======== UPCOMING ACTIVITIES ======== */}
      {upcomingActivities.length > 0 ? (
        <motion.section
          className="max-w-6xl mx-auto mb-14 md:mb-20"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
          variants={fadeInUp}
        >
          <SectionHeader color="primary" title="النشاطات القادمة" count={upcomingActivities.length} />

          {heroUpcoming && (
            <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.4rem] blur opacity-20 group-hover:opacity-40 transition duration-700" />
              <div className="card w-full bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-2xl rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-black/10 blur-3xl pointer-events-none" />
                <div className="card-body p-5 sm:p-8 md:p-10 lg:p-12 relative z-10">
                  <div className="flex flex-wrap justify-between items-center mb-5 md:mb-7 gap-2">
                    <div className="badge bg-white/20 border-0 text-white backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 h-auto gap-2 text-xs sm:text-sm font-bold shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                      <span>النشاط القادم</span>
                    </div>
                    {heroUpcoming.activity_date && (
                      <div className="text-blue-100 font-medium bg-black/10 px-3 py-1.5 rounded-lg text-xs sm:text-sm">
                        {heroUpcoming.activity_date}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
                    <div className="w-full lg:w-1/2 text-right space-y-3 md:space-y-5 order-2 lg:order-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight drop-shadow-md break-words">
                        {heroUpcoming.title}
                      </h2>
                      <p className="text-sm sm:text-base md:text-lg text-blue-50 opacity-90 leading-relaxed font-light line-clamp-3 break-words">
                        {heroUpcoming.short_description}
                      </p>
                      {heroUpcoming.start_time && (
                        <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                          <FaClock />
                          <span>{heroUpcoming.start_time.slice(0, 5)}</span>
                          {heroUpcoming.end_time && <span>– {heroUpcoming.end_time.slice(0, 5)}</span>}
                        </div>
                      )}
                      <div className="pt-2">
                        <button onClick={() => setSelectedActivity(heroUpcoming)}
                          className="btn btn-sm sm:btn-md bg-white text-primary hover:bg-blue-50 border-none rounded-xl sm:rounded-2xl px-6 sm:px-8 shadow-xl w-full sm:w-auto text-xs sm:text-sm active:scale-95 transition-transform">
                          التفاصيل والتسجيل <FaArrowLeft className="mr-1 text-xs" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end shrink-0">
                      {heroUpcoming.image_url ? (
                        <div className="relative w-full max-w-md h-44 sm:h-56 md:h-72 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 sm:rotate-1 hover:rotate-0 transition-all duration-500 cursor-pointer group/img"
                          onClick={(e) => { e.stopPropagation(); setExpandedImage(heroUpcoming.image_url); }}>
                          <img src={heroUpcoming.image_url} alt={heroUpcoming.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <FaExpand className="text-white text-2xl drop-shadow-lg opacity-0 group-hover/img:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ) : (
                        <div className="hidden sm:flex justify-center opacity-60">
                          <FaCalendarAlt className="text-[8rem] md:text-[10rem] text-white/15" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {additionalUpcoming.length > 0 && (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
              variants={staggerContainer} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}>
              {additionalUpcoming.map((act) => (
                <SmallActivityCard key={act.id} activity={act} onClick={setSelectedActivity} isUpcoming />
              ))}
            </motion.div>
          )}
        </motion.section>
      ) : (
        <motion.section className="max-w-6xl mx-auto mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="bg-base-100 rounded-3xl p-8 md:p-12 text-center shadow-sm border border-base-200">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRegCalendarAlt className="text-xl md:text-2xl text-primary/50" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-base-content mb-2">لا توجد نشاطات قادمة حالياً</h3>
            <p className="text-base-content/50 text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
              ترقبوا إعلاناتنا عن النشاطات الجديدة!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/activities" className="btn btn-primary btn-sm rounded-xl text-white gap-2"><FaHistory /> سجل النشاطات</Link>
              <Link href="/gallery" className="btn btn-ghost btn-sm rounded-xl gap-2"><FaImages /> معرض الصور</Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* ======== RECENT ACTIVITIES ======== */}
      {recentActivities.length > 0 && (
        <motion.section className="max-w-6xl mx-auto mb-14 md:mb-20"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeInUp}>
          <SectionHeader color="secondary" title="أحدث ما قمنا به" actionLabel="عرض الكل" actionHref="/activities" />

          {heroRecent && (
            <div className="bg-base-100/70 backdrop-blur-xl border border-base-content/10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 mb-5 md:mb-6">
              <div className="flex flex-col lg:flex-row-reverse">
                {heroRecent.image_url ? (
                  <div className="w-full lg:w-5/12 h-[220px] sm:h-[260px] lg:h-auto relative group overflow-hidden cursor-pointer"
                    onClick={() => setExpandedImage(heroRecent.image_url)}>
                    <img src={heroRecent.image_url} alt={heroRecent.title} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-black/20 lg:to-transparent" />
                    <div className="absolute bottom-3 right-3 lg:top-4 lg:right-4 badge badge-secondary shadow-lg border-none text-xs">
                      <FaStar className="mr-1 text-[9px]" /> تم إنجازه
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                      <FaExpand className="text-white text-2xl drop-shadow-lg" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full lg:w-5/12 bg-base-200 flex items-center justify-center min-h-[220px]">
                    <FaStar className="text-5xl text-base-300" />
                  </div>
                )}
                <div className="w-full lg:w-7/12 p-5 sm:p-6 md:p-10 text-right flex flex-col justify-center min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-base-content break-words leading-snug">{heroRecent.title}</h2>
                  <p className="text-sm md:text-base text-base-content/70 leading-relaxed mb-4 md:mb-6 line-clamp-3 break-words">{heroRecent.short_description}</p>
                  {heroRecent.activity_date && (
                    <p className="text-xs text-base-content/40 mb-4 md:mb-6 flex items-center gap-2">
                      <FaCalendarAlt className="text-primary text-[11px]" /> {heroRecent.activity_date}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-auto items-center">
                    <LikeButton activityId={heroRecent.id} userId={user.id} />
                    <button onClick={() => setSelectedActivity(heroRecent)}
                      className="btn btn-ghost text-base-content/60 hover:text-primary rounded-xl text-xs sm:text-sm">
                      قراءة المزيد…
                    </button>
                    <div className="flex-grow" />
                    <Link href="/contact" className="btn btn-xs sm:btn-sm btn-ghost text-secondary opacity-70 hover:opacity-100 gap-1.5 hidden sm:inline-flex">
                      <FaPaperPlane className="text-[10px]" /> تواصل معنا
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {additionalRecent.length > 0 && (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
              variants={staggerContainer} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}>
              {additionalRecent.map((act) => (
                <SmallActivityCard key={act.id} activity={act} onClick={setSelectedActivity} />
              ))}
            </motion.div>
          )}
        </motion.section>
      )}

      {/* ======== EMPTY STATE ======== */}
      {recentActivities.length === 0 && upcomingActivities.length === 0 && (
        <motion.section className="max-w-4xl mx-auto mb-20 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="bg-base-100 rounded-3xl p-8 sm:p-10 md:p-16 shadow-sm border border-base-200">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <FaStar className="text-2xl md:text-3xl text-primary/40" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-base-content mb-2">مرحباً بك في قدوة!</h3>
            <p className="text-base-content/50 text-xs sm:text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
              نحن نجهز نشاطات رائعة لكم. في هذه الأثناء، تعرف علينا أكثر أو تواصل معنا.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/about" className="btn btn-primary rounded-xl text-white gap-2 btn-sm sm:btn-md"><FaUsers /> تعرف علينا</Link>
              <Link href="/contact" className="btn btn-ghost rounded-xl gap-2 btn-sm sm:btn-md"><FaEnvelope /> تواصل معنا</Link>
              <Link href="/donate" className="btn btn-outline btn-primary rounded-xl gap-2 btn-sm sm:btn-md"><FaHandHoldingHeart /> ادعمنا</Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* ======== QUICK LINKS ======== */}
      <motion.section className="max-w-6xl mx-auto mb-10"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <div className="bg-base-100 rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm border border-base-200">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {[
              { href: '/profile', icon: FaChild, label: 'ملفي الشخصي' },
              { href: '/contact', icon: FaEnvelope, label: 'راسل الإدارة' },
              { href: '/donate', icon: FaHandHoldingHeart, label: 'ادعمنا' },
              { href: '/about', icon: FaUsers, label: 'عن الجمعية' },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                className="btn btn-ghost btn-xs sm:btn-sm rounded-xl gap-1.5 text-base-content/60 hover:text-primary active:scale-95 transition-transform">
                <Icon className="text-[11px]" /> <span className="text-[11px] sm:text-xs">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ==================================================
          ACTIVITY DETAIL MODAL
      ================================================== */}
      <AnimatePresence>
        {selectedActivity && (
          <BottomSheetModal onClose={() => setSelectedActivity(null)}>
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 btn btn-circle btn-sm bg-black/20 border-none text-white z-20 hover:bg-red-500 transition-colors"
            >
              <FaTimes />
            </button>

            {selectedActivity.image_url && (
              <div className="w-full h-48 sm:h-64 md:h-80 relative cursor-pointer group"
                onClick={() => setExpandedImage(selectedActivity.image_url)}>
                <img src={selectedActivity.image_url} alt={selectedActivity.title} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-5 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-base-content drop-shadow-sm line-clamp-2 break-words">
                    {selectedActivity.title}
                  </h3>
                </div>
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaExpand className="text-white text-sm" />
                </div>
              </div>
            )}

            <div className="p-5 sm:p-6 md:p-10 text-right space-y-6 sm:space-y-8">
              {!selectedActivity.image_url && (
                <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-primary mb-4 md:mb-6 break-words">
                  {selectedActivity.title}
                </h3>
              )}

              {selectedActivity.short_description && (
                <p className="text-base-content/70 text-sm sm:text-base md:text-lg leading-relaxed break-words">
                  {selectedActivity.short_description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {selectedActivity.activity_date && (
                  <div className="flex items-center gap-3 sm:gap-4 bg-base-200/50 p-3 sm:p-4 rounded-2xl">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                      <FaCalendarAlt className="text-sm" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs text-base-content/50">التاريخ</div>
                      <div className="font-bold text-sm sm:text-base text-base-content">{selectedActivity.activity_date}</div>
                    </div>
                  </div>
                )}
                {selectedActivity.start_time && (
                  <div className="flex items-center gap-3 sm:gap-4 bg-base-200/50 p-3 sm:p-4 rounded-2xl">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-warning/10 text-warning rounded-full flex items-center justify-center shrink-0">
                      <FaClock className="text-sm" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs text-base-content/50">الوقت</div>
                      <div className="font-bold text-sm sm:text-base text-base-content">
                        {selectedActivity.start_time.slice(0, 5)}
                        {selectedActivity.end_time ? ` - ${selectedActivity.end_time.slice(0, 5)}` : ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-lg sm:text-xl text-primary mb-3 sm:mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-base shrink-0" /> التفاصيل
                </h4>
                <p className="text-base-content/80 whitespace-pre-wrap leading-loose text-sm sm:text-base break-words overflow-wrap-anywhere">
                  {selectedActivity.full_report}
                </p>
              </div>

              {selectedActivity.notable_notes && (
                <div className="bg-warning/10 border border-warning/20 p-4 sm:p-6 rounded-2xl flex gap-3 sm:gap-4 items-start">
                  <FaStar className="text-warning text-lg sm:text-xl mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <h5 className="font-bold text-base-content mb-1 text-sm sm:text-base">ملاحظات هامة</h5>
                    <p className="text-base-content/70 text-xs sm:text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
                      {selectedActivity.notable_notes}
                    </p>
                  </div>
                </div>
              )}

              {!attendeesLoading && attendees.length > 0 && (
                <div className="border border-base-200 rounded-2xl overflow-hidden">
                  <button onClick={() => setShowAttendees(!showAttendees)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-base-200/50 transition-colors active:bg-base-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                        <FaUsers className="text-sm" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold text-base-content text-sm sm:text-base">سجل الحضور</h4>
                        <p className="text-[10px] sm:text-xs text-base-content/50">
                          {attendees.length} حاضر
                          {attendees.filter(a => a.is_honored).length > 0 && (
                            <span className="text-warning mr-2">
                              • {attendees.filter(a => a.is_honored).length} قدوة النشاط ⭐
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <FaChevronDown className={`text-base-content/40 transition-transform duration-300 text-xs ${showAttendees ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showAttendees && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-base-200">
                        <div className="p-3 sm:p-4 space-y-1.5 max-h-60 sm:max-h-64 overflow-y-auto">
                          {attendees.map((a) => {
                            const childRec = a.parent_id ? childrenMap[`${a.parent_id}-${a.child_name}`] : null;
                            const lvl = getLevelDef(childRec?.level);
                            const hasLevel = childRec && childRec.level && childRec.level !== 'new';
                            return (
                              <div key={a.id}
                                className={`flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl cursor-pointer hover:ring-1 hover:ring-primary/20 transition-all active:bg-base-200/50 ${
                                  a.is_honored ? 'bg-warning/10' : 'bg-base-200/30'
                                }`}
                                onClick={() => { if (childRec) setSelectedChildProfile({ record: childRec, parentId: a.parent_id }); }}>
                                {a.is_honored ? <FaCrown className="text-warning shrink-0 text-xs sm:text-sm" /> : <div className="w-1.5 h-1.5 bg-base-content/20 rounded-full shrink-0" />}
                                <span className={`font-medium text-xs sm:text-sm flex-1 ${a.is_honored ? 'text-warning' : 'text-base-content/80'} ${childRec ? 'hover:underline decoration-dotted underline-offset-4' : ''}`}>
                                  {a.child_name}
                                </span>
                                {hasLevel && (
                                  <span className={`badge badge-xs shrink-0 gap-0.5 ${lvl.bg} ${lvl.text} ${lvl.border} border text-[9px]`}>
                                    {lvl.emoji} {lvl.label}
                                  </span>
                                )}
                                {a.child_age && <span className="text-[10px] sm:text-xs text-base-content/40">{a.child_age} سنة</span>}
                                {a.is_honored && (
                                  <span className="badge badge-warning badge-xs gap-0.5 shrink-0 text-[8px] sm:text-[9px]">
                                    <FaCrown className="text-[6px] sm:text-[7px]" /> قدوة
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                {selectedActivity.is_upcoming && (
                  <button onClick={handleRegister} disabled={registering}
                    className={`btn flex-1 rounded-xl shadow-lg transition-all duration-300 gap-2 text-sm ${
                      isRegistered ? 'btn-success text-white' : 'btn-primary text-white shadow-primary/30'
                    }`}>
                    {registering ? (
                      <><FaSpinner className="animate-spin" /> جاري التحويل…</>
                    ) : isRegistered ? (
                      <><FaCheckCircle /> تم التسجيل (فتح الرابط مجدداً)</>
                    ) : (
                      <><FaExternalLinkAlt /> التسجيل في النشاط</>
                    )}
                  </button>
                )}
                <button onClick={() => setSelectedActivity(null)} className="btn btn-ghost flex-1 rounded-xl text-sm">إغلاق</button>
              </div>
            </div>
          </BottomSheetModal>
        )}
      </AnimatePresence>

      {/* ======== IMAGE LIGHTBOX ======== */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}>
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <button onClick={() => setExpandedImage(null)}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center text-white transition-all">
              <FaTimes className="text-lg" />
            </button>
            <motion.img src={expandedImage} alt="صورة مكبرة"
              className="relative z-20 max-w-[95vw] max-h-[85vh] sm:max-h-[90vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======== CHILD PROFILE MODAL ======== */}
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