'use client'
import { createClient } from '../utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaInfoCircle, FaTimes, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { updateActivityStatuses } from '../utils/activityHelpers';

export default function ActivitiesArchive() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null); 
  
  const supabase = createClient();
  const router = useRouter();

  // 1. Fetch Data
  useEffect(() => {
    const fetchAllActivities = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

       // AUTO-UPDATE: Check and update activity statuses first
      await updateActivityStatuses(supabase);

      // Fetch ALL past activities
      const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('is_upcoming', false) // Only past activities
        .order('activity_date', { ascending: false });
      
      if (data) {
        // OPTIONAL: Secondary sort for activities with same date or null dates
        const sortedData = data.sort((a, b) => {
          if (a.activity_date && b.activity_date) {
            return new Date(b.activity_date) - new Date(a.activity_date);
          }
          if (!a.activity_date) return 1;
          if (!b.activity_date) return -1;
          return new Date(b.created_at) - new Date(a.created_at);
        });
        
        setActivities(sortedData);
      }
      setLoading(false);
    };

    fetchAllActivities();
  }, [router]);

  // Freeze scroll when modal opens
  useEffect(() => {
    if (selectedActivity) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedActivity]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-ring loading-lg text-primary"></span></div>;

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-10">
      
      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-4" style={{ fontFamily: 'var(--font-slogan)' }}>
          سجل النشاطات
        </h1>
        <p className="text-neutral/60 text-lg">أرشيف كامل لكل ما قدمته قدوة للمجتمع</p>
      </div>

      {/* GRID LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.length === 0 ? (
            <div className="col-span-full text-center py-20 opacity-50">لا يوجد نشاطات سابقة حتى الآن.</div>
        ) : (
            activities.map((act, index) => (
                <motion.div 
                    key={act.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-base-200 cursor-pointer"
                    onClick={() => setSelectedActivity(act)}
                >
                    {/* Card Image */}
                    <div className="h-48 w-full overflow-hidden relative">
                        {act.image_url ? (
                            <img src={act.image_url} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full bg-base-200 flex items-center justify-center text-neutral/30 font-bold">بلا صورة</div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-neutral mb-2 line-clamp-1">{act.title}</h3>
                        <p className="text-sm text-neutral/60 line-clamp-2 mb-4 h-10">
                            {act.short_description}
                        </p>
                        <div className="flex justify-between items-center border-t border-base-100 pt-4">
                             <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                {act.activity_date || 'تاريخ غير محدد'}
                             </span>
                             <span className="text-secondary text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                التفاصيل <FaArrowLeft />
                             </span>
                        </div>
                    </div>
                </motion.div>
            ))
        )}
      </div>

      {/* ================= MODAL POPUP ================= */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedActivity(null)}></div>
            
            <motion.div 
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
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

                {/* ADDED: Bottom Close Button */}
                <div className="pt-4 mt-auto">
                  <button 
                    onClick={() => setSelectedActivity(null)} 
                    className="btn btn-ghost w-full rounded-xl border border-base-200 hover:bg-base-200 hover:border-base-300 transition-all"
                  >
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