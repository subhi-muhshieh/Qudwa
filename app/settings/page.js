'use client'
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaUser, 
  FaPhone, 
  FaChild, 
  FaEdit, 
  FaSignOutAlt, 
  FaShieldAlt, 
  FaLock,
  FaQuestionCircle,
  FaInfoCircle,
  FaDownload
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useProfile } from '../context/ProfileContext';

export default function SettingsPage() {
  const { user, profile } = useProfile();
  const [loading, setLoading] = useState(true);
  
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
    <div className="min-h-screen bg-base-200 pt-32 pb-24 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-3xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">الإعدادات</h1>
          <p className="text-base-content/50 mt-2">إدارة حسابك</p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6">
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
                <p className="font-bold text-lg text-base-content">{profile?.parent_name || 'لم يتم تحديد الاسم'}</p>
                <p className="text-base-content/50 text-sm" dir="ltr">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl">
              <FaPhone className="text-primary" />
              <div>
                <p className="text-xs text-base-content/50">رقم الهاتف</p>
                <p className="font-medium text-base-content" dir="ltr">{profile?.parent_phone || 'لم يتم تحديد رقم'}</p>
              </div>
            </div>
            
            <div className="p-3 bg-base-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <FaChild className="text-primary" />
                <p className="text-xs text-base-content/50">الأبناء المسجلين</p>
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
                <p className="text-base-content/40 text-sm">لا يوجد أبناء مسجلين</p>
              )}
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <FaLock />
            الأمان
          </h2>
          
          <div className="space-y-3">
            <Link 
              href="/reset-password"
              className="flex items-center justify-between p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FaLock className="text-primary" />
                <span className="text-base-content">تغيير كلمة المرور</span>
              </div>
              <span className="text-base-content/40">←</span>
            </Link>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <FaDownload />
            البيانات والخصوصية
          </h2>
          
          <div className="space-y-3">
            <button 
              onClick={handleExportData}
              className="flex items-center justify-between p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors cursor-pointer w-full"
            >
              <div className="flex items-center gap-3">
                <FaDownload className="text-primary" />
                <span className="text-base-content">تحميل بياناتي</span>
              </div>
              <span className="text-base-content/40">↓</span>
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <FaQuestionCircle />
            المساعدة والدعم
          </h2>
          
          <div className="space-y-3">
            <Link 
              href="/faq"
              className="flex items-center justify-between p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FaQuestionCircle className="text-primary" />
                <span className="text-base-content">الأسئلة الشائعة</span>
              </div>
              <span className="text-base-content/40">←</span>
            </Link>

            <Link 
              href="/about"
              className="flex items-center justify-between p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FaInfoCircle className="text-primary" />
                <span className="text-base-content">عن الجمعية</span>
              </div>
              <span className="text-base-content/40">←</span>
            </Link>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
            <FaUser />
            إجراءات الحساب
          </h2>
          
          <div className="space-y-3">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-between p-4 bg-base-200 rounded-xl hover:bg-warning/10 transition-colors cursor-pointer w-full"
            >
              <div className="flex items-center gap-3 text-warning">
                <FaSignOutAlt />
                <span>تسجيل الخروج</span>
              </div>
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center text-base-content/40 text-sm py-4">
          <p>منظمة قدوة - الإصدار 1.0.0</p>
        </div>
        <div className="text-center text-base-content/40 text-sm py-4 font-slogan">
          <p>جيلٌ يبني... أثرٌ يبقى</p>
        </div>

      </div>
    </div>
  );
}