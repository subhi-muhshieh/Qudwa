'use client'
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaImages, FaCalendarAlt, FaExpand, FaArrowLeft } from 'react-icons/fa';
import PhotoLightbox from '../components/PhotoLightbox';

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

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
  }, [router]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
            <FaImages className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 font-slogan">
            معرض الصور
          </h1>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            لحظات مميزة من أنشطتنا وفعالياتنا
          </p>
        </motion.div>

        {/* Activity Filter Tabs */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedActivity(null)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                selectedActivity === null
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                  : 'bg-base-100 text-base-content hover:bg-primary/10'
              }`}
            >
              <span className="flex items-center gap-2">
                <FaImages />
                جميع الصور
                <span className="badge badge-sm">{allPhotos.length}</span>
              </span>
            </button>
            
            {activities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity.id)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  selectedActivity === activity.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                    : 'bg-base-100 text-base-content hover:bg-primary/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  {activity.title}
                  <span className="badge badge-sm">{activity.activity_photos.length}</span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Current Section Title */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
          <h2 className="text-2xl font-bold text-base-content">{getActivityTitle()}</h2>
          <span className="text-base-content/50">({getPhotosToDisplay().length} صورة)</span>
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
                className="group relative aspect-square rounded-2xl overflow-hidden bg-base-300 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => openLightbox(getPhotosToDisplay(), index, getActivityTitle())}
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || `صورة ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    {photo.caption && (
                      <p className="text-white text-sm font-medium truncate mb-1">
                        {photo.caption}
                      </p>
                    )}
                    {selectedActivity === null && photo.activityTitle && (
                      <p className="text-white/70 text-xs truncate">
                        {photo.activityTitle}
                      </p>
                    )}
                  </div>
                  
                  <div className="absolute top-3 left-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FaExpand className="text-white text-sm" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaImages className="text-4xl text-base-content/30" />
            </div>
            <h3 className="text-xl font-bold text-base-content/50 mb-2">لا توجد صور بعد</h3>
            <p className="text-base-content/40">سيتم إضافة الصور قريباً</p>
          </motion.div>
        )}

        {/* Activity Cards View */}
        {selectedActivity === null && activities.length > 0 && (
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-2 h-8 bg-gradient-to-b from-secondary to-accent rounded-full"></div>
              <h2 className="text-2xl font-bold text-base-content">تصفح حسب النشاط</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group bg-base-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedActivity(activity.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={activity.activity_photos[0]?.image_url || activity.image_url || '/placeholder.jpg'}
                      alt={activity.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <span className="text-white text-sm font-bold flex items-center gap-2">
                        <FaImages />
                        {activity.activity_photos.length} صورة
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4 flex -space-x-2 space-x-reverse">
                      {activity.activity_photos.slice(0, 4).map((photo, i) => (
                        <div
                          key={photo.id}
                          className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-md"
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
                        <div className="w-10 h-10 rounded-lg bg-black/50 border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            +{activity.activity_photos.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                      {activity.title}
                    </h3>
                    {activity.activity_date && (
                      <p className="text-base-content/50 text-sm flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        {activity.activity_date}
                      </p>
                    )}
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-primary text-sm font-medium group-hover:gap-3 flex items-center gap-2 transition-all">
                        عرض الصور
                        <FaArrowLeft />
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
    </div>
  );
}