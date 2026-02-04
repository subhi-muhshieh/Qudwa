'use client'
import { useState } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaLock, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

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

    setLoading(true);
    const toastId = toast.loading('جاري تحديث كلمة المرور...');

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast.error('حدث خطأ في تحديث كلمة المرور', { id: toastId });
      setLoading(false);
    } else {
      toast.success('تم تحديث كلمة المرور بنجاح!', { id: toastId });
      await supabase.auth.signOut();
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden font-sans px-4">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>

      <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] border border-white/50">
        <div className="card-body p-10 text-center">
          
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-3xl text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold text-primary mb-2">تعيين كلمة مرور جديدة</h2>
          <p className="text-gray-500 mb-8 text-sm">أدخل كلمة المرور الجديدة لحسابك</p>
          
          <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
            
            {/* New Password */}
            <div className="relative">
              <FaLock className="absolute top-4 left-4 text-gray-400 z-10" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                dir="ltr"
                className="input input-bordered w-full rounded-full pl-12 pr-12 bg-base-200/50 focus:bg-white transition-colors text-left"
                placeholder="كلمة المرور الجديدة"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors z-10"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FaCheckCircle className="absolute top-4 left-4 text-gray-400 z-10" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                dir="ltr"
                className="input input-bordered w-full rounded-full pl-12 pr-12 bg-base-200/50 focus:bg-white transition-colors text-left"
                placeholder="تأكيد كلمة المرور"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors z-10"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {newPassword && confirmPassword && (
              <div className={`text-sm ${newPassword === confirmPassword ? 'text-success' : 'text-error'}`}>
                {newPassword === confirmPassword ? '✓ كلمات المرور متطابقة' : '✗ كلمات المرور غير متطابقة'}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-full shadow-lg hover:scale-105 transition-transform mt-2 text-lg text-white"
            >
              {loading ? <span className="loading loading-spinner"></span> : 'تحديث كلمة المرور'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}