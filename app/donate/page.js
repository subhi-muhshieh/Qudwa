'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaHeart, FaHandHoldingHeart, FaChild, FaGraduationCap, 
  FaQrcode, FaWhatsapp, FaTelegramPlane, FaEnvelope,
  FaCheckCircle, FaQuestionCircle, FaStar, FaUsers,
  FaMoneyBillWave, FaMosque, FaArrowLeft, FaInfoCircle,
  FaHandsHelping, FaShieldAlt
} from 'react-icons/fa';

export default function DonatePage() {

  const impactItems = [
    { icon: <FaChild />, number: '15+', label: 'مستفيد', color: 'text-primary' },
    { icon: <FaGraduationCap />, number: '5+', label: 'نشاط', color: 'text-secondary' },
    { icon: <FaUsers />, number: '15+', label: 'عائلة مشاركة', color: 'text-primary' },
    { icon: <FaStar />, number: '10+', label: 'متطوع نشط', color: 'text-secondary' },
  ];

  const donationUses = [
    { icon: <FaGraduationCap />, title: 'البرامج التعليمية', desc: 'تمويل ورشات العمل والدورات التدريبية للأطفال والشباب' },
    { icon: <FaChild />, title: 'الأنشطة الترفيهية', desc: 'تنظيم المخيمات والرحلات والفعاليات الترفيهية الهادفة' },
    { icon: <FaHandsHelping />, title: 'المبادرات المجتمعية', desc: 'دعم المبادرات التطوعية وحملات التوعية المجتمعية' },
    { icon: <FaMoneyBillWave />, title: 'المستلزمات والأدوات', desc: 'شراء المواد التعليمية والقرطاسية وأدوات الأنشطة' },
  ];

  const faqItems = [
    { q: 'هل التبرع آمن؟', a: 'نعم، يتم التبرع مباشرة عبر حساب الجمعية الرسمي على شام كاش أو نقداً عبر التواصل المباشر مع الإدارة.' },
    { q: 'هل يمكنني التبرع بمبلغ صغير؟', a: 'بالتأكيد! كل مبلغ مهما كان صغيراً يصنع فرقاً حقيقياً في حياة أطفالنا. لا يوجد حد أدنى للتبرع.' },
    { q: 'هل يمكنني التبرع بأشياء غير نقدية؟', a: 'نعم! نستقبل التبرعات العينية كالقرطاسية، الألعاب التعليمية، الكتب، والمستلزمات. تواصل معنا لتنسيق ذلك.' },
    { q: 'كيف أتأكد أن تبرعي وصل؟', a: 'سنرسل لك تأكيداً باستلام التبرع عبر واتساب أو تلغرام. يمكنك أيضاً متابعة أثر تبرعك عبر صفحة النشاطات.' },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <main className="min-h-screen bg-base-100 relative w-full max-w-[100vw] overflow-x-hidden pb-16 md:pb-24" dir="rtl">
      
      {/* Responsive Background Decor */}
      <div className="absolute top-[40vh] right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/5 rounded-full blur-[60px] md:blur-[100px] -z-10 pointer-events-none translate-x-1/3" />
      <div className="absolute bottom-40 left-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-secondary/5 rounded-full blur-[60px] md:blur-[100px] -z-10 pointer-events-none -translate-x-1/3" />

      {/* ==========================================
          HERO SECTION (Cinematic & Deep)
      ========================================== */}
      <section className="relative bg-gradient-to-br from-neutral via-primary to-secondary pt-28 pb-36 md:pt-32 md:pb-48 px-4 overflow-hidden rounded-b-[3rem] md:rounded-b-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full">
        {/* Abstract Glowing Orbs - Scaled for mobile */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white/10 rounded-full blur-[80px] md:blur-[120px] -mr-16 -mt-16 md:-mr-32 md:-mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-neutral/30 rounded-full blur-[60px] md:blur-[100px] -ml-16 -mb-16 md:-ml-32 md:-mb-32 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
          >
            <div className="w-20 h-20 md:w-28 md:h-28 bg-white/10 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-white/20 flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl">
              <FaHandHoldingHeart className="text-4xl md:text-6xl text-white drop-shadow-md" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            ساهم في بناء <span className="text-transparent bg-clip-text bg-gradient-to-l from-white via-white/80 to-white/40">جيل واع</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed font-bold tracking-wide px-4"
            style={{ fontFamily: 'var(--font-slogan)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            تبرعك يصنع الفرق في حياة أطفال يستحقون فرصة أفضل
          </motion.p>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-white/60 max-w-xl mx-auto mb-8 md:mb-10 font-medium px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            كل مساهمة، مهما كانت صغيرة، تساعدنا في تقديم برامج تعليمية وتربوية لأبنائنا
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <a href="#donate-now" className="inline-flex items-center justify-center gap-3 bg-white text-neutral font-black px-8 py-3.5 md:px-10 md:py-4 rounded-full text-base md:text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300">
              <FaHeart className="text-primary animate-pulse" /> تبرع الآن
            </a>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          IMPACT STATS (Overlapping Glass Cards)
      ========================================== */}
      <section className="px-4 -mt-20 md:-mt-24 relative z-20 mb-16 md:mb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {impactItems.map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:-translate-y-1 md:hover:-translate-y-2 transition-transform duration-500"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 mx-auto bg-base-100 rounded-xl md:rounded-2xl flex items-center justify-center ${item.color} mb-3 md:mb-4 shadow-sm border border-base-200`}>
                  <span className="text-xl md:text-2xl">{item.icon}</span>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-base-content mb-1">{item.number}</div>
                <div className="text-xs sm:text-sm md:text-base font-bold text-base-content/60">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          WHY DONATE (Premium Grid)
      ========================================== */}
      <section className="py-8 md:py-10 px-4 mb-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-10 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-base-content mb-3 md:mb-4 tracking-tight">أين يذهب تبرعك؟</h2>
            <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4" />
            <p className="text-base-content/60 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed px-2">
              نضمن أن كل مساهمة تصل إلى مكانها الصحيح وتصنع أثراً حقيقياً
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {donationUses.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-4 md:gap-6 hover:bg-white hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-[1rem] md:rounded-[1.5rem] flex items-center justify-center shrink-0 text-primary text-xl md:text-2xl shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-base-200 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-black text-base-content text-lg md:text-xl mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-base-content/60 text-xs sm:text-sm md:text-base leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          DONATE NOW — QR CODE + METHODS
      ========================================== */}
      <section id="donate-now" className="py-12 md:py-16 px-4 scroll-mt-24 mb-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-10 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-base-content mb-3 md:mb-4 tracking-tight">طرق التبرع</h2>
            <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4" />
            <p className="text-base-content/60 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed px-2">
              اختر الطريقة الأنسب لك للمساهمة في دعم رسالتنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

            {/* QR Code Card (Fintech Style) */}
            <motion.div
              className="lg:col-span-5 bg-white/70 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 text-center relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl mb-4 md:mb-6 shadow-sm border border-primary/20 text-sm md:text-base">
                  <FaQrcode className="text-base md:text-lg" />
                  <span>دفع إلكتروني آمن</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-base-content mb-2">شام كاش</h3>
                <p className="text-base-content/60 text-xs md:text-sm mb-6 md:mb-8 font-medium">
                  امسح رمز QR أدناه عبر تطبيق شام كاش للتحويل المباشر
                </p>

                {/* QR Image */}
                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-4 inline-block mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-base-200 mb-6 md:mb-8 aspect-square w-48 sm:w-56 md:w-64 transition-transform hover:scale-105 duration-500">
                  <img 
                    src="/shamcash-qr.png" 
                    alt="رمز QR لحساب شام كاش - جمعية قدوة"
                    className="w-full h-full object-contain rounded-xl md:rounded-[1.5rem]"
                  />
                </div>

                <div className="bg-base-100 rounded-xl md:rounded-2xl p-4 md:p-5 border border-base-200">
                  <p className="text-[10px] md:text-xs text-base-content/40 font-bold uppercase tracking-wider mb-1">اسم الحساب المستفيد</p>
                  <p className="font-black text-base-content text-lg md:text-xl">جمعية قدوة</p>
                </div>
              </div>
            </motion.div>

            {/* Other Methods */}
            <motion.div
              className="lg:col-span-7 space-y-4 md:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Cash Donation */}
              <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)] transition-all duration-300 group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-[1rem] md:rounded-2xl flex items-center justify-center text-primary text-xl md:text-2xl shadow-sm border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                  <FaMoneyBillWave />
                </div>
                <div className="flex-1 flex flex-col items-center sm:items-start">
                  <h3 className="font-black text-base-content text-lg md:text-xl lg:text-2xl mb-2">تبرع نقدي مباشر</h3>
                  <p className="text-base-content/60 text-sm md:text-base mb-4 md:mb-6 font-medium leading-relaxed max-w-lg">
                    يمكنك تسليم تبرعك نقداً لأحد أعضاء الإدارة المعتمدين. تواصل معنا لترتيب الاستلام بكل سهولة.
                  </p>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-base-100 text-base-content text-sm md:text-base font-bold rounded-lg md:rounded-xl border border-base-300 hover:bg-primary hover:border-primary hover:text-white transition-colors shadow-sm">
                    <FaEnvelope /> تواصل لترتيب الاستلام
                  </Link>
                </div>
              </div>

              {/* In-Kind Donation */}
              <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)] transition-all duration-300 group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-secondary/10 rounded-[1rem] md:rounded-2xl flex items-center justify-center text-secondary text-xl md:text-2xl shadow-sm border border-secondary/20 group-hover:bg-secondary group-hover:text-white transition-colors duration-300 shrink-0">
                  <FaHandsHelping />
                </div>
                <div className="flex-1 flex flex-col items-center sm:items-start">
                  <h3 className="font-black text-base-content text-lg md:text-xl lg:text-2xl mb-2">تبرع عيني</h3>
                  <p className="text-base-content/60 text-sm md:text-base mb-3 md:mb-4 font-medium leading-relaxed max-w-lg">
                    نستقبل التبرعات العينية التي تساعدنا في تقديم أنشطتنا بأفضل صورة:
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4 md:mb-6">
                    {['قرطاسية', 'ألعاب تعليمية', 'كتب', 'أدوات'].map((item, idx) => (
                      <span key={idx} className="px-3 py-1.5 md:px-4 md:py-2 bg-base-100 rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-base-content/70 border border-base-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">{item}</span>
                    ))}
                  </div>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-base-100 text-base-content text-sm md:text-base font-bold rounded-lg md:rounded-xl border border-base-300 hover:bg-secondary hover:border-secondary hover:text-white transition-colors shadow-sm">
                    <FaEnvelope /> تواصل لتنسيق التبرع
                  </Link>
                </div>
              </div>

              {/* Contact for Other Methods */}
              <div className="bg-neutral rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border border-neutral-focus text-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden text-center sm:text-right">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-[1rem] md:rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl backdrop-blur-md border border-white/20">
                      <FaQuestionCircle />
                    </div>
                    <h3 className="font-black text-lg sm:text-xl md:text-2xl drop-shadow-sm">طريقة أخرى؟</h3>
                  </div>
                  <p className="text-white/70 text-sm md:text-base mb-5 md:mb-6 font-light leading-relaxed max-w-lg">
                    إذا كنت خارج سوريا أو تفضل طريقة دفع مختلفة، فريقنا جاهز للمساعدة وإيجاد الطريقة الأنسب لك.
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 w-full sm:w-auto">
                    <a href="https://wa.me/963980931111" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-white/10 hover:bg-white hover:text-neutral border border-white/20 text-white text-sm md:text-base font-bold rounded-lg md:rounded-xl transition-all shadow-lg backdrop-blur-md">
                      <FaWhatsapp className="text-base md:text-lg" /> واتساب
                    </a>
                    <a href="https://t.me/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-white/10 hover:bg-white hover:text-neutral border border-white/20 text-white text-sm md:text-base font-bold rounded-lg md:rounded-xl transition-all shadow-lg backdrop-blur-md">
                      <FaTelegramPlane className="text-base md:text-lg" /> تلغرام
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TRANSPARENCY NOTE
      ========================================== */}
      <section className="py-8 md:py-10 px-4 mb-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/70 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-primary/5 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[1.5rem] md:rounded-3xl flex items-center justify-center shrink-0 border border-primary/20 shadow-inner">
                <FaShieldAlt className="text-3xl md:text-4xl text-primary drop-shadow-sm" />
              </div>
              <div className="space-y-4 md:space-y-5 text-center md:text-right w-full">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-base-content tracking-tight">التزامنا القاطع بالشفافية</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-right">
                  {[
                    'توثيق كل تبرع بالسجلات',
                    'إرسال تأكيد استلام مباشر',
                    'صرف حصري على البرامج',
                    'متابعة أثر التبرع',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-base-100 p-3 rounded-xl md:rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-base-200">
                      <FaCheckCircle className="text-primary shrink-0 text-base md:text-lg" />
                      <p className="text-base-content/80 font-bold text-xs md:text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          DONATION FAQ
      ========================================== */}
      <section className="py-8 md:py-10 px-4 mb-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-base-content mb-3 md:mb-4 tracking-tight">أسئلة شائعة</h2>
            <div className="w-10 md:w-12 h-1 bg-base-300 rounded-full mx-auto" />
          </motion.div>

          <motion.div 
            className="space-y-3 md:space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {faqItems.map((item, idx) => (
              <motion.details
                key={idx}
                variants={fadeInUp}
                className="group bg-white/70 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden [&_summary::-webkit-details-marker]:hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all"
              >
                <summary className="flex items-center justify-between p-5 md:p-6 cursor-pointer hover:bg-white transition-colors font-black text-base md:text-lg text-base-content list-none gap-4">
                  <span className="leading-snug">{item.q}</span>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-base-100 flex items-center justify-center group-open:-rotate-90 transition-transform duration-300 border border-base-200 text-base-content/50 shrink-0">
                    <FaArrowLeft className="text-[10px] md:text-xs" />
                  </div>
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 bg-white/30">
                  <p className="text-base-content/60 text-sm md:text-base leading-relaxed font-medium pt-3 md:pt-4 border-t border-base-100">{item.a}</p>
                </div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          CTA SECTION (Cinematic)
      ========================================== */}
      <section className="py-8 md:py-10 px-4 mb-8">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="bg-neutral rounded-[2rem] md:rounded-[3rem] p-8 sm:p-10 md:p-16 text-white text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-focus"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Cinematic Gradient Background inside CTA */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-neutral to-secondary/20 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-white/20 shadow-lg"
              >
                <FaMosque className="text-3xl md:text-4xl text-white drop-shadow-md" />
              </motion.div>

              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-relaxed mb-4 md:mb-6 drop-shadow-md px-2" style={{ fontFamily: 'var(--font-slogan)' }}>
               «أحبُّ النَّاسِ إلى اللَّهِ أنفعهُم للناس»
              </h2>
              <p className="text-white/80 mb-8 md:mb-10 text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-light px-4">
                ساهم معنا في بناء مستقبل أفضل لأبنائنا. كل مساهمة تترك أثراً يبقى.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full px-2">
                <a href="#donate-now" className="inline-flex items-center justify-center px-6 md:px-8 py-3.5 md:py-4 bg-white text-neutral font-black rounded-xl md:rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] gap-2 text-base md:text-lg w-full sm:w-auto">
                  <FaHeart className="text-primary animate-pulse" /> تبرع الآن
                </a>
                <Link href="/contact" className="inline-flex items-center justify-center px-6 md:px-8 py-3.5 md:py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl md:rounded-[1.5rem] hover:bg-white/20 transition-all gap-2 text-base md:text-lg backdrop-blur-md w-full sm:w-auto">
                  <FaEnvelope /> تواصل معنا
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}