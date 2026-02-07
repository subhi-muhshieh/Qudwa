'use client'
import { createClient } from '../utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Added Link import
import Link from 'next/link'; 
import { FaHeart, FaPaperPlane, FaCalendarAlt, FaStar, FaArrowLeft, FaClock, FaInfoCircle, FaTimes, FaExternalLinkAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [recentActivity, setRecentActivity] = useState(null);
  const [upcomingActivity, setUpcomingActivity] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) { router.replace('/login'); return; }
      setUser(user);

      const { data: past } = await supabase.from('activities').select('*').eq('is_upcoming', false).order('created_at', { ascending: false }).limit(1).single();
      if (past) setRecentActivity(past);

      const { data: coming } = await supabase.from('activities').select('*').eq('is_upcoming', true).order('created_at', { ascending: false }).limit(1).single();
      if (coming) setUpcomingActivity(coming);
      
      setLoading(false);
    };
    checkUserAndFetchData();
  }, [router]);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!selectedActivity || !user) return;
      
      setIsRegistered(false);

      const { data } = await supabase
        .from('activity_registrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_id', selectedActivity.id)
        .maybeSingle();

      if (data) {
        setIsRegistered(true);
      }
    };

    if (selectedActivity) {
      document.body.style.overflow = 'hidden';
      checkRegistrationStatus();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedActivity, user]);

  const handleLike = async (activityId) => {
    const { error } = await supabase.from('likes').insert([{ user_id: user.id, activity_id: activityId }]);
    if (error) error.code === '23505' ? toast('أعجبك مسبقاً!', { icon: '✨' }) : toast.error("خطأ");
    else toast.success("شكراً لتفاعلك!");
  };

  const handleRegister = async () => {
    if (!user || !selectedActivity) return;

    if (selectedActivity.registration_form_url) {
        window.open(selectedActivity.registration_form_url, '_blank');
    } else {
        toast.error("رابط التسجيل غير متوفر، ولكن تم تسجيل اهتمامك.");
    }

    if (isRegistered) return;

    setRegistering(true);
    
    const { error } = await supabase
        .from('activity_registrations')
        .insert([{ user_id: user.id, activity_id: selectedActivity.id }]);

    if (!error || error.code === '23505') {
        setIsRegistered(true);
        if(selectedActivity.registration_form_url) {
             toast.success("جاري فتح النموذج...", { duration: 2000 });
        }
    } else {
        console.error(error);
    }
    
    setRegistering(false);
  };

  // REMOVED: scrollToContact function

  const fadeInUp = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-ring loading-lg text-primary"></span></div>;

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 overflow-hidden relative">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16 mt-6">
        <h2 className="text-4xl md:text-6xl text-primary font-bold tracking-normal leading-tight drop-shadow-sm font-slogan">
          جيلٌ يبني، أثرٌ يبقى
        </h2>
        <div className="w-24 h-2 bg-gradient-to-r from-primary to-accent mx-auto mt-6 rounded-full opacity-50"></div>
      </motion.div>

      {/* 1. UPCOMING ACTIVITY */}
      {upcomingActivity && (
        <motion.div 
          className="max-w-6xl mx-auto mb-20 relative group" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }} 
          variants={fadeInUp}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.6rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="card w-full bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-2xl rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-black/10 blur-3xl"></div>

            <div className="card-body p-8 md:p-12 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                 <div className="badge bg-white/20 border-0 text-white backdrop-blur-md px-4 py-3 h-auto gap-2 text-sm font-bold shadow-sm">
                    <FaCalendarAlt className="animate-pulse" />
                    <span>النشاط القادم</span>
                 </div>
                 {upcomingActivity.activity_date && (
                    <div className="text-blue-100 font-medium bg-black/10 px-4 py-2 rounded-xl">
                      {upcomingActivity.activity_date}
                    </div>
                 )}
              </div>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
                <div className="w-full lg:w-1/2 text-right space-y-6 order-2 lg:order-1">
                  <h2 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-md">
                    {upcomingActivity.title}
                  </h2>
                  <p className="text-lg md:text-xl text-blue-50 opacity-90 leading-relaxed font-light">
                    {upcomingActivity.short_description}
                  </p>
                  
                  <div className="pt-4 flex flex-wrap gap-4">
                    <button 
                      onClick={() => setSelectedActivity(upcomingActivity)} 
                      className="btn btn-lg bg-white text-primary hover:bg-blue-50 border-none rounded-2xl px-10 shadow-xl w-full md:w-auto"
                    >
                        التفاصيل والتسجيل <FaArrowLeft />
                    </button>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end">
                   {upcomingActivity.image_url ? (
                      <div className="relative w-full max-w-md h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-2 hover:rotate-0 transition-all duration-500">
                        <img 
                          src={upcomingActivity.image_url} 
                          alt="Upcoming Activity" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                   ) : (
                      <div className="hidden lg:flex justify-center opacity-80">
                         <FaCalendarAlt className="text-[10rem] text-white/20" />
                      </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. RECENT ACTIVITY */}
      <motion.div 
        className="max-w-6xl mx-auto mb-24" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        variants={fadeInUp}
      >
        <div className="flex items-center gap-3 mb-6 px-4">
           <div className="w-2 h-8 bg-secondary rounded-full"></div>
           <h3 className="text-2xl font-bold text-neutral">أحدث ما قمنا به</h3>
        </div>

        <div className="glass-panel bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
          <div className="flex flex-col lg:flex-row-reverse">
            
            {recentActivity?.image_url ? (
              <div className="w-full lg:w-5/12 h-[300px] lg:h-auto relative group overflow-hidden">
                  <img 
                    src={recentActivity.image_url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={recentActivity.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-black/20 lg:to-transparent"></div>
                  <div className="absolute bottom-4 right-4 lg:top-4 lg:right-4 badge badge-secondary shadow-lg border-none">
                     <FaStar className="mr-1 text-xs" /> تم إنجازه
                  </div>
              </div>
            ) : (
              <div className="w-full lg:w-5/12 bg-base-200 flex items-center justify-center min-h-[300px]">
                <FaStar className="text-6xl text-base-300" />
              </div>
            )}

            {recentActivity ? (
              <div className="w-full lg:w-7/12 p-8 md:p-12 text-right flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral">{recentActivity.title}</h2>
                <p className="text-lg text-neutral/70 leading-relaxed mb-8">
                  {recentActivity.short_description}
                </p>
                
                <div className="flex flex-wrap gap-3 mt-auto">
                    <button 
                      onClick={() => handleLike(recentActivity.id)} 
                      className="btn btn-outline btn-primary rounded-xl px-6 hover:bg-primary hover:text-white transition-all gap-2"
                    >
                      <FaHeart /> أعجبني
                    </button>
                    <button 
                      onClick={() => setSelectedActivity(recentActivity)} 
                      className="btn btn-ghost text-neutral/60 hover:text-primary rounded-xl"
                    >
                      قراءة المزيد...
                    </button>
                    <div className="flex-grow"></div>
                    
                    {/* UPDATED: Changed from Button(scrollTo) to Link(/contact) */}
                    <Link 
                      href="/contact"
                      className="btn btn-sm btn-ghost text-secondary opacity-70 hover:opacity-100 gap-2"
                    >
                      <FaPaperPlane /> تواصل معنا
                    </Link>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center w-full text-neutral/50">جاري تحميل النشاطات...</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* MODAL (Unchanged Logic, just rendering) */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedActivity(null)}></div>
            <motion.div 
              className="bg-base-100 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
              initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
            >
              <button 
                onClick={() => setSelectedActivity(null)} 
                className="absolute top-4 left-4 btn btn-circle btn-sm bg-black/20 border-none text-white z-20 hover:bg-red-500 transition-colors"
              >
                <FaTimes />
              </button>

              {selectedActivity.image_url && (
                <div className="w-full h-64 md:h-80 relative">
                  <img src={selectedActivity.image_url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 right-0 p-8 w-full">
                    <h3 className="text-3xl md:text-4xl font-bold text-neutral drop-shadow-sm">{selectedActivity.title}</h3>
                  </div>
                </div>
              )}

              <div className="p-8 md:p-10 text-right space-y-8">
                {!selectedActivity.image_url && <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">{selectedActivity.title}</h3>}
                {/* ... existing modal content ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedActivity.activity_date && (
                        <div className="flex items-center gap-4 bg-base-200/50 p-4 rounded-2xl">
                            <div className="w-10 h-10 bg-blue-100 text-primary rounded-full flex items-center justify-center"><FaCalendarAlt /></div>
                            <div>
                                <div className="text-xs text-neutral/50">التاريخ</div>
                                <div className="font-bold text-neutral">{selectedActivity.activity_date}</div>
                            </div>
                        </div>
                    )}
                    {selectedActivity.start_time && (
                        <div className="flex items-center gap-4 bg-base-200/50 p-4 rounded-2xl">
                            <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center"><FaClock /></div>
                            <div>
                                <div className="text-xs text-neutral/50">الوقت</div>
                                <div className="font-bold text-neutral">
                                  {selectedActivity.start_time.slice(0,5)} 
                                  {selectedActivity.end_time ? ` - ${selectedActivity.end_time.slice(0,5)}` : ''}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="prose prose-lg max-w-none text-neutral/80">
                    <h4 className="font-bold text-xl text-primary mb-4 flex items-center gap-2">
                        <FaInfoCircle className="text-lg" /> التفاصيل
                    </h4>
                    <p className="whitespace-pre-wrap leading-loose text-base">{selectedActivity.full_report}</p>
                </div>

                {selectedActivity.notable_notes && (
                    <div className="bg-warning/10 border border-warning/20 p-6 rounded-2xl flex gap-4 items-start">
                        <FaStar className="text-warning text-xl mt-1 shrink-0" />
                        <div>
                            <h5 className="font-bold text-warning-content mb-1">ملاحظات هامة</h5>
                            <p className="text-neutral/70 text-sm whitespace-pre-wrap">{selectedActivity.notable_notes}</p>
                        </div>
                    </div>
                )}
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                   {selectedActivity.is_upcoming && (
                       <button 
                         onClick={handleRegister}
                         disabled={registering}
                         className={`btn flex-1 rounded-xl shadow-lg transition-all duration-300 gap-2 ${
                           isRegistered 
                             ? 'btn-success text-white' 
                             : 'btn-primary text-white shadow-primary/30'
                         }`}
                       >
                          {registering ? (
                             <><FaSpinner className="animate-spin" /> جاري التحويل...</>
                          ) : isRegistered ? (
                             <><FaCheckCircle /> تم التسجيل (فتح الرابط مجدداً)</>
                          ) : (
                             <><FaExternalLinkAlt /> التسجيل في النشاط</>
                          )}
                       </button>
                   )}
                   <button onClick={() => setSelectedActivity(null)} className="btn btn-ghost flex-1 rounded-xl">
                      إغلاق
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}