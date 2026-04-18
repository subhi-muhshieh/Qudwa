'use client'
import { createClient } from '../utils/supabase/client';
import { useEffect, useState, memo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  FaCalendarAlt, FaClock, FaInfoCircle, FaTimes, FaArrowLeft, 
  FaUsers, FaChevronDown, FaCrown, FaStar, FaChild, FaHistory
} from 'react-icons/fa';
import { useProfile } from '../context/ProfileContext';
import { getLevelDef } from '../utils/constants';
import dynamic from 'next/dynamic';

const ChildProfileModal = dynamic(() => import('../components/ChildProfileModal'), { ssr: false });
import { motion, AnimatePresence } from 'framer-motion';
import { updateActivityStatuses } from '../utils/activityHelpers';
import EmptyState from '../components/EmptyState';

/* ========================================== */
/* SKELETON UI                               */
/* ========================================== */
const ArchiveSkeleton = memo(function ArchiveSkeleton() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-4 md:px-8 lg:px-12 bg-[#FAFCFF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col items-center justify-center mb-16 space-y-4">
          <div className="h-12 w-64 bg-slate-200 rounded-2xl" />
          <div className="h-5 w-80 bg-slate-200 rounded-full" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[22rem] bg-slate-200 rounded-[2.5rem] border border-white/50" />
          ))}
        </div>
      </div>
    </main>
  );
});

export default function ActivitiesArchive() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null); 
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [childrenMap, setChildrenMap] = useState({});
  const [selectedChildProfile, setSelectedChildProfile] = useState(null);
  
  const supabase = createClient();
  const router = useRouter();
  const { user: currentUser, profile: currentProfile } = useProfile();
  const isCurrentUserAdmin = currentProfile?.role === 'admin';

  useEffect(() => {
    const fetchAllActivities = async () => {
      if (currentUser) {
        await updateActivityStatuses(supabase);
      }

      const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('is_upcoming', false)
        .order('activity_date', { ascending: false, nullsFirst: false });
      
      if (data) setActivities(data);
      setLoading(false);
    };
    fetchAllActivities();
  }, [currentUser?.id]);

  useEffect(() => {
    if (selectedActivity) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedActivity]);

  useEffect(() => {
    if (!selectedActivity) {
      setAttendees([]);
      setShowAttendees(false);
      setChildrenMap({});
      return;
    }

    const fetchAttendees = async () => {
      setAttendeesLoading(true);
      const { data } = await supabase
        .from('attendance')
        .select('id, child_name, child_age, parent_name, parent_id, is_honored')
        .eq('activity_id', selectedActivity.id)
        .order('child_name');

      if (data) {
        const sorted = [
          ...data.filter(a => a.is_honored),
          ...data.filter(a => !a.is_honored)
        ];
        setAttendees(sorted);

        // Fetch children records for level data
        const parentIds = [...new Set(data.map(a => a.parent_id).filter(Boolean))];
        if (parentIds.length > 0) {
          const { data: childrenData } = await supabase
            .from('children')
            .select('*')
            .in('parent_id', parentIds);

          const map = {};
          (childrenData || []).forEach(c => {
            map[`${c.parent_id}-${c.name}`] = c;
          });
          setChildrenMap(map);
        }
      }
      setAttendeesLoading(false);
    };

    fetchAttendees();
  }, [selectedActivity, supabase]);
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedActivity(null);
    };
    if (selectedActivity) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [selectedActivity]);

  if (loading) return <ArchiveSkeleton />;

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 md:px-8 lg:px-12 bg-[#FAFCFF] relative overflow-hidden" dir="rtl">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3" />
      
      {/* HEADER */}
      <motion.div 
        className="text-center mb-16 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/10">
           <FaHistory className="text-2xl text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight drop-shadow-sm">
          سجل النشاطات
        </h1>
        <p className="text-slate-500 text-lg font-medium leading-relaxed">
          أرشيف كامل لكل ما قدمته جمعية قدوة للمجتمع، نتذكر إنجازاتنا لنبني مستقبلاً أفضل.
        </p>
      </motion.div>

      {/* GRID LAYOUT */}
      <div className="max-w-7xl mx-auto">
        {activities.length === 0 ? (
            <EmptyState
              icon={<FaCalendarAlt />}
              title="لا يوجد نشاطات سابقة"
              description="سجل النشاطات فارغ حالياً. سيتم إدراج النشاطات هنا فور اكتمالها."
              className="max-w-2xl mx-auto"
            />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {activities.map((act, index) => (
                <motion.div 
                    key={act.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group flex flex-col bg-white/70 backdrop-blur-md border border-white/60 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden cursor-pointer"
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedActivity(act)}
                >
                    {/* Card Image */}
                    <div className="h-56 w-full overflow-hidden relative shrink-0">
                        {act.image_url ? (
                            <>
                              <Image
                                src={act.image_url}
                                alt={act.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </>
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <FaStar className="text-3xl text-slate-300" />
                            </div>
                        )}
                        {act.activity_date && (
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-black px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
                             <FaCalendarAlt className="text-primary/70" /> {act.activity_date}
                          </div>
                        )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                        <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                          {act.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed font-medium flex-1">
                            {act.short_description}
                        </p>
                        <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-auto">
                             <div className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary font-bold px-3 py-1 rounded-xl text-xs">
                                <FaStar className="text-[10px]" /> تم الإنجاز
                             </div>
                             <span className="text-slate-400 group-hover:text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                التفاصيل <FaArrowLeft className="text-xs" />
                             </span>
                        </div>
                    </div>
                </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <motion.div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setSelectedActivity(null)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            
            <motion.div 
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative z-10 max-h-[90vh] flex flex-col overflow-hidden border border-white/20"
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <button 
                onClick={() => setSelectedActivity(null)} 
                className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white z-20 hover:bg-black/40 transition-all shadow-lg border border-white/10"
              >
                <FaTimes className="text-lg" />
              </button>

              <div className="overflow-y-auto flex-1 overscroll-contain pb-10">
                {selectedActivity.image_url ? (
                  <div className="w-full h-[30vh] md:h-[40vh] relative">
                    <Image
                      src={selectedActivity.image_url}
                      alt={selectedActivity.title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-primary/10 to-secondary/10" />
                )}

                <div className={`px-6 sm:px-10 md:px-12 max-w-4xl mx-auto ${selectedActivity.image_url ? '-mt-16 relative z-10' : 'pt-10'}`}>
                  
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm text-secondary font-bold px-4 py-2 rounded-xl text-xs mb-6">
                    <FaStar /> تم الإنجاز بنجاح
                  </div>

                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 mb-8 leading-tight drop-shadow-sm">
                    {selectedActivity.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {selectedActivity.activity_date && (
                      <div className="bg-slate-50 border border-slate-100 p-5 rounded-[2rem] flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-[1.2rem] flex items-center justify-center shrink-0"><FaCalendarAlt className="text-xl" /></div>
                        <div>
                          <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">تاريخ النشاط</div>
                          <div className="font-black text-slate-800 text-lg">{selectedActivity.activity_date}</div>
                        </div>
                      </div>
                    )}
                    {selectedActivity.start_time && (
                      <div className="bg-slate-50 border border-slate-100 p-5 rounded-[2rem] flex items-center gap-4">
                        <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-[1.2rem] flex items-center justify-center shrink-0"><FaClock className="text-xl" /></div>
                        <div>
                          <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">التوقيت</div>
                          <div className="font-black text-slate-800 text-lg">
                            {selectedActivity.start_time.slice(0, 5)}
                            {selectedActivity.end_time && ` - ${selectedActivity.end_time.slice(0, 5)}`}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-10">
                    <h4 className="font-black text-xl text-slate-800 mb-5 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><FaInfoCircle className="text-primary text-sm" /></span>
                      التفاصيل الكاملة
                    </h4>
                    <div className="prose prose-lg prose-slate max-w-none bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 leading-loose">
                      {selectedActivity.full_report ? (
                        <p className="whitespace-pre-wrap font-medium text-slate-600">{selectedActivity.full_report}</p>
                      ) : (
                        <p className="text-slate-400 italic">لا توجد تفاصيل إضافية مسجلة.</p>
                      )}
                    </div>
                  </div>

                  {selectedActivity.notable_notes && (
                    <div className="bg-amber-50 border border-amber-100 p-6 md:p-8 rounded-[2.5rem] mb-10 flex gap-4 md:gap-5 shadow-inner">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <FaStar className="text-amber-500 text-xl" />
                      </div>
                      <div>
                        <h5 className="font-black text-amber-900 text-lg mb-2">ملاحظات هامة</h5>
                        <p className="text-amber-800/80 text-base leading-relaxed whitespace-pre-wrap font-medium">{selectedActivity.notable_notes}</p>
                      </div>
                    </div>
                  )}

                  {/* ATTENDEES SECTION */}
                  {!attendeesLoading && attendees.length > 0 && (
                    <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] overflow-hidden mb-8 transition-all">
                      <button
                        onClick={() => setShowAttendees(!showAttendees)}
                        className="w-full flex items-center justify-between p-6 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white shadow-sm text-slate-600 rounded-2xl flex items-center justify-center"><FaUsers className="text-xl" /></div>
                          <div className="text-right">
                            <h4 className="font-black text-slate-800 text-lg">سجل الحضور</h4>
                            <p className="text-sm font-bold text-slate-500 mt-1">
                              {attendees.length} حاضر
                              {attendees.filter(a => a.is_honored).length > 0 && (
                                <span className="text-amber-500 mr-2 border-r border-slate-300 pr-2 inline-flex items-center gap-1">
                                  <FaCrown className="text-[10px]" /> {attendees.filter(a => a.is_honored).length} قدوة النشاط
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300 ${showAttendees ? 'rotate-180 bg-slate-200' : ''}`}>
                          <FaChevronDown className="text-slate-500 text-sm" />
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {showAttendees && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-slate-200"
                          >
                            <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
                              {attendees.map((a) => {
                                const childRec = a.parent_id ? childrenMap[`${a.parent_id}-${a.child_name}`] : null;
                                const lvl = getLevelDef(childRec?.level);
                                const hasLevel = childRec && childRec.level && childRec.level !== 'new';

                                return (
                                  <div
                                    key={a.id}
                                    className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => {
                                      if (childRec) {
                                        setSelectedChildProfile({ record: childRec, parentId: a.parent_id });
                                      }
                                    }}
                                  >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${a.is_honored ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
                                      {a.is_honored ? <FaCrown className="text-lg" /> : <FaChild />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-base text-slate-800 group-hover:text-primary transition-colors truncate">
                                          {a.child_name}
                                        </span>
                                        {hasLevel && (
                                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 flex items-center gap-1 ${lvl.bg} ${lvl.text} ${lvl.border} border`}>
                                            {lvl.emoji} {lvl.label}
                                          </span>
                                        )}
                                      </div>
                                      {a.child_age && <div className="text-xs font-bold text-slate-400 mt-1">{a.child_age} سنوات</div>}
                                    </div>
                                    {childRec && <FaArrowLeft className="text-slate-300 group-hover:text-primary transition-colors text-sm opacity-0 group-hover:opacity-100 shrink-0" />}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <button 
                      onClick={() => setSelectedActivity(null)} 
                      className="w-full py-4 rounded-[2rem] bg-slate-100 text-slate-600 font-bold text-lg hover:bg-slate-200 transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHILD PROFILE MODAL */}
      {selectedChildProfile && (
        <ChildProfileModal
          child={selectedChildProfile.record}
          parentId={selectedChildProfile.parentId}
          isAdmin={isCurrentUserAdmin}
          isOwner={currentUser?.id === selectedChildProfile.parentId}
          onClose={() => setSelectedChildProfile(null)}
          onUpdate={() => setSelectedChildProfile(null)}
        />
      )}
    </main>
  );
}