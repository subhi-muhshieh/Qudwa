'use client'
import { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCamera, FaPhone, FaEnvelope, FaInstagram, FaFacebook, FaTelegramPlane, FaWhatsapp, FaUser, FaChild, FaSave, FaEdit, FaPlus, FaTrash, FaTimes, FaCheck, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useProfile } from '../context/ProfileContext';
import ImageEditorModal from '../components/ImageEditorModal';

export default function ProfilePage() {
  const { user, profile: contextProfile, updateProfile } = useProfile();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [originalPhone, setOriginalPhone] = useState('');
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState('');
  const [originalChildren, setOriginalChildren] = useState([]);
  
  const [currentPhone, setCurrentPhone] = useState('');
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');
  const [currentChildren, setCurrentChildren] = useState([]);
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingChildren, setEditingChildren] = useState(false);
  
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [tempImageFile, setTempImageFile] = useState(null);
  
  const fileInputRef = useRef(null);
  const supabase = createClient();
  const router = useRouter();

  const childrenChanged = JSON.stringify(currentChildren) !== JSON.stringify(originalChildren);
  const hasChanges = currentPhone !== originalPhone || pendingAvatarFile !== null || childrenChanged;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (contextProfile) {
      setProfile(contextProfile);
      
      const children = contextProfile.children || [];
      
      setOriginalPhone(contextProfile.parent_phone || '');
      setOriginalAvatarUrl(contextProfile.avatar_url || '');
      setOriginalChildren(children);
      
      setCurrentPhone(contextProfile.parent_phone || '');
      setCurrentAvatarUrl(contextProfile.avatar_url || '');
      setCurrentChildren(children);
      
      setLoading(false);
    }
  }, [user, contextProfile, router]);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = '';

    // Check if HEIC and reject it with helpful message
    const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                   file.name.toLowerCase().endsWith('.heif') ||
                   file.type === 'image/heic' ||
                   file.type === 'image/heif';

    if (isHeic) {
      toast.error(
        'صور HEIC غير مدعومة. الرجاء تحويل الصورة إلى JPG أو PNG من تطبيق الصور',
        { duration: 5000 }
      );
      return;
    }

    // Check if valid image type
    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار صورة صالحة (JPG, PNG, WebP)');
      return;
    }

    setTempImageFile(file);
    setShowImageEditor(true);
  };

  const handleImageEditorSave = (editedFile) => {
    setPendingAvatarFile(editedFile);
    const preview = URL.createObjectURL(editedFile);
    setPreviewUrl(preview);
    setShowImageEditor(false);
    setTempImageFile(null);
    toast.success('تم تعديل الصورة - اضغط حفظ لتأكيد التغييرات');
  };

  const handleImageEditorClose = () => {
    setShowImageEditor(false);
    setTempImageFile(null);
  };

  const handlePhoneChange = (value) => {
    const numbersOnly = value.replace(/[^0-9+]/g, '');
    setCurrentPhone(numbersOnly);
  };

  const addChild = () => {
    setCurrentChildren([...currentChildren, { name: '', age: '' }]);
    setEditingChildren(true);
  };

  const removeChild = (index) => {
    if (currentChildren.length > 1) {
      const newChildren = currentChildren.filter((_, i) => i !== index);
      setCurrentChildren(newChildren);
    } else {
      toast.error('يجب أن يكون لديك طفل واحد على الأقل');
    }
  };

  const updateChild = (index, field, value) => {
    const newChildren = [...currentChildren];
    if (field === 'age') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      newChildren[index][field] = numbersOnly;
    } else {
      newChildren[index][field] = value;
    }
    setCurrentChildren(newChildren);
  };

  const cancelChildrenEdit = () => {
    setCurrentChildren([...originalChildren]);
    setEditingChildren(false);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    const validChildren = currentChildren.filter(child => child.name.trim() && child.age);
    if (validChildren.length === 0) {
      toast.error('الرجاء إدخال بيانات طفل واحد على الأقل');
      return;
    }
    
    setSaving(true);
    const toastId = toast.loading('جاري حفظ التغييرات...');

    try {
      let newAvatarUrl = currentAvatarUrl;

      if (pendingAvatarFile) {
        const fileExt = pendingAvatarFile.name.split('.').pop() || 'jpg';
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, pendingAvatarFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`فشل رفع الصورة: ${uploadError.message}`, { id: toastId });
          setSaving(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        newAvatarUrl = urlData.publicUrl;
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          parent_phone: currentPhone,
          avatar_url: newAvatarUrl,
          parent_name: profile?.parent_name || '',
          children: validChildren,
        });

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        toast.error(`فشل الحفظ: ${upsertError.message}`, { id: toastId });
        setSaving(false);
        return;
      }

      const updatedProfile = { 
        ...profile, 
        parent_phone: currentPhone,
        avatar_url: newAvatarUrl,
        children: validChildren
      };
      
      setProfile(updatedProfile);
      updateProfile(updatedProfile);
      
      setOriginalPhone(currentPhone);
      setOriginalAvatarUrl(newAvatarUrl);
      setCurrentAvatarUrl(newAvatarUrl);
      setOriginalChildren(validChildren);
      setCurrentChildren(validChildren);
      
      setPendingAvatarFile(null);
      setPreviewUrl('');
      setEditingPhone(false);
      setEditingChildren(false);

      toast.success('تم حفظ التغييرات بنجاح!', { id: toastId });
    } catch (error) {
      console.error('Save error:', error);
      toast.error(`حدث خطأ: ${error.message}`, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setCurrentPhone(originalPhone);
    setCurrentChildren([...originalChildren]);
    setPendingAvatarFile(null);
    setPreviewUrl('');
    setEditingPhone(false);
    setEditingChildren(false);
    toast('تم إلغاء التغييرات', { icon: '↩️' });
  };

  const displayAvatarUrl = previewUrl || currentAvatarUrl;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-24 px-4">
      
      <div className="max-w-2xl mx-auto">

        <Link 
          href="/dashboard" 
          className="btn btn-ghost btn-sm rounded-xl gap-2 mb-6"
        >
          <FaArrowRight />
          العودة للرئيسية
        </Link>
        
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
          
          <div className="h-32 bg-gradient-to-r from-primary to-accent"></div>
          
          <div className="px-8 pb-8">
            
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-base-200">
                  {displayAvatarUrl ? (
                    <img 
                      src={displayAvatarUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <FaUser className="text-4xl text-primary/50" />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary shadow-lg"
                  title="تغيير الصورة الشخصية"
                >
                  <FaCamera />
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {pendingAvatarFile && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-neutral">
                {profile?.parent_name || 'مستخدم'}
              </h1>
              <p className="text-gray-500" dir="ltr">{user?.email}</p>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  <FaPhone />
                  رقم الهاتف
                </h3>
                {!editingPhone && (
                  <button
                    onClick={() => setEditingPhone(true)}
                    className="btn btn-ghost btn-sm text-primary"
                  >
                    <FaEdit />
                    تعديل
                  </button>
                )}
              </div>
              
              {editingPhone ? (
                <div className="relative">
                  <input
                    type="tel"
                    value={currentPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    dir="ltr"
                    className="input input-bordered w-full text-left"
                    placeholder="رقم الهاتف"
                  />
                  {currentPhone !== originalPhone && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full"></div>
                  )}
                </div>
              ) : (
                <p className="text-lg" dir="ltr">
                  {currentPhone || 'لم يتم إضافة رقم'}
                </p>
              )}
            </div>

            <div className="bg-base-100 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  <FaChild />
                  الأبناء المسجلين
                  {childrenChanged && (
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                  )}
                </h3>
                {!editingChildren ? (
                  <button
                    onClick={() => setEditingChildren(true)}
                    className="btn btn-ghost btn-sm text-primary"
                  >
                    <FaEdit />
                    تعديل
                  </button>
                ) : (
                  <button
                    onClick={cancelChildrenEdit}
                    className="btn btn-ghost btn-sm text-gray-500"
                  >
                    <FaTimes />
                    إلغاء
                  </button>
                )}
              </div>
              
              {currentChildren && currentChildren.length > 0 ? (
                <div className="space-y-3">
                  {currentChildren.map((child, index) => (
                    <div key={index} className={`p-4 rounded-xl ${editingChildren ? 'bg-base-200' : 'bg-base-200/50'}`}>
                      {editingChildren ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                              الطفل {index + 1}
                            </span>
                            {currentChildren.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeChild(index)}
                                className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="label py-1">
                                <span className="label-text text-xs">اسم الطفل</span>
                              </label>
                              <input
                                type="text"
                                value={child.name}
                                onChange={(e) => updateChild(index, 'name', e.target.value)}
                                className="input input-bordered input-sm w-full"
                                placeholder="اسم الطفل"
                              />
                            </div>
                            <div>
                              <label className="label py-1">
                                <span className="label-text text-xs">العمر</span>
                              </label>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={child.age}
                                onChange={(e) => updateChild(index, 'age', e.target.value)}
                                className="input input-bordered input-sm w-full"
                                placeholder="العمر"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{child.name || 'بدون اسم'}</span>
                          <span className="badge badge-primary">{child.age} سنة</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {editingChildren && (
                    <button
                      type="button"
                      onClick={addChild}
                      className="btn btn-outline btn-primary btn-sm w-full rounded-xl gap-2"
                    >
                      <FaPlus />
                      إضافة طفل آخر
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">لم يتم إضافة أبناء</p>
                  <button
                    type="button"
                    onClick={addChild}
                    className="btn btn-outline btn-primary btn-sm rounded-xl gap-2"
                  >
                    <FaPlus />
                    إضافة طفل
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleSaveChanges}
                disabled={!hasChanges || saving}
                className={`btn flex-1 rounded-xl gap-2 text-white ${
                  hasChanges 
                    ? 'btn-primary shadow-lg hover:shadow-xl' 
                    : 'btn-disabled bg-gray-300 text-gray-500'
                }`}
              >
                {saving ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <FaSave />
                    حفظ التغييرات
                  </>
                )}
              </button>
              
              {hasChanges && (
                <button
                  onClick={handleDiscardChanges}
                  className="btn btn-ghost rounded-xl"
                >
                  إلغاء
                </button>
              )}
            </div>

            {hasChanges && (
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6 text-center">
                <p className="text-warning text-sm font-medium">
                  لديك تغييرات غير محفوظة
                </p>
              </div>
            )}

            <div className="bg-base-100 rounded-2xl p-6">
              <h3 className="font-bold text-primary mb-4">تواصل معنا</h3>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://www.instagram.com/QudwaAssoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-secondary hover:text-primary transition-colors cursor-pointer"
                  title="Instagram"
                >
                  <FaInstagram />
                </a>
                
                <a
                  href="https://www.facebook.com/QudwaAssoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-secondary hover:text-primary transition-colors cursor-pointer"
                  title="Facebook"
                >
                  <FaFacebook />
                </a>
                
                <a
                  href="https://t.me/QudwaAssoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-secondary hover:text-primary transition-colors cursor-pointer"
                  title="Telegram"
                >
                  <FaTelegramPlane />
                </a>
                
                <a
                  href="https://wa.me/963980931111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-secondary hover:text-primary transition-colors cursor-pointer"
                  title="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
                
                <a
                  href="mailto:qudwa.ltk@gmail.com"
                  className="text-2xl text-secondary hover:text-primary transition-colors cursor-pointer"
                  title="Email"
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {showImageEditor && tempImageFile && (
        <ImageEditorModal
          imageFile={tempImageFile}
          onSave={handleImageEditorSave}
          onClose={handleImageEditorClose}
        />
      )}
    </div>
  );
}