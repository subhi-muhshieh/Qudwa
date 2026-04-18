'use client'
import { useState, useRef, memo } from 'react';
import { useProfile } from '../context/ProfileContext';
import { FaPaperPlane, FaWhatsapp, FaFacebookMessenger, FaInstagram, FaTelegram, FaEnvelope, FaSpinner, FaClock, FaSignInAlt, FaLock, FaHeadset } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

const COOLDOWN_SECONDS = 60;

/* ========================================== */
/* SKELETON UI                               */
/* ========================================== */
const ContactSkeleton = memo(function ContactSkeleton() {
  return (
    <main className="min-h-screen bg-base-100 relative w-full max-w-[100vw] overflow-x-hidden pb-24" dir="rtl">
      <section className="relative bg-neutral pt-32 pb-48 px-4 overflow-hidden rounded-b-[4rem] shadow-lg w-full">
        <div className="max-w-4xl mx-auto animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-white/10 rounded-[2rem] mb-6" />
          <div className="h-12 w-64 bg-white/10 rounded-2xl mb-4" />
          <div className="h-4 w-80 bg-white/10 rounded-full" />
        </div>
      </section>

      <section className="px-4 -mt-24 relative z-20 mb-20 w-full">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-pulse">
          <div className="h-[500px] bg-base-200 rounded-[3rem] border border-base-300 shadow-sm" />
          <div className="space-y-4">
            <div className="h-[400px] bg-base-200 rounded-[3rem] border border-base-300 shadow-sm" />
          </div>
        </div>
      </section>
    </main>
  );
});

export default function ContactPage() {
  const { user, profile, loading: profileLoading } = useProfile();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(null);

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Synced social links to the tech-forward, pure semantic spectrum
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="text-lg sm:text-xl" />,
      url: 'https://wa.me/963980931111', 
      color: 'bg-primary hover:bg-primary-focus shadow-primary/20 text-white border-primary/50'
    },
    {
      name: 'Telegram',
      icon: <FaTelegram className="text-lg sm:text-xl" />,
      url: 'https://t.me/QudwaAssoc',
      color: 'bg-secondary hover:bg-secondary-focus shadow-secondary/20 text-white border-secondary/50'
    },
    {
      name: 'Messenger',
      icon: <FaFacebookMessenger className="text-lg sm:text-xl" />,
      url: 'https://m.me/QudwaAssoc', 
      color: 'bg-primary hover:bg-primary-focus shadow-primary/20 text-white border-primary/50'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="text-lg sm:text-xl" />,
      url: 'https://ig.me/m/QudwaAssoc',
      color: 'bg-accent hover:bg-accent-focus shadow-accent/20 text-white border-accent/50'
    },
    {
      name: 'البريد الإلكتروني',
      icon: <FaEnvelope className="text-lg sm:text-xl" />,
      url: 'mailto:qudwa.ltk@gmail.com?subject=استفسار من موقع قدوة',
      color: 'bg-neutral hover:bg-neutral-focus shadow-neutral/20 text-white border-neutral/50'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('الرجاء تسجيل الدخول أولاً');
      return;
    }
    
    if (!message.trim()) {
      toast.error('الرجاء كتابة رسالة');
      return;
    }

    if (message.trim().length < 10) {
      toast.error('الرسالة قصيرة جداً (10 أحرف على الأقل)');
      return;
    }

    if (cooldown > 0) {
      toast.error(`الرجاء الانتظار ${cooldown} ثانية قبل إرسال رسالة أخرى`);
      return;
    }

    setSending(true);
    const toastId = toast.loading('جاري الإرسال...');
    
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          userEmail: user.email,
          userName: profile?.parent_name || 'غير محدد',
          userPhone: profile?.parent_phone || 'غير محدد',
          userType: profile?.user_type || 'follower',
          children: profile?.user_type === 'parent' ? (profile?.children || []) : []
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('تم إرسال رسالتك للإدارة بنجاح!', { id: toastId });
        setMessage('');
        startCooldown();
      } else {
        throw new Error(data.error || 'Failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ، يرجى المحاولة عبر الواتساب', { id: toastId });
    } finally {
      setSending(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (profileLoading) return <ContactSkeleton />;

  return (
    <main className="min-h-screen bg-base-100 relative w-full max-w-[100vw] overflow-x-hidden pb-16 md:pb-24" dir="rtl">
      
      {/* Background Decor */}
      <div className="absolute top-[40vh] right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/5 rounded-full blur-[60px] md:blur-[100px] -z-10 pointer-events-none translate-x-1/3" />
      <div className="absolute bottom-40 left-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-secondary/5 rounded-full blur-[60px] md:blur-[100px] -z-10 pointer-events-none -translate-x-1/3" />

      {/* ==========================================
          HERO SECTION (Cinematic & Deep)
      ========================================== */}
      <section className="relative bg-gradient-to-br from-neutral via-primary to-secondary pt-28 pb-36 md:pt-32 md:pb-48 px-4 overflow-hidden rounded-b-[3rem] md:rounded-b-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white/10 rounded-full blur-[80px] md:blur-[120px] -mr-16 -mt-16 md:-mr-32 md:-mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-neutral/30 rounded-full blur-[60px] md:blur-[100px] -ml-16 -mb-16 md:-ml-32 md:-mb-32 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
          >
            <div className="w-20 h-20 md:w-28 md:h-28 bg-white/10 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-white/20 flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl">
              <FaHeadset className="text-4xl md:text-5xl text-white drop-shadow-md" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight text-white drop-shadow-md break-words"
            style={{ fontFamily: 'var(--font-slogan)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            تواصل مع الإدارة
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed px-4 break-words"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            نحن هنا للإجابة على جميع استفساراتكم ومقترحاتكم. تواصلوا معنا بكل سهولة.
          </motion.p>
        </div>
      </section>

      {/* ==========================================
          CONTACT CONTENT (Overlapping Glass Cards)
      ========================================== */}
      <section className="px-4 -mt-20 md:-mt-24 relative z-20 mb-16 md:mb-20 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 items-start w-full">
          
          {/* Right Side: Message Form or Login Prompt */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white/80 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white/60 w-full min-w-0"
          >
            {user ? (
              <>
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-[1.2rem] flex items-center justify-center text-primary text-xl border border-primary/10 shadow-sm shrink-0">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-base-content tracking-tight break-words">أرسل رسالة مباشرة</h2>
                  </div>
                </div>
                <p className="text-base-content/60 text-xs sm:text-sm mb-6 sm:mb-8 font-medium leading-relaxed">
                  سيتم إرسال هذه الرسالة مباشرة وبشكل فوري إلى تلغرام الإدارة مع معلومات ملفك الشخصي لضمان سرعة الرد.
                </p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label className="text-base-content/80 font-bold mb-2 text-sm px-1">نص الرسالة</label>
                    <textarea 
                      className="w-full bg-base-100 border border-base-200 text-base-content text-sm sm:text-base h-32 sm:h-36 md:h-48 p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none shadow-inner font-medium"
                      placeholder="اكتب استفسارك أو اقتراحك هنا... (10 أحرف على الأقل)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={sending}
                      minLength={10}
                    />
                    <div className="flex justify-end mt-2 px-1">
                      <span className={`text-xs font-bold ${message.length < 10 ? 'text-error' : 'text-success'}`}>
                        {message.length} حرف
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={sending || cooldown > 0 || message.length < 10}
                    className="w-full py-3.5 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] bg-primary text-white font-black text-sm sm:text-base md:text-lg shadow-[0_8px_20px_rgba(18,104,177,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:pointer-events-none mt-2 border border-primary-focus"
                  >
                    {sending ? (
                      <><FaSpinner className="animate-spin text-lg sm:text-xl" /> جاري الإرسال...</>
                    ) : cooldown > 0 ? (
                      <><FaClock className="text-lg sm:text-xl" /> انتظر {cooldown} ثانية</>
                    ) : (
                      <><FaPaperPlane className="text-lg sm:text-xl" /> إرسال للإدارة</>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* ===== GUEST: Login prompt ===== */
              <div className="text-center py-10 md:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/5 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-primary/10 shadow-inner">
                  <FaLock className="text-2xl sm:text-3xl md:text-4xl text-primary/40" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-base-content mb-4 tracking-tight break-words">
                  أرسل رسالة مباشرة
                </h2>
                <p className="text-base-content/60 text-sm sm:text-base mb-8 md:mb-10 max-w-sm mx-auto leading-relaxed font-medium">
                  سجّل دخولك لإرسال رسالة مباشرة إلى الإدارة، أو تواصل معنا عبر وسائل التواصل الاجتماعي أدناه.
                </p>
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-primary text-white font-black rounded-[1.2rem] sm:rounded-[1.5rem] shadow-[0_8px_20px_rgba(18,104,177,0.25)] hover:scale-105 transition-all gap-2 sm:gap-3 text-sm sm:text-base md:text-lg w-full sm:w-auto border border-primary-focus"
                >
                  <FaSignInAlt /> تسجيل الدخول للرسائل
                </Link>
              </div>
            )}
          </motion.div>

          {/* Left Side: Compact Social Links Grid */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-5 md:space-y-6 w-full min-w-0"
          >
            <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary/10 rounded-[1.2rem] flex items-center justify-center text-secondary text-xl border border-secondary/10 shadow-sm shrink-0">
                  <FaWhatsapp />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-base-content tracking-tight break-words">قنوات التواصل</h3>
              </div>

              {/* Compact 2-Column Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {socialLinks.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-[1rem] sm:rounded-[1.2rem] border shadow-sm transition-all duration-300 transform hover:-translate-y-1 group min-w-0 ${link.color} ${idx === socialLinks.length - 1 ? 'col-span-2 justify-center' : ''}`}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-[0.8rem] flex items-center justify-center shrink-0 backdrop-blur-sm shadow-sm border border-white/20 group-hover:scale-110 transition-transform">
                      {link.icon}
                    </div>
                    <span className="font-bold text-xs sm:text-sm tracking-wide truncate">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-[1.5rem] md:rounded-[2rem] p-5 sm:p-6 shadow-sm flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-[1rem] flex items-center justify-center text-primary shrink-0 border border-base-200 shadow-sm">
                <FaClock className="text-lg sm:text-xl" />
              </div>
              <p className="text-base-content/80 font-bold text-xs sm:text-sm md:text-base leading-relaxed break-words">
                نحن نهتم بوقتك. يتم الرد على جميع الرسائل والاستفسارات خلال 24 ساعة كحد أقصى من قبل فريق الإدارة.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

    </main>
  );
}