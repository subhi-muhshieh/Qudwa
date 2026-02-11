'use client'
import { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaCamera, FaPhone, FaEnvelope, FaInstagram, FaFacebook, 
  FaTelegramPlane, FaWhatsapp, FaUser, FaChild, FaSave, 
  FaEdit, FaPlus, FaTrash, FaTimes, FaArrowRight,
  FaSitemap, FaBuilding, FaIdBadge, FaUserTag
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useProfile } from '../context/ProfileContext';
import ImageEditorModal from '../components/ImageEditorModal';

export default function ProfilePage() {
  const { user, profile: contextProfile, updateProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // --- STATE FOR ORIGINAL DATA (To detect changes) ---
  const [originalName, setOriginalName] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState('');
  const [originalUserType, setOriginalUserType] = useState('parent');
  const [originalChildren, setOriginalChildren] = useState([]);
  const [originalMemberRoles, setOriginalMemberRoles] = useState([]);
  const [originalDonorParty, setOriginalDonorParty] = useState('');
  
  // --- STATE FOR CURRENT EDITS ---
  const [currentName, setCurrentName] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');
  const [currentUserType, setCurrentUserType] = useState('parent');
  const [currentChildren, setCurrentChildren] = useState([]);
  const [currentMemberRoles, setCurrentMemberRoles] = useState([]);
  const [currentDonorParty, setCurrentDonorParty] = useState('');
  
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // --- UI TOGGLES ---
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingUserType, setEditingUserType] = useState(false);
  const [editingChildren, setEditingChildren] = useState(false);
  const [editingMemberRoles, setEditingMemberRoles] = useState(false);
  const [editingDonorParty, setEditingDonorParty] = useState(false);

  const [showImageEditor, setShowImageEditor] = useState(false);
  const [tempImageFile, setTempImageFile] = useState(null);
  
  const fileInputRef = useRef(null);
  const supabase = createClient();
  const router = useRouter();

  // --- DATA LISTS ---
  const userTypeLabels = {
    'parent': 'ولي أمر',
    'member': 'عضو جمعية',
    'volunteer': 'متطوع',
    'donor': 'داعم/مانح'
  };

  const officeLabels = {
    'activity': 'مكتب الأنشطة',
    'media': 'المكتب الإعلامي',
    'scientific': 'المكتب العلمي',
    'logistic': 'المكتب اللوجستي'
  };

  const rankLabels = {
    'president': 'رئيس الجمعية',
    'vice_president': 'نائب رئيس الجمعية',
    'office_manager': 'مدير مكتب',
    'secretary': 'أمين سر',
    'monetary_manager': 'مدير مالي',
    'member': 'عضو'
  };

  // --- CHANGE DETECTION ---
  const hasChanges = 
    currentName !== originalName ||
    currentPhone !== originalPhone ||
    currentUserType !== originalUserType ||
    currentDonorParty !== originalDonorParty ||
    JSON.stringify(currentChildren) !== JSON.stringify(originalChildren) ||
    JSON.stringify(currentMemberRoles) !== JSON.stringify(originalMemberRoles) ||
    pendingAvatarFile !== null;

  // --- INITIALIZATION ---
  useEffect(() => {
    if (!user) { router.push('/login'); return; }

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
      
      setLoading(false);
    }
  }, [user, contextProfile, router]);

  // --- AVATAR HANDLERS ---
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

  // --- GENERAL HANDLERS ---
  const handlePhoneChange = (value) => setCurrentPhone(value.replace(/[^0-9+]/g, ''));

  // --- MEMBER ROLE HANDLERS ---
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

  // --- CHILDREN HANDLERS ---
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

  // *** FIXED: RE-ADDED THIS FUNCTION ***
  const cancelChildrenEdit = () => {
    setCurrentChildren([...originalChildren]);
    setEditingChildren(false);
  };

  // --- SAVE LOGIC ---
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 py-24 px-4">
      <div className="max-w-2xl mx-auto">

        <Link href="/dashboard" className="btn btn-ghost btn-sm rounded-xl gap-2 mb-6">
          <FaArrowRight /> العودة للرئيسية
        </Link>
        
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
          
          <div className="h-32 bg-gradient-to-r from-primary to-accent"></div>
          
          <div className="px-8 pb-8">
            
            {/* AVATAR */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-base-200">
                  {displayAvatarUrl ? (
                    <img src={displayAvatarUrl} alt="Profile" className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <FaUser className="text-4xl text-primary/50" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary shadow-lg"
                >
                  <FaCamera />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </div>
            </div>

            {/* HEADER */}
            <div className="text-center mb-8">
              
              {/* Name Edit */}
              <div className="flex items-center justify-center gap-2 mb-1">
                 {editingName ? (
                     <div className="flex gap-2 items-center">
                        <input 
                           type="text" 
                           value={currentName} 
                           onChange={(e) => setCurrentName(e.target.value)}
                           className="input input-sm input-bordered text-center w-full max-w-xs"
                           placeholder="الاسم"
                        />
                        <button onClick={() => setEditingName(false)} className="btn btn-xs btn-circle btn-ghost"><FaTimes /></button>
                     </div>
                 ) : (
                     <h1 className="text-2xl font-bold text-neutral flex items-center gap-2">
                        {currentName}
                        <button onClick={() => setEditingName(true)} className="text-gray-400 text-sm hover:text-primary"><FaEdit /></button>
                     </h1>
                 )}
              </div>
              
              <p className="text-gray-500 text-sm" dir="ltr">{user?.email}</p>

              {/* User Type Edit */}
              <div className="mt-3 flex justify-center items-center gap-2">
                 {editingUserType ? (
                    <div className="flex gap-2 items-center">
                       <select 
                          className="select select-sm select-bordered"
                          value={currentUserType}
                          onChange={(e) => {
                              setCurrentUserType(e.target.value);
                              if(e.target.value === 'member' && currentMemberRoles.length === 0) {
                                  setCurrentMemberRoles([{rank: '', office: ''}]);
                              }
                              if(e.target.value === 'member') setEditingMemberRoles(true);
                              if(e.target.value === 'donor') setEditingDonorParty(true);
                              if(e.target.value === 'parent') setEditingChildren(true);
                          }}
                       >
                           {Object.entries(userTypeLabels).map(([key, label]) => (
                               <option key={key} value={key}>{label}</option>
                           ))}
                       </select>
                       <button onClick={() => setEditingUserType(false)} className="btn btn-xs btn-circle btn-ghost"><FaTimes /></button>
                    </div>
                 ) : (
                    <span className="badge badge-lg badge-outline gap-2 py-3 px-4">
                       <FaUserTag /> {userTypeLabels[currentUserType] || 'مستخدم'}
                       <button onClick={() => setEditingUserType(true)} className="hover:text-primary"><FaEdit /></button>
                    </span>
                 )}
              </div>
            </div>

            {/* --- 1. MEMBER INFO --- */}
            {currentUserType === 'member' && (
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                        <FaIdBadge /> تفاصيل العضوية
                    </h3>
                    {!editingMemberRoles ? (
                        <button onClick={() => setEditingMemberRoles(true)} className="btn btn-ghost btn-sm text-primary"><FaEdit /> تعديل</button>
                    ) : (
                        <button onClick={() => setEditingMemberRoles(false)} className="btn btn-ghost btn-sm text-gray-500"><FaTimes /> إغلاق</button>
                    )}
                 </div>

                 <div className="space-y-3">
                    {currentMemberRoles.length > 0 ? (
                        currentMemberRoles.map((role, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-xl shadow-sm flex flex-col gap-2 border border-gray-100 relative">
                                {editingMemberRoles ? (
                                    <div className="space-y-2 pt-1">
                                        {currentMemberRoles.length > 1 && (
                                            <button onClick={() => removeRole(idx)} className="absolute top-2 left-2 text-error hover:bg-error/10 p-1 rounded-full"><FaTrash size={12}/></button>
                                        )}
                                        <select className="select select-bordered select-sm w-full" value={role.rank} onChange={(e) => updateRole(idx, 'rank', e.target.value)}>
                                            <option value="" disabled>اختر المنصب...</option>
                                            {Object.entries(rankLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                        </select>
                                        {role.rank !== 'president' && (
                                            <select className="select select-bordered select-sm w-full" value={role.office} onChange={(e) => updateRole(idx, 'office', e.target.value)}>
                                                <option value="" disabled>اختر المكتب...</option>
                                                {Object.entries(officeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                            </select>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary"><FaSitemap /></div>
                                        <div>
                                            <div className="font-bold text-neutral">{rankLabels[role.rank] || role.rank}</div>
                                            {role.office && <div className="text-xs text-gray-500">{officeLabels[role.office] || role.office}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">لا توجد مناصب مسجلة</p>
                    )}
                    {editingMemberRoles && <button onClick={addRole} className="btn btn-outline btn-primary btn-sm w-full rounded-xl gap-2 border-dashed mt-2"><FaPlus /> إضافة منصب</button>}
                 </div>
              </div>
            )}

            {/* --- 2. DONOR INFO --- */}
            {currentUserType === 'donor' && (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-6">
                 <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-orange-600 flex items-center gap-2"><FaBuilding /> معلومات الجهة المانحة</h3>
                     {!editingDonorParty ? (
                        <button onClick={() => setEditingDonorParty(true)} className="btn btn-ghost btn-sm text-orange-600"><FaEdit /> تعديل</button>
                     ) : (
                        <button onClick={() => setEditingDonorParty(false)} className="btn btn-ghost btn-sm text-gray-500"><FaTimes /> إغلاق</button>
                     )}
                 </div>
                 {editingDonorParty ? (
                     <div className="space-y-1">
                        <input type="text" value={currentDonorParty} onChange={(e) => setCurrentDonorParty(e.target.value)} className="input input-bordered w-full bg-white" placeholder="اسم الجهة (اختياري)" />
                        <p className="text-[10px] text-gray-400">اتركه فارغاً إذا كنت داعماً بصفة شخصية</p>
                     </div>
                 ) : (
                    <p className="text-lg text-neutral">{currentDonorParty || 'داعم بصفة شخصية'}</p>
                 )}
              </div>
            )}

            {/* --- 3. CHILDREN (Parent Only) --- */}
            {currentUserType === 'parent' && (
              <div className="bg-base-100 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-primary flex items-center gap-2"><FaChild /> الأبناء المسجلين</h3>
                  {!editingChildren ? (
                    <button onClick={() => setEditingChildren(true)} className="btn btn-ghost btn-sm text-primary"><FaEdit /> تعديل</button>
                  ) : (
                    <button onClick={cancelChildrenEdit} className="btn btn-ghost btn-sm text-gray-500"><FaTimes /> إغلاق</button>
                  )}
                </div>
                {currentChildren.length > 0 || editingChildren ? (
                  <div className="space-y-3">
                    {currentChildren.map((child, index) => (
                      <div key={index} className={`p-4 rounded-xl ${editingChildren ? 'bg-base-200' : 'bg-base-200/50'}`}>
                        {editingChildren ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">الطفل {index + 1}</span>
                              {currentChildren.length > 1 && <button onClick={() => removeChild(index)} className="btn btn-ghost btn-xs text-error"><FaTrash /></button>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input type="text" value={child.name} onChange={(e) => updateChild(index, 'name', e.target.value)} className="input input-bordered input-sm w-full" placeholder="اسم الطفل" />
                              <input type="text" inputMode="numeric" value={child.age} onChange={(e) => updateChild(index, 'age', e.target.value)} className="input input-bordered input-sm w-full" placeholder="العمر" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{child.name}</span>
                            <span className="badge badge-primary">{child.age} سنة</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {editingChildren && <button onClick={addChild} className="btn btn-outline btn-primary btn-sm w-full rounded-xl gap-2"><FaPlus /> إضافة طفل آخر</button>}
                  </div>
                ) : (
                   <p className="text-gray-500 text-center">لم يتم إضافة أبناء</p>
                )}
              </div>
            )}

            {/* --- 4. PHONE NUMBER --- */}
            <div className="bg-base-100 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-primary flex items-center gap-2"><FaPhone /> رقم الهاتف</h3>
                {!editingPhone && <button onClick={() => setEditingPhone(true)} className="btn btn-ghost btn-sm text-primary"><FaEdit /> تعديل</button>}
              </div>
              {editingPhone ? (
                <div className="relative"><input type="tel" value={currentPhone} onChange={(e) => handlePhoneChange(e.target.value)} dir="ltr" className="input input-bordered w-full text-left" placeholder="رقم الهاتف" /></div>
              ) : (
                <p className="text-lg" dir="ltr">{currentPhone || 'لم يتم إضافة رقم'}</p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleSaveChanges} disabled={!hasChanges || saving} className={`btn flex-1 rounded-xl gap-2 text-white ${hasChanges ? 'btn-primary shadow-lg' : 'btn-disabled bg-gray-300'}`}>
                {saving ? <span className="loading loading-spinner"></span> : <><FaSave /> حفظ التغييرات</>}
              </button>
              {hasChanges && <button onClick={handleDiscardChanges} className="btn btn-ghost rounded-xl">إلغاء</button>}
            </div>

            {/* SOCIAL */}
            <div className="bg-base-100 rounded-2xl p-6">
              <h3 className="font-bold text-primary mb-4">تواصل معنا</h3>
              <div className="flex flex-wrap gap-4 justify-center text-2xl text-secondary">
                <a href="https://www.instagram.com/QudwaAssoc" target="_blank"><FaInstagram className="hover:text-primary transition-colors" /></a>
                <a href="https://www.facebook.com/QudwaAssoc" target="_blank"><FaFacebook className="hover:text-primary transition-colors" /></a>
                <a href="https://t.me/QudwaAssoc" target="_blank"><FaTelegramPlane className="hover:text-primary transition-colors" /></a>
                <a href="https://wa.me/963980931111" target="_blank"><FaWhatsapp className="hover:text-primary transition-colors" /></a>
                <a href="mailto:qudwa.ltk@gmail.com"><FaEnvelope className="hover:text-primary transition-colors" /></a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {showImageEditor && tempImageFile && (
        <ImageEditorModal
          imageFile={tempImageFile}
          onSave={handleImageEditorSave}
          onClose={() => setShowImageEditor(false)}
        />
      )}
    </div>
  );
}