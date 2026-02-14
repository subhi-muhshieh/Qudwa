'use client'
import { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { FaPaperPlane, FaWhatsapp, FaFacebookMessenger, FaInstagram, FaTelegram, FaEnvelope, FaSpinner, FaClock, FaSignInAlt, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

const COOLDOWN_SECONDS = 60;

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

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="text-2xl sm:text-3xl" />,
      url: 'https://wa.me/963980931111', 
      color: 'bg-[#25D366] hover:bg-[#128C7E]',
      textColor: 'text-white'
    },
    {
      name: 'Telegram',
      icon: <FaTelegram className="text-2xl sm:text-3xl" />,
      url: 'https://t.me/QudwaAssoc',
      color: 'bg-[#0088cc] hover:bg-[#007db3]',
      textColor: 'text-white'
    },
    {
      name: 'Messenger',
      icon: <FaFacebookMessenger className="text-2xl sm:text-3xl" />,
      url: 'https://m.me/QudwaAssoc', 
      color: 'bg-[#0084FF] hover:bg-[#006BCE]',
      textColor: 'text-white'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="text-2xl sm:text-3xl" />,
      url: 'https://ig.me/m/QudwaAssoc',
      color: 'bg-gradient-to-tr from-[#FFB800] via-[#FF0069] to-[#D300C5]',
      textColor: 'text-white'
    },
    {
      name: 'البريد الإلكتروني',
      icon: <FaEnvelope className="text-2xl sm:text-3xl" />,
      url: 'mailto:qudwa.ltk@gmail.com?subject=استفسار من موقع قدوة',
      color: 'bg-base-content/70 hover:bg-base-content/80',
      textColor: 'text-white'
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

  return (
    <div className="min-h-screen bg-base-200 pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 font-slogan">تواصل مع الإدارة</h1>
          <p className="text-base-content/50 text-base sm:text-lg">نحن هنا للإجابة على استفساراتكم ومقترحاتكم</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          
          {/* Right Side: Message Form or Login Prompt */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="bg-base-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg border border-base-200 w-full relative z-10"
          >
            {user ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2">
                  <FaEnvelope /> أرسل رسالة مباشرة
                </h2>
                <p className="text-base-content/40 text-xs sm:text-sm mb-4 sm:mb-6">
                  سيتم إرسال هذه الرسالة مباشرة إلى تلغرام الإدارة مع معلومات ملفك الشخصي.
                </p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold">الرسالة</span></label>
                    <textarea 
                      className="textarea textarea-bordered h-40 sm:h-48 text-base sm:text-lg rounded-xl sm:rounded-2xl" 
                      placeholder="اكتب استفسارك أو اقتراحك هنا... (10 أحرف على الأقل)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={sending}
                      minLength={10}
                    ></textarea>
                    <label className="label">
                      <span className="label-text-alt text-base-content/40">{message.length} حرف</span>
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={sending || cooldown > 0}
                    className="btn btn-primary btn-md sm:btn-lg w-full rounded-xl sm:rounded-2xl text-white shadow-lg shadow-primary/30 mt-2 sm:mt-4 gap-2"
                  >
                    {sending ? (
                      <><FaSpinner className="animate-spin" /> جاري الإرسال...</>
                    ) : cooldown > 0 ? (
                      <><FaClock /> انتظر {cooldown} ثانية</>
                    ) : (
                      <><FaPaperPlane /> إرسال للإدارة</>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* ===== GUEST: Login prompt ===== */
              <div className="text-center py-8 md:py-12">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaLock className="text-3xl text-primary/50" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-3">
                  أرسل رسالة مباشرة
                </h2>
                <p className="text-base-content/50 text-sm mb-6 max-w-xs mx-auto">
                  سجّل دخولك لإرسال رسالة مباشرة إلى الإدارة، أو تواصل معنا عبر وسائل التواصل
                </p>
                <Link href="/login" className="btn btn-primary rounded-full px-8 text-white gap-2">
                  <FaSignInAlt /> تسجيل الدخول
                </Link>
              </div>
            )}
          </motion.div>

          {/* Left Side: Social Links — always visible */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 sm:space-y-6 w-full relative z-10"
          >
            <div className="bg-base-100/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-base-content/10 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-base-content mb-4 sm:mb-6 text-center lg:text-right">قنوات التواصل المباشر</h3>
              <div className="grid gap-3 sm:gap-4">
                {socialLinks.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${link.color} ${link.textColor}`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {link.icon}
                      <span className="font-bold text-base sm:text-lg">{link.name}</span>
                    </div>
                    <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                      فتح المحادثة
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="alert bg-info/10 border-info/20 text-info rounded-xl sm:rounded-2xl shadow-sm text-sm sm:text-base">
              <FaEnvelope className="shrink-0" />
              <span>يتم الرد على جميع الرسائل خلال 24 ساعة كحد أقصى.</span>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}