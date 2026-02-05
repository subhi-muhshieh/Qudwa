'use client'
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaChild, 
  FaEdit, 
  FaSignOutAlt, 
  FaTrash, 
  FaCog, 
  FaShieldAlt, 
  FaLock,
  FaBell,
  FaMoon,
  FaSun,
  FaQuestionCircle,
  FaInfoCircle,
  FaDownload,
  FaExclamationTriangle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useProfile } from '../context/ProfileContext';

export default function SettingsPage() {
  const { user, profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  
  // Optional: Theme toggle state
  const [darkMode, setDarkMode] = useState(false);
  
  // Optional: Notifications state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [user, router]);

  const handleLogout = async () => {
    const toastId = toast.loading('جاري تسجيل الخروج...');
    await supabase.auth.signOut();
    toast.success('تم تسجيل الخروج', { id: toastId });
    router.push('/login');
    router.refresh();
  };

  const handleDeleteAccount = async () => {
  if (deleteConfirmText !== 'حذف حسابي') {
    toast.error('الرجاء كتابة "حذف حسابي" للتأكيد');
    return;
  }

  setDeleting(true);
  const toastId = toast.loading('جاري حذف الحساب...');

  try {
    // Soft delete - mark account as deleted
    const { error } = await supabase
      .from('profiles')
      .update({ 
        deleted_at: new Date().toISOString(),
        deleted: true,
        // Optional: Clear sensitive data
        parent_phone: null,
        avatar_url: null
      })
      .eq('id', user.id);

    if (error) throw error;

    // Delete avatar from storage if exists
    if (profile?.avatar_url) {
      try {
        const avatarPath = profile.avatar_url.split('/').pop();
        await supabase.storage.from('avatars').remove([avatarPath]);
      } catch (storageError) {
        console.error('Error deleting avatar:', storageError);
        // Continue even if avatar deletion fails
      }
    }

    // Sign out the user
    await supabase.auth.signOut();
    
    toast.success('تم حذف حسابك بنجاح', { id: toastId });
    router.push('/');
    router.refresh();
  } catch (error) {
    console.error('Delete error:', error);
    toast.error('حدث خطأ أثناء حذف الحساب', { id: toastId });
  } finally {
    setDeleting(false);
    setShowDeleteModal(false);
  }
};

  // Optional: Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // You can implement actual theme switching here
    toast.success(darkMode ? 'تم تفعيل الوضع الفاتح' : 'تم تفعيل الوضع الداكن');
  };

  // Optional: Toggle notifications
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(notificationsEnabled ? 'تم إيقاف الإشعارات' : 'تم تفعيل الإشعارات');
  };

  // Optional: Export user data
  const handleExportData = () => {
    const data = {
      email: user?.email,
      parent_name: profile?.parent_name,
      parent_phone: profile?.parent_phone,
      children: profile?.children,
      created_at: user?.created_at
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qudwa-profile-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('تم تحميل بياناتك');
  };

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
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCog className="text-3xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-neutral">الإعدادات</h1>
          <p className="text-gray-500 mt-2">إدارة حسابك وتفضيلاتك</p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <FaUser />
              معلومات الحساب
            </h2>
            <Link 
              href="/profile" 
              className="btn btn-sm btn-primary btn-outline rounded-xl gap-2"
            >
              <FaEdit />
              تعديل
            </Link>
          </div>
          
          <div className="space-y-4">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="text-2xl text-primary/50" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-lg">{profile?.parent_name || 'لم يتم تحديد الاسم'}</p>
                <p className="text-gray-500 text-sm" dir="ltr">{user?.email}</p>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl">
              <FaPhone className="text-primary" />
              <div>
                <p className="text-xs text-gray-500">رقم الهاتف</p>
                <p className="font-medium" dir="ltr">{profile?.parent_phone || 'لم يتم تحديد رقم'}</p>
              </div>
            </div>
            
            {/* Children */}
            <div className="p-3 bg-base-100 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <FaChild className="text-primary" />
                <p className="text-xs text-gray-500">الأبناء المسجلين</p>
              </div>
              {profile?.children && profile.children.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.children.map((child, index) => (
                    <span key={index} className="badge badge-primary badge-outline">
                      {child.name} ({child.age} سنة)
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">لا يوجد أبناء مسجلين</p>
              )}
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <FaShieldAlt />
            الأمان
          </h2>
          
          <div className="space-y-3">
            {/* Change Password */}
            <Link 
              href="/reset-password"
              className="flex items-center justify-between p-4 bg-base-100 rounded-xl hover:bg-base-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FaLock className="text-primary" />
                <span>تغيير كلمة المرور</span>
              </div>
              <span className="text-gray-400">←</span>
            </Link>
          </div>
        </div>

        {/* Optional: Preferences Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <FaCog />
            التفضيلات
          </h2>
          
          <div className="space-y-3">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 bg-base-100 rounded-xl">
              <div className="flex items-center gap-3">
                {darkMode ? <FaMoon className="text-primary" /> : <FaSun className="text-primary" />}
                <span>الوضع الداكن</span>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={darkMode}
                onChange={toggleTheme}
              />
            </div>
            
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-4 bg-base-100 rounded-xl">
              <div className="flex items-center gap-3">
                <FaBell className="text-primary" />
                <span>الإشعارات</span>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={notificationsEnabled}
                onChange={toggleNotifications}
              />
            </div>
          </div>
        </div>

        {/* Optional: Data & Privacy */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <FaDownload />
            البيانات والخصوصية
          </h2>
          
          <div className="space-y-3">
            {/* Export Data */}
            <button 
              onClick={handleExportData}
              className="flex items-center justify-between p-4 bg-base-100 rounded-xl hover:bg-base-200 transition-colors cursor-pointer w-full"
            >
              <div className="flex items-center gap-3">
                <FaDownload className="text-primary" />
                <span>تحميل بياناتي</span>
              </div>
              <span className="text-gray-400">↓</span>
            </button>
          </div>
        </div>

        {/* Optional: Help & Support */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <FaQuestionCircle />
            المساعدة والدعم
          </h2>
          
          <div className="space-y-3">
           {/* FAQ */}
<Link 
  href="/faq"
  className="flex items-center justify-between p-4 bg-base-100 rounded-xl hover:bg-base-200 transition-colors cursor-pointer"
>
  <div className="flex items-center gap-3">
    <FaQuestionCircle className="text-primary" />
    <span>الأسئلة الشائعة</span>
  </div>
  <span className="text-gray-400">←</span>
</Link>

{/* About */}
<Link 
  href="/about"
  className="flex items-center justify-between p-4 bg-base-100 rounded-xl hover:bg-base-200 transition-colors cursor-pointer"
>
  <div className="flex items-center gap-3">
    <FaInfoCircle className="text-primary" />
    <span>عن الجمعية</span>
  </div>
  <span className="text-gray-400">←</span>
</Link>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <FaUser />
            إجراءات الحساب
          </h2>
          
          <div className="space-y-3">
            {/* Sign Out */}
            <button 
              onClick={handleLogout}
              className="flex items-center justify-between p-4 bg-base-100 rounded-xl hover:bg-warning/10 transition-colors cursor-pointer w-full"
            >
              <div className="flex items-center gap-3 text-warning">
                <FaSignOutAlt />
                <span>تسجيل الخروج</span>
              </div>
            </button>
            
            {/* Delete Account */}
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-between p-4 bg-error/5 rounded-xl hover:bg-error/10 transition-colors cursor-pointer w-full border border-error/20"
            >
              <div className="flex items-center gap-3 text-error">
                <FaTrash />
                <span>حذف الحساب</span>
              </div>
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center text-gray-400 text-sm py-4">
          <p>منظمة قدوة - الإصدار 1.0.0</p>
          <p>جيلٌ يبني، أثرٌ يبقى</p>
        </div>

      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowDeleteModal(false)}
          ></div>
          
          <div className="bg-white rounded-2xl p-8 relative z-10 max-w-md w-full shadow-2xl">
            
            {/* Warning Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-3xl text-error" />
              </div>
              <h3 className="text-2xl font-bold text-error">حذف الحساب</h3>
              <p className="text-gray-500 mt-2 text-sm">
                هل أنت متأكد من حذف حسابك؟ سيتم حذف جميع بياناتك نهائياً ولا يمكن استرجاعها.
              </p>
            </div>
            
            {/* Confirmation Input */}
            <div className="mb-6">
              <label className="label">
                <span className="label-text">اكتب "حذف حسابي" للتأكيد</span>
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="input input-bordered w-full text-center"
                placeholder="حذف حسابي"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'حذف حسابي' || deleting}
                className="btn btn-error flex-1 text-white"
              >
                {deleting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <FaTrash />
                    تأكيد الحذف
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="btn btn-ghost flex-1"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}