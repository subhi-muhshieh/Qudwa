'use client'
import { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FaCamera, FaPhone, FaEnvelope, FaInstagram, FaFacebook, FaTelegramPlane, FaUser, FaChild, FaSave, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Original values (to compare for changes)
  const [originalPhone, setOriginalPhone] = useState('');
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState('');
  
  // Current editable values
  const [currentPhone, setCurrentPhone] = useState('');
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [editingPhone, setEditingPhone] = useState(false);
  
  const fileInputRef = useRef(null);
  const supabase = createClient();
  const router = useRouter();

  // Check if there are any unsaved changes
  const hasChanges = currentPhone !== originalPhone || pendingAvatarFile !== null;

  useEffect(() => {
    fetchProfile();
  }, []);

 const fetchProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    router.push('/login');
    return;
  }
  
  setUser(user);

  // Try to get existing profile
  let { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If no profile exists, create one
  if (!profile || error) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id,
        parent_phone: '',
        avatar_url: '',
        parent_name: '',
        children: []
      })
      .select()
      .single();

    profile = newProfile;
  }

  if (profile) {
    setProfile(profile);
    
    setOriginalPhone(profile.parent_phone || '');
    setOriginalAvatarUrl(profile.avatar_url || '');
    
    setCurrentPhone(profile.parent_phone || '');
    setCurrentAvatarUrl(profile.avatar_url || '');
  }
  
  setLoading(false);
};

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار صورة صالحة');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 2 ميغابايت');
      return;
    }

    // Store file for later upload
    setPendingAvatarFile(file);
    
    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    
    toast.success('تم اختيار الصورة - اضغط حفظ لتأكيد التغييرات');
  };

  const handlePhoneChange = (value) => {
    const numbersOnly = value.replace(/[^0-9+]/g, '');
    setCurrentPhone(numbersOnly);
  };

 const handleSaveChanges = async () => {
  if (!hasChanges) return;
  
  setSaving(true);
  const toastId = toast.loading('جاري حفظ التغييرات...');

  try {
    let newAvatarUrl = currentAvatarUrl;

    // Upload new avatar if pending
    if (pendingAvatarFile) {
      const fileExt = pendingAvatarFile.name.split('.').pop();
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

    // Use UPSERT - creates row if doesn't exist, updates if it does
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        parent_phone: currentPhone,
        avatar_url: newAvatarUrl,
        parent_name: profile?.parent_name || '',
        children: profile?.children || [],
      });

    if (upsertError) {
      console.error('Upsert error:', upsertError);
      toast.error(`فشل الحفظ: ${upsertError.message}`, { id: toastId });
      setSaving(false);
      return;
    }

    // Update local state
    setProfile({ 
      ...profile, 
      parent_phone: currentPhone,
      avatar_url: newAvatarUrl 
    });
    
    setOriginalPhone(currentPhone);
    setOriginalAvatarUrl(newAvatarUrl);
    setCurrentAvatarUrl(newAvatarUrl);
    
    setPendingAvatarFile(null);
    setPreviewUrl('');
    setEditingPhone(false);

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
    setPendingAvatarFile(null);
    setPreviewUrl('');
    setEditingPhone(false);
    toast('تم إلغاء التغييرات', { icon: '↩️' });
  };

  // Get display avatar URL (preview or current)
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
        
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
          
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-primary to-accent"></div>
          
          {/* Profile Content */}
          <div className="px-8 pb-8">
            
            {/* Avatar Section */}
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
                
                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary shadow-lg"
                >
                  <FaCamera />
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Pending change indicator */}
                {pendingAvatarFile && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full border-2 border-white"></div>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-neutral">
                {profile?.parent_name || 'مستخدم'}
              </h1>
              <p className="text-gray-500" dir="ltr">{user?.email}</p>
            </div>

            {/* Phone Section */}
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

            {/* Children Section */}
            {profile?.children && profile.children.length > 0 && (
              <div className="bg-base-100 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-primary flex items-center gap-2 mb-4">
                  <FaChild />
                  الأبناء المسجلين
                </h3>
                <div className="space-y-3">
                  {profile.children.map((child, index) => (
                    <div key={index} className="flex items-center justify-between bg-base-200/50 p-3 rounded-xl">
                      <span className="font-medium">{child.name}</span>
                      <span className="badge badge-primary">{child.age} سنة</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button Section */}
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

            {/* Unsaved Changes Warning */}
            {hasChanges && (
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6 text-center">
                <p className="text-warning text-sm font-medium">
                  لديك تغييرات غير محفوظة
                </p>
              </div>
            )}

            {/* Social Links */}
            <div className="bg-base-100 rounded-2xl p-6">
              <h3 className="font-bold text-primary mb-4">تواصل معنا</h3>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://www.instagram.com/QudwaAssoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-lg bg-gradient-to-br from-purple-500 to-pink-500 border-none text-white hover:scale-110 transition-transform"
                >
                  <FaInstagram className="text-xl" />
                </a>
                
                <a
                  href="https://www.facebook.com/QudwaAssoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-lg bg-blue-600 border-none text-white hover:scale-110 transition-transform"
                >
                  <FaFacebook className="text-xl" />
                </a>
                
                <a
                  href="https://t.me/QudwaAssoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-lg bg-sky-500 border-none text-white hover:scale-110 transition-transform"
                >
                  <FaTelegramPlane className="text-xl" />
                </a>
                
                <a
                  href="mailto:contact@qudwa.org"
                  className="btn btn-circle btn-lg bg-red-500 border-none text-white hover:scale-110 transition-transform"
                >
                  <FaEnvelope className="text-xl" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}