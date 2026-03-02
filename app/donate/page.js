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
    { icon: <FaUsers />, number: '15+', label: 'عائلة مشاركة', color: 'text-accent' },
    { icon: <FaStar />, number: '10+', label: 'متطوع نشط', color: 'text-warning' },
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
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-base-200 overflow-x-hidden">

      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent text-white py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-white/10 rounded-full blur-3xl -mr-36 -mt-36 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 md:w-96 h-60 md:h-96 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <FaHandHoldingHeart className="text-3xl md:text-4xl" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4 md:mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            ساهم في بناء جيل واعٍ
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-2xl opacity-90 mb-4 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            تبرعك يصنع الفرق في حياة أطفال يستحقون فرصة أفضل
          </motion.p>

          <motion.p
            className="text-sm md:text-base opacity-70 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            كل مساهمة، مهما كانت صغيرة، تساعدنا في تقديم برامج تعليمية وتربوية لأبنائنا
          </motion.p>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <a href="#donate-now" className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none rounded-full px-10 shadow-xl gap-2">
              <FaHeart className="animate-pulse" /> تبرع الآن
            </a>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          IMPACT STATS
      ========================================== */}
      <section className="py-12 md:py-16 px-4 -mt-10 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {impactItems.map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                className="bg-base-100 rounded-2xl p-5 text-center shadow-lg border border-base-200 hover:shadow-xl transition-shadow"
              >
                <div className={`text-2xl md:text-3xl ${item.color} mb-2`}>{item.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-base-content">{item.number}</div>
                <div className="text-xs md:text-sm text-base-content/50">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          WHY DONATE
      ========================================== */}
      <section className="py-14 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaQuestionCircle className="text-2xl text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">أين يذهب تبرعك؟</h2>
            <p className="text-base-content/50 text-sm md:text-base max-w-xl mx-auto">
              نضمن أن كل ليرة تصل إلى مكانها الصحيح وتصنع أثراً حقيقياً
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {donationUses.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-base-100 rounded-2xl p-5 md:p-6 shadow-sm border border-base-200 flex items-start gap-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary text-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base-content text-lg mb-1">{item.title}</h3>
                  <p className="text-base-content/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          DONATE NOW — QR CODE + METHODS
      ========================================== */}
      <section id="donate-now" className="py-14 md:py-20 px-4 bg-base-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaHeart className="text-2xl text-warning" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">طرق التبرع</h2>
            <p className="text-base-content/50 text-sm md:text-base max-w-xl mx-auto">
              اختر الطريقة الأنسب لك للمساهمة في دعم رسالتنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

            {/* QR Code Card */}
            <motion.div
              className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/15 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden order-1"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <FaQrcode className="text-xl text-primary" />
                  <h3 className="text-xl md:text-2xl font-bold text-primary">شام كاش</h3>
                </div>

                <p className="text-base-content/60 text-sm mb-6">
                  امسح رمز QR أدناه عبر تطبيق شام كاش للتحويل المباشر
                </p>

                {/* QR Image */}
                <div className="bg-white rounded-2xl p-4 md:p-6 inline-block mx-auto shadow-lg border border-base-200 mb-6">
                  <img 
                    src="/shamcash-qr.png" 
                    alt="رمز QR لحساب شام كاش - جمعية قدوة"
                    className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto"
                  />
                </div>

                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <p className="text-xs text-base-content/50 mb-1">اسم الحساب</p>
                  <p className="font-bold text-primary text-lg">جمعية قدوة</p>
                </div>

                <div className="mt-4 flex items-start gap-2 text-right bg-info/5 border border-info/10 p-3 rounded-xl">
                  <FaInfoCircle className="text-info shrink-0 mt-0.5 text-sm" />
                  <p className="text-xs text-base-content/50 leading-relaxed">
                    بعد التحويل، يرجى التواصل معنا لتأكيد وصول التبرع وإرسال إيصال الاستلام
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Other Methods */}
            <motion.div
              className="space-y-4 md:space-y-5 order-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Cash Donation */}
              <div className="bg-base-100 rounded-2xl p-5 md:p-6 shadow-sm border border-base-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center text-success">
                    <FaMoneyBillWave />
                  </div>
                  <h3 className="font-bold text-base-content text-lg">تبرع نقدي مباشر</h3>
                </div>
                <p className="text-base-content/60 text-sm mb-4 leading-relaxed">
                  يمكنك تسليم تبرعك نقداً لأحد أعضاء الإدارة. تواصل معنا لترتيب الاستلام.
                </p>
                <Link href="/contact" className="btn btn-sm btn-outline btn-success rounded-xl gap-2">
                  <FaEnvelope /> تواصل لترتيب الاستلام
                </Link>
              </div>

              {/* In-Kind Donation */}
              <div className="bg-base-100 rounded-2xl p-5 md:p-6 shadow-sm border border-base-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    <FaHandsHelping />
                  </div>
                  <h3 className="font-bold text-base-content text-lg">تبرع عيني</h3>
                </div>
                <p className="text-base-content/60 text-sm mb-3 leading-relaxed">
                  نستقبل التبرعات العينية التي تساعدنا في تقديم أنشطتنا:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['قرطاسية', 'ألعاب تعليمية', 'كتب', 'مواد فنية', 'أدوات رياضية', 'مستلزمات مخيمات'].map((item, idx) => (
                    <span key={idx} className="badge badge-outline badge-sm py-2">{item}</span>
                  ))}
                </div>
                <Link href="/contact" className="btn btn-sm btn-outline btn-accent rounded-xl gap-2">
                  <FaEnvelope /> تواصل لتنسيق التبرع
                </Link>
              </div>

              {/* Contact for Other Methods */}
              <div className="bg-gradient-to-r from-warning/5 to-warning/10 rounded-2xl p-5 md:p-6 border border-warning/15">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center text-warning">
                    <FaQuestionCircle />
                  </div>
                  <h3 className="font-bold text-base-content text-lg">طريقة أخرى؟</h3>
                </div>
                <p className="text-base-content/60 text-sm mb-4 leading-relaxed">
                  إذا كنت خارج سوريا أو تفضل طريقة دفع مختلفة، تواصل معنا وسنجد الحل المناسب.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href="https://wa.me/963980931111" target="_blank" rel="noopener noreferrer" className="btn btn-sm bg-[#25D366] hover:bg-[#128C7E] border-none text-white rounded-xl gap-2">
                    <FaWhatsapp /> واتساب
                  </a>
                  <a href="https://t.me/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="btn btn-sm bg-[#0088cc] hover:bg-[#007db3] border-none text-white rounded-xl gap-2">
                    <FaTelegramPlane /> تلغرام
                  </a>
                  <Link href="/contact" className="btn btn-sm btn-outline rounded-xl gap-2">
                    <FaEnvelope /> راسلنا
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TRANSPARENCY NOTE
      ========================================== */}
      <section className="py-14 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-base-100 rounded-3xl p-6 md:p-10 shadow-lg border border-base-200 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <FaShieldAlt className="text-xl text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-primary">التزامنا بالشفافية</h2>
            </div>

            <div className="space-y-4 relative z-10">
              {[
                'كل تبرع يُوثّق ويُسجّل رسمياً في سجلات الجمعية',
                'نرسل تأكيد استلام لكل متبرع عبر وسائل التواصل',
                'يمكنك متابعة أثر تبرعك من خلال صفحة النشاطات والمعرض',
                'نلتزم بصرف التبرعات حصرياً على البرامج والأنشطة المعلنة',
                'نرحب بأي استفسار حول آلية صرف التبرعات في أي وقت',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <FaCheckCircle className="text-success shrink-0 mt-1" />
                  <p className="text-base-content/70 text-sm md:text-base leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          DONATION FAQ
      ========================================== */}
      <section className="py-14 md:py-20 px-4 bg-base-100">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">أسئلة شائعة عن التبرع</h2>
          </motion.div>

          <motion.div 
            className="space-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {faqItems.map((item, idx) => (
              <motion.details
                key={idx}
                variants={fadeInUp}
                className="group bg-base-200/50 rounded-2xl border border-base-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-base-200 transition-colors font-bold text-base-content list-none">
                  <span>{item.q}</span>
                  <FaArrowLeft className="text-primary text-sm shrink-0 group-open:rotate-90 transition-transform duration-300" />
                </summary>
                <div className="px-5 pb-5 pt-0">
                  <div className="border-t border-base-200 pt-4">
                    <p className="text-base-content/60 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          CTA SECTION
      ========================================== */}
      <section className="py-14 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl p-6 md:p-14 text-white text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaMosque className="text-3xl" />
              </motion.div>

              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                «خيرُ الناسِ أنفعُهم للناس»
              </h2>
              <p className="opacity-90 mb-8 text-sm md:text-lg max-w-lg mx-auto leading-relaxed">
                ساهم معنا في بناء مستقبل أفضل لأبنائنا. كل مساهمة تترك أثراً يبقى.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#donate-now" className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none rounded-full px-10 shadow-xl gap-2">
                  <FaHeart /> تبرع الآن
                </a>
                <Link href="/contact" className="btn btn-lg btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-10 gap-2">
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