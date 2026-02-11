'use client'
import Link from 'next/link';
import { 
  FaInfoCircle, 
  FaArrowRight, 
  FaHeart, 
  FaUsers, 
  FaStar, 
  FaHandsHelping,
  FaLightbulb,
  FaGraduationCap,
  FaChild,
  FaInstagram,
  FaFacebook,
  FaTelegramPlane,
  FaWhatsapp,
  FaEnvelope
} from 'react-icons/fa';

export default function AboutPage() {
  
  const stats = [
    { number: "15+", label: "متطوع واعد", icon: <FaChild /> },
    { number: "5+", label: "نشاط منفذ", icon: <FaStar /> },
    { number: "19", label: "متطوع نشط", icon: <FaUsers /> },
    { number: "1", label: "سنوات الخبرة", icon: <FaGraduationCap /> },
  ];

  const values = [
    {
      icon: <FaHeart className="text-3xl" />,
      title: "الاحترام",
      description: "احترام الذات و الآخرين و الاختلاف."
    },
    {
      icon: <FaLightbulb className="text-3xl" />,
      title: "الإبداع",
      description: "التعلم بأساليب مبتكرة و ممتعة."
    },
    {
      icon: <FaHandsHelping className="text-3xl" />,
      title: "العمل الجماعي",
      description: "النجاح يصنعه الفريق."
    },
    {
      icon: <FaGraduationCap className="text-3xl" />,
      title: "الإبداع",
      description: "نؤمن بأن التعلم رحلة لا تنتهي، ونسعى لتنمية حب المعرفة والاستكشاف لدى الأطفال."
    },
  ];

  const team = [
    { name: "عمر عيسى", role: "رئيس الجمعية", image: null },
    { name: "محمد أنور بوادقجي", role: "نائب رئيس الجمعية", image: null },
    { name: "عبادة جولاق", role: "أمين الصندوق", image: null },
    { name: "صبحي محشية", role: "أمين السر", image: null },
    { name: "محمد المقدم", role: "مدير الأنشطة", image: null },
    { name: "عبد الله شرف", role: "مدير الإعلام", image: null },
    { name: "أحمد رفاعي", role: "مدير اللوجستيات", image: null },
    { name: "محمود عليو", role: "مسؤول الموارد العلمية و البشرية", image: null },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-accent text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link 
            href="/settings" 
            className="btn btn-ghost btn-sm rounded-xl gap-2 mb-6 text-white/80 hover:text-white hover:bg-white/10"
          >
            <FaArrowRight />
            العودة للإعدادات
          </Link>

          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <img 
              src="/logo.png" 
              alt="Qudwa Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          
          <h1 
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-nastaliq)' }}
          >
            قُدوَة
          </h1>
          
          <p className="text-2xl md:text-3xl opacity-90 mb-6 font-slogan">
            جيلٌ يبني... أثرٌ يبقى
          </p>
          
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            منظمة غير ربحية تسعى لبناء جيل واعٍ ومسؤول من خلال برامج تربوية وتعليمية متميزة
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-primary text-3xl mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-base-content mb-1">{stat.number}</div>
                <div className="text-base-content/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-100 rounded-3xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">من نحن؟</h2>
            
            <div className="space-y-4 text-base-content/70 leading-relaxed text-lg">
              <p>
                نحن مجموعةٌ من الشباب، نؤمنُ بدورنا في صناعةِ التَّغيير الإيجابي في المجتمع، و أنَّ التعليمَ يكون أكثرَ تأثيراً عندما يقترن بالمتعةِ و التجربة.
              </p>
              <p>
                اجتمعنا على فكرة أن القيم لا تُفرض، بل تُغرَس.
              </p>
              <p>
                نسعى إلى تمكينِ الفئة الشبابيَّة و بناء شخصياتٍ واعدة و متوازنة، قادرة على التأثير إيجاباً بنفسها و محيطها.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="py-16 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">رؤيتنا</h3>
              <p className="text-base-content/70 leading-relaxed">
                شبابٌ واعٍ، صاحب قيمٍ راسخة، و قدوة إيجابية تساهم في بناء مجتمع متماسك و متقدِّم، نعدُّ من كلِّ شابٍّ قدوةً ملهمةً قادرةً على إحداثِ فرقٍ و قيادةِ التغييرِ الإيجابيِّ في المجتمع.
              </p>
            </div>
            
            <div className="bg-secondary/5 border border-secondary/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-secondary mb-4">رسالتنا</h3>
              <p className="text-base-content/70 leading-relaxed">
                رفعُ مستوى القيم الأخلاقيَّة و الإنسانيَّة لدى الشبابِ من خلال برامجَ تعليميَّةٍ و تربويَّةٍ مبتكرة، تعتمدُ على الترفيهِ الهادف، و التجربة العملية، و المشاركة الفعالة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-10 text-center">قيمنا</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-base-100 rounded-2xl p-6 shadow-sm">
                <div className="text-primary mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-base-content mb-2">{value.title}</h3>
                <p className="text-base-content/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-10 text-center">فريقنا</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-3xl text-primary/50" />
                </div>
                <h4 className="font-bold text-base-content">{member.name}</h4>
                <p className="text-base-content/50 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">تواصل معنا</h2>
            <p className="opacity-90 mb-8">نحن هنا للإجابة على استفساراتكم ومساعدتكم</p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <a href="https://www.instagram.com/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-lg bg-white/20 border-none hover:bg-white/30">
                <FaInstagram className="text-xl" />
              </a>
              <a href="https://www.facebook.com/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-lg bg-white/20 border-none hover:bg-white/30">
                <FaFacebook className="text-xl" />
              </a>
              <a href="https://t.me/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-lg bg-white/20 border-none hover:bg-white/30">
                <FaTelegramPlane className="text-xl" />
              </a>
              <a href="https://wa.me/963980931111" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-lg bg-white/20 border-none hover:bg-white/30">
                <FaWhatsapp className="text-xl" />
              </a>
              <a href="mailto:qudwa.ltk@gmail.com" className="btn btn-circle btn-lg bg-white/20 border-none hover:bg-white/30">
                <FaEnvelope className="text-xl" />
              </a>
            </div>

            <Link 
              href="/dashboard" 
              className="btn bg-white text-primary rounded-full px-8 hover:bg-white/90 border-none"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>

      {/* App Info Footer */}
      <div className="py-8 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto text-center text-base-content/40">
          <p className="mb-2">جمعية قدوة - الإصدار 1.0.0</p>
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
        </div>
      </div>

    </div>
  );
}