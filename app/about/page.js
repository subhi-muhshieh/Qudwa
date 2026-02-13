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
  FaPaperPlane,
  FaSeedling,
  FaUsersCog
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const [managementTeam, setManagementTeam] = useState([]);
  const [regularTeam, setRegularTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
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
      color: "from-blue-500/10 to-blue-600/5 border-blue-500/20"
    },
    {
      icon: <FaHandHoldingHeart />,
      title: "المسؤولية المجتمعية",
      description: "تعزيز دورنا الإيجابي تجاه المجتمع.",
      color: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20"
    },
    {
      icon: <FaUserShield />,
      title: "القدوة الحسنة",
      description: "نؤمن أن السلوك أبلغ من الكلام.",
      color: "from-amber-500/10 to-amber-600/5 border-amber-500/20"
    },
    {
      icon: <FaPalette />,
      title: "الإبداع",
      description: "التعلم بأساليب مبتكرة وممتعة.",
      color: "from-purple-500/10 to-purple-600/5 border-purple-500/20"
    },
    {
      icon: <FaSmile />,
      title: "الإيجابية",
      description: "التفكير وتقديم الحلول بدلاً عن التذمر.",
      color: "from-orange-500/10 to-orange-600/5 border-orange-500/20"
    },
    {
      icon: <FaUsers />,
      title: "العمل الجماعي",
      description: "النجاح يصنعه الفريق.",
      color: "from-sky-500/10 to-sky-600/5 border-sky-500/20"
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
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-base-200 overflow-x-hidden">
      
      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent text-white py-24 md:py-28 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 md:w-96 h-60 md:h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-40 md:w-64 h-40 md:h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link 
            href="/settings" 
            className="btn btn-ghost btn-sm rounded-xl gap-2 mb-6 md:mb-8 text-white/80 hover:text-white hover:bg-white/10"
          >
            <FaArrowRight />
            العودة للإعدادات
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl shadow-black/10">
              <img 
                src="/logo.png" 
                alt="شعار قدوة" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-8xl font-bold mb-4 md:mb-6"
            style={{ fontFamily: 'var(--font-nastaliq)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            قُدوَة
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-4xl opacity-90 mb-4 md:mb-6 font-slogan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            جيلٌ يبني... أثرٌ يبقى
          </motion.p>
        </div>
      </div>

      {/* ==========================================
          WHO WE ARE
      ========================================== */}
      <div className="py-14 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-base-100 rounded-3xl p-6 md:p-12 shadow-lg border border-base-200 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <FaUsers className="text-lg md:text-xl text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">من نحن؟</h2>
            </div>
            
            <p className="text-base-content/80 leading-[2] text-base md:text-xl relative z-10">
              نحن مجموعةٌ من الشباب، نؤمن بدورنا في صناعةِ التغيير الإيجابيِّ في المجتمع، وأنَّ التعليمَ يكونُ أكثرَ تأثيراً عندما يقترنُ بالمتعةِ والتجربة. اجتمعنا على فكرة أن القيمَ لا تُفرضُ بل تُغرس، نسعى إلى تمكينِ الفئةِ الشبابيَّةِ وبناءِ شخصيَّاتٍ واعيةٍ ومتوازنة، قادرة على التأثير الإيجابيِّ في نفسها ومحيطها.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ==========================================
          VISION & MISSION
      ========================================== */}
      <div className="py-14 md:py-16 px-4 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Vision */}
            <motion.div 
              className="relative rounded-3xl p-6 md:p-10 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 overflow-hidden group hover:shadow-xl transition-shadow duration-500"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <FaEye className="text-lg md:text-xl text-primary" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary">رؤيتنا</h3>
                </div>
                <p className="text-base-content/75 leading-[1.9] text-sm md:text-lg">
                  شبابٌ واعٍ، صاحبُ قيمٍ راسخة، وقدوة إيجابيَّة تساهمُ في بناءِ مجتمعٍ متماسكٍ ومتقدِّم. نعدُّ من كلِّ شابٍّ قدوةً مُلهمةً قادرة على إحداثِ فرقٍ وقيادة التغيير الإيجابيِّ في المجتمع.
                </p>
              </div>
            </motion.div>
            
            {/* Mission */}
            <motion.div 
              className="relative rounded-3xl p-6 md:p-10 bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/15 overflow-hidden group hover:shadow-xl transition-shadow duration-500"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <FaPaperPlane className="text-lg md:text-xl text-secondary" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-secondary">رسالتنا</h3>
                </div>
                <p className="text-base-content/75 leading-[1.9] text-sm md:text-lg">
                  رفعُ مستوى القيمِ الأخلاقيَّة والإنسانيَّة لدى الشباب من خلال برامج تعليمية وتربوية مبتكرة تعتمدُ على الترفيهِ الهادف، والتجربةِ العملية، والمشاركةِ الفعَّالة.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ==========================================
          GOALS
      ========================================== */}
      <div className="py-14 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaBullseye className="text-xl md:text-2xl text-accent" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-3">أهدافنا</h2>
            <p className="text-base-content/50 text-sm md:text-base">نعمل لتحقيق أهداف واضحة تصنع الفرق</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {goals.map((goal, index) => (
              <motion.div 
                key={index} 
                className="bg-base-100 rounded-2xl p-4 md:p-6 shadow-sm border border-base-200 flex items-start gap-3 md:gap-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary text-sm md:text-base group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {goal.icon}
                </div>
                <p className="text-base-content/80 leading-relaxed text-sm md:text-base font-medium pt-1">{goal.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================
          VALUES — 2 cols mobile, 3 cols desktop
      ========================================== */}
      <div className="py-14 md:py-20 px-4 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaStar className="text-xl md:text-2xl text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-3">قيمنا</h2>
            <p className="text-base-content/50 text-sm md:text-base">المبادئ التي توجه عملنا وتشكل هويتنا</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className={`rounded-2xl p-4 md:p-6 bg-gradient-to-br ${value.color} border hover:scale-[1.02] transition-transform duration-300`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="text-primary mb-2 md:mb-4 text-xl md:text-3xl">{value.icon}</div>
                <h3 className="text-sm md:text-xl font-bold text-base-content mb-1 md:mb-2 leading-snug">{value.title}</h3>
                <p className="text-base-content/60 leading-relaxed text-xs md:text-base">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================
          WHAT WE DO — 2 cols mobile, 3 cols desktop
      ========================================== */}
      <div className="py-14 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaChild className="text-xl md:text-2xl text-secondary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-3">ماذا نقدم؟</h2>
          </motion.div>

          {/* Target Audience */}
          <motion.div 
            className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-5 md:p-8 mb-8 md:mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-base-content/80 text-sm md:text-lg leading-[1.9]">
              نستهدفُ الشباب واليافعين، مع التركيزِ على الفئةِ العمريَّة الصغيرة القابلةِ للتكوين الفكريِّ والقيميّ.
            </p>
          </motion.div>

          {/* Activities Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {activities.map((activity, index) => (
              <motion.div 
                key={index} 
                className="bg-base-100 rounded-2xl p-4 md:p-6 shadow-sm border border-base-200 flex flex-col items-center text-center gap-2 md:gap-4 hover:shadow-lg hover:border-secondary/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-secondary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-secondary text-lg md:text-2xl group-hover:bg-secondary group-hover:text-white transition-colors duration-300 shrink-0">
                  {activity.icon}
                </div>
                <p className="text-base-content/80 font-medium leading-relaxed text-xs md:text-base">{activity.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================
          TEAM SECTION
      ========================================== */}
      <div className="py-14 md:py-20 px-4 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-xl md:text-2xl text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-3">فريقنا</h2>
            {totalTeam > 0 && (
              <p className="text-base-content/50 text-sm md:text-base">{totalTeam} عضو يعملون معاً لتحقيق رسالتنا</p>
            )}
          </motion.div>
          
          {teamLoading ? (
            <div className="flex items-center justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : totalTeam === 0 ? (
            <div className="text-center py-16 text-base-content/40">
              <FaUsers className="text-5xl mx-auto mb-4 text-base-content/20" />
              <p className="text-lg">سيتم إضافة فريق العمل قريباً</p>
            </div>
          ) : (
            <>
              {/* Management Team */}
              {managementTeam.length > 0 && (
                <div className="mb-12 md:mb-14">
                  <div className="flex items-center justify-center gap-3 mb-8 md:mb-10">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-warning/30"></div>
                    <h3 className="text-lg md:text-xl font-bold text-warning flex items-center gap-2 whitespace-nowrap px-2 md:px-4">
                      <FaCrown /> الإدارة
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-warning/30"></div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {managementTeam.map((member, index) => (
                      <motion.div 
                        key={member.id} 
                        className="text-center group"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="relative mx-auto mb-3 md:mb-5">
                          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden mx-auto border-4 border-warning/20 shadow-lg shadow-warning/10 group-hover:border-warning/50 transition-all duration-500 group-hover:scale-105">
                            {member.photo_url ? (
                              <img 
                                src={member.photo_url} 
                                alt={member.name}
                                loading="lazy"
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full bg-warning/10 flex items-center justify-center">
                                <FaUser className="text-2xl md:text-3xl text-warning/40" />
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                            <span className="badge badge-warning badge-xs md:badge-sm gap-1 shadow-md">
                              <FaCrown className="text-[8px] md:text-[10px]" /> إدارة
                            </span>
                          </div>
                        </div>
                        <h4 className="font-bold text-base-content text-sm md:text-lg mt-1 md:mt-2">{member.name}</h4>
                        <p className="text-primary text-xs md:text-sm font-medium mt-0.5 md:mt-1">{member.role_title}</p>
                        {member.office && (
                          <p className="text-base-content/40 text-[10px] md:text-xs mt-0.5 md:mt-1">
                            {officeLabels[member.office] || member.office}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Team */}
              {regularTeam.length > 0 && (
                <div>
                  <div className="flex items-center justify-center gap-3 mb-8 md:mb-10">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/20"></div>
                    <h3 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 whitespace-nowrap px-2 md:px-4">
                      <FaUsers /> الأعضاء
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/20"></div>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                    {regularTeam.map((member, index) => (
                      <motion.div 
                        key={member.id} 
                        className="text-center group"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto mb-2 md:mb-3 border-2 border-primary/10 shadow-md group-hover:border-primary/30 transition-all duration-300 group-hover:scale-105">
                          {member.photo_url ? (
                            <img 
                              src={member.photo_url} 
                              alt={member.name}
                              loading="lazy"
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                              <FaUser className="text-base md:text-xl text-primary/40" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-base-content text-xs md:text-base leading-tight">{member.name}</h4>
                        <p className="text-primary/70 text-[10px] md:text-xs mt-0.5">{member.role_title}</p>
                        {member.office && (
                          <p className="text-base-content/30 text-[9px] md:text-[10px] mt-0.5">
                            {officeLabels[member.office] || member.office}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ==========================================
          CONTACT / CTA SECTION
      ========================================== */}
      <div className="py-14 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl p-6 md:p-14 text-white text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">انضم إلينا</h2>
              <p className="opacity-90 mb-8 md:mb-10 text-sm md:text-lg max-w-lg mx-auto">
                سواء كنت ولي أمر، متطوعاً، أو داعماً — نرحب بك في عائلة قدوة
              </p>
              
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-8 md:mb-10">
                <a href="https://www.instagram.com/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-md md:btn-lg bg-white/20 border-none hover:bg-white/30 hover:scale-110 transition-all">
                  <FaInstagram className="text-lg md:text-xl" />
                </a>
                <a href="https://www.facebook.com/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-md md:btn-lg bg-white/20 border-none hover:bg-white/30 hover:scale-110 transition-all">
                  <FaFacebook className="text-lg md:text-xl" />
                </a>
                <a href="https://t.me/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-md md:btn-lg bg-white/20 border-none hover:bg-white/30 hover:scale-110 transition-all">
                  <FaTelegramPlane className="text-lg md:text-xl" />
                </a>
                <a href="https://wa.me/963980931111" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-md md:btn-lg bg-white/20 border-none hover:bg-white/30 hover:scale-110 transition-all">
                  <FaWhatsapp className="text-lg md:text-xl" />
                </a>
                <a href="mailto:qudwa.ltk@gmail.com" className="btn btn-circle btn-md md:btn-lg bg-white/20 border-none hover:bg-white/30 hover:scale-110 transition-all">
                  <FaEnvelope className="text-lg md:text-xl" />
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Link 
                  href="/login" 
                  className="btn bg-white text-primary rounded-full px-8 hover:bg-white/90 border-none shadow-lg btn-sm md:btn-md"
                >
                  سجّل الآن
                </Link>
                <Link 
                  href="/dashboard" 
                  className="btn btn-outline border-white/30 text-white rounded-full px-8 hover:bg-white/10 hover:border-white/50 btn-sm md:btn-md"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <div className="py-6 md:py-8 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto text-center text-base-content/40 text-xs md:text-sm">
          <p className="mb-1 md:mb-2">منظمة قدوة - الإصدار 1.0.0</p>
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
        </div>
      </div>

    </div>
  );
}