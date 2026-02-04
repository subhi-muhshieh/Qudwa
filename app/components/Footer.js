'use client'
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // <--- NEW IMPORT
import { FaPaperPlane, FaInstagram, FaTwitter, FaFacebook, FaTelegramPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { createClient } from '../utils/supabase/client';

export default function Footer() {
  const [msg, setMsg] = useState('');
  const supabase = createClient();
  const pathname = usePathname(); // <--- GET CURRENT URL

  // --- HIDE FOOTER LOGIC ---
  // If we are on Home (Landing) or Login, return nothing.
if (pathname === '/' || pathname === '/login' || pathname === '/admin' || pathname === '/reset-password') {
  return null;
}
  // -------------------------

  const sendTelegramMessage = async (e) => {
    e.preventDefault();
    if (!msg) return;

    const { data: { user } } = await supabase.auth.getUser();

    const toastId = toast.loading("جاري الإرسال...");
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, userEmail: user?.email }),
      });
      toast.success("وصلت رسالتك!", { id: toastId });
      setMsg('');
    } catch (error) {
      toast.error("فشل الإرسال", { id: toastId });
    }
  };

  return (
    <footer className="bg-base-200 text-base-content pt-10 mt-20">
      
      <div className="container mx-auto px-4">
        
        {/* 1. TOP BIG BOX (Slogan) */}
        <div className="bg-neutral rounded-[2.5rem] p-10 md:p-16 text-center mb-16 relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-slogan)' }}>
                    نصنع الأثر، ونبني المستقبل
                </h2>
                <div className="inline-block border-2 border-white/30 rounded-full px-8 py-3 text-white/80 font-bold tracking-widest uppercase">
                    معاً نحو الأفضل
                </div>
            </div>
        </div>

        {/* 2. BOTTOM COLUMNS */}
        <div className="footer py-10 border-t border-base-300">
            
            {/* Column 1: Navigation */}
            <nav className="gap-4">
                <header className="footer-title opacity-100 text-primary text-lg">روابط سريعة</header> 
                <a href="/dashboard" className="link link-hover text-base">الرئيسية</a>
                <a href="/activities" className="link link-hover text-base">سجل النشاطات</a>
                <a href="/admin" className="link link-hover text-base">لوحة الإدارة</a>
            </nav> 

            {/* Column 2: Contact Form */}
            <form onSubmit={sendTelegramMessage} className="w-full md:w-96">
                <header className="footer-title opacity-100 text-primary text-lg">تواصل مع الإدارة</header> 
                <fieldset className="form-control w-full">
                    <label className="label">
                        <span className="label-text">أرسل ملاحظة أو اقتراح للمسؤولين مباشرة</span>
                    </label>
                    <div className="relative" id="message-box" >
                        <input 
                            id="contact-input" 
                            type="text" 
                            placeholder="اكتب رسالتك هنا..." 
                            className="input input-bordered w-full pr-12 rounded-xl focus:outline-none focus:border-primary bg-base-100" 
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                        />
                        <button type="submit" className="absolute top-0 left-0 rounded-l-xl btn btn-primary join-item text-white">
                            <FaPaperPlane className="transform scale-x-[-1]" />
                        </button>
                    </div>
                </fieldset>
            </form>

            {/* Column 3: Socials */}
           {/* Column 3: Socials */}
<nav>
    <header className="footer-title opacity-100 text-primary text-lg">تابعنا</header> 
    <div className="grid grid-flow-col gap-4">
        
        <a 
          href="https://www.instagram.com/QudwaAssoc" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-2xl text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <FaInstagram />
        </a>
        
        <a 
          href="https://www.facebook.com/QudwaAssoc" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-2xl text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <FaFacebook />
        </a>
        
        <a 
          href="https://t.me/QudwaAssoc" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-2xl text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <FaTelegramPlane />
        </a>
    </div>
</nav>
        </div>

        {/* Copyright */}
        <div className="text-center py-8 text-sm opacity-50 border-t border-base-300 mt-10">
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()} - منظمة قدوة</p>
        </div>

      </div>
    </footer>
  );
}