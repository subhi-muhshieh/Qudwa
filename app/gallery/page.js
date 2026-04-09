'use client'
import { useState, useEffect, memo } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaImages, FaCalendarAlt, FaExpand, FaArrowLeft } from 'react-icons/fa';
import PhotoLightbox from '../components/PhotoLightbox';

/* ========================================== */
/* SKELETON UI                               */
/* ========================================== */
const GallerySkeleton = memo(function GallerySkeleton() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-4 md:px-8 lg:px-12 bg-[#FAFCFF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col items-center justify-center mb-16 space-y-4">
          <div className="w-20 h-20 bg-slate-200 rounded-[2rem]" />
          <div className="h-10 w-64 bg-slate-200 rounded-2xl" />
          <div className="h-5 w-80 bg-slate-200 rounded-full" />
        </div>

        {/* Filter Tabs skeleton */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 w-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-slate-200 rounded-[1.5rem]" />
          ))}
        </div>
      </div>
    </main>
  );
});

export default function GalleryPage() {
  const [activities, setActivities] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState('');

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchGalleryData = async () => {
      // Gallery is publicly accessible — no auth redirect needed

      const { data: activitiesData } = await supabase
        .from('activities')
        .select(`
          id,
          title,
          activity_date,
          image_url,
          activity_photos (
            id,
            image_url,
            caption,
            display_order,
            created_at
          )
        `)
        .eq('is_upcoming', false)
        .order('activity_date', { ascending: false });

      if (activitiesData) {
        const activitiesWithPhotos = activitiesData.filter(
          activity => activity.activity_photos && activity.activity_photos.length > 0
        );
        setActivities(activitiesWithPhotos);

        const photos = activitiesWithPhotos.flatMap(activity => 
          activity.activity_photos.map(photo => ({
            ...photo,
            activityTitle: activity.title,
            activityId: activity.id
          }))
        );
        setAllPhotos(photos);
      }

      setLoading(false);
    };

    fetchGalleryData();
  }, []);

  const openLightbox = (photos, index, title) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  const getPhotosToDisplay = () => {
    if (selectedActivity === null) {
      return allPhotos;
    }
    const activity = activities.find(a => a.id === selectedActivity);
    return activity?.activity_photos || [];
  };

  const getActivityTitle = () => {
    if (selectedActivity === null) return 'جميع الصور';
    const activity = activities.find(a => a.id === selectedActivity);
    return activity?.title || '';
  };

  if (loading) return <GallerySkeleton />;

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 md:px-8 lg:px-12 bg-[#FAFCFF] relative overflow-hidden" dir="rtl">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3" />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div 
          className="text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/10">
            <FaImages className="text-4xl text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight drop-shadow-sm">
            معرض الصور
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            لحظات مميزة من أنشطتنا وفعالياتنا نوثق بها أجمل ذكريات جمعية قدوة.
          </p>
        </motion.div>

        {/* Activity Filter Tabs */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedActivity(null)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 border ${
                selectedActivity === null
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105 border-transparent'
                  : 'bg-white/60 backdrop-blur-md border-white/60 text-slate-500 hover:text-primary hover:bg-white shadow-sm'
              }`}
            >
              <span className="flex items-center gap-2 text-sm md:text-base">
                <FaImages />
                جميع الصور
                <span className={`px-2 py-0.5 rounded-lg text-xs ${selectedActivity === null ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {allPhotos.length}
                </span>
              </span>
            </button>
            
            {activities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity.id)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 border ${
                  selectedActivity === activity.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105 border-transparent'
                    : 'bg-white/60 backdrop-blur-md border-white/60 text-slate-500 hover:text-primary hover:bg-white shadow-sm'
                }`}
              >
                <span className="flex items-center gap-2 text-sm md:text-base">
                  {activity.title}
                  <span className={`px-2 py-0.5 rounded-lg text-xs ${selectedActivity === activity.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {activity.activity_photos.length}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Current Section Title */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
          <h2 className="text-2xl font-black text-slate-800">{getActivityTitle()}</h2>
          <span className="text-slate-400 font-bold">({getPhotosToDisplay().length} صورة)</span>
        </div>

        {/* Photo Grid */}
        {getPhotosToDisplay().length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {getPhotosToDisplay().map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="group relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 cursor-pointer shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgb(0,0,0,0.08)] transition-all duration-500"
                onClick={() => openLightbox(getPhotosToDisplay(), index, getActivityTitle())}
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || `صورة ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {photo.caption && (
                      <p className="text-white text-sm font-bold truncate mb-1 drop-shadow-md">
                        {photo.caption}
                      </p>
                    )}
                    {selectedActivity === null && photo.activityTitle && (
                      <p className="text-white/80 text-xs font-medium truncate drop-shadow-sm">
                        {photo.activityTitle}
                      </p>
                    )}
                  </div>
                  
                  <div className="absolute top-3 left-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300">
                      <FaExpand className="text-white text-xs" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="max-w-2xl mx-auto text-center bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-white/60"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <FaImages className="text-4xl text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">لا توجد صور بعد</h3>
            <p className="text-slate-500 font-medium">سيتم إضافة الصور وتوثيق الأنشطة قريباً.</p>
          </motion.div>
        )}

        {/* Activity Cards View */}
        {selectedActivity === null && activities.length > 0 && (
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-2 h-8 bg-gradient-to-b from-secondary to-primary rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-800">تصفح حسب النشاط</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group flex flex-col bg-white/70 backdrop-blur-md border border-white/60 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedActivity(activity.id)}
                >
                  <div className="relative h-56 overflow-hidden shrink-0">
                    <img
                      src={activity.activity_photos[0]?.image_url || activity.image_url || '/placeholder.jpg'}
                      alt={activity.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-black px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
                      <FaImages className="text-primary/70" />
                      {activity.activity_photos.length} صور
                    </div>

                    <div className="absolute bottom-4 left-4 flex -space-x-3 space-x-reverse">
                      {activity.activity_photos.slice(0, 4).map((photo, i) => (
                        <div
                          key={photo.id}
                          className="w-10 h-10 rounded-[0.8rem] overflow-hidden border-2 border-white shadow-md"
                          style={{ zIndex: 4 - i }}
                        >
                          <img 
                            src={photo.image_url} 
                            alt="" 
                            loading="lazy"
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ))}
                      {activity.activity_photos.length > 4 && (
                        <div className="w-10 h-10 rounded-[0.8rem] bg-slate-900/80 backdrop-blur-sm border-2 border-white flex items-center justify-center shadow-md">
                          <span className="text-white text-xs font-bold">
                            +{activity.activity_photos.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {activity.title}
                    </h3>
                    {activity.activity_date && (
                      <p className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-4">
                        <FaCalendarAlt className="text-primary/60" />
                        {activity.activity_date}
                      </p>
                    )}
                    
                    <div className="mt-auto border-t border-slate-100 pt-5">
                      <span className="text-slate-400 group-hover:text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        عرض ألبوم الصور
                        <FaArrowLeft className="text-xs" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>

      <PhotoLightbox
        photos={lightboxPhotos}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        activityTitle={lightboxTitle}
      />
    </main>
  );
}