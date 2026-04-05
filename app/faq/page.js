'use client'
import { useState } from 'react';
import Link from 'next/link';
import { FaQuestionCircle, FaChevronDown, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "ما هي جمعية قدوة؟",
      answer: "جمعية قدوة هي جمعية غير ربحية تهدف إلى بناء جيل واعٍ ومسؤول من خلال تقديم برامج تربوية وتعليمية متميزة للأطفال والشباب. نسعى لغرس القيم الإيجابية وتنمية المهارات الحياتية لدى الأجيال الناشئة."
    },
    {
      question: "كيف يمكنني تسجيل أطفالي في الأنشطة؟",
      answer: "يمكنك تسجيل أطفالك من خلال إنشاء حساب في الموقع، ثم إضافة بيانات أطفالك في صفحة الملف الشخصي. بعد ذلك، ستتمكن من الاطلاع على الأنشطة المتاحة والتسجيل فيها مباشرة."
    },
    {
      question: "هل الأنشطة مجانية؟",
      answer: "نعم، معظم أنشطتنا مجانية بالكامل. بعض الأنشطة الخاصة قد تتطلب رسوماً رمزية لتغطية تكاليف المواد والأدوات المستخدمة. سيتم الإعلان عن أي رسوم مسبقاً في وصف النشاط."
    },
    {
      question: "ما هي الفئات العمرية المستهدفة؟",
      answer: "نستهدف الأطفال من عمر 5 سنوات وحتى 18 سنة. يتم تقسيم الأنشطة حسب الفئات العمرية لضمان ملاءمة المحتوى لكل مرحلة عمرية."
    },
    {
      question: "أين تقام الأنشطة؟",
      answer: "تقام أنشطتنا في مقر الجمعية الرئيسي، بالإضافة إلى مراكز مختلفة في المدينة. يتم تحديد موقع كل نشاط في تفاصيله. كما نقدم بعض الأنشطة عبر الإنترنت."
    },
    {
      question: "كيف أتواصل مع الإدارة؟",
      answer: "يمكنك التواصل معنا عبر صفحة تواصل معنا، أو من خلال حساباتنا على وسائل التواصل الاجتماعي (إنستغرام، فيسبوك، تيليغرام)، أو عبر البريد الإلكتروني أو الواتساب."
    },
    {
      question: "هل يمكنني تعديل بيانات أطفالي؟",
      answer: "نعم، يمكنك تعديل جميع بيانات أطفالك في أي وقت من خلال صفحة الملف الشخصي. يمكنك إضافة أطفال جدد أو تعديل الأسماء والأعمار أو حذف أي طفل."
    },
    {
      question: "هل بياناتي آمنة؟",
      answer: "نعم، نحن نأخذ أمان بياناتك على محمل الجد. نستخدم تشفير SSL لحماية جميع البيانات المنقولة، ولا نشارك معلوماتك الشخصية مع أي طرف ثالث دون موافقتك."
    },
    {
      question: "كيف أستعيد كلمة المرور؟",
      answer: "إذا نسيت كلمة المرور، اضغط على 'نسيت كلمة المرور؟' في صفحة تسجيل الدخول. سيتم إرسال رابط إلى بريدك الإلكتروني لإعادة تعيين كلمة المرور الخاصة بك."
    }
  ];

  return (
    <div className="min-h-screen bg-[#EAF4FC] py-32 px-4 relative overflow-hidden">
      
      {/* Cinematic Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Updated Back Button: Soft, minimal, frosted glass */}
        <Link 
          href="/settings" 
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/50 backdrop-blur-md text-slate-600 text-sm font-bold hover:bg-white hover:text-primary hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all border border-white/60 mb-10"
        >
          <FaArrowRight className="text-sm" />
          العودة للإعدادات
        </Link>

        {/* Header */}
        <motion.div 
          className="text-center mb-16 space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white/60">
            <FaQuestionCircle className="text-5xl text-primary" />
          </div>
          {/* Fix: Changed to leading-normal and added py-2 to the span to prevent Arabic letters from clipping */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-normal">
            الأسئلة <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-secondary py-2">الشائعة</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            إجابات وافية على الأسئلة الأكثر شيوعاً حول منصة قدوة
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className={`bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border transition-all duration-300 ${isOpen ? 'border-primary/20 shadow-lg' : 'border-white/60'}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between text-right hover:bg-white/40 transition-colors rounded-t-3xl"
                >
                  <span className={`font-bold text-lg md:text-xl transition-colors ${isOpen ? 'text-primary' : 'text-slate-800'}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
                    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    className="flex-shrink-0 mr-6 w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center"
                  >
                    <FaChevronDown className={`text-sm ${isOpen ? 'text-primary' : 'text-slate-400'}`} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0">
                        <div className="border-t border-slate-100 pt-5 prose prose-slate prose-sm md:prose-base max-w-none text-slate-600 font-medium leading-loose">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Contact CTA Section */}
        <motion.div 
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white/60"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <FaQuestionCircle className="text-3xl text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-3 tracking-tight">لم تجد إجابة لسؤالك؟</h2>
          <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed">فريقنا جاهز لمساعدتك في أي وقت. تواصل معنا مباشرة وسنرد عليك في أقرب فرصة.</p>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-10 py-3.5 rounded-full text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            راسلنا الآن
          </Link>
        </motion.div>

        {/* Footer Info */}
        <div className="text-center text-slate-400 font-medium text-xs md:text-sm mt-12 pb-10">
          <p>آخر تحديث للمحتوى: <span dir="ltr">{new Date().toLocaleDateString('ar-SA')}</span></p>
        </div>

      </div>
    </div>
  );
}