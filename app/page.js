'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createClient } from './utils/supabase/client';
import { useRouter } from 'next/navigation';
import {
  FaArrowLeft, FaCalendarAlt, FaStar, FaChild, FaUsers,
  FaHandsHelping, FaImages, FaHeart, FaChevronDown,
  FaInstagram, FaFacebook, FaTelegramPlane, FaWhatsapp, FaExpand
} from 'react-icons/fa';

export default function LandingPage() {
  const [supabase] = useState(() => createClient());
  const router = useRouter();
  const [recentActivities,  setRecentActivities]  = useState([]);
  const [upcomingActivity,  setUpcomingActivity]  = useState(null);
  const [galleryPhotos,     setGalleryPhotos]     = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [isLoggedIn,        setIsLoggedIn]        = useState(false);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;
        if (user) { setIsLoggedIn(true); router.replace('/dashboard'); return; }

        const [activitiesRes, upcomingRes, photosRes] = await Promise.allSettled([
          supabase.from('activities')
            .select('id,title,short_description,image_url,activity_date')
            .eq('is_upcoming', false).order('activity_date', { ascending: false }).limit(3),
          supabase.from('activities')
            .select('id,title,short_description,image_url,activity_date,start_time')
            .eq('is_upcoming', true).order('activity_date', { ascending: true }).limit(1).maybeSingle(),
          supabase.from('activity_photos')
            .select('id,image_url,caption').order('created_at', { ascending: false }).limit(8),
        ]);

        if (!isMounted) return;
        if (activitiesRes.status === 'fulfilled' && activitiesRes.value.data) setRecentActivities(activitiesRes.value.data);
        if (upcomingRes.status  === 'fulfilled' && upcomingRes.value.data)  setUpcomingActivity(upcomingRes.value.data);
        if (photosRes.status    === 'fulfilled' && photosRes.value.data)    setGalleryPhotos(photosRes.value.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        if (isMounted) setLoading(false);
      }
    };
    init();
    return () => { isMounted = false; };
  }, [supabase, router]);

  if (isLoggedIn || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <motion.img
            src="/logo.png" alt="Qudwa" width={96} height={96}
            className="w-24 h-24 mx-auto mb-4 object-contain"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', type: "spring", stiffness: 300, damping: 24 } },
  };
  const staggerContainer = { visible: { transition: { staggerChildren: 0.15 } } };

  return (
    <main className="min-h-screen overflow-x-hidden w-full max-w-[100vw]" dir="rtl">

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden px-4 bg-gradient-to-br from-neutral via-primary to-secondary">
        {/* Ambient blobs */}
        <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-white/10 rounded-full blur-3xl -mr-36 -mt-36 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 md:w-96 h-60 md:h-96 bg-neutral/30 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center text-white max-w-3xl mx-auto pt-32 sm:pt-28 md:pt-20 pb-20 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', type: "spring", bounce: 0.4 }}
          >
            <div className="relative mx-auto mb-6 sm:mb-8 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <motion.img
                src="/logo.png" alt="شعار قدوة" width={160} height={160}
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ willChange: 'transform' }}
              />
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 md:mb-8 font-nastaliq"
            initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            قُدوَة
          </motion.h1>

          <motion.p
            className="text-xl md:text-3xl opacity-90 mb-4 font-slogan tracking-wide"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            جيلٌ يبني... أثرٌ يبقى
          </motion.p>

          <motion.p
            className="text-sm md:text-lg opacity-80 mb-10 max-w-xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            جمعية غير ربحية تسعى لبناء جيل واعٍ ومسؤول من خلال برامج تربوية وتعليمية تعتمد على الترفيه الهادف والتجربة العملية
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none rounded-full px-10 shadow-[0_10px_30px_rgba(255,255,255,0.15)] w-full sm:w-auto gap-2 font-black"
              >
                ابدأ رحلتك معنا <FaArrowLeft />
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="btn btn-lg btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-10 w-full sm:w-auto backdrop-blur-sm"
              >
                تعرف علينا
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className="flex gap-3 justify-center mt-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <SocialLink href="https://www.instagram.com/QudwaAssoc" icon={<FaInstagram />} label="Instagram" />
            <SocialLink href="https://www.facebook.com/QudwaAssoc"  icon={<FaFacebook />}  label="Facebook"  />
            <SocialLink href="https://t.me/QudwaAssoc"              icon={<FaTelegramPlane />} label="Telegram" />
            <SocialLink href="https://wa.me/963980931111"           icon={<FaWhatsapp />}  label="WhatsApp"  />
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        >
          <FaChevronDown className="text-2xl" />
        </motion.div>
      </section>

      {/* ════════════════════════════════
          UPCOMING ACTIVITY 
      ════════════════════════════════ */}
      {upcomingActivity && (
        <section className="py-16 md:py-24 px-4 bg-base-100">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-primary rounded-full" />
                <h2 className="text-2xl md:text-3xl font-black text-base-content tracking-tight">النشاط القادم</h2>
              </div>

              <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[3rem] shadow-[0_10px_40px_rgb(0,0,0,0.04)] overflow-hidden mb-6 group transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Text Side */}
                  <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1">
                    <div className="inline-flex w-max items-center gap-2 bg-primary/10 text-primary font-bold px-4 py-2 rounded-xl mb-6 border border-primary/10 shadow-sm">
                      <FaCalendarAlt className="text-sm animate-pulse" /> نشاط قادم
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-base-content mb-5 leading-snug tracking-tight">
                      {upcomingActivity.title}
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 font-medium">
                      {upcomingActivity.short_description}
                    </p>
                    
                    {upcomingActivity.activity_date && (
                      <div className="flex items-center gap-2 mb-8 text-slate-500 font-bold text-sm bg-base-200 w-max px-4 py-2 rounded-xl">
                        <FaCalendarAlt className="text-primary" /> {upcomingActivity.activity_date}
                        {upcomingActivity.start_time && ` · ${upcomingActivity.start_time.slice(0, 5)}`}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-auto">
                      <Link href="/login" className="bg-neutral text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-primary transition-colors flex items-center gap-2 text-sm shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        سجّل الآن <FaArrowLeft className="text-xs" />
                      </Link>
                    </div>
                  </div>

                  {/* Image Side */}
                  {upcomingActivity.image_url && (
                    <div className="w-full lg:w-1/2 h-[280px] sm:h-[350px] lg:h-auto relative overflow-hidden order-1 lg:order-2 p-4 lg:p-6 lg:pl-0">
                      <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-base-200 group-hover:shadow-[0_10px_30px_rgb(0,0,0,0.1)] transition-all duration-500 bg-base-300">
                        <img src={upcomingActivity.image_url} alt={upcomingActivity.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════
          WHAT WE DO 
      ════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 bg-base-200">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer} className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black text-base-content mb-4 tracking-tight">
              ماذا نقدم لأبنائكم؟
            </motion.h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4" />
            <motion.p variants={fadeInUp} className="text-slate-500 max-w-2xl mx-auto text-sm md:text-lg font-medium">
              نسعى لتمكين الفئة الشبابية من خلال برامج متنوعة تجمع بين التعلم والمتعة
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          >
            {[
              { icon: <FaStar />, title: 'أنشطة تفاعلية', desc: 'ورشات تعليمية بأساليب ممتعة', color: 'text-primary' },
              { icon: <FaChild />, title: 'تنمية المهارات', desc: 'بناء شخصيات واعية ومتوازنة', color: 'text-secondary' },
              { icon: <FaUsers />, title: 'عمل جماعي', desc: 'تعزيز روح الفريق والتعاون', color: 'text-primary' },
              { icon: <FaHandsHelping />, title: 'قيم إيجابية', desc: 'غرس الاحترام والمسؤولية', color: 'text-secondary' },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}
                className="group bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col items-center gap-3 w-full"
              >
                <div className={`w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center ${item.color} text-2xl shadow-sm border border-base-100 mb-2 group-hover:bg-primary group-hover:text-white transition-colors duration-500 shrink-0`}>
                  {item.icon}
                </div>
                <h3 className="font-black text-slate-800 text-lg">{item.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="text-center mt-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            <Link href="/about"
              className="inline-flex items-center gap-2 bg-white border border-base-300 text-slate-700 hover:bg-base-100 hover:text-primary font-black px-8 py-4 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300"
            >
              تعرف على المزيد <FaArrowLeft />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          RECENT ACTIVITIES 
      ════════════════════════════════ */}
      {recentActivities.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-base-100">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-secondary rounded-full" />
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">أحدث النشاطات</h2>
                </div>
                <Link href="/activities"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-primary font-bold text-sm transition-colors group"
                >
                  عرض الكل <FaArrowLeft className="text-[10px] transition-transform group-hover:-translate-x-1" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            >
              {recentActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════
          GALLERY PREVIEW 
      ════════════════════════════════ */}
      {galleryPhotos.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-base-200">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-accent rounded-full" />
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">من معرض الصور</h2>
                </div>
                <Link href="/gallery"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-primary font-bold text-sm transition-colors group"
                >
                  المعرض الكامل <FaArrowLeft className="text-[10px] transition-transform group-hover:-translate-x-1" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            >
              {galleryPhotos.map((photo, idx) => (
                <GalleryPhoto key={photo.id} photo={photo} idx={idx} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════
          CTA — JOIN US
      ════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            className="rounded-[3rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral"
            style={{ background: 'linear-gradient(135deg, var(--fallback-n,oklch(var(--n)/1)) 0%, var(--fallback-p,oklch(var(--p)/1)) 60%, var(--fallback-s,oklch(var(--s)/1)) 100%)' }}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-neutral/40 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

            <div className="relative z-10 w-full">
              <motion.div
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-lg"
              >
                <FaHeart className="text-4xl drop-shadow-md" />
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-md tracking-tight">كن جزءاً من عائلة قدوة</h2>
              <p className="text-white/90 mb-10 text-sm md:text-xl max-w-xl mx-auto leading-relaxed font-light">
                سجّل أبناءك في أنشطتنا، أو انضم كمتطوع، أو ادعم رسالتنا — كل مساهمة تصنع فرقاً.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <Link href="/login" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="btn btn-lg bg-white text-neutral hover:bg-white/90 border-none rounded-[1.5rem] px-10 shadow-[0_10px_30px_rgba(255,255,255,0.15)] w-full gap-3 font-black text-lg"
                  >
                    سجّل الآن <FaArrowLeft />
                  </motion.button>
                </Link>
                <Link href="/donate" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="btn btn-lg btn-outline border-white/30 text-white hover:bg-white/20 hover:border-white/50 rounded-[1.5rem] px-10 w-full gap-3 backdrop-blur-md font-bold text-lg"
                  >
                    <FaHeart /> ادعمنا
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="w-12 h-12 rounded-[1.2rem] bg-white/10 backdrop-blur-md hover:bg-white hover:text-primary border border-white/20 flex items-center justify-center text-white transition-all shadow-lg hover:scale-110"
      aria-label={label}
    >
      <span className="text-xl">{icon}</span>
    </a>
  );
}

/* ==========================================
   UPGRADED QUDWA ACTIVITY CARD
========================================== */
function ActivityCard({ activity }) {
  return (
    <motion.div variants={{
      hidden:  { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', type: "spring", stiffness: 300, damping: 24 } },
    }} className="h-full">
      <Link href="/activities" className="block h-full">
        <div className="group flex flex-col bg-white/70 backdrop-blur-md border border-white/60 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer h-full min-w-0">
          
          <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
            {activity.image_url ? (
              <img src={activity.image_url} alt={activity.title} loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full bg-base-200 flex items-center justify-center">
                <FaStar className="text-4xl text-primary/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-6 md:p-8 flex flex-col flex-1">
            <h3 className="font-black text-slate-800 text-lg md:text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug break-words">
              {activity.title}
            </h3>
            <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-4 leading-relaxed break-words">
              {activity.short_description}
            </p>
            
            <div className="mt-auto border-t border-slate-100 pt-5 flex items-center justify-between">
              {activity.activity_date ? (
                <span className="text-xs font-bold text-primary flex items-center gap-1.5 shrink-0 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/10">
                  <FaCalendarAlt className="text-primary/60"/> {activity.activity_date}
                </span>
              ) : <div/>}
              <span className="text-slate-400 group-hover:text-primary text-xs font-bold flex items-center gap-1.5 transition-all shrink-0">
                 التفاصيل <FaArrowLeft className="text-[10px] transition-transform group-hover:-translate-x-1" />
              </span>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}

/* ==========================================
   UPGRADED QUDWA GALLERY CARD
========================================== */
function GalleryPhoto({ photo, idx }) {
  return (
    <motion.div variants={{
      hidden:  { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', type: "spring", stiffness: 300, damping: 24 } },
    }}>
      <Link href="/gallery">
        <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-base-300 cursor-pointer group shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 relative border border-slate-200/50">
          <img src={photo.image_url} alt={photo.caption || `صورة ${idx + 1}`} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral/80 via-neutral/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
             <FaExpand className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 drop-shadow-md" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}