'use client'
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaArrowRight, FaUserPlus, FaSignInAlt, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false); // New State
  
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("جاري المعالجة...");

    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC (With Email Confirmation) ---
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`, // Redirects back to home after clicking email
          }
        });
        
        if (error) throw error;

        // Don't auto-login. Show the "Check Email" screen instead.
        toast.dismiss(toastId);
        setVerificationSent(true);
        toast.success("تم إنشاء الحساب! يرجى تفعيل البريد الإلكتروني");

      } else {
        // --- LOGIN LOGIC ---
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

  // If "Verification Sent" screen is active
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
                <span className="font-bold text-primary">{email}</span>
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

  // Normal Login/Signup Form
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
            
            <div className="relative">
                <FaEnvelope className="absolute top-4 right-4 text-gray-400 z-10" />
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  className="input input-bordered w-full rounded-full pr-12 bg-base-200/50 focus:bg-white transition-colors text-right"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
            </div>

            <div className="relative">
                <FaLock className="absolute top-4 right-4 text-gray-400 z-10" />
                <input 
                  type="password" 
                  placeholder="كلمة المرور" 
                  className="input input-bordered w-full rounded-full pr-12 bg-base-200/50 focus:bg-white transition-colors text-right"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
            </div>
            
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
    </div>
  );
}