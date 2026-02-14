'use client'
import { createClient } from '../utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaInfoCircle, FaTimes, FaArrowLeft, FaUsers, FaChevronDown, FaCrown } from 'react-icons/fa';
import { useProfile } from '../context/ProfileContext';
import { getLevelDef } from '../utils/constants';
import ChildProfileModal from '../components/ChildProfileModal';
import { motion, AnimatePresence } from 'framer-motion';
import { updateActivityStatuses } from '../utils/activityHelpers';

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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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
  }, []);

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
}, [selectedActivity]);
  
  useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape') setSelectedActivity(null);
  };
  if (selectedActivity) document.addEventListener('keydown', handleEsc);
  return () => document.removeEventListener('keydown', handleEsc);
}, [selectedActivity]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-ring loading-lg text-primary"></span></div>;

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-10">
      
      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-4" style={{ fontFamily: 'var(--font-slogan)' }}>
          سجل النشاطات
        </h1>
        <p className="text-base-content/60 text-lg">أرشيف كامل لكل ما قدمته قدوة للمجتمع</p>
      </div>

      {/* GRID LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.length === 0 ? (
            <div className="col-span-full text-center py-20 text-base-content/50">لا يوجد نشاطات سابقة حتى الآن.</div>
        ) : (
            activities.map((act, index) => (
                <motion.div 
                    key={act.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-base-100 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-base-200 cursor-pointer"
                    onClick={() => setSelectedActivity(act)}
                >
                    {/* Card Image */}
                    <div className="h-48 w-full overflow-hidden relative">
                        {act.image_url ? (
                            <img 
                              src={act.image_url} 
                              alt={act.title}
                              loading="lazy"
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                            />
                        ) : (
                            <div className="w-full h-full bg-base-200 flex items-center justify-center text-base-content/30 font-bold">بلا صورة</div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-base-content mb-2 line-clamp-1">{act.title}</h3>
                        <p className="text-sm text-base-content/60 line-clamp-2 mb-4 min-h-[2.5rem]">
                            {act.short_description}
                        </p>
                        <div className="flex justify-between items-center border-t border-base-200 pt-4">
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

      {/* MODAL */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div 
  className="fixed inset-0 z-[100] flex items-center justify-center px-4"
  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  role="dialog"
  aria-modal="true"
  aria-labelledby="activity-modal-title"
>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedActivity(null)}></div>
            
            <motion.div 
              className="bg-base-100 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            >
              <button onClick={() => setSelectedActivity(null)} className="absolute top-4 left-4 btn btn-circle btn-sm btn-ghost bg-black/10 z-20 hover:bg-red-500 hover:text-white transition-colors">
                <FaTimes />
              </button>

              {selectedActivity.image_url && (
                <div className="w-full h-48 md:h-64 relative">
                  <img 
                    src={selectedActivity.image_url} 
                    alt={selectedActivity.title}
                    loading="lazy"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-6 right-6 text-3xl font-bold text-white drop-shadow-md">{selectedActivity.title}</h3>
                </div>
              )}

              <div className="p-8 text-right space-y-6">
                {!selectedActivity.image_url && <h3 className="text-3xl font-bold text-primary">{selectedActivity.title}</h3>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200 p-4 rounded-2xl border border-base-300">
                    {selectedActivity.activity_date && (
                        <div className="flex items-center gap-3 text-base-content/80">
                            <div className="p-2 bg-primary/10 text-primary rounded-full"><FaCalendarAlt /></div>
                            <span className="font-bold">{selectedActivity.activity_date}</span>
                        </div>
                    )}
                    {selectedActivity.start_time && (
                        <div className="flex items-center gap-3 text-base-content/80">
                            <div className="p-2 bg-warning/10 text-warning rounded-full"><FaClock /></div>
                            <span className="font-bold">
                              {selectedActivity.start_time.slice(0,5)} 
                              {selectedActivity.end_time ? ` - ${selectedActivity.end_time.slice(0,5)}` : ''}
                            </span>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="font-bold text-lg text-primary mb-2 border-b border-base-200 pb-2">التفاصيل الكاملة</h4>
                    <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{selectedActivity.full_report}</p>
                </div>

                {selectedActivity.notable_notes && (
                    <div className="bg-warning/10 border border-warning/20 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-warning font-bold mb-2">
                            <FaInfoCircle /> ملاحظات هامة
                        </div>
                        <p className="text-base-content/70 text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{selectedActivity.notable_notes}</p>
                    </div>
                )}

                {/* ATTENDEES SECTION */}
{!attendeesLoading && attendees.length > 0 && (
  <div className="border border-base-200 rounded-2xl overflow-hidden">
    <button
      onClick={() => setShowAttendees(!showAttendees)}
      className="w-full flex items-center justify-between p-4 hover:bg-base-200/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
          <FaUsers />
        </div>
        <div className="text-right">
          <h4 className="font-bold text-base-content">سجل الحضور</h4>
          <p className="text-xs text-base-content/50">
            {attendees.length} حاضر
            {attendees.filter(a => a.is_honored).length > 0 && (
              <span className="text-warning mr-2">
                • {attendees.filter(a => a.is_honored).length} قدوة النشاط ⭐
              </span>
            )}
          </p>
        </div>
      </div>
      <FaChevronDown className={`text-base-content/40 transition-transform duration-300 ${showAttendees ? 'rotate-180' : ''}`} />
    </button>
    
    <AnimatePresence>
      {showAttendees && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden border-t border-base-200"
        >
          <div className="p-4 space-y-1.5 max-h-64 overflow-y-auto">
            {attendees.map((a) => {
  const childRec = a.parent_id ? childrenMap[`${a.parent_id}-${a.child_name}`] : null;
  const lvl = getLevelDef(childRec?.level);
  const hasLevel = childRec && childRec.level && childRec.level !== 'new';

  return (
    <div
      key={a.id}
      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:ring-1 hover:ring-primary/20 transition-all ${
        a.is_honored ? 'bg-warning/10' : 'bg-base-200/30'
      }`}
      onClick={() => {
        if (childRec) {
          setSelectedChildProfile({ record: childRec, parentId: a.parent_id });
        }
      }}
      title={childRec ? 'عرض بطاقة الطفل' : ''}
    >
      {a.is_honored ? (
        <FaCrown className="text-warning shrink-0 text-sm" />
      ) : (
        <div className="w-1.5 h-1.5 bg-base-content/20 rounded-full shrink-0"></div>
      )}
      <span className={`font-medium text-sm flex-1 ${
        a.is_honored ? 'text-warning' : 'text-base-content/80'
      } ${childRec ? 'hover:underline decoration-dotted underline-offset-4' : ''}`}>
        {a.child_name}
      </span>
      {hasLevel && (
        <span className={`badge badge-xs shrink-0 gap-0.5 ${lvl.bg} ${lvl.text} ${lvl.border} border`}>
          {lvl.emoji} {lvl.label}
        </span>
      )}
      {a.child_age && (
        <span className="text-xs text-base-content/40">{a.child_age} سنة</span>
      )}
      {a.is_honored && (
        <span className="badge badge-warning badge-xs gap-0.5 shrink-0">
          <FaCrown className="text-[7px]" /> قدوة النشاط
        </span>
      )}
    </div>
  );
})}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)}

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