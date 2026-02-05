'use client'
import { useState } from 'react';
import Link from 'next/link';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaArrowRight } from 'react-icons/fa';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // DUMMY DATA - Edit these questions and answers as needed
  const faqs = [
    {
      question: "ما هي منظمة قدوة؟",
      answer: "منظمة قدوة هي منظمة غير ربحية تهدف إلى بناء جيل واعٍ ومسؤول من خلال تقديم برامج تربوية وتعليمية متميزة للأطفال والشباب. نسعى لغرس القيم الإيجابية وتنمية المهارات الحياتية لدى الأجيال الناشئة."
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
      answer: "تقام أنشطتنا في مقر المنظمة الرئيسي، بالإضافة إلى مراكز مختلفة في المدينة. يتم تحديد موقع كل نشاط في تفاصيله. كما نقدم بعض الأنشطة عبر الإنترنت."
    },
    {
      question: "كيف أتواصل مع الإدارة؟",
      answer: "يمكنك التواصل معنا عبر نموذج الاتصال في أسفل الصفحة الرئيسية، أو من خلال حساباتنا على وسائل التواصل الاجتماعي (إنستغرام، فيسبوك، تيليغرام)، أو عبر البريد الإلكتروني أو الواتساب."
    },
    {
      question: "هل يمكنني تعديل بيانات أطفالي؟",
      answer: "نعم، يمكنك تعديل جميع بيانات أطفالك في أي وقت من خلال صفحة الملف الشخصي. يمكنك إضافة أطفال جدد أو تعديل الأسماء والأعمار أو حذف أي طفل."
    },
    {
      question: "كيف أحذف حسابي؟",
      answer: "يمكنك حذف حسابك من صفحة الإعدادات. ستحتاج لتأكيد الحذف بكتابة 'حذف حسابي'. يمكنك استعادة حسابك خلال 30 يوماً من الحذف، وبعد ذلك يتم حذف البيانات نهائياً."
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
    <div className="min-h-screen bg-base-200 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <Link 
          href="/settings" 
          className="btn btn-ghost btn-sm rounded-xl gap-2 mb-6"
        >
          <FaArrowRight />
          العودة للإعدادات
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaQuestionCircle className="text-4xl text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">الأسئلة الشائعة</h1>
          <p className="text-gray-500">إجابات على الأسئلة الأكثر شيوعاً</p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between text-right hover:bg-base-100 transition-colors"
              >
                <span className="font-bold text-lg text-neutral">{faq.question}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-primary flex-shrink-0 mr-4" />
                ) : (
                  <FaChevronDown className="text-gray-400 flex-shrink-0 mr-4" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t pt-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-primary mb-2">لم تجد إجابة لسؤالك؟</h2>
          <p className="text-gray-500 mb-6">تواصل معنا مباشرة وسنرد عليك في أقرب وقت</p>
          <Link 
            href="/dashboard#message-box" 
            className="btn btn-primary rounded-full px-8 text-white"
          >
            تواصل معنا
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm mt-8">
          <p>آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
        </div>

      </div>
    </div>
  );
}