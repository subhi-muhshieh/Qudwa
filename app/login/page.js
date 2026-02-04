'use client'
import { useState } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaArrowRight, FaUserPlus, FaSignInAlt, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("جاري المعالجة...");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });
        
        if (error) throw error;

        toast.dismiss(toastId);
        setVerificationSent(true);
        toast.success("تم إنشاء الحساب! يرجى تفعيل البريد الإلكتروني");

      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            toast.error("يرجى تفعيل حسابك من البريد الإلكتروني أولاً", { id: toastId });
          } else {
            toast.error("خطأ في البريد أو كلمة المرور", { id: toastId });
          }
        } else {
          toast.success("تم تسجيل الدخول بنجاح", { id: toastId });
          router.push('/');
          router.refresh();
        }
      }
    } catch (error) {
      toast.error(error.message || "حدث خطأ ما", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('الرجاء إدخال البريد الإلكتروني');
      return;
    }

    setResetLoading(true);
    const toastId = toast.loading('جاري إرسال رابط استعادة كلمة المرور...');
    
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setResetLoading(false);

    if (error) {
      toast.error('حدث خطأ في إرسال البريد', { id: toastId });
    } else {
      toast.success('تم إرسال رابط الاستعادة إلى بريدك الإلكتروني!', { id: toastId });
      setShowResetModal(false);
      setResetEmail('');
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden font-sans">
         <div className="card w-full max-w-md bg-white shadow-2xl rounded-[2.5rem] p-10 text-center animate-fade-in-up">
            <div className="flex justify-center mb-6">
                <div className="bg-green-100 text-green-500 p-6 rounded-full text-5xl">
                    <FaEnvelope />
                </div>
            </div>
            <h2 className="text-3xl font-black text-neutral mb-4" style={{ fontFamily: 'var(--font-tajawal)' }}>
                تحقق من بريدك
            </h2>
            <p className="text-lg opacity-70 mb-8">
                أرسلنا رابط تفعيل إلى: <br/>
                <span className="font-bold text-primary" dir="ltr">{email}</span>
            </p>
            <p className="text-sm opacity-50 mb-8">
                اضغط على الرابط في الرسالة لتفعيل حسابك، ثم عد إلى هنا لتسجيل الدخول.
            </p>
            <button 
                onClick={() => setVerificationSent(false)} 
                className="btn btn-outline w-full rounded-full"
            >
                العودة لتسجيل الدخول
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>

      <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] border border-white/50">
        <div className="card-body p-10 text-center">
          
          <h2 className="text-4xl font-black mb-2 text-primary" style={{ fontFamily: 'var(--font-tajawal)' }}>
            {isSignUp ? "انضم إلى قدوة" : "تسجيل الدخول"}
          </h2>
          <p className="opacity-60 mb-8 text-sm text-neutral">
            {isSignUp ? "أنشئ حساباً جديداً وسيتم إرسال رابط تفعيل إليك" : "مرحباً بعودتك! اشتقنا إليك"}
          </p>
          
          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            
            {/* Email Input - LTR */}
            <div className="relative">
                <FaEnvelope className="absolute top-4 left-4 text-gray-400 z-10" />
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  dir="ltr"
                  className="input input-bordered w-full rounded-full pl-12 bg-base-200/50 focus:bg-white transition-colors text-left"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
            </div>

            {/* Password Input - LTR with Eye Toggle */}
            <div className="relative">
                <FaLock className="absolute top-4 left-4 text-gray-400 z-10" />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="كلمة المرور" 
                  dir="ltr"
                  className="input input-bordered w-full rounded-full pl-12 pr-12 bg-base-200/50 focus:bg-white transition-colors text-left"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors z-10"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            {/* Forgot Password Link - Only on Login */}
            {!isSignUp && (
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(true);
                    setResetEmail(email);
                  }}
                  className="text-sm text-primary hover:text-primary/70 transition-colors inline-flex items-center gap-1"
                >
                  <FaKey className="text-xs" />
                  نسيت كلمة المرور؟
                </button>
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary w-full rounded-full shadow-lg hover:scale-105 transition-transform mt-2 gap-2 text-lg text-white"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : (isSignUp ? <><FaUserPlus /> إنشاء حساب</> : <><FaSignInAlt /> دخول</>)}
            </button>
          </form>

          <div className="divider opacity-50 my-6">أو</div>
          
          <button 
            className="btn btn-ghost hover:bg-transparent normal-case gap-2"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "لديك حساب بالفعل؟ سجل دخولك" : "ليس لديك حساب؟ انضم إلينا"}
            <FaArrowRight className="text-xs mt-1" />
          </button>
        </div>
      </div>

      {/* PASSWORD RESET MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => {
              setShowResetModal(false);
              setResetEmail('');
            }}
          ></div>
          
          <div className="bg-white rounded-[2rem] p-8 relative z-10 max-w-md w-full shadow-2xl">
            
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaKey className="text-2xl text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">استعادة كلمة المرور</h3>
              <p className="text-gray-500 mt-2 text-sm">
                أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
              </p>
            </div>
            
            {/* Modal Form */}
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute top-4 left-4 text-gray-400 z-10" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  dir="ltr"
                  className="input input-bordered w-full rounded-full pl-12 text-left"
                  placeholder="البريد الإلكتروني"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary flex-1 rounded-full text-white"
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'إرسال الرابط'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetEmail('');
                  }}
                  className="btn btn-ghost flex-1 rounded-full"
                >
                  إلغاء
                </button>
              </div>
            </form>

            <p className="text-center mt-6 text-xs text-gray-400">
              ستصلك رسالة على بريدك الإلكتروني خلال دقائق
            </p>
          </div>
        </div>
      )}
    </div>
  );
}