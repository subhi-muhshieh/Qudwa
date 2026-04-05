'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaWhatsapp, FaTelegram, FaFacebookMessenger, FaInstagram, FaHeart, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

function Footer() {
  const pathname = usePathname();

  const hiddenPages = ['/login', '/reset-password'];
  
  if (hiddenPages.includes(pathname)) {
    return null;
  }
  
  const contactLinks = [
    { name: 'WhatsApp', icon: FaWhatsapp, url: 'https://wa.me/963980931111', hoverColor: 'group-hover:text-[#25D366]' },
    { name: 'Telegram', icon: FaTelegram, url: 'https://t.me/QudwaAssoc', hoverColor: 'group-hover:text-[#0088cc]' },
    { name: 'Messenger', icon: FaFacebookMessenger, url: 'https://m.me/QudwaAssoc', hoverColor: 'group-hover:text-[#0084FF]' },
    { name: 'Instagram', icon: FaInstagram, url: 'https://ig.me/m/QudwaAssoc', hoverColor: 'group-hover:text-[#E1306C]' },
    { name: 'البريد', icon: FaEnvelope, url: 'mailto:qudwa.ltk@gmail.com', hoverColor: 'group-hover:text-[#EA4335]' }
  ];

  return (
    <footer className="relative bg-slate-900 text-slate-300 pt-16 pb-8 overflow-hidden rounded-t-[3rem] mt-20 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      
      {/* Cinematic Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-0 pointer-events-none translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -z-0 pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        {/* ======== BRANDING & ABOUT ======== */}
        <div className="md:col-span-5 space-y-5 text-center md:text-right">
          <div className="flex items-center justify-center md:justify-start gap-3">
            {/* Fixed Logo: Solid white circular background */}
            <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain bg-white rounded-full p-1.5 shadow-lg" />
            
            <div className="flex items-center h-full pt-1">
              <h2 className="text-4xl font-nastaliq text-white drop-shadow-sm -mt-3">قُدوَة</h2>
            </div>
          </div>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm mx-auto md:mx-0 font-light">
            <span className="text-primary font-bold">جيلٌ يبني... أثرٌ يبقى.</span>
            <br className="mb-2" />
            نسعى لبناء جيل واعٍ ومثقف من خلال برامج تربوية وترفيهية هادفة تترك بصمة مستدامة.
          </p>
        </div>

        {/* ======== QUICK LINKS ======== */}
        <div className="md:col-span-3 text-center md:text-right">
          <h3 className="text-lg font-black text-white mb-6 tracking-wide">روابط سريعة</h3>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 text-sm font-medium">
            {[
              { path: '/', label: 'الرئيسية' },
              { path: '/activities', label: 'سجل النشاطات' },
              { path: '/gallery', label: 'معرض الصور' },
              { path: '/about', label: 'عن الجمعية' },
              { path: '/contact', label: 'تواصل معنا' },
              { path: '/faq', label: 'الأسئلة الشائعة' },
              { path: '/donate', label: 'ادعمنا', isHighlight: true },
            ].map((link, i) => (
              <li key={i} className={link.isHighlight ? "col-span-2 md:col-span-1 mt-1 md:mt-0" : ""}>
                <Link 
                  href={link.path} 
                  className={`group flex items-center justify-center md:justify-start gap-2 transition-all duration-300 md:bg-transparent md:border-none md:py-0 md:rounded-none
                    ${link.isHighlight 
                      ? 'bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 hover:text-red-200 py-2.5 rounded-xl' 
                      : 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10 hover:text-white py-2.5 rounded-xl md:text-slate-400 md:hover:text-white'
                    }
                  `}
                >
                  {/* Desktop Bullet Point */}
                  <span className={`hidden md:block w-1.5 h-1.5 rounded-full transition-colors ${link.isHighlight ? 'bg-red-500/50 group-hover:bg-red-400' : 'bg-slate-700 group-hover:bg-primary'}`} />
                  
                  {/* Link Text */}
                  <span className="transition-transform duration-300 md:group-hover:-translate-x-1">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ======== CONTACT & SOCIALS ======== */}
        <div className="md:col-span-4 text-center md:text-right">
          <h3 className="text-lg font-black text-white mb-6 tracking-wide">تحدث معنا مباشرة</h3>
          
          {/* Fixed CTAs: Compact row of circular icon buttons instead of stacking text pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
             {contactLinks.map((link, idx) => {
               const Icon = link.icon;
               return (
                 <a 
                   key={idx}
                   href={link.url}
                   target="_blank" 
                   rel="noopener noreferrer"
                   title={link.name}
                   className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all text-slate-300 hover:text-white backdrop-blur-md shadow-sm"
                 >
                    <Icon className={`text-xl transition-colors duration-300 ${link.hoverColor}`} />
                 </a>
               );
             })}
          </div>

          <div className="flex flex-col gap-3 text-xs md:text-sm text-slate-400 items-center md:items-start font-medium bg-white/5 p-4 rounded-2xl border border-white/5 w-max mx-auto md:mx-0">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><FaMapMarkerAlt /></div> 
               <span>اللاذقية، سوريا</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0"><FaPhone /></div> 
               <span dir="ltr" className="tracking-wider">+963 980 931 111</span>
             </div>
          </div>
        </div>
      </div>

      {/* ======== COPYRIGHT ======== */}
      <div className="relative z-10 border-t border-white/10 mt-12 pt-8 px-6 text-center">
        <p className="flex items-center justify-center gap-1.5 text-sm text-slate-400 font-medium mb-2">
          صنع بكل <FaHeart className="text-red-500 animate-pulse text-xs" /> من أجل مستقبل أفضل
        </p>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} جمعية قدوة. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}

export default Footer;