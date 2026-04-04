'use client'

import { useState, useCallback, useMemo, memo } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  FaEnvelope, FaLock, FaArrowRight, FaUserPlus, FaSignInAlt, 
  FaKey, FaEye, FaEyeSlash, FaUser, FaChild, FaPlus, FaTrash, FaPhone,
  FaHandsHelping, FaHandHoldingHeart, FaUsers, FaUserFriends,
  FaBuilding, FaSitemap, FaTimes, FaChevronDown, FaChevronUp,
  FaBullseye, FaStar, FaHeart, FaPalette, FaLightbulb, FaInfoCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { memberRanks, offices } from '../utils/constants';

/* ========================================== */
/*  USER TYPE BUTTON - Memoized              */
/* ========================================== */
const UserTypeButton = memo(function UserTypeButton({ 
  type, 
  isSelected, 
  onClick, 
  isLastOdd 
}) {
  const handleClick = useCallback(() => {
    onClick(type.id);
  }, [onClick, type.id]);

  return (
    <div 
      onClick={handleClick}
      className={`cursor-pointer rounded-2xl p-3 border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center relative
        ${isLastOdd ? 'col-span-2' : ''}
        ${isSelected 
          ? 'border-primary bg-primary/5 text-primary shadow-inner' 
          : 'border-transparent bg-base-200 hover:bg-base-300 text-base-content/50'
        }`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="text-xl">{type.icon}</div>
      <span className="text-xs font-bold">{type.label}</span>
    </div>
  );
});

/* ========================================== */
/*  CHILD FORM CARD - Memoized               */
/* ========================================== */
const ChildFormCard = memo(function ChildFormCard({
  child,
  index,
  isExpanded,
  totalChildren,
  onUpdate,
  onRemove,
  onToggleExpand,
  onAgeChange
}) {
  const handleFieldChange = useCallback((field, value) => {
    onUpdate(index, field, value);
  }, [index, onUpdate]);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  const handleToggleExpand = useCallback(() => {
    onToggleExpand(index);
  }, [index, onToggleExpand]);

  const handleAgeInput = useCallback((value) => {
    onAgeChange(index, value);
  }, [index, onAgeChange]);

  return (
    <div className="bg-base-200/30 p-4 rounded-2xl space-y-3 relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
          الشاب {index + 1}
        </span>
        
        {totalChildren > 1 && (
          <button
            type="button"
            onClick={handleRemove}
            className="btn btn-ghost btn-xs text-error hover:bg-error/10"
            aria-label={`حذف الشاب ${index + 1}`}
          >
            <FaTrash />
          </button>
        )}
      </div>

      <div className="relative">
        <FaChild className="absolute top-4 right-4 text-base-content/40 z-10" />
        <input 
          type="text" 
          placeholder="اسم الشاب" 
          className="input input-bordered w-full rounded-full pr-12 bg-base-100 focus:bg-base-100 transition-colors text-right"
          value={child.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          required
        />
      </div>

      <div className="relative">
        <span className="absolute top-4 right-4 text-base-content/40 z-10 text-xs font-bold">
          عمر
        </span>
        <input 
          type="text"
          inputMode="numeric"
          placeholder="عمر الشاب" 
          className="input input-bordered w-full rounded-full pr-12 bg-base-100 focus:bg-base-100 transition-colors text-right"
          value={child.age}
          onChange={(e) => handleAgeInput(e.target.value)}
          required
        />
      </div>

      {/* Fun Facts Toggle */}
      <button
        type="button"
        onClick={handleToggleExpand}
        className="w-full flex items-center justify-between p-3 bg-base-100 rounded-xl hover:bg-base-200/50 transition-colors"
      >
        <span className="text-xs font-bold text-secondary flex items-center gap-2">
          <FaStar className="text-secondary/70" /> بطاقة التعريف (اختياري)
        </span>
        {isExpanded ? (
          <FaChevronUp className="text-xs text-base-content/40" />
        ) : (
          <FaChevronDown className="text-xs text-base-content/40" />
        )}
      </button>

      {/* Fun Fact Fields */}
      {isExpanded && (
        <div className="space-y-3 bg-base-100 p-4 rounded-xl border border-base-200">
          <FunFactField
            icon={<FaBullseye className="absolute top-3 right-3 text-base-content/30 z-10 text-sm" />}
            placeholder="ماذا يريد أن يصبح؟ (طبيب، مهندس...)"
            value={child.dream_profession}
            onChange={(value) => handleFieldChange('dream_profession', value)}
          />

          <FunFactField
            icon={<FaStar className="absolute top-3 right-3 text-base-content/30 z-10 text-sm" />}
            placeholder="أكبر أحلامه"
            value={child.biggest_dream}
            onChange={(value) => handleFieldChange('biggest_dream', value)}
          />

          <FunFactField
            icon={<FaUser className="absolute top-3 right-3 text-base-content/30 z-10 text-sm" />}
            placeholder="قدوته في الحياة"
            value={child.role_model}
            onChange={(value) => handleFieldChange('role_model', value)}
          />

          {child.role_model && (
            <FunFactField
              icon={<FaHeart className="absolute top-3 right-3 text-base-content/30 z-10 text-sm" />}
              placeholder="لماذا هو/هي قدوته؟"
              value={child.role_model_why}
              onChange={(value) => handleFieldChange('role_model_why', value)}
            />
          )}

          <FunFactField
            icon={<FaPalette className="absolute top-3 right-3 text-base-content/30 z-10 text-sm" />}
            placeholder="هوايته المفضلة"
            value={child.hobby}
            onChange={(value) => handleFieldChange('hobby', value)}
          />

          <FunFactField
            icon={<FaLightbulb className="absolute top-3 right-3 text-base-content/30 z-10 text-sm" />}
            placeholder="حقيقة ممتعة عنه"
            value={child.fun_fact}
            onChange={(value) => handleFieldChange('fun_fact', value)}
          />
        </div>
      )}
    </div>
  );
});

/* ========================================== */
/*  FUN FACT FIELD - Memoized                */
/* ========================================== */
const FunFactField = memo(function FunFactField({ icon, placeholder, value, onChange }) {
  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="relative">
      {icon}
      <input
        type="text"
        placeholder={placeholder}
        className="input input-bordered input-sm w-full rounded-xl pr-10 bg-base-200/30 text-right"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
});

/* ========================================== */
/*  MEMBER ROLE CARD - Memoized              */
/* ========================================== */
const MemberRoleCard = memo(function MemberRoleCard({
  role,
  index,
  totalRoles,
  onUpdate,
  onRemove
}) {
  const handleRankChange = useCallback((e) => {
    onUpdate(index, 'rank', e.target.value);
  }, [index, onUpdate]);

  const handleOfficeChange = useCallback((e) => {
    onUpdate(index, 'office', e.target.value);
  }, [index, onUpdate]);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className="bg-base-100 p-3 rounded-2xl border border-base-200 relative shadow-sm space-y-3">
      {totalRoles > 1 && (
        <button 
          type="button" 
          onClick={handleRemove}
          className="absolute top-2 left-2 text-error hover:bg-error/10 p-1 rounded-full transition-colors"
          aria-label={`حذف المنصب ${index + 1}`}
        >
          <FaTimes />
        </button>
      )}
      
      <div className="space-y-3 pt-1">
        <div className="form-control">
          <label className="text-[10px] font-bold text-base-content/40 block mb-1">
            الصفة / المنصب
          </label>
          <select 
            className="select select-bordered select-sm w-full rounded-xl"
            value={role.rank}
            onChange={handleRankChange}
            required
          >
            <option value="" disabled>اختر الصفة...</option>
            {memberRanks.map(r => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>

        {role.rank !== 'president' && (
          <div className="form-control">
            <label className="text-[10px] font-bold text-base-content/40 block mb-1">
              المكتب التابع له
            </label>
            <select 
              className="select select-bordered select-sm w-full rounded-xl"
              value={role.office}
              onChange={handleOfficeChange}
              required
            >
              <option value="" disabled>اختر المكتب...</option>
              {offices.map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
});

/* ========================================== */
/*  PASSWORD RESET MODAL - Memoized          */
/* ========================================== */
const PasswordResetModal = memo(function PasswordResetModal({
  isOpen,
  resetEmail,
  resetLoading,
  onEmailChange,
  onSubmit,
  onClose
}) {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(e);
  }, [onSubmit]);

  const handleEmailChange = useCallback((e) => {
    onEmailChange(e.target.value);
  }, [onEmailChange]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="bg-base-100 rounded-[2rem] p-8 relative z-10 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaKey className="text-2xl text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-primary">استعادة كلمة المرور</h3>
          <p className="text-base-content/50 mt-2 text-sm">
            أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-4 text-base-content/40 z-10" />
            <input
              type="email"
              value={resetEmail}
              onChange={handleEmailChange}
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
                <span className="loading loading-spinner" />
              ) : (
                'إرسال الرابط'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1 rounded-full"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

/* ========================================== */
/*  VERIFICATION SUCCESS SCREEN - Memoized   */
/* ========================================== */
const VerificationScreen = memo(function VerificationScreen({ 
  email, 
  onBack 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden font-sans px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl rounded-[2.5rem] p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-success/10 text-success p-6 rounded-full text-5xl">
            <FaEnvelope />
          </div>
        </div>
        <h2 className="text-3xl font-black text-base-content mb-4" style={{ fontFamily: 'var(--font-tajawal)' }}>
          تحقق من بريدك
        </h2>
        <p className="text-lg text-base-content/70 mb-8">
          أرسلنا رابط تفعيل إلى: <br/>
          <span className="font-bold text-primary" dir="ltr">{email}</span>
        </p>
        <p className="text-sm text-base-content/50 mb-8">
          اضغط على الرابط في الرسالة لتفعيل حسابك، ثم عد إلى هنا لتسجيل الدخول.
        </p>
        <button 
          onClick={onBack} 
          className="btn btn-outline w-full rounded-full"
        >
          العودة لتسجيل الدخول
        </button>
      </div>
    </div>
  );
});

/* ========================================== */
/*  MAIN LOGIN PAGE                           */
/* ========================================== */
export default function LoginPage() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // User type & role state
  const [userType, setUserType] = useState('parent');
  const [memberRoles, setMemberRoles] = useState([{ rank: '', office: '' }]);
  const [donorParty, setDonorParty] = useState('');

  // Password reset state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  // Personal info state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [children, setChildren] = useState([{ 
    name: '', 
    age: '', 
    dream_profession: '', 
    biggest_dream: '', 
    role_model: '', 
    role_model_why: '', 
    hobby: '', 
    fun_fact: '' 
  }]);
  const [expandedChildCards, setExpandedChildCards] = useState({});
  
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  // User types configuration
  const userTypes = useMemo(() => [
    { id: 'parent', label: 'ولي أمر', icon: <FaUserFriends />, desc: 'لتسجيل أبنائك' },
    { id: 'member', label: 'عضو جمعية', icon: <FaUsers />, desc: 'للكادر الإداري' },
    { id: 'volunteer', label: 'متطوع', icon: <FaHandsHelping />, desc: 'للانضمام للفريق' },
    { id: 'donor', label: 'داعم/مانح', icon: <FaHandHoldingHeart />, desc: 'لدعم الجمعية' },
    { id: 'follower', label: 'متابع', icon: <FaUser />, desc: 'للمتابعة والاطلاع' },
  ], []);

  /* ========================================== */
  /*  HANDLERS - Memoized                       */
  /* ========================================== */
  
  const handleUserTypeChange = useCallback((typeId) => {
    setUserType(typeId);
  }, []);

  const handlePhoneChange = useCallback((value) => {
    const numbersOnly = value.replace(/[^0-9+]/g, '');
    setPhoneNumber(numbersOnly);
  }, []);

  const handleAgeChange = useCallback((index, value) => {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    if (numbersOnly === '' || (parseInt(numbersOnly) >= 1 && parseInt(numbersOnly) <= 99)) {
      setChildren(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], age: numbersOnly };
        return updated;
      });
    }
  }, []);

  const updateChild = useCallback((index, field, value) => {
    setChildren(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const addChild = useCallback(() => {
    setChildren(prev => [...prev, { 
      name: '', 
      age: '', 
      dream_profession: '', 
      biggest_dream: '', 
      role_model: '', 
      role_model_why: '', 
      hobby: '', 
      fun_fact: '' 
    }]);
  }, []);

  const removeChild = useCallback((index) => {
    if (children.length > 1) {
      setChildren(prev => prev.filter((_, i) => i !== index));
      setExpandedChildCards(prev => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }
  }, [children.length]);

  const toggleChildExpand = useCallback((index) => {
    setExpandedChildCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  const updateMemberRole = useCallback((index, field, value) => {
    setMemberRoles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'rank' && value === 'president') {
        updated[index].office = '';
      }
      return updated;
    });
  }, []);

  const addMemberRole = useCallback(() => {
    setMemberRoles(prev => [...prev, { rank: '', office: '' }]);
  }, []);

  const removeMemberRole = useCallback((index) => {
    if (memberRoles.length > 1) {
      setMemberRoles(prev => prev.filter((_, i) => i !== index));
    }
  }, [memberRoles.length]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleAuthMode = useCallback(() => {
    setIsSignUp(prev => !prev);
    setFullName('');
    setPhoneNumber('');
    setChildren([{ 
      name: '', 
      age: '', 
      dream_profession: '', 
      biggest_dream: '', 
      role_model: '', 
      role_model_why: '', 
      hobby: '', 
      fun_fact: '' 
    }]);
    setExpandedChildCards({});
    setMemberRoles([{ rank: '', office: '' }]);
    setUserType('parent');
    setDonorParty('');
  }, []);

  const handleAuth = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("جاري المعالجة...");

    try {
      if (isSignUp) {
        // Validation
        if (!fullName.trim()) {
          toast.error("الرجاء إدخال الاسم الكامل", { id: toastId });
          setLoading(false);
          return;
        }
        if (!phoneNumber.trim()) {
          toast.error("الرجاء إدخال رقم الهاتف", { id: toastId });
          setLoading(false);
          return;
        }

        let finalChildren = [];
        let finalMemberRoles = [];

        if (userType === 'parent') {
          finalChildren = children
            .filter(child => child.name.trim() && child.age)
            .map(child => ({
              name: child.name.trim(),
              age: child.age,
              dream_profession: child.dream_profession || '',
              biggest_dream: child.biggest_dream || '',
              role_model: child.role_model || '',
              role_model_why: child.role_model_why || '',
              hobby: child.hobby || '',
              fun_fact: child.fun_fact || '',
            }));
          
          if (finalChildren.length === 0) {
            toast.error("الرجاء إدخال بيانات طفل واحد على الأقل", { id: toastId });
            setLoading(false);
            return;
          }
        }

        if (userType === 'member') {
          finalMemberRoles = memberRoles.filter(r => r.rank);
          if (finalMemberRoles.length === 0) {
            toast.error("الرجاء اختيار صفة واحدة على الأقل", { id: toastId });
            setLoading(false);
            return;
          }
          for (let role of finalMemberRoles) {
            if (role.rank !== 'president' && !role.office) {
              toast.error("الرجاء اختيار المكتب لجميع الصفات المختارة", { id: toastId });
              setLoading(false);
              return;
            }
          }
        }

        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              parent_name: fullName,
              parent_phone: phoneNumber,
              user_type: userType,
              children: finalChildren,
              member_roles: finalMemberRoles,
              donor_party: userType === 'donor' ? donorParty : null
            }
          }
        });
        
        if (error) throw error;

        if (data.user) {
          const profileData = {
            id: data.user.id,
            parent_name: fullName,
            parent_phone: phoneNumber,
            user_type: userType,
            children: userType === 'parent' ? finalChildren : [],
            member_roles: userType === 'member' ? finalMemberRoles : [],
            donor_party: userType === 'donor' ? donorParty : null,
          };

          const { error: profileError } = await supabase
            .from('profiles')
            .upsert(profileData);

          if (profileError) {
            console.error('Profile save error:', profileError);
          }

          // Insert children into children table
          if (userType === 'parent' && finalChildren.length > 0) {
            try {
              const childRecords = finalChildren.map(c => ({
                parent_id: data.user.id,
                name: c.name,
                age: String(c.age),
                dream_profession: c.dream_profession?.trim() || null,
                biggest_dream: c.biggest_dream?.trim() || null,
                role_model: c.role_model?.trim() || null,
                role_model_why: c.role_model_why?.trim() || null,
                hobby: c.hobby?.trim() || null,
                fun_fact: c.fun_fact?.trim() || null,
              }));
              
              const { error: childError } = await supabase
                .from('children')
                .insert(childRecords);
              
              if (childError) {
                console.error('Children table insert error:', childError);
              }
            } catch (childErr) {
              console.error('Children insertion error:', childErr);
            }
          }
        }

        toast.dismiss(toastId);
        setVerificationSent(true);
        toast.success("تم إنشاء الحساب! يرجى تفعيل البريد الإلكتروني");

      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            toast.error("يرجى تفعيل حسابك من البريد الإلكتروني أولاً", { id: toastId });
          } else {
            toast.error("خطأ في البريد أو كلمة المرور", { id: toastId });
          }
        } else {
          toast.success("تم تسجيل الدخول بنجاح", { id: toastId });
          router.push('/dashboard');
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || "حدث خطأ ما", { id: toastId });
    } finally {
      setLoading(false);
    }
  }, [
    isSignUp, 
    email, 
    password, 
    fullName, 
    phoneNumber, 
    userType, 
    children, 
    memberRoles, 
    donorParty, 
    supabase, 
    router
  ]);

  const handlePasswordReset = useCallback(async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('الرجاء إدخال البريد الإلكتروني');
      return;
    }

    setResetLoading(true);
    const toastId = toast.loading('جاري إرسال رابط استعادة كلمة المرور...');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('تم إرسال الرابط بنجاح!', { id: toastId });
      setShowResetModal(false);
      setResetEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('حدث خطأ في إرسال البريد', { id: toastId });
    } finally {
      setResetLoading(false);
    }
  }, [resetEmail, supabase]);

  const handleOpenResetModal = useCallback(() => {
    setShowResetModal(true);
    setResetEmail(email);
  }, [email]);

  const handleCloseResetModal = useCallback(() => {
    setShowResetModal(false);
    setResetEmail('');
  }, []);

  const handleBackFromVerification = useCallback(() => {
    setVerificationSent(false);
  }, []);

  /* ========================================== */
  /*  RENDER                                    */
  /* ========================================== */

  if (verificationSent) {
    return (
      <VerificationScreen 
        email={email} 
        onBack={handleBackFromVerification} 
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden font-sans py-10 px-4">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="card w-full max-w-lg bg-base-100/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] border border-base-content/10">
        <div className="card-body p-6 md:p-10 text-center">
          
          <h2 className="text-3xl md:text-4xl font-black mb-2 text-primary" style={{ fontFamily: 'var(--font-tajawal)' }}>
            {isSignUp ? "انضم إلى قدوة" : "تسجيل الدخول"}
          </h2>
          <p className="text-base-content/60 mb-8 text-sm">
            {isSignUp ? "اختر نوع حسابك وأنشئ حساباً جديداً" : "مرحباً بعودتك! اشتقنا إليك"}
          </p>
          
          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            
            {/* User Type Selection */}
            {isSignUp && (
              <div className="grid grid-cols-2 gap-3 mb-2">
                {userTypes.map((type, index) => (
                  <UserTypeButton
                    key={type.id}
                    type={type}
                    isSelected={userType === type.id}
                    onClick={handleUserTypeChange}
                    isLastOdd={index === userTypes.length - 1 && userTypes.length % 2 !== 0}
                  />
                ))}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-4 left-4 text-base-content/40 z-10" />
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                dir="ltr"
                className="input input-bordered w-full rounded-full pl-12 bg-base-200/50 focus:bg-base-100 transition-colors text-left"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-4 left-4 text-base-content/40 z-10" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور" 
                dir="ltr"
                className="input input-bordered w-full rounded-full pl-12 pr-12 bg-base-200/50 focus:bg-base-100 transition-colors text-left"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-4 right-4 text-base-content/40 hover:text-primary transition-colors z-10"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Sign Up Additional Fields */}
            {isSignUp && (
              <div className="space-y-4">
                <div className="divider text-base-content/50 my-1 text-xs">المعلومات الشخصية</div>

                {/* Full Name */}
                <div className="relative">
                  <FaUser className="absolute top-4 right-4 text-base-content/40 z-10" />
                  <input 
                    type="text" 
                    placeholder="الاسم الثلاثي" 
                    className="input input-bordered w-full rounded-full pr-12 bg-base-200/50 focus:bg-base-100 transition-colors text-right"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <FaPhone className="absolute top-4 left-4 text-base-content/40 z-10" />
                  <input 
                    type="tel" 
                    placeholder="رقم الهاتف" 
                    dir="ltr"
                    className="input input-bordered w-full rounded-full pl-12 bg-base-200/50 focus:bg-base-100 transition-colors text-left"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    required
                  />
                </div>

                {/* Member Roles */}
                {userType === 'member' && (
                  <div className="bg-primary/5 p-4 rounded-3xl space-y-4 border border-primary/10">
                    <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                      <FaSitemap /> المناصب والمهام
                    </h4>

                    {memberRoles.map((role, index) => (
                      <MemberRoleCard
                        key={index}
                        role={role}
                        index={index}
                        totalRoles={memberRoles.length}
                        onUpdate={updateMemberRole}
                        onRemove={removeMemberRole}
                      />
                    ))}

                    <button 
                      type="button" 
                      onClick={addMemberRole}
                      className="btn btn-outline btn-primary btn-sm w-full rounded-xl gap-2 border-dashed"
                    >
                      <FaPlus /> إضافة منصب آخر
                    </button>
                  </div>
                )}

                {/* Donor Party */}
                {userType === 'donor' && (
                  <div className="bg-warning/5 p-4 rounded-3xl space-y-2 border border-warning/10">
                    <h4 className="font-bold text-warning text-sm flex items-center gap-2">
                      <FaBuilding /> الجهة المانحة (اختياري)
                    </h4>
                    <input 
                      type="text" 
                      placeholder="اسم الجمعية / الجهة / الشركة" 
                      className="input input-bordered w-full rounded-2xl bg-base-100"
                      value={donorParty}
                      onChange={(e) => setDonorParty(e.target.value)}
                    />
                    <p className="text-[10px] text-base-content/40 pr-2">
                      اتركه فارغاً إذا كنت داعماً بصفة شخصية
                    </p>
                  </div>
                )}

                {/* Children */}
                {userType === 'parent' && (
                  <div className="space-y-4">
                    <div className="divider text-base-content/50 my-2 text-xs">بيانات الأبناء</div>
                    
                    {children.map((child, index) => (
                      <ChildFormCard
                        key={index}
                        child={child}
                        index={index}
                        isExpanded={expandedChildCards[index]}
                        totalChildren={children.length}
                        onUpdate={updateChild}
                        onRemove={removeChild}
                        onToggleExpand={toggleChildExpand}
                        onAgeChange={handleAgeChange}
                      />
                    ))}

                    {/* Skip Reminder */}
                    <div className="flex items-start gap-3 p-3 bg-info/5 border border-info/10 rounded-2xl">
                      <FaInfoCircle className="text-info shrink-0 mt-0.5" />
                      <p className="text-xs text-base-content/60 leading-relaxed">
                        بطاقة التعريف اختيارية ويمكنك تعبئتها أو تعديلها لاحقاً من خلال 
                        <span className="font-bold text-primary"> صفحة الملف الشخصي</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addChild}
                      className="btn btn-outline btn-primary btn-sm w-full rounded-full gap-2"
                    >
                      <FaPlus />
                      إضافة طفل آخر
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Forgot Password Link */}
            {!isSignUp && (
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={handleOpenResetModal}
                  className="text-sm text-primary hover:text-primary/70 transition-colors inline-flex items-center gap-1"
                >
                  <FaKey className="text-xs" />
                  نسيت كلمة المرور؟
                </button>
              </div>
            )}
            
            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-full rounded-full shadow-lg hover:scale-105 transition-transform mt-2 gap-2 text-lg text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner" />
              ) : (
                isSignUp ? (
                  <>
                    <FaUserPlus /> إنشاء حساب
                  </>
                ) : (
                  <>
                    <FaSignInAlt /> دخول
                  </>
                )
              )}
            </button>
          </form>

          <div className="divider text-base-content/50 my-6">أو</div>
          
          {/* Toggle Auth Mode */}
          <button 
            className="btn btn-ghost hover:bg-transparent normal-case gap-2"
            onClick={toggleAuthMode}
          >
            {isSignUp ? "لديك حساب بالفعل؟ سجل دخولك" : "ليس لديك حساب؟ انضم إلينا"}
            <FaArrowRight className="text-xs mt-1" />
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={showResetModal}
        resetEmail={resetEmail}
        resetLoading={resetLoading}
        onEmailChange={setResetEmail}
        onSubmit={handlePasswordReset}
        onClose={handleCloseResetModal}
      />
    </div>
  );
}