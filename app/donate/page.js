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
    { icon: <FaUsers />, number: '15+', label: 'عائلة مشاركة', color: 'text-emerald-500' },
    { icon: <FaStar />, number: '10+', label: 'متطوع نشط', color: 'text-amber-500' },
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
    <div className="min-h-screen bg-[#EAF4FC] overflow-x-hidden pb-20">

      {/* ==========================================
          HERO SECTION (Cinematic & Deep)
      ========================================== */}
      <section className="relative bg-slate-900 pt-40 pb-48 px-4 overflow-hidden rounded-b-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        {/* Abstract Glowing Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
          >
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <FaHandHoldingHeart className="text-4xl md:text-5xl text-white drop-shadow-md" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            ساهم في بناء <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-secondary">جيل واعٍ</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-2xl text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            تبرعك يصنع الفرق في حياة أطفال يستحقون فرصة أفضل
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-slate-400 max-w-xl mx-auto mb-10"
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
            <a href="#donate-now" className="inline-flex items-center justify-center gap-3 bg-white text-slate-900 font-black px-10 py-4 rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300">
              <FaHeart className="text-red-500 animate-pulse" /> تبرع الآن
            </a>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          IMPACT STATS (Overlapping Glass Cards)
      ========================================== */}
      <section className="px-4 -mt-24 relative z-20 mb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {impactItems.map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 text-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/60 hover:-translate-y-2 transition-transform duration-500"
              >
                <div className={`w-14 h-14 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center ${item.color} mb-4 shadow-sm`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="text-3xl md:text-4xl font-black text-slate-800 mb-1">{item.number}</div>
                <div className="text-sm md:text-base font-bold text-slate-500">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          WHY DONATE (Premium Grid)
      ========================================== */}
      <section className="py-10 px-4 mb-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">أين يذهب تبرعك؟</h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4" />
            <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-medium">
              نضمن أن كل ليرة تصل إلى مكانها الصحيح وتصنع أثراً حقيقياً
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {donationUses.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex items-start gap-6 hover:bg-white hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group"
              >
                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shrink-0 text-primary text-2xl shadow-sm border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-xl mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          DONATE NOW — QR CODE + METHODS
      ========================================== */}
      <section id="donate-now" className="py-16 px-4 scroll-mt-24 mb-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">طرق التبرع</h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-warning to-red-400 rounded-full mx-auto mb-4" />
            <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-medium">
              اختر الطريقة الأنسب لك للمساهمة في دعم رسالتنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* QR Code Card (Fintech Style) */}
            <motion.div
              className="lg:col-span-5 bg-white rounded-[3rem] p-8 md:p-10 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary font-bold px-4 py-2 rounded-xl mb-6">
                  <FaQrcode className="text-lg" />
                  <span>دفع إلكتروني</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">شام كاش</h3>
                <p className="text-slate-500 text-sm mb-8 font-medium">
                  امسح رمز QR أدناه عبر تطبيق شام كاش للتحويل المباشر
                </p>

                {/* QR Image */}
                <div className="bg-white rounded-3xl p-4 inline-block mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 mb-8 aspect-square w-56 md:w-64">
                  <img 
                    src="/shamcash-qr.png" 
                    alt="رمز QR لحساب شام كاش - جمعية قدوة"
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">اسم الحساب المستفيد</p>
                  <p className="font-black text-slate-800 text-xl">جمعية قدوة</p>
                </div>
              </div>
            </motion.div>

            {/* Other Methods */}
            <motion.div
              className="lg:col-span-7 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Cash Donation */}
              <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl">
                    <FaMoneyBillWave />
                  </div>
                  <h3 className="font-black text-slate-800 text-xl md:text-2xl">تبرع نقدي مباشر</h3>
                </div>
                <p className="text-slate-500 text-base mb-6 font-medium leading-relaxed">
                  يمكنك تسليم تبرعك نقداً لأحد أعضاء الإدارة المعتمدين. تواصل معنا لترتيب الاستلام بكل سهولة.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-emerald-600 transition-colors shadow-sm">
                  <FaEnvelope /> تواصل لترتيب الاستلام
                </Link>
              </div>

              {/* In-Kind Donation */}
              <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 text-2xl">
                    <FaHandsHelping />
                  </div>
                  <h3 className="font-black text-slate-800 text-xl md:text-2xl">تبرع عيني</h3>
                </div>
                <p className="text-slate-500 text-base mb-4 font-medium leading-relaxed">
                  نستقبل التبرعات العينية التي تساعدنا في تقديم أنشطتنا بأفضل صورة:
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['قرطاسية', 'ألعاب تعليمية', 'كتب', 'مواد فنية', 'أدوات رياضية'].map((item, idx) => (
                    <span key={idx} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-600 border border-slate-100 shadow-sm">{item}</span>
                  ))}
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-amber-600 transition-colors shadow-sm">
                  <FaEnvelope /> تواصل لتنسيق التبرع
                </Link>
              </div>

              {/* Contact for Other Methods */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white text-2xl backdrop-blur-md">
                    <FaQuestionCircle />
                  </div>
                  <h3 className="font-black text-xl md:text-2xl">طريقة أخرى؟</h3>
                </div>
                <p className="text-slate-400 text-base mb-6 font-medium leading-relaxed">
                  إذا كنت خارج سوريا أو تفضل طريقة دفع مختلفة، فريقنا جاهز للمساعدة وإيجاد الطريقة الأنسب لك.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://wa.me/963980931111" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold rounded-xl transition-colors">
                    <FaWhatsapp className="text-lg" /> واتساب
                  </a>
                  <a href="https://t.me/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold rounded-xl transition-colors">
                    <FaTelegramPlane className="text-lg" /> تلغرام
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TRANSPARENCY NOTE
      ========================================== */}
      <section className="py-10 px-4 mb-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl flex items-center justify-center shrink-0 border border-primary/20">
                <FaShieldAlt className="text-4xl text-primary drop-shadow-sm" />
              </div>
              <div className="space-y-5 text-center md:text-right">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800">التزامنا القاطع بالشفافية</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                  {[
                    'توثيق كل تبرع في السجلات الرسمية',
                    'إرسال تأكيد استلام مباشر للمتبرع',
                    'صرف حصري على البرامج المعلنة',
                    'متابعة أثر التبرع عبر منصتنا',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                      <FaCheckCircle className="text-emerald-500 shrink-0 text-lg" />
                      <p className="text-slate-600 font-bold text-sm">{item}</p>
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
      <section className="py-10 px-4 mb-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-slate-800 mb-4">أسئلة شائعة</h2>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {faqItems.map((item, idx) => (
              <motion.details
                key={idx}
                variants={fadeInUp}
                className="group bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white transition-colors font-black text-lg text-slate-800 list-none">
                  <span>{item.q}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-open:rotate-90 transition-transform duration-300">
                    <FaArrowLeft className="text-slate-500 text-sm" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-slate-500 text-base leading-relaxed font-medium pt-4 border-t border-slate-100">{item.a}</p>
                </div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          CTA SECTION (Cinematic)
      ========================================== */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Cinematic Gradient Background inside CTA */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-900 to-secondary/20 pointer-events-none" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20"
              >
                <FaMosque className="text-4xl text-primary-100" />
              </motion.div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-nastaliq leading-relaxed mb-6 drop-shadow-md">
               «أحبُّ النَّاسِ إلى اللَّهِ أنفعهُم للناس»
              </h2>
              <p className="text-slate-300 mb-10 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                ساهم معنا في بناء مستقبل أفضل لأبنائنا. كل مساهمة تترك أثراً يبقى.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#donate-now" className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] gap-2 text-lg">
                  <FaHeart className="text-red-500" /> تبرع الآن
                </a>
                <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all gap-2 text-lg backdrop-blur-md">
                  <FaEnvelope /> تواصل معنا
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}