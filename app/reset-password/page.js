'use client'
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Check if user came from email link
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidToken(true);
      } else {
        toast.error('رابط غير صالح أو منتهي الصلاحية');
        router.push('/login');
      }
    };
    checkUser();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة!');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('جاري تحديث كلمة المرور...');

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast.error('حدث خطأ في تحديث كلمة المرور', { id: toastId });
      setIsLoading(false);
    } else {
      toast.success('تم تحديث كلمة المرور بنجاح!', { id: toastId });
      
      // Sign out and redirect to login
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glass-panel p-8 rounded-3xl shadow-xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-3xl text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-primary">تعيين كلمة مرور جديدة</h2>
            <p className="text-gray-600 mt-2">أدخل كلمة المرور الجديدة لحسابك</p>
          </div>
          
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="label">
                <span className="label-text">كلمة المرور الجديدة</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text">تأكيد كلمة المرور</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <FaCheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {newPassword && confirmPassword && (
              <div className={`text-sm ${newPassword === confirmPassword ? 'text-success' : 'text-error'}`}>
                {newPassword === confirmPassword ? '✓ كلمات المرور متطابقة' : '✗ كلمات المرور غير متطابقة'}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-white"
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'تحديث كلمة المرور'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}