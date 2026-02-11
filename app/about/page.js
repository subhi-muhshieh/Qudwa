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
    { number: "500+", label: "طفل مستفيد", icon: <FaChild /> },
    { number: "50+", label: "نشاط منفذ", icon: <FaStar /> },
    { number: "20+", label: "متطوع نشط", icon: <FaUsers /> },
    { number: "3", label: "سنوات خبرة", icon: <FaGraduationCap /> },
  ];

  const values = [
    {
      icon: <FaHeart className="text-3xl" />,
      title: "الحب والرعاية",
      description: "نؤمن بأن كل طفل يستحق أن يُحب ويُرعى، ونسعى لتوفير بيئة آمنة ومحبة لجميع أطفالنا."
    },
    {
      icon: <FaLightbulb className="text-3xl" />,
      title: "الإبداع والابتكار",
      description: "نشجع التفكير الإبداعي ونوفر بيئة محفزة تتيح للأطفال استكشاف مواهبهم وتطوير قدراتهم."
    },
    {
      icon: <FaHandsHelping className="text-3xl" />,
      title: "التعاون والعمل الجماعي",
      description: "نغرس في الأطفال قيم التعاون والمشاركة من خلال الأنشطة الجماعية والمشاريع المشتركة."
    },
    {
      icon: <FaGraduationCap className="text-3xl" />,
      title: "التعلم المستمر",
      description: "نؤمن بأن التعلم رحلة لا تنتهي، ونسعى لتنمية حب المعرفة والاستكشاف لدى الأطفال."
    },
  ];

  const team = [
    { name: "أحمد محمد", role: "المدير التنفيذي", image: null },
    { name: "فاطمة علي", role: "مديرة البرامج", image: null },
    { name: "محمود خالد", role: "منسق الأنشطة", image: null },
    { name: "سارة أحمد", role: "مسؤولة التواصل", image: null },
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
                منظمة قدوة هي منظمة مجتمعية غير ربحية تأسست عام 2021 بهدف الاستثمار في الأجيال الناشئة وتزويدهم بالمهارات والقيم اللازمة ليكونوا قادة المستقبل.
              </p>
              <p>
                نؤمن بأن كل طفل يحمل في داخله إمكانيات هائلة تنتظر من يكتشفها ويصقلها. لذلك نقدم مجموعة متنوعة من البرامج والأنشطة التي تناسب مختلف الأعمار والاهتمامات.
              </p>
              <p>
                من خلال فريقنا المتخصص من المربين والمتطوعين، نسعى لخلق بيئة محفزة تجمع بين التعلم والمتعة، حيث يمكن للأطفال اكتساب مهارات جديدة وبناء صداقات قوية وتطوير شخصياتهم.
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
                أن نكون المنظمة الرائدة في بناء جيل واعٍ ومسؤول، يتمتع بالقيم الإيجابية والمهارات اللازمة للمساهمة في تطوير مجتمعه وبناء مستقبل أفضل.
              </p>
            </div>
            
            <div className="bg-secondary/5 border border-secondary/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-secondary mb-4">رسالتنا</h3>
              <p className="text-base-content/70 leading-relaxed">
                تقديم برامج تربوية وتعليمية متميزة تساهم في تنمية شخصية الطفل بشكل متكامل، وغرس القيم الإيجابية، وتطوير المهارات الحياتية في بيئة آمنة ومحفزة.
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
          <p className="mb-2">منظمة قدوة - الإصدار 1.0.0</p>
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
        </div>
      </div>

    </div>
  );
}