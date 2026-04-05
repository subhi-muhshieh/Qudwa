'use client'
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';
import { FaImages, FaPlus, FaTrash, FaSpinner, FaTimes, FaCompress, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImageForGallery } from '../utils/imageUtils';

function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);

  return debouncedCallback;
}

export default function ActivityPhotoManager({ activityId, activityTitle, onClose }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, compressing: false });
  const [savingCaptions, setSavingCaptions] = useState({});
  const fileInputRef = useRef(null);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('activity_photos')
        .select('*')
        .eq('activity_id', activityId)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching photos:', error);
        toast.error('خطأ في تحميل الصور');
      }
      
      if (data) {
        setPhotos(data);
      }
      setLoading(false);
    };
    
    fetchPhotos();
  }, [activityId]);

  const handleFileSelect = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  setUploading(true);
  setUploadProgress({ current: 0, total: files.length, compressing: true });
  const toastId = toast.loading(`جاري تجهيز ${files.length} صورة...`);

  try {
    // Step 1 — compress all files first
    const compressedFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ current: i + 1, total: files.length, compressing: true });

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} ليس ملف صورة`);
        continue;
      }

      const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
      if (isHeic) {
        toast.error(`${file.name}: صور HEIC غير مدعومة`);
        continue;
      }

      try {
        const compressed = await compressImageForGallery(file, 2); // 2MB target
        compressedFiles.push(compressed);
      } catch (err) {
        console.error('Compression error:', err);
        toast.error(`فشل ضغط ${file.name}`);
      }
    }

    if (compressedFiles.length === 0) {
      toast.error('فشل تجهيز جميع الصور', { id: toastId });
      return;
    }

    // Step 2 — upload all in parallel
    toast.loading(`جاري رفع ${compressedFiles.length} صورة...`, { id: toastId });
    setUploadProgress({ current: 0, total: compressedFiles.length, compressing: false });

    const results = await Promise.allSettled(
      compressedFiles.map(async (file, i) => {
        const fileExt = 'jpg';
        const fileName = `${activityId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('activity-images')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('activity-images').getPublicUrl(fileName);

        const { data: photoData, error: insertError } = await supabase
          .from('activity_photos')
          .insert({
            activity_id: activityId,
            image_url: urlData.publicUrl,
            display_order: photos.length + i,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
        return photoData;
      })
    );

    const uploaded = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    const errorCount = results.filter(r => r.status === 'rejected').length;

    if (uploaded.length > 0) {
      setPhotos(prev => [...prev, ...uploaded]);
      toast.success(`تم رفع ${uploaded.length} صورة بنجاح! 🎉`, { id: toastId });
    } else {
      toast.error('فشل رفع جميع الصور', { id: toastId });
    }

    if (errorCount > 0 && uploaded.length > 0) {
      toast.error(`فشل رفع ${errorCount} صورة`);
    }

  } catch (error) {
    console.error('Upload error:', error);
    toast.error('حدث خطأ أثناء الرفع', { id: toastId });
  } finally {
    setUploading(false);
    setUploadProgress({ current: 0, total: 0, compressing: false });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
};

  const handleDeletePhoto = async (photoId, imageUrl) => {
    const toastId = toast.loading('جاري حذف الصورة...');

    try {
      if (imageUrl && imageUrl.includes('activity-images')) {
        const path = imageUrl.split('/activity-images/')[1];
        if (path) {
          await supabase.storage.from('activity-images').remove([path]);
        }
      }

      const { error: deleteDbError } = await supabase
        .from('activity_photos')
        .delete()
        .eq('id', photoId);

      if (deleteDbError) {
        console.error('Database delete error:', deleteDbError);
        toast.error('فشل حذف الصورة', { id: toastId });
        return;
      }

      setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
      toast.success('تم حذف الصورة', { id: toastId });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('حدث خطأ أثناء الحذف', { id: toastId });
    }
  };

  const saveCaptionToDatabase = useCallback(async (photoId, caption) => {
    setSavingCaptions(prev => ({ ...prev, [photoId]: 'saving' }));
    
    const { error } = await supabase
      .from('activity_photos')
      .update({ caption })
      .eq('id', photoId);
    
    if (error) {
      console.error('Caption update error:', error);
      setSavingCaptions(prev => ({ ...prev, [photoId]: 'error' }));
      toast.error('فشل حفظ الوصف');
    } else {
      setSavingCaptions(prev => ({ ...prev, [photoId]: 'saved' }));
      setTimeout(() => {
        setSavingCaptions(prev => ({ ...prev, [photoId]: null }));
      }, 2000);
    }
  }, [supabase]);

  const debouncedSave = useDebounce(saveCaptionToDatabase, 1000);

  const handleCaptionChange = (photoId, caption) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(p => 
        p.id === photoId ? { ...p, caption } : p
      )
    );
    
    setSavingCaptions(prev => ({ ...prev, [photoId]: 'typing' }));
    debouncedSave(photoId, caption);
  };

  const handleCaptionBlur = (photoId, caption) => {
    saveCaptionToDatabase(photoId, caption);
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
        className="bg-base-100 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-base-200 flex items-center justify-between bg-gradient-to-l from-primary/5 to-transparent">
          <div>
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
              <FaImages />
              إدارة صور النشاط
            </h2>
            <p className="text-base-content/60 mt-1">{activityTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-circle btn-ghost hover:bg-error/10 hover:text-error transition-colors"
          >
            <FaTimes className="text-lg" />
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
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn btn-primary btn-lg w-full rounded-2xl gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {uploadProgress.compressing ? (
                        <>جاري ضغط الصورة {uploadProgress.current} من {uploadProgress.total}...</>
                      ) : (
                        <>جاري رفع الصورة {uploadProgress.current} من {uploadProgress.total}...</>
                      )}
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      إضافة صور جديدة
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-2 mt-3 text-base-content/50 text-sm">
                  <FaCompress className="text-primary" />
                  <span>يمكنك رفع صور بأي حجم - سيتم ضغطها تلقائياً</span>
                </div>
                
                {uploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-base-content/60 mb-2">
                      <span>
                        {uploadProgress.compressing ? 'جاري الضغط...' : 'جاري الرفع...'}
                      </span>
                      <span>{uploadProgress.current} / {uploadProgress.total}</span>
                    </div>
                    <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
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
                        layout
                        className="group relative bg-base-200 rounded-2xl overflow-hidden aspect-square shadow-md hover:shadow-xl transition-shadow"
                      >
                        <img
                          src={photo.image_url}
                          alt={photo.caption || `صورة ${index + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-bold z-10">
                          {index + 1}
                        </div>

                        {photo.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 group-hover:opacity-0 transition-opacity">
                            <p className="text-white text-xs truncate">{photo.caption}</p>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col p-3">
                          
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeletePhoto(photo.id, photo.image_url)}
                              className="btn btn-error btn-sm btn-circle"
                              title="حذف الصورة"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <div className="flex-1"></div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-white/70 text-xs">وصف الصورة (اختياري)</label>
                              
                              {savingCaptions[photo.id] === 'saving' && (
                                <span className="text-yellow-400 text-xs flex items-center gap-1">
                                  <FaSpinner className="animate-spin text-[10px]" />
                                  جاري الحفظ...
                                </span>
                              )}
                              {savingCaptions[photo.id] === 'saved' && (
                                <span className="text-green-400 text-xs flex items-center gap-1">
                                  <FaCheck className="text-[10px]" />
                                  تم الحفظ
                                </span>
                              )}
                              {savingCaptions[photo.id] === 'typing' && (
                                <span className="text-white/50 text-xs">
                                  ...
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="أضف وصفاً للصورة..."
                              value={photo.caption || ''}
                              onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                              onBlur={(e) => handleCaptionBlur(photo.id, e.target.value)}
                              className="input input-sm w-full rounded-xl bg-base-100 text-base-content placeholder:text-base-content/50"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-16 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
                  <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaImages className="text-4xl text-base-content/30" />
                  </div>
                  <p className="text-base-content/50 text-lg font-medium">لا توجد صور لهذا النشاط</p>
                  <p className="text-base-content/40 text-sm mt-1">اضغط على "إضافة صور جديدة" للبدء</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-base-200 bg-base-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base-content/60 font-medium">
                {photos.length} صورة
              </span>
              {photos.length > 0 && (
                <span className="badge badge-primary badge-sm">محفوظة</span>
              )}
            </div>
            <button onClick={onClose} className="btn btn-primary rounded-xl px-8">
              تم
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}