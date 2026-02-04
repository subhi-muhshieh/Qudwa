'use client'
import { createClient } from '../utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHeart, FaPaperPlane, FaCalendarAlt, FaStar, FaArrowLeft, FaClock, FaInfoCircle, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [recentActivity, setRecentActivity] = useState(null);
  const [upcomingActivity, setUpcomingActivity] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
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
    if (selectedActivity) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedActivity]);

  const handleLike = async (activityId) => {
    const { error } = await supabase.from('likes').insert([{ user_id: user.id, activity_id: activityId }]);
    if (error) error.code === '23505' ? toast('أعجبك مسبقاً!', { icon: '✨' }) : toast.error("خطأ");
    else toast.success("شكراً لتفاعلك!");
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact-input');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  };

  const fadeInUp = { hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-ring loading-lg text-primary"></span></div>;

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 overflow-hidden relative">
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-center mb-20 mt-6">
        <h2 className="text-4xl md:text-6xl text-accent font-black tracking-wide leading-tight drop-shadow-sm" style={{ fontFamily: 'var(--font-slogan)' }}>
          جيلٌ يبني، أثرٌ يبقى
        </h2>
        <div className="w-24 h-2 bg-primary/20 mx-auto mt-6 rounded-full"></div>
      </motion.div>

      <motion.div className="max-w-6xl mx-auto mb-24" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
        <div className="glass-panel p-2 rounded-[2.5rem] shadow-sm">
          <div className="bg-white/60 rounded-[2rem] overflow-hidden p-6 md:p-10 flex flex-col lg:flex-row-reverse gap-10 items-start transition-all">
            {recentActivity ? (
              <>
                {recentActivity.image_url && (
                  <div className="w-full lg:w-1/2 relative">
                      <img src={recentActivity.image_url} className="rounded-3xl shadow-lg w-full object-cover h-[350px] md:h-[400px]" />
                  </div>
                )}
                <div className="w-full lg:w-1/2 text-right">
                  <div className="badge badge-secondary badge-outline mb-6 px-4 py-4 text-sm gap-2 font-bold bg-white/50 border-secondary/30 flex items-center h-auto">
                    <FaStar className="text-base" /> 
                    <span className="leading-none pt-1">آخر النشاطات</span>
                  </div>
                  <h1 className="text-3xl lg:text-5xl font-bold mb-6 text-neutral leading-tight">{recentActivity.title}</h1>
                  <p className="text-lg text-neutral/70 leading-relaxed mb-8 pl-4 border-l-4 border-primary/20">{recentActivity.short_description}</p>
                  <div className="flex flex-wrap gap-3">
                      <button onClick={() => handleLike(recentActivity.id)} className="btn btn-primary rounded-2xl px-6 text-white shadow-lg shadow-primary/30"><FaHeart /> أعجبني</button>
                      <button onClick={() => setSelectedActivity(recentActivity)} className="btn btn-ghost rounded-2xl">التفاصيل</button>
                      <button onClick={scrollToContact} className="btn btn-outline btn-secondary rounded-2xl gap-2">
                        <FaPaperPlane /> تواصل بشأن هذا
                      </button>
                  </div>
                </div>
              </>
            ) : <div className="w-full text-center py-20 opacity-40">بانتظار إضافة نشاطات...</div>}
          </div>
        </div>
      </motion.div>

      {upcomingActivity && (
        <motion.div className="max-w-4xl mx-auto mb-24 relative group" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeInUp}>
          <div className="absolute inset-0 bg-secondary/30 rounded-[2.5rem] blur-2xl transform group-hover:scale-105 transition duration-500"></div>
          <div className="card w-full bg-gradient-to-br from-primary to-accent text-white shadow-2xl overflow-hidden rounded-[2.5rem] relative z-10">
            <div className="card-body p-8 md:p-12 text-right relative">
                <div className="flex items-center gap-3 text-blue-100 mb-4 opacity-90"><FaCalendarAlt className="text-xl" /><span className="font-bold tracking-widest text-sm uppercase">النشاط القادم</span></div>
                <h2 className="card-title text-3xl md:text-5xl font-bold mb-6">{upcomingActivity.title}</h2>
                <p className="text-lg md:text-xl opacity-90 mb-10 font-light leading-relaxed">{upcomingActivity.short_description}</p>
                <div className="card-actions justify-end border-t border-white/20 pt-6">
                    <button onClick={() => setSelectedActivity(upcomingActivity)} className="btn btn-ghost bg-white/20 text-white hover:bg-white hover:text-primary border-none rounded-2xl px-8 gap-3 h-12">
                        للمزيد من التفاصيل <FaArrowLeft />
                    </button>
                </div>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedActivity && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedActivity(null)}></div>
            <motion.div 
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            >
              <button onClick={() => setSelectedActivity(null)} className="absolute top-4 left-4 btn btn-circle btn-sm btn-ghost bg-black/10 z-20 hover:bg-red-500 hover:text-white transition-colors">
                <FaTimes />
              </button>

              {selectedActivity.image_url && (
                <div className="w-full h-48 md:h-64 relative">
                  <img src={selectedActivity.image_url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-6 right-6 text-3xl font-bold text-white drop-shadow-md">{selectedActivity.title}</h3>
                </div>
              )}

              <div className="p-8 text-right space-y-6">
                {!selectedActivity.image_url && <h3 className="text-3xl font-bold text-primary">{selectedActivity.title}</h3>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-100 p-4 rounded-2xl border border-base-200">
                    {selectedActivity.activity_date && (
                        <div className="flex items-center gap-3 text-neutral/80">
                            <div className="p-2 bg-blue-100 text-primary rounded-full"><FaCalendarAlt /></div>
                            <span className="font-bold">{selectedActivity.activity_date}</span>
                        </div>
                    )}
                    {selectedActivity.start_time && (
                        <div className="flex items-center gap-3 text-neutral/80">
                            <div className="p-2 bg-orange-100 text-orange-500 rounded-full"><FaClock /></div>
                            <span className="font-bold">
                              {selectedActivity.start_time.slice(0,5)} 
                              {selectedActivity.end_time ? ` - ${selectedActivity.end_time.slice(0,5)}` : ''}
                            </span>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="font-bold text-lg text-primary mb-2 border-b pb-2">التفاصيل الكاملة</h4>
                    <p className="text-neutral/80 leading-relaxed whitespace-pre-wrap">{selectedActivity.full_report}</p>
                </div>

                {selectedActivity.notable_notes && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-yellow-700 font-bold mb-2">
                            <FaInfoCircle /> ملاحظات هامة
                        </div>
                        <p className="text-yellow-800 text-sm whitespace-pre-wrap">{selectedActivity.notable_notes}</p>
                    </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}