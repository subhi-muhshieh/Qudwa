'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';
import { officeLabels } from '../utils/constants';
import { 
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
  FaEnvelope,
  FaCrown,
  FaUser,
  FaBullseye,
  FaHandshake,
  FaSmile,
  FaUserShield,
  FaPalette,
  FaChalkboardTeacher,
  FaBullhorn,
  FaHandHoldingHeart,
  FaComments,
  FaGamepad,
  FaEye,
  FaQuestionCircle,
  FaPaperPlane,
  FaSeedling,
  FaUsersCog
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const [managementTeam, setManagementTeam] = useState([]);
  const [regularTeam, setRegularTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setTeamLoading(true);
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) console.error('Error fetching team:', error);
        if (data) {
          setManagementTeam(data.filter(m => m.is_management));
          setRegularTeam(data.filter(m => !m.is_management));
        }
      } catch (err) {
        console.error('Team fetch error:', err);
        setTeamError(true);
      } finally {
        setTeamLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const goals = [
    { text: "تعزيز القيم الإيجابية، الاحترام، المسؤولية.", icon: <FaHeart /> },
    { text: "المساهمة في تنمية الوعي الفكري والسلوكي لدى الشباب.", icon: <FaLightbulb /> },
    { text: "توفير مساحات آمنة وجذابة للتعلم غير التقليدي.", icon: <FaSeedling /> },
    { text: "تطوير مهارات الشباب الشخصية والاجتماعية.", icon: <FaGraduationCap /> },
    { text: "إعداد شباب قادرين على أن يكونوا قدوة في محيطهم.", icon: <FaUserShield /> },
    { text: "تشجيع المبادرات الشبابية والعمل التطوعي.", icon: <FaHandsHelping /> },
  ];

  const values = [
    {
      icon: <FaHandshake />,
      title: "الاحترام",
      description: "احترام الذات والآخرين والاختلاف.",
      color: "text-primary bg-primary/10 border-primary/20"
    },
    {
      icon: <FaHandHoldingHeart />,
      title: "المسؤولية المجتمعية",
      description: "تعزيز دورنا الإيجابي تجاه المجتمع.",
      color: "text-secondary bg-secondary/10 border-secondary/20"
    },
    {
      icon: <FaUserShield />,
      title: "القدوة الحسنة",
      description: "نؤمن أن السلوك أبلغ من الكلام.",
      color: "text-accent bg-accent/10 border-accent/20"
    },
    {
      icon: <FaPalette />,
      title: "الإبداع",
      description: "التعلم بأساليب مبتكرة وممتعة.",
      color: "text-primary bg-primary/10 border-primary/20"
    },
    {
      icon: <FaSmile />,
      title: "الإيجابية",
      description: "التفكير وتقديم الحلول بدلاً عن التذمر.",
      color: "text-accent bg-accent/10 border-accent/20"
    },
    {
      icon: <FaUsers />,
      title: "العمل الجماعي",
      description: "النجاح يصنعه الفريق.",
      color: "text-secondary bg-secondary/10 border-secondary/20"
    },
  ];

  const activities = [
    { icon: <FaChalkboardTeacher />, text: "ورشات تعليمية وتربوية بأساليب تفاعلية" },
    { icon: <FaBullhorn />, text: "حملات توعوية حول القيم والسلوك الإيجابي" },
    { icon: <FaHandHoldingHeart />, text: "مبادرات تطوعية ومجتمعية" },
    { icon: <FaUsersCog />, text: "برامج تطوير الذات والمهارات الحياتية" },
    { icon: <FaComments />, text: "لقاءات شبابية وحلقات نقاش" },
    { icon: <FaGamepad />, text: "أنشطة ترفيهية هادفة (ألعاب تربوية، تحديات، مخيمات)" },
  ];

  const totalTeam = managementTeam.length + regularTeam.length;

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <main className="min-h-screen bg-base-100 relative w-full max-w-[100vw] overflow-x-hidden pb-24" dir="rtl">
      
      {/* Background Decor */}
      <div className="absolute top-[40vh] right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3" />

      {/* ==========================================
          HERO SECTION (Cinematic & Deep)
      ========================================== */}
      <section className="relative bg-gradient-to-br from-neutral via-primary to-secondary pt-32 pb-48 px-4 overflow-hidden rounded-b-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full">
        {/* Abstract Glowing Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neutral/30 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <img 
                src="/logo.png" 
                alt="شعار قدوة" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight text-white drop-shadow-md break-words"
            style={{ fontFamily: 'var(--font-nastaliq)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            قُدوَة
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-3xl text-white/90 mb-6 font-bold tracking-wide break-words px-2"
            style={{ fontFamily: 'var(--font-slogan)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            جيلٌ يبني... أثرٌ يبقى
          </motion.p>
        </div>
      </section>

      {/* ==========================================
          WHO WE ARE (Overlapping Glass Card)
      ========================================== */}
      <section className="px-4 -mt-24 relative z-20 mb-20 w-full">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div 
            className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-14 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/60 relative overflow-hidden text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/10">
              <FaUsers className="text-2xl text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-base-content mb-6 tracking-tight break-words">من نحن؟</h2>
            
            <p className="text-base-content/70 leading-relaxed text-base md:text-xl relative z-10 font-medium max-w-2xl mx-auto">
              نحن مجموعةٌ من الشباب، نؤمن بدورنا في صناعةِ التغيير الإيجابيِّ في المجتمع، وأنَّ التعليمَ يكونُ أكثرَ تأثيراً عندما يقترنُ بالمتعةِ والتجربة. اجتمعنا على فكرة أن القيمَ لا تُفرضُ بل تُغرس، نسعى إلى تمكينِ الفئةِ الشبابيَّةِ وبناءِ شخصيَّاتٍ واعيةٍ ومتوازنة، قادرة على التأثير الإيجابيِّ في نفسها ومحيطها.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          VISION & MISSION (Premium Grid)
      ========================================== */}
      <section className="py-10 px-4 mb-10 w-full">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Vision */}
            <motion.div 
              variants={fadeInUp}
              className="relative rounded-[2.5rem] p-8 md:p-12 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden group w-full"
            >
              <div className="absolute top-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none group-hover:bg-primary/20 transition-colors duration-500" />
              
              <div className="relative z-10 text-center md:text-right">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto md:mx-0 mb-6 text-primary text-2xl shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-base-200 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <FaEye />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-base-content mb-4 tracking-tight break-words">رؤيتنا</h3>
                <p className="text-base-content/70 leading-relaxed text-base md:text-lg font-medium">
                  شبابٌ واعٍ، صاحبُ قيمٍ راسخة، وقدوة إيجابيَّة تساهمُ في بناءِ مجتمعٍ متماسكٍ ومتقدِّم. نعدُّ من كلِّ شابٍّ قدوةً مُلهمةً قادرة على إحداثِ فرقٍ وقيادة التغيير الإيجابيِّ في المجتمع.
                </p>
              </div>
            </motion.div>
            
            {/* Mission */}
            <motion.div 
              variants={fadeInUp}
              className="relative rounded-[2.5rem] p-8 md:p-12 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden group w-full"
            >
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -mr-10 -mb-10 pointer-events-none group-hover:bg-secondary/20 transition-colors duration-500" />
              
              <div className="relative z-10 text-center md:text-right">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto md:mx-0 mb-6 text-secondary text-2xl shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-base-200 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                  <FaPaperPlane />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-base-content mb-4 tracking-tight break-words">رسالتنا</h3>
                <p className="text-base-content/70 leading-relaxed text-base md:text-lg font-medium">
                  رفعُ مستوى القيمِ الأخلاقيَّة والإنسانيَّة لدى الشباب من خلال برامج تعليمية وتربوية مبتكرة تعتمدُ على الترفيهِ الهادف، والتجربةِ العملية، والمشاركةِ الفعَّالة.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          GOALS
      ========================================== */}
      <section className="py-10 px-4 mb-10 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-base-content mb-4 tracking-tight break-words">أهدافنا</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4" />
            <p className="text-base-content/60 text-base md:text-lg max-w-xl mx-auto font-medium px-2">نعمل لتحقيق أهداف واضحة تصنع الفرق</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {goals.map((goal, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex items-start gap-5 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)] transition-all duration-500 group w-full"
              >
                <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center shrink-0 text-primary text-xl shadow-sm border border-base-200 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  {goal.icon}
                </div>
                <p className="text-base-content/80 leading-relaxed text-sm md:text-base font-bold pt-1 break-words">{goal.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          VALUES 
      ========================================== */}
      <section className="py-10 px-4 mb-10 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-base-content mb-4 tracking-tight break-words">قيمنا</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-secondary to-primary rounded-full mx-auto mb-4" />
            <p className="text-base-content/60 text-base md:text-lg max-w-xl mx-auto font-medium px-2">المبادئ التي توجه عملنا وتشكل هويتنا</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:-translate-y-2 transition-transform duration-500 group text-center min-w-0"
              >
                <div className={`w-16 h-16 mx-auto rounded-[1.5rem] flex items-center justify-center text-3xl shadow-[0_4px_15px_rgb(0,0,0,0.03)] border mb-6 transition-transform duration-500 group-hover:scale-110 shrink-0 ${value.color}`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-black text-base-content mb-3 break-words">{value.title}</h3>
                <p className="text-base-content/70 leading-relaxed text-base font-medium break-words">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          WHAT WE DO 
      ========================================== */}
      <section className="py-10 px-4 mb-10 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-base-content mb-4 tracking-tight break-words">ماذا نقدم؟</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-accent to-secondary rounded-full mx-auto mb-4" />
          </motion.div>

          <motion.div 
            className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 md:p-8 mb-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-base-content/80 text-base md:text-lg leading-relaxed font-bold break-words">
              نستهدفُ الشباب واليافعين، مع التركيزِ على الفئةِ العمريَّة الصغيرة القابلةِ للتكوين الفكريِّ والقيميّ.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {activities.map((activity, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col items-center text-center gap-4 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group min-w-0"
              >
                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-secondary text-2xl shadow-sm border border-base-200 group-hover:bg-secondary group-hover:text-white transition-colors duration-500 shrink-0">
                  {activity.icon}
                </div>
                <p className="text-base-content/80 font-bold leading-relaxed text-sm md:text-base break-words">{activity.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          TEAM SECTION
      ========================================== */}
      <section className="py-10 px-4 mb-20 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-base-content mb-4 tracking-tight break-words">فريقنا</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4" />
            {totalTeam > 0 && (
              <p className="text-base-content/60 text-base md:text-lg font-medium px-2">{totalTeam} عضو يعملون معاً لتحقيق رسالتنا</p>
            )}
          </motion.div>
          
          {teamLoading ? (
            <div className="flex items-center justify-center py-16 w-full">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : teamError ? (
            <div className="text-center py-12 bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/60 mx-auto max-w-2xl w-full">
              <p className="text-error font-bold">حدث خطأ في تحميل فريق العمل</p>
              <button onClick={() => { setTeamError(false); }} className="mt-4 px-6 py-2 bg-white rounded-xl border border-base-300 text-base-content/70 font-bold shadow-sm hover:bg-base-200">
                إعادة المحاولة
              </button>
            </div>
          ) : totalTeam === 0 ? (
            <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-[3rem] border border-white/60 shadow-sm max-w-2xl mx-auto w-full">
              <div className="w-20 h-20 bg-base-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-4xl text-base-content/30" />
              </div>
              <p className="text-xl font-bold text-base-content/80 break-words">سيتم إضافة فريق العمل قريباً</p>
            </div>
          ) : (
            <>
              {/* Management Team */}
              {managementTeam.length > 0 && (
                <div className="mb-20 w-full overflow-hidden">
                  <div className="flex items-center justify-center gap-4 mb-12 w-full">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/30"></div>
                    <div className="inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 px-6 py-2 rounded-2xl shadow-sm shrink-0">
                      <FaCrown className="text-sm" />
                      <h3 className="text-lg md:text-xl font-black tracking-wide">الإدارة</h3>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/30"></div>
                  </div>

                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                  >
                    {managementTeam.map((member) => (
                      <motion.div 
                        key={member.id} 
                        variants={fadeInUp}
                        className="text-center group bg-white/60 backdrop-blur-md rounded-[2.5rem] p-4 sm:p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 min-w-0"
                      >
                        <div className="relative mx-auto mb-6 shrink-0">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-[2rem] overflow-hidden mx-auto border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                            {member.photo_url ? (
                              <img 
                                src={member.photo_url} 
                                alt={member.name}
                                loading="lazy"
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full bg-base-200 flex items-center justify-center">
                                <FaUser className="text-3xl md:text-4xl text-base-content/30" />
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className="bg-accent text-white font-bold px-3 py-1 rounded-xl text-[10px] md:text-xs shadow-md border border-accent flex items-center gap-1">
                              <FaCrown className="text-[8px]" /> إدارة
                            </span>
                          </div>
                        </div>
                        <h4 className="font-black text-base-content text-sm sm:text-base md:text-xl mb-1 break-words line-clamp-2">{member.name}</h4>
                        <p className="text-primary font-bold text-[10px] sm:text-xs md:text-sm mb-1 break-words">{member.role_title}</p>
                        {member.office && (
                          <p className="text-base-content/50 font-medium text-[9px] sm:text-[10px] md:text-xs break-words">
                            {officeLabels[member.office] || member.office}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Regular Team */}
              {regularTeam.length > 0 && (
                <div className="w-full overflow-hidden">
                  <div className="flex items-center justify-center gap-4 mb-12 w-full">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30"></div>
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/10 px-6 py-2 rounded-2xl shadow-sm shrink-0">
                      <FaUsers className="text-sm" />
                      <h3 className="text-lg md:text-xl font-black tracking-wide">الأعضاء</h3>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30"></div>
                  </div>

                  <motion.div 
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                  >
                    {regularTeam.map((member) => (
                      <motion.div 
                        key={member.id} 
                        variants={fadeInUp}
                        className="text-center group bg-white/60 backdrop-blur-sm rounded-[2rem] p-4 sm:p-5 border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 min-w-0"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[1.5rem] overflow-hidden mx-auto mb-4 border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 shrink-0">
                          {member.photo_url ? (
                            <img 
                              src={member.photo_url} 
                              alt={member.name}
                              loading="lazy"
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full bg-base-200 flex items-center justify-center">
                              <FaUser className="text-2xl text-base-content/30" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-base-content text-xs sm:text-sm md:text-base leading-tight mb-1 break-words">{member.name}</h4>
                        <p className="text-primary/80 font-medium text-[9px] sm:text-[10px] md:text-xs mb-1 break-words">{member.role_title}</p>
                        {member.office && (
                          <p className="text-base-content/40 text-[8px] sm:text-[9px] md:text-[10px] break-words">
                            {officeLabels[member.office] || member.office}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ==========================================
          CTA SECTION (Cinematic)
      ========================================== */}
      <section className="py-10 px-4 w-full">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div 
            className="bg-gradient-to-br from-neutral via-primary to-secondary rounded-[3rem] p-8 sm:p-10 md:p-16 text-white text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-primary/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-neutral/40 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
            
            <div className="relative z-10 w-full">
              <h2 className="text-3xl md:text-5xl font-black mb-4 drop-shadow-md break-words">انضم إلينا</h2>
              <p className="text-white/90 mb-10 text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-light px-2 break-words">
                سواء كنت ولي أمر، متطوعاً، أو داعماً — نرحب بك في عائلة جمعية قدوة لتكون جزءاً من هذا الأثر.
              </p>
              
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-10">
                <a href="https://www.instagram.com/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-[1.2rem] flex items-center justify-center hover:bg-white hover:text-primary border border-white/20 transition-all shadow-lg hover:scale-110 shrink-0">
                  <FaInstagram className="text-xl md:text-2xl" />
                </a>
                <a href="https://www.facebook.com/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-[1.2rem] flex items-center justify-center hover:bg-white hover:text-primary border border-white/20 transition-all shadow-lg hover:scale-110 shrink-0">
                  <FaFacebook className="text-xl md:text-2xl" />
                </a>
                <a href="https://t.me/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-[1.2rem] flex items-center justify-center hover:bg-white hover:text-primary border border-white/20 transition-all shadow-lg hover:scale-110 shrink-0">
                  <FaTelegramPlane className="text-xl md:text-2xl" />
                </a>
                <a href="https://wa.me/963980931111" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-[1.2rem] flex items-center justify-center hover:bg-white hover:text-primary border border-white/20 transition-all shadow-lg hover:scale-110 shrink-0">
                  <FaWhatsapp className="text-xl md:text-2xl" />
                </a>
                <a href="mailto:qudwa.ltk@gmail.com" className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-[1.2rem] flex items-center justify-center hover:bg-white hover:text-primary border border-white/20 transition-all shadow-lg hover:scale-110 shrink-0">
                  <FaEnvelope className="text-xl md:text-2xl" />
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-white text-primary font-black rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] gap-2 text-sm sm:text-lg w-full sm:w-auto break-words"
                >
                  سجّل الآن في المنصة
                </Link>
                <Link 
                  href="/faq" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-[1.5rem] hover:bg-white/20 transition-all gap-2 text-sm sm:text-lg backdrop-blur-md w-full sm:w-auto break-words"
                >
                  <FaQuestionCircle className="shrink-0" /> الأسئلة الشائعة
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer className="py-8 px-4 text-center w-full">
        <p className="text-base-content/50 font-bold text-sm mb-2 break-words">جمعية قدوة - منصة الإدارة والأعضاء</p>
        <p className="text-base-content/40 text-xs font-medium break-words">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
      </footer>

    </main>
  );
}