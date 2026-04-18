'use client'
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useModalA11y from '../hooks/useModalA11y';
import { X, ChevronLeft, ChevronRight, Expand, Download } from 'lucide-react';
import Image from 'next/image';

export default function PhotoLightbox({ 
  photos, 
  initialIndex = 0, 
  isOpen, 
  onClose,
  activityTitle 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0, distance: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

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
        setCurrentIndex((prev) => (prev + 1) % photos.length);
        setIsZoomed(false);
        break;
      case 'ArrowRight':
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
        setIsZoomed(false);
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [isOpen, photos.length, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Preload next and previous images for instant swiping
  useEffect(() => {
    if (!isOpen || !photos || photos.length === 0) return;

    const preloadImage = (index) => {
      if (photos[index]?.image_url) {
        const img = new window.Image();
        img.src = photos[index].image_url;
      }
    };

    // Preload next image
    const nextIndex = (currentIndex + 1) % photos.length;
    preloadImage(nextIndex);

    // Preload previous image
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    preloadImage(prevIndex);

  }, [currentIndex, isOpen, photos]);
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

  // Touch gesture handling for pinch-zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = { ...touchStartRef.current, distance };
    } else if (e.touches.length === 1) {
      // Record starting X for swipe detection, or pan if zoomed
      touchStartRef.current = {
        ...touchStartRef.current,
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
        startX: e.touches[0].clientX, // NEW: Track initial touch point
      };
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance - touchStartRef.current.distance;
      const newScale = Math.min(Math.max(1, scale + delta * 0.01), 4);
      setScale(newScale);
      touchStartRef.current.distance = distance;
    } else if (e.touches.length === 1 && scale > 1 && isDragging) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - touchStartRef.current.x,
        y: e.touches[0].clientY - touchStartRef.current.y,
      });
    }
  };

  const handleTouchEnd = (e) => {
    setIsDragging(false);
    
    // NEW: Handle swipe to navigate if not zoomed
    if (scale === 1 && touchStartRef.current.startX) {
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - touchStartRef.current.startX;
      
      // If swiped left/right by more than 50px
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
           // Swiped Right -> Previous Photo (assuming RTL layout)
           setCurrentIndex((prev) => (prev + 1) % photos.length);
        } else {
           // Swiped Left -> Next Photo
           setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
        }
      }
    }

    if (scale < 1.2) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
    touchStartRef.current.startX = null; // Reset
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(1, scale + delta), 4);
      setScale(newScale);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2);
      setIsZoomed(true);
    }
  };

  const containerRef = useModalA11y({ open: isOpen, onClose });

  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={activityTitle || 'معرض الصور'}
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
<div className="absolute top-0 left-0 right-0 z-50 p-4 pt-[max(1rem,env(safe-area-inset-top))] bg-gradient-to-b from-black/80 to-transparent">
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
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={toggleZoom}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${
                  scale > 1 ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'
                }`}
                title="تكبير"
              >
                <Expand className="w-5 h-5" />
              </button>
              <button
  onClick={(e) => {
    e.stopPropagation();
    onClose();
  }}
  className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center text-white transition-all"
  title="إغلاق"
>
  <X className="w-5 h-5" />
</button>
            </div>
          </div>
        </div>

        {/* Main Image Container */}
<motion.div
  ref={imageRef}
  className={`relative z-10 w-full h-full flex items-center justify-center p-4 pt-[max(5rem,env(safe-area-inset-top))] pb-[max(6rem,env(safe-area-inset-bottom))] overflow-hidden ${
    scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
  }`}
  onClick={toggleZoom}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  onWheel={handleWheel}
>
  {/* The Loading Spinner */}
  {isLoading && (
    <div className="absolute inset-0 flex items-center justify-center z-0">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )}

  <motion.img
    key={currentIndex}
    src={currentPhoto.image_url}
    alt={currentPhoto.caption || `صورة ${currentIndex + 1}`}
    className={`max-h-full rounded-lg shadow-2xl transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
    style={{
      transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      maxWidth: scale > 1 ? 'none' : '100%',
    }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    onLoad={() => setIsLoading(false)} // Hides the spinner when ready
    onClick={(e) => {
      e.stopPropagation();
      toggleZoom();
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
                setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
                resetZoom();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all group"
            >
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % photos.length);
                resetZoom();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
         <div className="absolute bottom-0 left-0 right-0 z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black/80 to-transparent">
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
                  <Image
                    src={photo.image_url}
                    alt={`صورة ${index + 1}`}
                    width={64}
                    height={64}
                    sizes="64px"
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