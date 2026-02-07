'use client'
import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { FaPaperPlane, FaWhatsapp, FaFacebookMessenger, FaInstagram, FaTelegram, FaEnvelope, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const { user, profile } = useProfile();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // --- SOCIAL MEDIA LINKS ---
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="text-3xl" />,
      url: 'https://wa.me/963980931111', 
      color: 'bg-[#25D366] hover:bg-[#128C7E]',
      textColor: 'text-white'
    },
    {
      name: 'Telegram',
      icon: <FaTelegram className="text-3xl" />,
      url: 'https://t.me/QudwaAssoc', // Replace with Admin Telegram Username
      color: 'bg-[#0088cc] hover:bg-[#007db3]',
      textColor: 'text-white'
    },
    {
      name: 'Messenger',
      icon: <FaFacebookMessenger className="text-3xl" />,
      url: 'https://m.me/QudwaAssoc', 
      color: 'bg-[#0084FF] hover:bg-[#006BCE]',
      textColor: 'text-white'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="text-3xl" />,
      url: 'https://instagram.com/QudwaAssoc',
      color: 'bg-gradient-to-tr from-[#FFB800] via-[#FF0069] to-[#D300C5]',
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

    setSending(true);
    const toastId = toast.loading('جاري الإرسال...');
    
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          userEmail: user.email,
          parentName: profile?.parent_name || 'غير محدد',
          parentPhone: profile?.parent_phone || 'غير محدد',
          children: profile?.children || []
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('تم إرسال رسالتك للإدارة بنجاح!', { id: toastId });
        setMessage('');
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
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-slogan">تواصل مع الإدارة</h1>
          <p className="text-gray-500 text-lg">نحن هنا للإجابة على استفساراتكم ومقترحاتكم</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Right Side: Message Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-base-300 w-full relative z-10"
          >
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <FaEnvelope /> أرسل رسالة مباشرة
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              سيتم إرسال هذه الرسالة مباشرة إلى تلغرام الإدارة مع معلومات ملفك الشخصي.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">الرسالة</span></label>
                <textarea 
                  className="textarea textarea-bordered h-48 text-lg rounded-2xl" 
                  placeholder="اكتب استفسارك أو اقتراحك هنا..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sending}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={sending}
                className="btn btn-primary btn-lg w-full rounded-2xl text-white shadow-lg shadow-primary/30 mt-4 gap-2"
              >
                {sending ? <><FaSpinner className="animate-spin" /> جاري الإرسال...</> : <><FaPaperPlane /> إرسال للإدارة</>}
              </button>
            </form>
          </motion.div>

          {/* Left Side: Social Links */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 w-full relative z-10"
          >
             <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-sm">
                <h3 className="text-xl font-bold text-neutral mb-6 text-center lg:text-right">قنوات التواصل المباشر</h3>
                <div className="grid gap-4">
                  {socialLinks.map((link, idx) => (
                    <a 
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${link.color} ${link.textColor}`}
                    >
                      <div className="flex items-center gap-4">
                        {link.icon}
                        <span className="font-bold text-lg">{link.name}</span>
                      </div>
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">فتح المحادثة</span>
                    </a>
                  ))}
                </div>
             </div>

             <div className="alert alert-info bg-info/10 border-info/20 text-info-content rounded-2xl shadow-sm">
                <FaEnvelope />
                <span>يتم الرد على جميع الرسائل خلال 24 ساعة كحد أقصى.</span>
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}