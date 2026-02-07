'use client'
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand, FaDownload } from 'react-icons/fa';

export default function PhotoLightbox({ 
  photos, 
  initialIndex = 0, 
  isOpen, 
  onClose,
  activityTitle 
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [isOpen, currentIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setIsZoomed(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setIsZoomed(false);
  };

  const handleDownload = async () => {
    const photo = photos[currentIndex];
    try {
      const response = await fetch(photo.image_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qudwa-photo-${currentIndex + 1}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/95 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-white">
              <h3 className="font-bold text-lg">{activityTitle}</h3>
              <p className="text-white/60 text-sm">
                {currentIndex + 1} / {photos.length}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                title="تحميل الصورة"
              >
                <FaDownload />
              </button>
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${
                  isZoomed ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'
                }`}
                title="تكبير"
              >
                <FaExpand />
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center text-white transition-all"
                title="إغلاق"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <motion.div 
          className={`relative z-10 w-full h-full flex items-center justify-center p-4 pt-20 pb-24 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <motion.img
            key={currentIndex}
            src={currentPhoto.image_url}
            alt={currentPhoto.caption || `صورة ${currentIndex + 1}`}
            className={`max-h-full rounded-lg shadow-2xl transition-transform duration-300 ${
              isZoomed ? 'max-w-none scale-150' : 'max-w-full object-contain'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
          />
        </motion.div>

        {/* Caption */}
        {currentPhoto.caption && (
          <div className="absolute bottom-20 left-0 right-0 z-10 text-center">
            <p className="text-white/80 text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
              {currentPhoto.caption}
            </p>
          </div>
        )}

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all group"
            >
              <FaChevronRight className="text-xl group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all group"
            >
              <FaChevronLeft className="text-xl group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-hide">
              {photos.map((photo, index) => (
                <button
                  key={photo.id || index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                    setIsZoomed(false);
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-primary scale-110 shadow-lg shadow-primary/30' 
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.image_url}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}