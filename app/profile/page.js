'use client'
import { useState, useEffect, useRef, memo } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCamera, FaPhone, FaEnvelope, FaInstagram, FaFacebook, 
  FaTelegramPlane, FaWhatsapp, FaUser, FaChild, FaSave, 
  FaEdit, FaPlus, FaTrash, FaTimes, FaArrowRight,
  FaSitemap, FaBuilding, FaIdBadge, FaUserTag, FaCheck, FaChevronDown, FaInfoCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useProfile } from '../context/ProfileContext';
import { userTypeLabels, rankLabels, officeLabels } from '../utils/constants';
import dynamic from 'next/dynamic';

const ImageEditorModal = dynamic(() => import('../components/ImageEditorModal'), { ssr: false });
const ChildProfileModal = dynamic(() => import('../components/ChildProfileModal'), { ssr: false });

/* ========================================== */
/* CUSTOM PREMIUM DROPDOWN COMPONENT         */
/* ========================================== */
const CustomDropdown = ({ value, onChange, options, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = value ? options[value] : placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex items-center justify-between cursor-pointer ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedLabel}</span>
        <FaChevronDown className={`transition-transform duration-300 text-base-content/40 text-xs sm:text-sm shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-base-300 rounded-[1.2rem] shadow-[0_15px_40px_rgba(0,0,0,0.12)] max-h-60 overflow-y-auto overflow-x-hidden transform origin-top"
          >
            {Object.entries(options).map(([k, v]) => (
              <div
                key={k}
                className={`px-5 py-3 cursor-pointer text-sm font-bold transition-colors ${
                  value === k ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-base-content/80 hover:bg-base-200 border-l-4 border-transparent'
                }`}
                onClick={() => {
                  onChange(k);
                  setIsOpen(false);
                }}
              >
                {v}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ========================================== */
/* SKELETON UI                               */
/* ========================================== */
const ProfileSkeleton = memo(function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-base-100 relative w-full max-w-[100vw] overflow-x-hidden pb-24" dir="rtl">
      <section className="relative bg-gradient-to-br from-neutral via-primary to-secondary pt-36 sm:pt-48 pb-40 sm:pb-52 px-4 overflow-hidden rounded-b-[3rem] sm:rounded-b-[4rem] shadow-lg w-full">
        <div className="max-w-3xl mx-auto animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-white/10 rounded-[2rem] mb-6" />
          <div className="h-10 w-48 bg-white/10 rounded-xl mb-4" />
          <div className="h-4 w-64 bg-white/10 rounded-full" />
        </div>
      </section>

      <section className="px-2 sm:px-4 -mt-24 sm:-mt-32 relative z-20 mb-20 w-full">
        <div className="max-w-3xl mx-auto w-full bg-white/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/60 animate-pulse">
          <div className="flex justify-center -mt-16 sm:-mt-20 mb-8">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-base-300 border-4 border-white shadow-lg" />
          </div>
          <div className="space-y-6 flex flex-col items-center">
            <div className="h-8 w-48 bg-base-200 rounded-full" />
            <div className="h-4 w-32 bg-base-200 rounded-full" />
            <div className="h-12 w-32 bg-base-200 rounded-xl" />
            <div className="w-full h-32 bg-base-200 rounded-[1.5rem] mt-6" />
            <div className="w-full h-24 bg-base-200 rounded-[1.5rem]" />
          </div>
        </div>
      </section>
    </main>
  );
});

export default function ProfilePage() {
  const { user, profile: contextProfile, loading: contextLoading, updateProfile } = useProfile();
  const isAdmin = contextProfile?.role === 'admin';
  const [saving, setSaving] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  
  const [originalName, setOriginalName] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState('');
  const [originalUserType, setOriginalUserType] = useState('parent');
  const [originalChildren, setOriginalChildren] = useState([]);
  const [originalMemberRoles, setOriginalMemberRoles] = useState([]);
  const [originalDonorParty, setOriginalDonorParty] = useState('');
  
  const [currentName, setCurrentName] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');
  const [currentUserType, setCurrentUserType] = useState('parent');
  const [currentChildren, setCurrentChildren] = useState([]);
  const [currentMemberRoles, setCurrentMemberRoles] = useState([]);
  const [currentDonorParty, setCurrentDonorParty] = useState('');
  
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingUserType, setEditingUserType] = useState(false);
  const [editingChildren, setEditingChildren] = useState(false);
  const [editingMemberRoles, setEditingMemberRoles] = useState(false);
  const [editingDonorParty, setEditingDonorParty] = useState(false);

  const [showImageEditor, setShowImageEditor] = useState(false);
  const [tempImageFile, setTempImageFile] = useState(null);
  const [childTableRecords, setChildTableRecords] = useState([]);
  const [selectedChildForProfile, setSelectedChildForProfile] = useState(null);
  
  const fileInputRef = useRef(null);
  const supabase = createClient();
  const router = useRouter();

  const hasChanges = 
    currentName !== originalName ||
    currentPhone !== originalPhone ||
    currentUserType !== originalUserType ||
    currentDonorParty !== originalDonorParty ||
    JSON.stringify(currentChildren) !== JSON.stringify(originalChildren) ||
    JSON.stringify(currentMemberRoles) !== JSON.stringify(originalMemberRoles) ||
    pendingAvatarFile !== null;

  useEffect(() => {
    if (contextLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (contextProfile) {
      setOriginalName(contextProfile.parent_name || '');
      setOriginalPhone(contextProfile.parent_phone || '');
      setOriginalAvatarUrl(contextProfile.avatar_url || '');
      setOriginalUserType(contextProfile.user_type || 'parent');
      setOriginalChildren(contextProfile.children || []);
      setOriginalMemberRoles(contextProfile.member_roles || []);
      setOriginalDonorParty(contextProfile.donor_party || '');

      setCurrentName(contextProfile.parent_name || '');
      setCurrentPhone(contextProfile.parent_phone || '');
      setCurrentAvatarUrl(contextProfile.avatar_url || '');
      setCurrentUserType(contextProfile.user_type || 'parent');
      setCurrentChildren(contextProfile.children || []);
      setCurrentMemberRoles(contextProfile.member_roles || []);
      setCurrentDonorParty(contextProfile.donor_party || '');
      
      setProfileReady(true);

      if ((contextProfile.user_type || 'parent') === 'parent') {
        const syncChildren = async () => {
          try {
            const { data: tableRecords } = await supabase
              .from('children')
              .select('*')
              .eq('parent_id', user.id)
              .order('created_at', { ascending: true });

            if (tableRecords && tableRecords.length > 0) {
              setChildTableRecords(tableRecords);
            } else if ((contextProfile.children || []).length > 0) {
              const records = (contextProfile.children || []).map(c => ({
                parent_id: user.id,
                name: c.name,
                age: String(c.age)
              }));
              const { data: inserted } = await supabase
                .from('children')
                .insert(records)
                .select();
              if (inserted) setChildTableRecords(inserted);
            }
          } catch (err) {
            console.error('Children sync error:', err);
          }
        };
        syncChildren();
      }
    }
  }, [user, contextProfile, contextLoading, router]);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (file.name.toLowerCase().endsWith('.heic')) { toast.error('صور HEIC غير مدعومة'); return; }
    if (!file.type.startsWith('image/')) { toast.error('الرجاء اختيار صورة صالحة'); return; }
    setTempImageFile(file);
    setShowImageEditor(true);
  };

  const handleImageEditorSave = (editedFile) => {
    setPendingAvatarFile(editedFile);
    setPreviewUrl(URL.createObjectURL(editedFile));
    setShowImageEditor(false);
    setTempImageFile(null);
    toast.success('تم تعديل الصورة - اضغط حفظ لتأكيد التغييرات');
  };

  const handlePhoneChange = (value) => setCurrentPhone(value.replace(/[^0-9+]/g, ''));

  const addRole = () => setCurrentMemberRoles([...currentMemberRoles, { rank: '', office: '' }]);
  const removeRole = (index) => {
    if (currentMemberRoles.length > 1) setCurrentMemberRoles(currentMemberRoles.filter((_, i) => i !== index));
    else toast.error('يجب أن يكون لديك منصب واحد على الأقل');
  };
  const updateRole = (index, field, value) => {
    const newRoles = [...currentMemberRoles];
    newRoles[index][field] = value;
    if (field === 'rank' && value === 'president') newRoles[index].office = ''; 
    setCurrentMemberRoles(newRoles);
  };

  const addChild = () => setCurrentChildren([...currentChildren, { name: '', age: '' }]);
  const removeChild = (index) => {
    if (currentChildren.length > 1) setCurrentChildren(currentChildren.filter((_, i) => i !== index));
    else toast.error('يجب أن يكون لديك طفل واحد على الأقل');
  };
  const updateChild = (index, field, value) => {
    const newChildren = [...currentChildren];
    newChildren[index][field] = field === 'age' ? value.replace(/[^0-9]/g, '') : value;
    setCurrentChildren(newChildren);
  };

  const cancelChildrenEdit = () => {
    setCurrentChildren([...originalChildren]);
    setEditingChildren(false);
  };

  const syncChildrenTable = async (parentId, children) => {
    try {
      const { data: existing } = await supabase
        .from('children')
        .select('id, name')
        .eq('parent_id', parentId);

      const existingByName = {};
      (existing || []).forEach(c => { existingByName[c.name] = c.id; });
      const currentNames = new Set(children.map(c => c.name));

      for (const child of children) {
        if (existingByName[child.name]) {
          await supabase.from('children')
            .update({ age: String(child.age), updated_at: new Date().toISOString() })
            .eq('id', existingByName[child.name]);
        } else {
          await supabase.from('children')
            .insert({ parent_id: parentId, name: child.name, age: String(child.age) });
        }
      }

      const toDelete = (existing || []).filter(c => !currentNames.has(c.name));
      if (toDelete.length > 0) {
        await supabase.from('children').delete().in('id', toDelete.map(c => c.id));
      }

      const { data: refreshed } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', parentId)
        .order('created_at', { ascending: true });

      return refreshed || [];
    } catch (err) {
      console.error('Children table sync error:', err);
      return [];
    }
  };

  const handleChildProfileUpdate = (updatedChild) => {
    setChildTableRecords(prev =>
      prev.map(c => c.id === updatedChild.id ? { ...c, ...updatedChild } : c)
    );
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    if (!currentName.trim()) { toast.error('الاسم مطلوب'); return; }
    
    if (currentUserType === 'parent') {
        const validChildren = currentChildren.filter(child => child.name.trim() && child.age);
        if (validChildren.length === 0) { toast.error('أدخل بيانات طفل واحد على الأقل'); return; }
    }
    
    if (currentUserType === 'member') {
        const validRoles = currentMemberRoles.filter(r => r.rank);
        if (validRoles.length === 0) { toast.error('أدخل منصب واحد على الأقل'); return; }
        for (let role of validRoles) {
            if (role.rank !== 'president' && !role.office) { toast.error('اختر المكتب لجميع المناصب'); return; }
        }
    }

    setSaving(true);
    const toastId = toast.loading('جاري حفظ التغييرات...');

    try {
      let newAvatarUrl = currentAvatarUrl;

      if (pendingAvatarFile) {
        const fileExt = pendingAvatarFile.name.split('.').pop() || 'jpg';
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, pendingAvatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        newAvatarUrl = urlData.publicUrl;
      }

      const updates = {
        id: user.id,
        parent_name: currentName,
        parent_phone: currentPhone,
        avatar_url: newAvatarUrl,
        user_type: currentUserType,
        updated_at: new Date(),
        children: currentUserType === 'parent' ? currentChildren : [],
        member_roles: currentUserType === 'member' ? currentMemberRoles : [],
        donor_party: currentUserType === 'donor' ? currentDonorParty : null,
      };

      const { error: upsertError } = await supabase.from('profiles').upsert(updates);
      if (upsertError) throw upsertError;

      const updatedProfile = { ...contextProfile, ...updates };
      updateProfile(updatedProfile);

      setOriginalName(currentName);
      setOriginalPhone(currentPhone);
      setOriginalAvatarUrl(newAvatarUrl);
      setOriginalUserType(currentUserType);
      setOriginalChildren(updates.children);
      setOriginalMemberRoles(updates.member_roles);
      setOriginalDonorParty(updates.donor_party);
      
      setPendingAvatarFile(null);
      setPreviewUrl('');
      setEditingName(false);
      setEditingPhone(false);
      setEditingUserType(false);
      setEditingChildren(false);
      setEditingMemberRoles(false);
      setEditingDonorParty(false);

      if (currentUserType === 'parent' && updates.children.length > 0) {
        const refreshed = await syncChildrenTable(user.id, updates.children);
        setChildTableRecords(refreshed);
      }
      toast.success('تم حفظ التغييرات بنجاح!', { id: toastId });
    } catch (error) {
      console.error('Save error:', error);
      toast.error(`حدث خطأ: ${error.message}`, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setCurrentName(originalName);
    setCurrentPhone(originalPhone);
    setCurrentAvatarUrl(originalAvatarUrl);
    setCurrentUserType(originalUserType);
    setCurrentChildren(originalChildren);
    setCurrentMemberRoles(originalMemberRoles);
    setCurrentDonorParty(originalDonorParty);
    setPendingAvatarFile(null);
    setPreviewUrl('');
    
    setEditingName(false);
    setEditingPhone(false);
    setEditingUserType(false);
    setEditingChildren(false);
    setEditingMemberRoles(false);
    setEditingDonorParty(false);
    
    toast('تم إلغاء التغييرات', { icon: '↩️' });
  };

  const displayAvatarUrl = previewUrl || currentAvatarUrl;

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  if (contextLoading || !profileReady) {
    return <ProfileSkeleton />;
  }

  return (
    <main className="min-h-screen bg-base-100 relative w-full max-w-[100vw] overflow-x-hidden pb-24" dir="rtl">
      
      {/* Background Decor */}
      <div className="absolute top-[40vh] right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3" />

      {/* ==========================================
          HERO SECTION (Cinematic & Deep)
      ========================================== */}
      <section className="relative bg-gradient-to-br from-neutral via-primary to-secondary pt-36 sm:pt-48 pb-40 sm:pb-52 px-4 overflow-hidden rounded-b-[3rem] sm:rounded-b-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full">
        {/* Updated blobs to match landing page gradient integration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neutral/30 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all mb-10 text-sm font-bold"
          >
            <FaArrowRight />
            الرئيسية
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
          >
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <FaUser className="text-4xl md:text-5xl text-white drop-shadow-md" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight text-white drop-shadow-md break-words"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            الملف الشخصي
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-white/80 font-light max-w-xl mx-auto leading-relaxed px-2 break-words"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            إدارة بياناتك وحسابك الشخصي في منصة قدوة
          </motion.p>
        </div>
      </section>

      {/* ==========================================
          PROFILE CONTENT (Overlapping Glass Card)
      ========================================== */}
      <section className="px-2 sm:px-4 -mt-24 sm:-mt-32 relative z-20 mb-20 w-full">
        <div className="max-w-3xl mx-auto w-full">
          <motion.div 
            className="bg-white/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/60 min-w-0"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            
            {/* AVATAR */}
            <motion.div variants={fadeInUp} className="flex justify-center -mt-16 sm:-mt-20 mb-8">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden bg-base-100">
                  {displayAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={displayAvatarUrl} alt="صورة الملف الشخصي" className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <FaUser className="text-4xl text-primary/30" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border-2 border-white"
                >
                  <FaCamera className="text-sm" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </div>
            </motion.div>

            {/* HEADER / NAME / ROLE */}
            <motion.div variants={fadeInUp} className="text-center mb-10 w-full">
              <div className="flex items-center justify-center gap-2 mb-2 w-full">
                 {editingName ? (
                     <div className="flex gap-2 items-center w-full max-w-sm mx-auto">
                        <input 
                           type="text" 
                           value={currentName} 
                           onChange={(e) => setCurrentName(e.target.value)}
                           className="w-full bg-base-100 border border-base-300 text-base-content text-center font-bold px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-w-0"
                           placeholder="الاسم"
                        />
                        <button onClick={() => setEditingName(false)} className="w-10 h-10 rounded-xl bg-base-200 text-base-content/60 hover:bg-base-300 flex items-center justify-center shrink-0 transition-colors"><FaTimes /></button>
                     </div>
                 ) : (
                     <h2 className="text-2xl sm:text-3xl font-black text-base-content flex items-center gap-3 break-words justify-center">
                        {currentName || 'مستخدم جديد'}
                        <button onClick={() => setEditingName(true)} className="text-base-content/40 hover:text-primary transition-colors text-sm sm:text-base shrink-0"><FaEdit /></button>
                     </h2>
                 )}
              </div>
              
              <p className="text-base-content/60 text-sm font-medium" dir="ltr">{user?.email}</p>

              {/* USER TYPE DROPDOWN */}
              <div className="mt-6 flex justify-center items-center w-full">
                 {editingUserType ? (
                    <div className="flex gap-2 items-center w-full max-w-sm mx-auto">
                       <CustomDropdown
                          value={currentUserType}
                          options={userTypeLabels}
                          onChange={(val) => {
                              setCurrentUserType(val);
                              if(val === 'member' && currentMemberRoles.length === 0) {
                                  setCurrentMemberRoles([{rank: '', office: ''}]);
                              }
                              if(val === 'member') setEditingMemberRoles(true);
                              if(val === 'donor') setEditingDonorParty(true);
                              if(val === 'parent') setEditingChildren(true);
                          }}
                          className="bg-white border border-base-300 text-base-content font-bold px-5 py-3 rounded-[1.2rem] shadow-[0_2px_15px_rgb(0,0,0,0.03)]"
                          placeholder="اختر النوع..."
                       />
                       <button onClick={() => setEditingUserType(false)} className="w-12 h-12 rounded-[1.2rem] bg-base-200 text-base-content/60 hover:bg-base-300 flex items-center justify-center shrink-0 transition-colors shadow-inner"><FaTimes /></button>
                    </div>
                 ) : (
                    <div className="inline-flex items-center gap-3 bg-white border border-base-300 shadow-sm px-6 py-2.5 rounded-[1.2rem]">
                       <FaUserTag className="text-primary" /> 
                       <span className="font-bold text-base-content/90">{userTypeLabels[currentUserType] || 'مستخدم'}</span>
                       <button onClick={() => setEditingUserType(true)} className="text-base-content/40 hover:text-primary transition-colors text-sm ml-2 border-r border-base-300 pr-3"><FaEdit /></button>
                    </div>
                 )}
              </div>
            </motion.div>

            <div className="space-y-6 w-full">

              {/* MEMBER INFO */}
              {currentUserType === 'member' && (
                <motion.div variants={fadeInUp} className="bg-base-100 border border-base-200 rounded-[1.5rem] p-6 w-full shadow-sm">
                   <div className="flex items-center justify-between mb-5">
                      <h3 className="font-black text-base-content flex items-center gap-2">
                          <FaIdBadge className="text-primary" /> تفاصيل العضوية
                      </h3>
                      {!editingMemberRoles ? (
                          <button onClick={() => setEditingMemberRoles(true)} className="text-primary text-sm font-bold flex items-center gap-1 hover:text-primary/80"><FaEdit /> تعديل</button>
                      ) : (
                          <button onClick={() => setEditingMemberRoles(false)} className="text-base-content/60 text-sm font-bold flex items-center gap-1 hover:text-base-content/90"><FaTimes /> إغلاق</button>
                      )}
                   </div>

                   <div className="space-y-3 w-full">
                      {currentMemberRoles.length > 0 ? (
                          currentMemberRoles.map((role, idx) => (
                              <div key={idx} className={`bg-white p-4 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-base-200 flex flex-col gap-2 relative w-full min-w-0 ${editingMemberRoles ? 'pr-10' : ''}`}>
                                  {editingMemberRoles ? (
                                      <div className="space-y-3 w-full relative">
                                          {currentMemberRoles.length > 1 && (
                                              <button onClick={() => removeRole(idx)} className="absolute -top-1 right-2 text-error hover:bg-error/10 p-2 rounded-lg transition-colors z-10"><FaTrash size={14}/></button>
                                          )}
                                          
                                          <CustomDropdown
                                            value={role.rank}
                                            options={rankLabels}
                                            onChange={(val) => updateRole(idx, 'rank', val)}
                                            className="bg-base-100 border border-base-300 text-base-content/90 font-bold px-4 py-3 rounded-xl shadow-inner text-sm"
                                            placeholder="اختر المنصب..."
                                          />

                                          {role.rank !== 'president' && (
                                            <CustomDropdown
                                              value={role.office}
                                              options={officeLabels}
                                              onChange={(val) => updateRole(idx, 'office', val)}
                                              className="bg-base-100 border border-base-300 text-base-content/90 font-bold px-4 py-3 rounded-xl shadow-inner text-sm"
                                              placeholder="اختر المكتب..."
                                            />
                                          )}
                                      </div>
                                  ) : (
                                      <div className="flex items-center gap-4 w-full min-w-0">
                                          <div className="bg-primary/10 w-12 h-12 rounded-[1rem] flex items-center justify-center text-primary shrink-0"><FaSitemap className="text-lg" /></div>
                                          <div className="min-w-0">
                                              <div className="font-black text-base-content break-words">{rankLabels[role.rank] || role.rank}</div>
                                              {role.office && <div className="text-xs text-base-content/60 font-medium mt-1 break-words">{officeLabels[role.office] || role.office}</div>}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          ))
                      ) : (
                          <p className="text-base-content/40 text-sm font-medium text-center py-4">لا توجد مناصب مسجلة</p>
                      )}
                      {editingMemberRoles && <button onClick={addRole} className="w-full py-3 rounded-xl bg-primary/10 text-primary font-bold border border-primary/20 hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 mt-2"><FaPlus /> إضافة منصب</button>}
                   </div>
                </motion.div>
              )}

              {/* DONOR INFO */}
              {currentUserType === 'donor' && (
                <motion.div variants={fadeInUp} className="bg-base-100 border border-base-200 rounded-[1.5rem] p-6 w-full shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                       <h3 className="font-black text-base-content flex items-center gap-2"><FaBuilding className="text-warning" /> معلومات الجهة المانحة</h3>
                       {!editingDonorParty ? (
                          <button onClick={() => setEditingDonorParty(true)} className="text-primary text-sm font-bold flex items-center gap-1 hover:text-primary/80"><FaEdit /> تعديل</button>
                       ) : (
                          <button onClick={() => setEditingDonorParty(false)} className="text-base-content/60 text-sm font-bold flex items-center gap-1 hover:text-base-content/90"><FaTimes /> إغلاق</button>
                       )}
                   </div>
                   {editingDonorParty ? (
                       <div className="space-y-2 w-full">
                          <input type="text" value={currentDonorParty} onChange={(e) => setCurrentDonorParty(e.target.value)} className="w-full bg-white border border-base-300 text-base-content font-medium px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-warning/50 transition-all min-w-0" placeholder="اسم الجهة (اختياري)" />
                          <p className="text-xs font-medium text-base-content/40">اتركه فارغاً إذا كنت داعماً بصفة شخصية</p>
                       </div>
                   ) : (
                      <p className="text-lg font-bold text-base-content/90 break-words bg-white border border-base-300 px-4 py-3 rounded-xl shadow-sm">{currentDonorParty || 'داعم بصفة شخصية'}</p>
                   )}
                </motion.div>
              )}

              {/* CHILDREN */}
              {currentUserType === 'parent' && (
                <motion.div variants={fadeInUp} className="bg-base-100 border border-base-200 rounded-[1.5rem] p-6 w-full shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-black text-base-content flex items-center gap-2"><FaChild className="text-primary" /> الأبناء المسجلين</h3>
                    {!editingChildren ? (
                      <button onClick={() => setEditingChildren(true)} className="text-primary text-sm font-bold flex items-center gap-1 hover:text-primary/80"><FaEdit /> تعديل</button>
                    ) : (
                      <button onClick={cancelChildrenEdit} className="text-base-content/60 text-sm font-bold flex items-center gap-1 hover:text-base-content/90"><FaTimes /> إغلاق</button>
                    )}
                  </div>
                  {currentChildren.length > 0 || editingChildren ? (
                    <div className="space-y-3 w-full">
                      {currentChildren.map((child, index) => (
                        <div key={index} className={`p-5 rounded-[1.2rem] w-full min-w-0 border ${editingChildren ? 'bg-white border-base-300 shadow-sm' : 'bg-white border-base-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)]'}`}>
                          {editingChildren ? (
                            <div className="space-y-4 w-full">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/10">الشاب {index + 1}</span>
                                {currentChildren.length > 1 && <button onClick={() => removeChild(index)} className="w-8 h-8 rounded-lg bg-error/10 text-error hover:bg-error/20 flex items-center justify-center transition-colors"><FaTrash size={12} /></button>}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                <input type="text" value={child.name} onChange={(e) => updateChild(index, 'name', e.target.value)} className="w-full bg-base-100 border border-base-300 text-base-content font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all min-w-0" placeholder="الاسم الكامل" />
                                <input type="text" inputMode="numeric" value={child.age} onChange={(e) => updateChild(index, 'age', e.target.value)} className="w-full bg-base-100 border border-base-300 text-base-content font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all min-w-0" placeholder="العمر (أرقام فقط)" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 w-full min-w-0">
                              <span className="font-bold text-base-content break-words flex-1 min-w-0">{child.name}</span>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1.5 rounded-full border border-primary/10">{child.age} سنة</span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const record = childTableRecords.find(r => r.name === child.name);
                                    if (record) {
                                      setSelectedChildForProfile(record);
                                    } else {
                                      toast('جاري تحميل البيانات...', { icon: '⏳' });
                                    }
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-base-200 hover:bg-base-300 text-base-content/80 font-bold rounded-full text-xs transition-colors"
                                  title="بطاقة تعريف الشاب"
                                >
                                  <FaIdBadge className="text-base-content/40" /> البطاقة
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {editingChildren && <button onClick={addChild} className="w-full py-3 rounded-[1.2rem] bg-primary/10 text-primary font-bold border border-primary/20 hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 mt-2"><FaPlus /> إضافة طفل آخر</button>}
                    </div>
                  ) : (
                     <p className="text-base-content/40 font-medium text-center py-6 bg-white border border-base-200 rounded-2xl">لم يتم إضافة أبناء</p>
                  )}
                </motion.div>
              )}

              {/* PHONE */}
              <motion.div variants={fadeInUp} className="bg-base-100 border border-base-200 rounded-[1.5rem] p-6 w-full shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-base-content flex items-center gap-2"><FaPhone className="text-success" /> رقم الهاتف</h3>
                  {!editingPhone && <button onClick={() => setEditingPhone(true)} className="text-primary text-sm font-bold flex items-center gap-1 hover:text-primary/80"><FaEdit /> تعديل</button>}
                </div>
                {editingPhone ? (
                  <div className="relative flex items-center gap-2 w-full max-w-sm">
                    <input type="tel" value={currentPhone} onChange={(e) => handlePhoneChange(e.target.value)} dir="ltr" className="w-full bg-white border border-base-300 text-base-content font-medium px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-success/50 transition-all min-w-0 text-left" placeholder="+963..." />
                    <button onClick={() => setEditingPhone(false)} className="w-12 h-12 rounded-xl bg-base-200 text-base-content/60 hover:bg-base-300 flex items-center justify-center shrink-0 transition-colors"><FaTimes /></button>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-base-content/90 break-words bg-white border border-base-300 px-4 py-3 rounded-xl shadow-sm inline-block" dir="ltr">{currentPhone || 'لم يتم إضافة رقم'}</p>
                )}
              </motion.div>

              {/* UNSAVED CHANGES BANNER */}
              <AnimatePresence>
                {hasChanges && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden w-full"
                  >
                    <div className="bg-warning/10 border border-warning/30 rounded-[1.5rem] p-5 text-center shadow-inner mb-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                      <span className="w-8 h-8 rounded-full bg-warning/20 text-warning flex items-center justify-center shrink-0"><FaInfoCircle /></span>
                      <p className="text-base-content font-bold text-sm">لديك تغييرات غير محفوظة في ملفك الشخصي.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTIONS */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                <button 
                  onClick={handleSaveChanges} 
                  disabled={!hasChanges || saving} 
                  className={`py-4 px-6 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 flex-1 w-full ${hasChanges ? 'bg-primary text-white shadow-[0_8px_20px_rgba(var(--color-primary),0.3)] hover:scale-[1.02] active:scale-[0.98]' : 'bg-base-200 text-base-content/40 cursor-not-allowed'}`}
                >
                  {saving ? <span className="loading loading-spinner"></span> : <><FaCheck /> حفظ التغييرات</>}
                </button>
                {hasChanges && (
                  <button 
                    onClick={handleDiscardChanges} 
                    className="py-4 px-6 rounded-[1.5rem] font-bold text-base-content/60 bg-white border border-base-300 hover:bg-base-200 hover:text-base-content transition-colors w-full sm:w-auto"
                  >
                    إلغاء
                  </button>
                )}
              </motion.div>

              {/* SOCIAL */}
              <motion.div variants={fadeInUp} className="bg-base-100 border border-base-200 rounded-[2rem] p-8 w-full mt-10 text-center">
                <h3 className="font-black text-base-content mb-6 tracking-tight">تواصل معنا</h3>
                <div className="flex flex-wrap gap-4 justify-center text-base-content/50">
                  <a href="https://www.instagram.com/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white rounded-[1rem] shadow-sm border border-base-200 flex items-center justify-center hover:text-secondary hover:scale-110 hover:border-secondary/30 transition-all"><FaInstagram className="text-xl" /></a>
                  <a href="https://www.facebook.com/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white rounded-[1rem] shadow-sm border border-base-200 flex items-center justify-center hover:text-primary hover:scale-110 hover:border-primary/30 transition-all"><FaFacebook className="text-xl" /></a>
                  <a href="https://t.me/QudwaAssoc" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white rounded-[1rem] shadow-sm border border-base-200 flex items-center justify-center hover:text-secondary hover:scale-110 hover:border-secondary/30 transition-all"><FaTelegramPlane className="text-xl" /></a>
                  <a href="https://wa.me/963980931111" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white rounded-[1rem] shadow-sm border border-base-200 flex items-center justify-center hover:text-success hover:scale-110 hover:border-success/30 transition-all"><FaWhatsapp className="text-xl" /></a>
                  <a href="mailto:qudwa.ltk@gmail.com" className="w-12 h-12 bg-white rounded-[1rem] shadow-sm border border-base-200 flex items-center justify-center hover:text-base-content hover:scale-110 hover:border-base-300 transition-all"><FaEnvelope className="text-xl" /></a>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      {selectedChildForProfile && (
        <ChildProfileModal
          child={selectedChildForProfile}
          parentId={user.id}
          isAdmin={isAdmin}
          isOwner={true}
          onClose={() => setSelectedChildForProfile(null)}
          onUpdate={handleChildProfileUpdate}
        />
      )}

      {showImageEditor && tempImageFile && (
        <ImageEditorModal
          imageFile={tempImageFile}
          onSave={handleImageEditorSave}
          onClose={() => setShowImageEditor(false)}
        />
      )}
    </main>
  );
}