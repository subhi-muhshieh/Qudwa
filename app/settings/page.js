'use client'
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  FaDownload,
  FaExclamationTriangle,
  FaTrash,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useProfile } from '../context/ProfileContext';

export default function SettingsPage() {
  const { user, profile } = useProfile();
  const [loading, setLoading] = useState(true);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deletePassword, setDeletePassword] = useState('');
const [deleteConfirmText, setDeleteConfirmText] = useState('');
const [deleting, setDeleting] = useState(false);
const [showDeletePassword, setShowDeletePassword] = useState(false);
  
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

  const handleDeleteAccount = async () => {
  if (deleteConfirmText !== 'حذف حسابي') {
    toast.error('يرجى كتابة "حذف حسابي" للتأكيد');
    return;
  }

  if (!deletePassword) {
    toast.error('يرجى إدخال كلمة المرور');
    return;
  }

  setDeleting(true);
  const toastId = toast.loading('جاري حذف الحساب...');

  try {
    const res = await fetch('/api/account/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: deletePassword,
        confirmText: deleteConfirmText,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'فشل حذف الحساب');
    }

    toast.success('تم حذف حسابك نهائياً', { id: toastId });

    // Sign out and redirect
    await supabase.auth.signOut();
    setTimeout(() => {
      router.push('/login');
      router.refresh();
    }, 1500);

  } catch (error) {
    console.error('Delete account error:', error);
    toast.error(error.message || 'حدث خطأ أثناء حذف الحساب', { id: toastId });
    setDeleting(false);
  }
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
                  <Image
                    src={profile.avatar_url}
                    alt="Profile"
                    width={64}
                    height={64}
                    sizes="64px"
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

        {/* Danger Zone */}
<div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6 border-2 border-error/10">
  <h2 className="text-lg font-bold text-error flex items-center gap-2 mb-4">
    <FaExclamationTriangle />
    منطقة الخطر
  </h2>
  
  <div className="space-y-3">
    <div className="bg-error/5 rounded-xl p-4">
      <p className="text-sm text-base-content/70 mb-1">
        <span className="font-bold text-error">تحذير:</span> حذف الحساب عملية نهائية لا يمكن التراجع عنها.
      </p>
      <p className="text-xs text-base-content/50">
        سيتم حذف جميع بياناتك بما في ذلك الملف الشخصي، بيانات الأبناء، سجل الحضور، التسجيلات، والإشعارات.
      </p>
    </div>
    
    <button 
      onClick={() => setShowDeleteModal(true)}
      className="flex items-center justify-between p-4 bg-base-200 rounded-xl hover:bg-error/10 transition-colors cursor-pointer w-full group"
    >
      <div className="flex items-center gap-3 text-error">
        <FaTrash />
        <span className="group-hover:font-bold transition-all">حذف الحساب نهائياً</span>
      </div>
      <span className="text-error/40 group-hover:text-error transition-colors">⚠</span>
    </button>
  </div>
</div>

        {/* App Version */}
        <div className="text-center text-base-content/40 text-sm py-4">
          <p>جمعية قدوة - الإصدار 1.0.0</p>
        </div>
        <div className="text-center text-base-content/40 text-sm py-4 font-slogan">
          <p>جيلٌ يبني... أثرٌ يبقى</p>
        </div>

      </div>
      {/* DELETE ACCOUNT MODAL */}
{showDeleteModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <div 
      className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      onClick={() => {
        if (!deleting) {
          setShowDeleteModal(false);
          setDeletePassword('');
          setDeleteConfirmText('');
          setShowDeletePassword(false);
        }
      }}
    ></div>
    
    <div className="bg-base-100 rounded-3xl p-6 md:p-8 relative z-10 max-w-md w-full shadow-2xl">
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaExclamationTriangle className="text-3xl text-error" />
        </div>
        <h3 className="text-2xl font-bold text-error">حذف الحساب نهائياً</h3>
        <p className="text-base-content/50 mt-2 text-sm leading-relaxed">
          هذا الإجراء <span className="font-bold text-error">لا يمكن التراجع عنه</span>. 
          سيتم حذف جميع بياناتك من النظام بشكل كامل.
        </p>
      </div>

      {/* What will be deleted */}
      <div className="bg-error/5 rounded-xl p-4 mb-6 border border-error/10">
        <p className="text-xs font-bold text-error mb-2">سيتم حذف:</p>
        <ul className="text-xs text-base-content/60 space-y-1">
          <li>• الملف الشخصي والصورة الشخصية</li>
          <li>• بيانات الأبناء وبطاقات التعريف</li>
          <li>• سجل الحضور والتسجيلات في النشاطات</li>
          <li>• جميع الإشعارات والإعجابات</li>
          <li>• الحساب بالكامل من النظام</li>
        </ul>
      </div>

      {/* Confirmation */}
      <div className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-sm">
              اكتب <span className="font-bold text-error bg-error/10 px-2 py-0.5 rounded">حذف حسابي</span> للتأكيد
            </span>
          </label>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className={`input input-bordered rounded-xl text-center font-bold ${
              deleteConfirmText === 'حذف حسابي' ? 'input-error border-error' : ''
            }`}
            placeholder="حذف حسابي"
            disabled={deleting}
            dir="rtl"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-sm">أدخل كلمة المرور للتأكيد</span>
          </label>
          <div className="relative">
            <FaLock className="absolute top-4 left-4 text-base-content/40 z-10" />
            <input
              type={showDeletePassword ? "text" : "password"}
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="input input-bordered rounded-xl w-full pl-12 pr-12 text-left"
              placeholder="كلمة المرور"
              disabled={deleting}
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowDeletePassword(!showDeletePassword)}
              className="absolute top-4 right-4 text-base-content/40 hover:text-primary transition-colors z-10"
            >
              {showDeletePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={handleDeleteAccount}
          disabled={deleting || deleteConfirmText !== 'حذف حسابي' || !deletePassword}
          className="btn btn-error w-full rounded-xl text-white gap-2 disabled:opacity-40"
        >
          {deleting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              جاري الحذف...
            </>
          ) : (
            <>
              <FaTrash /> حذف حسابي نهائياً
            </>
          )}
        </button>
        
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setDeletePassword('');
            setDeleteConfirmText('');
            setShowDeletePassword(false);
          }}
          disabled={deleting}
          className="btn btn-ghost w-full rounded-xl"
        >
          إلغاء والعودة
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}