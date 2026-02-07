'use client'
import { useState, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { FaImages, FaPlus, FaTrash, FaSpinner, FaGripVertical, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActivityPhotoManager({ activityId, activityTitle, onClose }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const supabase = createClient();

  // Fetch photos on mount
  useState(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('activity_photos')
        .select('*')
        .eq('activity_id', activityId)
        .order('display_order', { ascending: true });
      
      if (data) setPhotos(data);
      setLoading(false);
    };
    fetchPhotos();
  }, [activityId]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const toastId = toast.loading(`جاري رفع ${files.length} صورة...`);

    try {
      const uploadedPhotos = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} ليس ملف صورة`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} أكبر من 10 ميغابايت`);
          continue;
        }

        // Upload to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${activityId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('activity-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('activity-images')
          .getPublicUrl(fileName);

        // Insert into database
        const { data: photoData, error: insertError } = await supabase
          .from('activity_photos')
          .insert({
            activity_id: activityId,
            image_url: urlData.publicUrl,
            display_order: photos.length + i
          })
          .select()
          .single();

        if (!insertError && photoData) {
          uploadedPhotos.push(photoData);
        }
      }

      setPhotos([...photos, ...uploadedPhotos]);
      toast.success(`تم رفع ${uploadedPhotos.length} صورة بنجاح`, { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('حدث خطأ أثناء الرفع', { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = async (photoId, imageUrl) => {
    const toastId = toast.loading('جاري حذف الصورة...');

    try {
      // Delete from storage
      if (imageUrl.includes('activity-images')) {
        const path = imageUrl.split('/activity-images/')[1];
        if (path) {
          await supabase.storage.from('activity-images').remove([path]);
        }
      }

      // Delete from database
      await supabase
        .from('activity_photos')
        .delete()
        .eq('id', photoId);

      setPhotos(photos.filter(p => p.id !== photoId));
      toast.success('تم حذف الصورة', { id: toastId });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('حدث خطأ أثناء الحذف', { id: toastId });
    }
  };

  const updateCaption = async (photoId, caption) => {
    await supabase
      .from('activity_photos')
      .update({ caption })
      .eq('id', photoId);
    
    setPhotos(photos.map(p => 
      p.id === photoId ? { ...p, caption } : p
    ));
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <motion.div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-base-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
              <FaImages />
              إدارة صور النشاط
            </h2>
            <p className="text-neutral/60 mt-1">{activityTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-circle btn-ghost"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <>
              {/* Upload Button */}
              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn btn-primary btn-lg w-full rounded-2xl gap-3"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      إضافة صور جديدة
                    </>
                  )}
                </button>
                <p className="text-center text-neutral/50 text-sm mt-2">
                  يمكنك اختيار عدة صور دفعة واحدة (الحد الأقصى 10 ميغابايت لكل صورة)
                </p>
              </div>

              {/* Photos Grid */}
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {photos.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group relative bg-base-200 rounded-2xl overflow-hidden aspect-square"
                      >
                        <img
                          src={photo.image_url}
                          alt={photo.caption || `صورة ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeletePhoto(photo.id, photo.image_url)}
                            className="btn btn-error btn-sm rounded-xl gap-2"
                          >
                            <FaTrash />
                            حذف
                          </button>
                        </div>

                        {/* Order Badge */}
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                          {index + 1}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12 bg-base-100 rounded-2xl border-2 border-dashed border-base-300">
                  <FaImages className="text-5xl text-base-300 mx-auto mb-4" />
                  <p className="text-neutral/50">لا توجد صور لهذا النشاط</p>
                  <p className="text-neutral/40 text-sm">اضغط على "إضافة صور جديدة" للبدء</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-base-200 bg-base-100">
          <div className="flex items-center justify-between">
            <span className="text-neutral/60">
              {photos.length} صورة
            </span>
            <button onClick={onClose} className="btn btn-primary rounded-xl">
              تم
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}