'use client'
import Link from 'next/link';
import { FaWhatsapp, FaTelegram, FaFacebookMessenger, FaInstagram, FaHeart, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
  
  const contactLinks = [
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="text-xl" />,
      url: 'https://wa.me/963980931111', 
      color: 'hover:text-[#25D366]'
    },
    {
      name: 'Telegram',
      icon: <FaTelegram className="text-xl" />,
      url: 'https://t.me/QudwaAssoc', 
      color: 'hover:text-[#0088cc]'
    },
    {
      name: 'Messenger',
      icon: <FaFacebookMessenger className="text-xl" />,
      url: 'https://m.me/QudwaAssoc', 
      color: 'hover:text-[#0084FF]'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="text-xl" />,
      url: 'https://ig.me/m/QudwaAssoc', 
      color: 'hover:text-[#E1306C]'
    },
    // Added Email Option
    {
      name: 'البريد الإلكتروني',
      icon: <FaEnvelope className="text-xl" />,
      url: 'mailto:qudwa.ltk@gmail.com', 
      color: 'hover:text-[#EA4335]' // Gmail Red
    }
  ];

  return (
    <footer className="bg-neutral text-neutral-content pt-10 pb-6 rounded-t-[2rem] mt-10">
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Brand & Slogan */}
        <div className="space-y-3 text-center md:text-right">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain bg-white rounded-full p-1" />
            <h2 className="text-2xl font-bold font-nastaliq text-white drop-shadow-md">قُدوَة</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
            جيلٌ يبني... أثرٌ يبقى.
            <br/>
            نسعى لبناء جيل واعٍ ومثقف من خلال برامج تربوية وترفيهية هادفة.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-3">روابط سريعة</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/dashboard" className="link link-hover hover:text-primary transition-colors">الرئيسية</Link></li>
            <li><Link href="/activities" className="link link-hover hover:text-primary transition-colors">سجل النشاطات</Link></li>
            <li><Link href="/contact" className="link link-hover hover:text-primary transition-colors">تواصل معنا</Link></li>
            <li><Link href="/about" className="link link-hover hover:text-primary transition-colors">عن الجمعية</Link></li>
          </ul>
        </div>

        {/* Column 3: Direct Contact Buttons */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-white mb-3">تحدث معنا مباشرة</h3>
          
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto md:mx-0 md:mr-auto">
             {contactLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  // Logic: If it is the last item (index 4), make it span 2 columns
                  className={`btn btn-sm btn-outline border-white/20 text-white hover:bg-white hover:border-white transition-all gap-2 h-10 font-normal ${link.color} ${idx === 4 ? 'col-span-2' : ''}`}
                >
                   {link.icon}
                   {link.name}
                </a>
             ))}
          </div>

          <div className="mt-4 flex flex-col gap-1 text-xs text-gray-400 items-center md:items-start">
             <div className="flex items-center gap-2">
                <FaMapMarkerAlt /> <span>اللاذقية، سوريا</span>
             </div>
             <div className="flex items-center gap-2">
                <FaPhone /> <span dir="ltr">+963 980 931 111</span>
             </div>
          </div>
        </div>

      </div>

      <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-gray-500">
        <p className="flex items-center justify-center gap-1">
          صنع بكل <FaHeart className="text-red-500 animate-pulse" /> من أجل مستقبل أفضل
        </p>
        <p className="mt-1">© {new Date().getFullYear()} منظمة قدوة. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}