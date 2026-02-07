'use client'
import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaCheck, 
  FaUndo, 
  FaRedo, 
  FaArrowsAltH,
  FaArrowsAltV,
  FaPlus,
  FaMinus,
  FaMagic,
  FaUser
} from 'react-icons/fa';
import { getCroppedImg, compressImage, blobToFile } from '../utils/imageUtils';
import toast from 'react-hot-toast';

export default function ImageEditorModal({ 
  imageFile, 
  onSave, 
  onClose 
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
      });
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    const generatePreview = async () => {
      if (imageSrc && croppedAreaPixels) {
        try {
          const blob = await getCroppedImg(
            imageSrc,
            croppedAreaPixels,
            rotation,
            flipHorizontal,
            flipVertical
          );
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
          }
        } catch (e) {
          // Silent fail for preview
        }
      }
    };
    
    const debounce = setTimeout(generatePreview, 150);
    return () => clearTimeout(debounce);
  }, [imageSrc, croppedAreaPixels, rotation, flipHorizontal, flipVertical]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const rotateLeft = () => setRotation((prev) => prev - 90);
  const rotateRight = () => setRotation((prev) => prev + 90);
  const toggleFlipHorizontal = () => setFlipHorizontal((prev) => !prev);
  const toggleFlipVertical = () => setFlipVertical((prev) => !prev);
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 1));

  const resetAll = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    setProcessing(true);
    const toastId = toast.loading('جاري تجهيز صورتك الشخصية...');

    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        flipHorizontal,
        flipVertical
      );

      if (!croppedBlob) {
        throw new Error('Failed to crop image');
      }

      const croppedFile = blobToFile(croppedBlob, 'profile.jpg');
      const compressedFile = await compressImage(croppedFile, 2);

      toast.success('تم تجهيز الصورة بنجاح!', { id: toastId });
      onSave(compressedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('حدث خطأ في معالجة الصورة', { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  if (!imageFile) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="absolute inset-0 bg-black/90" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          className="relative w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-lg sm:mx-4 bg-gradient-to-b from-gray-900 to-black sm:rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          
          <div className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200"
            >
              <FaTimes className="text-lg" />
            </button>
            
            <h3 className="text-lg font-bold text-white">تعديل الصورة</h3>
            
            <button
              onClick={resetAll}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200"
              title="إعادة تعيين"
            >
              <FaMagic className="text-lg" />
            </button>
          </div>

          <div className="relative flex-1 min-h-[300px] sm:min-h-[350px]">
            {imageSrc ? (
              <>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  style={{
                    containerStyle: {
                      backgroundColor: '#000',
                    },
                    mediaStyle: {
                      transform: `scale(${flipHorizontal ? -1 : 1}, ${flipVertical ? -1 : 1})`,
                    },
                  }}
                />
                
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-white/20 border-dashed" />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-white/50 mt-4">جاري تحميل الصورة...</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-4 sm:px-6 bg-black/50 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-primary/50 bg-gray-800 shadow-lg shadow-primary/20">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className="text-2xl text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <FaCheck className="text-xs text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">المعاينة المباشرة</p>
                <p className="text-white/50 text-xs">هذا ما ستبدو عليه صورتك</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6 sm:py-5 space-y-5 bg-gradient-to-t from-gray-900 to-transparent">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">التكبير</span>
                <span className="text-primary text-sm font-mono">{zoom.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= 1}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
                >
                  <FaMinus />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/50 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                  />
                  <div 
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary to-secondary rounded-full pointer-events-none"
                    style={{ width: `${((zoom - 1) / 2) * 100}%` }}
                  />
                </div>
                <button
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">التدوير</span>
                <span className="text-secondary text-sm font-mono">{rotation}°</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={rotateLeft}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                >
                  <FaUndo />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-secondary/50 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                <button
                  onClick={rotateRight}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                >
                  <FaRedo />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={rotateLeft}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all group"
              >
                <FaUndo className="text-lg group-hover:text-primary transition-colors" />
                <span className="text-xs text-white/60">90° يسار</span>
              </button>
              <button
                onClick={rotateRight}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all group"
              >
                <FaRedo className="text-lg group-hover:text-primary transition-colors" />
                <span className="text-xs text-white/60">90° يمين</span>
              </button>
              <button
                onClick={toggleFlipHorizontal}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                  flipHorizontal 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                <FaArrowsAltH className="text-lg" />
                <span className="text-xs opacity-60">قلب أفقي</span>
              </button>
              <button
                onClick={toggleFlipVertical}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                  flipVertical 
                    ? 'bg-secondary/20 text-secondary' 
                    : 'bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                <FaArrowsAltV className="text-lg" />
                <span className="text-xs opacity-60">قلب عمودي</span>
              </button>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6 sm:py-5 bg-black border-t border-white/10">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={processing}
                className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={processing || !imageSrc}
                className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
              >
                {processing ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    حفظ الصورة
                  </>
                )}
              </button>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}