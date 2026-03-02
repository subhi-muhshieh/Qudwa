'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createClient } from './utils/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, FaCalendarAlt, FaStar, FaChild, FaUsers, 
  FaHandsHelping, FaImages, FaHeart, FaChevronDown,
  FaInstagram, FaFacebook, FaTelegramPlane, FaWhatsapp
} from 'react-icons/fa';

export default function LandingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingActivity, setUpcomingActivity] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsLoggedIn(true);
        router.replace('/dashboard');
        return;
      }

      // Fetch public data for landing page
      const [activitiesRes, upcomingRes, photosRes] = await Promise.allSettled([
        supabase
          .from('activities')
          .select('id, title, short_description, image_url, activity_date')
          .eq('is_upcoming', false)
          .order('activity_date', { ascending: false })
          .limit(3),
        supabase
          .from('activities')
          .select('id, title, short_description, image_url, activity_date, start_time')
          .eq('is_upcoming', true)
          .order('activity_date', { ascending: true })
          .limit(1)
          .single(),
        supabase
          .from('activity_photos')
          .select('id, image_url, caption')
          .order('created_at', { ascending: false })
          .limit(8),
      ]);

      if (activitiesRes.status === 'fulfilled' && activitiesRes.value.data) {
        setRecentActivities(activitiesRes.value.data);
      }
      if (upcomingRes.status === 'fulfilled' && upcomingRes.value.data) {
        setUpcomingActivity(upcomingRes.value.data);
      }
      if (photosRes.status === 'fulfilled' && photosRes.value.data) {
        setGalleryPhotos(photosRes.value.data);
      }

      setLoading(false);
    };

    init();
  }, [router]);

  if (isLoggedIn || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <motion.img 
            src="/logo.png" 
            alt="Qudwa"
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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

  return (
    <main className="min-h-screen overflow-x-hidden">
      
      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden px-4">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-white/10 rounded-full blur-3xl -mr-36 -mt-36 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 md:w-96 h-60 md:h-96 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

<div className="relative z-10 text-center text-white max-w-3xl mx-auto pt-32 sm:pt-28 md:pt-20 pb-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative mx-auto mb-6 sm:mb-8 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
  <motion.img 
    src="/logo.png" 
    alt="شعار قدوة"
    className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    style={{ willChange: 'transform' }}
  />
</div>
          </motion.div>

          {/* Title */}
<motion.h1 
  className="text-6xl md:text-8xl font-bold mb-6 md:mb-8 font-nastaliq"
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.7 }}
>
  قُدوَة
</motion.h1>

          {/* Slogan */}
          <motion.p 
            className="text-xl md:text-3xl opacity-90 mb-4 font-slogan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            جيلٌ يبني... أثرٌ يبقى
          </motion.p>

          {/* Description */}
          <motion.p 
            className="text-sm md:text-lg opacity-75 mb-10 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            جمعية غير ربحية تسعى لبناء جيل واعٍ ومسؤول من خلال برامج تربوية وتعليمية تعتمد على الترفيه الهادف والتجربة العملية
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none rounded-full px-10 shadow-xl shadow-black/10 w-full sm:w-auto gap-2"
              >
                ابدأ رحلتك معنا
                <FaArrowLeft />
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-lg btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-10 w-full sm:w-auto"
              >
                تعرف علينا
              </motion.button>
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex gap-3 justify-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <a href="https://www.instagram.com/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-white/15 border-none hover:bg-white/25 text-white">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-white/15 border-none hover:bg-white/25 text-white">
              <FaFacebook />
            </a>
            <a href="https://t.me/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-white/15 border-none hover:bg-white/25 text-white">
              <FaTelegramPlane />
            </a>
            <a href="https://wa.me/963980931111" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-white/15 border-none hover:bg-white/25 text-white">
              <FaWhatsapp />
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaChevronDown className="text-2xl" />
        </motion.div>
      </section>

      {/* ==========================================
          UPCOMING ACTIVITY
      ========================================== */}
      {upcomingActivity && (
        <section className="py-16 md:py-24 px-4 bg-base-100">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-base-content">النشاط القادم</h2>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-primary via-secondary to-accent rounded-[2rem] p-6 md:p-10 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                  
                  <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                    <div className="flex-1 text-right space-y-4 order-2 lg:order-1">
                      <div className="badge bg-white/20 border-0 text-white px-4 py-2 gap-2 font-bold">
                        <FaCalendarAlt className="animate-pulse" />
                        نشاط قادم
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black leading-tight">
                        {upcomingActivity.title}
                      </h3>
                      <p className="text-blue-50 opacity-90 text-sm md:text-lg leading-relaxed line-clamp-3">
                        {upcomingActivity.short_description}
                      </p>
                      {upcomingActivity.activity_date && (
                        <p className="text-white/70 text-sm">
                          📅 {upcomingActivity.activity_date}
                          {upcomingActivity.start_time && ` • 🕐 ${upcomingActivity.start_time.slice(0,5)}`}
                        </p>
                      )}
                      <Link href="/login" className="btn bg-white text-primary hover:bg-white/90 border-none rounded-xl px-8 shadow-xl mt-2 gap-2">
                        سجّل الآن <FaArrowLeft />
                      </Link>
                    </div>

                    {upcomingActivity.image_url && (
                      <div className="w-full lg:w-5/12 order-1 lg:order-2 shrink-0">
                        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-video">
                          <img 
                            src={upcomingActivity.image_url} 
                            alt={upcomingActivity.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ==========================================
          WHAT WE DO — Quick overview
      ========================================== */}
      <section className="py-16 md:py-24 px-4 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-primary mb-4">
              ماذا نقدم لأبنائكم؟
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base-content/60 max-w-2xl mx-auto text-sm md:text-base">
              نسعى لتمكين الفئة الشبابية من خلال برامج متنوعة تجمع بين التعلم والمتعة
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { icon: <FaStar className="text-2xl md:text-3xl" />, title: "أنشطة تفاعلية", desc: "ورشات تعليمية بأساليب ممتعة", color: "from-blue-500/10 to-blue-600/5" },
              { icon: <FaChild className="text-2xl md:text-3xl" />, title: "تنمية المهارات", desc: "بناء شخصيات واعية ومتوازنة", color: "from-emerald-500/10 to-emerald-600/5" },
              { icon: <FaUsers className="text-2xl md:text-3xl" />, title: "عمل جماعي", desc: "تعزيز روح الفريق والتعاون", color: "from-amber-500/10 to-amber-600/5" },
              { icon: <FaHandsHelping className="text-2xl md:text-3xl" />, title: "قيم إيجابية", desc: "غرس الاحترام والمسؤولية", color: "from-purple-500/10 to-purple-600/5" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className={`bg-gradient-to-br ${item.color} bg-base-100 rounded-2xl p-4 md:p-6 text-center border border-base-200 hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="text-primary mb-3">{item.icon}</div>
                <h3 className="font-bold text-base-content text-sm md:text-lg mb-1">{item.title}</h3>
                <p className="text-base-content/50 text-xs md:text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/about" className="btn btn-outline btn-primary rounded-full px-8 gap-2">
              تعرف على المزيد <FaArrowLeft />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          RECENT ACTIVITIES
      ========================================== */}
      {recentActivities.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-base-100">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-secondary rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-base-content">أحدث النشاطات</h2>
                </div>
                <Link href="/activities" className="btn btn-ghost btn-sm text-primary gap-1">
                  عرض الكل <FaArrowLeft />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={fadeInUp}
                >
                  <Link href="/activities">
                    <div className="group bg-base-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-base-200 cursor-pointer h-full">
                      <div className="h-44 overflow-hidden relative">
                        {activity.image_url ? (
                          <img 
                            src={activity.image_url} 
                            alt={activity.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        ) : (
                          <div className="w-full h-full bg-base-200 flex items-center justify-center text-base-content/20">
                            <FaStar className="text-4xl" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-base-content text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {activity.title}
                        </h3>
                        <p className="text-base-content/60 text-sm line-clamp-2 mb-3">
                          {activity.short_description}
                        </p>
                        {activity.activity_date && (
                          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {activity.activity_date}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ==========================================
          GALLERY PREVIEW
      ========================================== */}
      {galleryPhotos.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-base-200">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-accent rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-base-content">من معرض الصور</h2>
                </div>
                <Link href="/gallery" className="btn btn-ghost btn-sm text-primary gap-1">
                  المعرض الكامل <FaArrowLeft />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {galleryPhotos.map((photo, idx) => (
                <motion.div
                  key={photo.id}
                  variants={fadeInUp}
                >
                  <Link href="/gallery">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-base-300 cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300">
                      <img 
                        src={photo.image_url} 
                        alt={photo.caption || `صورة ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ==========================================
          CTA — JOIN US
      ========================================== */}
      <section className="py-16 md:py-24 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl p-8 md:p-14 text-white text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaHeart className="text-3xl" />
              </motion.div>

              <h2 className="text-2xl md:text-4xl font-bold mb-4">كن جزءاً من عائلة قدوة</h2>
              <p className="opacity-90 mb-8 md:mb-10 text-sm md:text-lg max-w-lg mx-auto leading-relaxed">
                سجّل أبناءك في أنشطتنا، أو انضم كمتطوع، أو ادعم رسالتنا — كل مساهمة تصنع فرقاً
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Link href="/login">
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none rounded-full px-10 shadow-xl w-full sm:w-auto gap-2"
    >
      سجّل الآن <FaArrowLeft />
    </motion.button>
  </Link>
  <Link href="/donate">
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="btn btn-lg btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-10 w-full sm:w-auto gap-2"
    >
      <FaHeart /> ادعمنا
    </motion.button>
  </Link>
  <Link href="/contact">
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="btn btn-lg btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-10 w-full sm:w-auto"
    >
      تواصل معنا
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