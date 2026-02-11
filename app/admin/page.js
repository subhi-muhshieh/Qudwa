'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabase/client';
import { useProfile } from '../context/ProfileContext';
import { userTypeLabels, rankLabels, officeLabels } from '../utils/constants';
import { 
  FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaImage, FaTimes, FaStar, 
  FaHistory, FaSpinner, FaExclamationTriangle, FaUsers, FaLink, FaSync, 
  FaImages, FaUserFriends, FaChild, FaPhone, FaEnvelope, FaChevronDown, 
  FaChevronUp, FaSearch, FaUserTag, FaClipboardList, FaEye
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { updateActivityStatuses } from '../utils/activityHelpers'; 
import ActivityPhotoManager from '../components/ActivityPhotoManager';

export default function AdminDashboard() {
  // --- ACTIVITIES STATE ---
  const [activities, setActivities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const [photoManagerActivity, setPhotoManagerActivity] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_report: '',
    activity_date: '',
    start_time: '',
    end_time: '',
    notable_notes: '',
    image_url: '',
    registration_form_url: '',
    capacity: 20,
    is_upcoming: false
  });

  // --- USERS STATE ---
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [expandedUser, setExpandedUser] = useState(null);

  // --- REGISTRATIONS STATE ---
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [expandedRegistration, setExpandedRegistration] = useState(null);

  // --- ACTIVE TAB ---
  const [activeTab, setActiveTab] = useState('activities');

  const supabase = createClient();
  const router = useRouter();
  const { profile: userProfile } = useProfile();

  // --- ADMIN GUARD ---
  useEffect(() => {
    if (userProfile && userProfile.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [userProfile, router]);

  // ==========================================
  //  INITIALIZATION
  // ==========================================
  useEffect(() => {
    const initializeData = async () => {
      await updateActivityStatuses(supabase);
      fetchActivities();
      fetchMessages();
    };
    initializeData();
  }, []);

  // ==========================================
  //  ACTIVITIES FUNCTIONS
  // ==========================================
  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('activity_date', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const sortedData = data.sort((a, b) => {
          if (a.activity_date && b.activity_date) {
            return new Date(b.activity_date) - new Date(a.activity_date);
          }
          if (!a.activity_date) return 1;
          if (!b.activity_date) return -1;
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setActivities(sortedData);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('فشل تحميل النشاطات');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncStatuses = async () => {
    setSyncing(true);
    const toastId = toast.loading('جاري تحديث حالة النشاطات...');
    try {
      const updatedCount = await updateActivityStatuses(supabase);
      await fetchActivities();
      if (updatedCount > 0) {
        toast.success(`تم تحديث ${updatedCount} نشاط تلقائياً`, { id: toastId });
      } else {
        toast.success('جميع النشاطات محدثة بالفعل', { id: toastId });
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء التحديث', { id: toastId });
    } finally {
      setSyncing(false);
    }
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setMessages(data);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('الرجاء اختيار صورة صالحة'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('حجم الصورة يجب أن يكون أقل من 5 ميغابايت'); return; }

    setUploading(true);
    const toastId = toast.loading('جاري رفع الصورة...');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('activity-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('activity-images').getPublicUrl(fileName);
      setFormData({ ...formData, image_url: urlData.publicUrl });
      toast.success('تم رفع الصورة بنجاح!', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('فشل رفع الصورة', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(editingId ? 'جاري التحديث...' : 'جاري الإضافة...');
    try {
      const cleanFormData = { ...formData, registration_form_url: formData.registration_form_url?.trim() || null };
      if (editingId) {
        const { error } = await supabase.from('activities').update(cleanFormData).eq('id', editingId);
        if (error) throw error;
        toast.success('تم التحديث بنجاح!', { id: toastId });
      } else {
        const { error } = await supabase.from('activities').insert([cleanFormData]);
        if (error) throw error;
        toast.success('تم الإضافة بنجاح!', { id: toastId });
      }
      resetForm();
      fetchActivities();
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء الحفظ', { id: toastId });
    }
  };

  const promptDelete = (id, imageUrl) => setItemToDelete({ id, imageUrl });

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const toastId = toast.loading('جاري الحذف...');
    try {
      if (itemToDelete.imageUrl && itemToDelete.imageUrl.includes('activity-images')) {
        const imagePath = itemToDelete.imageUrl.split('/activity-images/')[1];
        if (imagePath) await supabase.storage.from('activity-images').remove([imagePath]);
      }
      const { error } = await supabase.from('activities').delete().eq('id', itemToDelete.id);
      if (error) throw error;
      toast.success('تم الحذف!', { id: toastId });
      fetchActivities();
      setItemToDelete(null);
    } catch (error) {
      toast.error('فشل الحذف!', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (activity) => {
    setFormData({ ...activity, capacity: activity.capacity || 20, registration_form_url: activity.registration_form_url || '' });
    setEditingId(activity.id);
    setIsAddingNew(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ title: '', short_description: '', full_report: '', activity_date: '', start_time: '', end_time: '', notable_notes: '', image_url: '', registration_form_url: '', capacity: 20, is_upcoming: false });
    setEditingId(null);
    setIsAddingNew(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ==========================================
  //  USERS FUNCTIONS
  // ==========================================
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('فشل تحميل المستخدمين');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      fetchUsers();
    }
  }, [activeTab]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      !userSearch || 
      (user.parent_name && user.parent_name.toLowerCase().includes(userSearch.toLowerCase())) ||
      (user.parent_phone && user.parent_phone.includes(userSearch)) ||
      (user.id && user.id.includes(userSearch));
    
    const matchesType = userTypeFilter === 'all' || user.user_type === userTypeFilter;
    
    return matchesSearch && matchesType;
  });

  // ==========================================
  //  REGISTRATIONS FUNCTIONS
  // ==========================================
  const fetchRegistrations = async (activityId) => {
    setRegistrationsLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_registrations')
        .select(`
          id,
          created_at,
          user_id,
          activity_id,
          profiles (
            id,
            parent_name,
            parent_phone,
            avatar_url,
            user_type,
            children,
            member_roles,
            donor_party
          )
        `)
        .eq('activity_id', activityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('فشل تحميل التسجيلات');
    } finally {
      setRegistrationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'registrations' && selectedEventId) {
      fetchRegistrations(selectedEventId);
    }
  }, [activeTab, selectedEventId]);

  useEffect(() => {
    if (activeTab === 'registrations' && !selectedEventId) {
      const upcomingActivities = activities.filter(a => a.is_upcoming);
      if (upcomingActivities.length > 0) {
        setSelectedEventId(upcomingActivities[0].id);
      }
    }
  }, [activeTab, activities]);

  const upcomingActivities = activities.filter(a => a.is_upcoming);

  // ==========================================
  //  RENDER
  // ==========================================
  if (loading || !userProfile || userProfile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">لوحة التحكم الإدارية</h1>
          <p className="text-base-content/60">إدارة النشاطات والمستخدمين والتسجيلات</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setActiveTab('activities')}
            className={`btn rounded-2xl gap-2 ${activeTab === 'activities' ? 'btn-primary text-white shadow-lg' : 'btn-ghost bg-base-100'}`}
          >
            <FaStar /> النشاطات
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`btn rounded-2xl gap-2 ${activeTab === 'users' ? 'btn-primary text-white shadow-lg' : 'btn-ghost bg-base-100'}`}
          >
            <FaUsers /> المستخدمون
            {users.length > 0 && <span className="badge badge-sm">{users.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`btn rounded-2xl gap-2 ${activeTab === 'registrations' ? 'btn-primary text-white shadow-lg' : 'btn-ghost bg-base-100'}`}
          >
            <FaClipboardList /> تسجيلات الفعاليات
          </button>
        </div>

        {/* ==========================================
            TAB 1: ACTIVITIES
        ========================================== */}
        {activeTab === 'activities' && (
          <>
            <button 
              onClick={handleSyncStatuses}
              disabled={syncing}
              className="btn btn-ghost btn-sm gap-2 text-secondary mb-4"
            >
              <FaSync className={syncing ? 'animate-spin' : ''} />
              تحديث تلقائي للحالات
            </button>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="stat bg-base-100 rounded-2xl shadow-sm">
                <div className="stat-figure text-primary"><FaStar className="text-3xl" /></div>
                <div className="stat-title">إجمالي النشاطات</div>
                <div className="stat-value text-primary">{activities.length}</div>
              </div>
              <div className="stat bg-base-100 rounded-2xl shadow-sm">
                <div className="stat-figure text-secondary"><FaCalendarAlt className="text-3xl" /></div>
                <div className="stat-title">النشاطات القادمة</div>
                <div className="stat-value text-secondary">{activities.filter(a => a.is_upcoming).length}</div>
              </div>
              <div className="stat bg-base-100 rounded-2xl shadow-sm">
                <div className="stat-figure text-accent"><FaHistory className="text-3xl" /></div>
                <div className="stat-title">النشاطات السابقة</div>
                <div className="stat-value text-accent">{activities.filter(a => !a.is_upcoming).length}</div>
              </div>
            </div>

            {/* Add/Edit Form */}
            {isAddingNew && (
              <div className="bg-base-100 rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  {editingId ? 'تعديل النشاط' : 'إضافة نشاط جديد'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label"><span className="label-text font-bold">عنوان النشاط</span></label>
                      <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input input-bordered rounded-xl" required />
                    </div>

                    <div className="form-control">
                      <label className="label"><span className="label-text font-bold">صورة النشاط</span></label>
                      <div className="flex gap-2">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered file-input-primary rounded-xl flex-1 w-full" disabled={uploading} />
                        {uploading && <button type="button" className="btn btn-square btn-primary" disabled><FaSpinner className="animate-spin" /></button>}
                      </div>
                      {formData.image_url && (
                        <div className="mt-2">
                          <img src={formData.image_url} alt="معاينة الصورة" className="w-full h-32 object-cover rounded-xl" />
                          <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="btn btn-xs btn-error btn-outline mt-2"><FaTimes /> إزالة الصورة</button>
                        </div>
                      )}
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label"><span className="label-text font-bold">الوصف المختصر</span></label>
                      <textarea value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} className="textarea textarea-bordered rounded-xl h-24" required />
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label"><span className="label-text font-bold">التقرير الكامل</span></label>
                      <textarea value={formData.full_report} onChange={(e) => setFormData({...formData, full_report: e.target.value})} className="textarea textarea-bordered rounded-xl h-32" required />
                    </div>

                    <div className="form-control">
                      <label className="label"><span className="label-text font-bold">تاريخ النشاط</span></label>
                      <input type="date" value={formData.activity_date} onChange={(e) => setFormData({...formData, activity_date: e.target.value})} className="input input-bordered rounded-xl" />
                    </div>

                    <div className="form-control">
                      <label className="label"><span className="label-text font-bold text-secondary">العدد الأقصى للمشاركين</span></label>
                      <div className="relative">
                        <FaUsers className="absolute top-3 right-3 text-base-content/40" />
                        <input type="number" min="1" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})} className="input input-bordered rounded-xl w-full pr-10" placeholder="مثال: 20" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label"><span className="label-text font-bold">وقت البداية</span></label>
                        <input type="time" value={formData.start_time} onChange={(e) => setFormData({...formData, start_time: e.target.value})} className="input input-bordered rounded-xl" />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text font-bold">وقت النهاية</span></label>
                        <input type="time" value={formData.end_time} onChange={(e) => setFormData({...formData, end_time: e.target.value})} className="input input-bordered rounded-xl" />
                      </div>
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label"><span className="label-text font-bold">ملاحظات مهمة</span></label>
                      <textarea value={formData.notable_notes} onChange={(e) => setFormData({...formData, notable_notes: e.target.value})} className="textarea textarea-bordered rounded-xl" placeholder="اختياري..." />
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label"><span className="label-text font-bold text-info">رابط استمارة التسجيل</span></label>
                      <div className="relative">
                        <FaLink className="absolute top-3.5 right-3 text-info/30" />
                        <input type="url" value={formData.registration_form_url} onChange={(e) => setFormData({...formData, registration_form_url: e.target.value})} className="input input-bordered input-primary w-full rounded-xl pr-10 text-left" placeholder="https://docs.google.com/forms/..." dir="ltr" />
                      </div>
                      <label className="label"><span className="label-text-alt text-base-content/40">اتركه فارغاً إذا لم يكن هناك تسجيل</span></label>
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label cursor-pointer justify-start gap-4">
                        <input type="checkbox" checked={formData.is_upcoming} onChange={(e) => setFormData({...formData, is_upcoming: e.target.checked})} className="checkbox checkbox-primary" />
                        <span className="label-text font-bold">نشاط قادم (يظهر في الواجهة الرئيسية)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button type="submit" className="btn btn-primary text-white flex-1" disabled={uploading}>{editingId ? 'حفظ التعديلات' : 'إضافة النشاط'}</button>
                    <button type="button" onClick={resetForm} className="btn btn-ghost flex-1">إلغاء</button>
                  </div>
                </form>
              </div>
            )}

            {/* Add New Button */}
            {!isAddingNew && (
              <div className="text-center mb-8">
                <button onClick={() => setIsAddingNew(true)} className="btn btn-primary btn-lg rounded-full text-white gap-2 shadow-lg">
                  <FaPlus /> إضافة نشاط جديد
                </button>
              </div>
            )}

            {/* Activities Table */}
            <div className="bg-base-100 rounded-3xl p-6 shadow-sm overflow-hidden">
              <h2 className="text-2xl font-bold mb-6 text-primary">النشاطات الحالية</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full whitespace-nowrap">
                  <thead>
                    <tr>
                      <th>الصورة</th>
                      <th>العنوان</th>
                      <th>التاريخ</th>
                      <th>الرابط</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr key={activity.id}>
                        <td>
                          {activity.image_url ? (
                            <img src={activity.image_url} alt={activity.title} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-base-200 rounded-lg flex items-center justify-center"><FaImage className="text-base-content/40" /></div>
                          )}
                        </td>
                        <td className="font-bold">{activity.title}</td>
                        <td>{activity.activity_date || 'غير محدد'}</td>
                        <td>
                          {activity.registration_form_url ? (
                            <a href={activity.registration_form_url} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-link">رابط</a>
                          ) : '-'}
                        </td>
                        <td>
                          <span className={`badge ${activity.is_upcoming ? 'badge-primary' : 'badge-ghost'}`}>
                            {activity.is_upcoming ? 'قادم' : 'منتهي'}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(activity)} className="btn btn-sm btn-square btn-ghost text-primary"><FaEdit /></button>
                            <button onClick={() => promptDelete(activity.id, activity.image_url)} className="btn btn-sm btn-square btn-ghost text-error"><FaTrash /></button>
                            <button onClick={() => setPhotoManagerActivity(activity)} className="btn btn-sm btn-square btn-ghost text-secondary" title="إدارة الصور"><FaImages /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Messages */}
            {messages.length > 0 && (
              <div className="bg-base-100 rounded-3xl p-6 md:p-8 shadow-sm mt-8">
                <h2 className="text-2xl font-bold mb-6 text-primary">آخر الرسائل</h2>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-4 bg-base-200 rounded-xl">
                      <p className="text-sm text-base-content/50 mb-2">{msg.user_email}</p>
                      <p className="text-base-content">{msg.message}</p>
                      <p className="text-xs text-base-content/40 mt-2">{new Date(msg.created_at).toLocaleString('ar-SA')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ==========================================
            TAB 2: USERS
        ========================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            {/* Users Header & Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-base-100 rounded-2xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-primary">{users.length}</div>
                <div className="text-base-content/50 text-sm">إجمالي المستخدمين</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-secondary">{users.filter(u => u.user_type === 'parent').length}</div>
                <div className="text-base-content/50 text-sm">أولياء أمور</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-accent">{users.filter(u => u.user_type === 'member').length}</div>
                <div className="text-base-content/50 text-sm">أعضاء</div>
              </div>
              <div className="bg-base-100 rounded-2xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-warning">{users.filter(u => u.user_type === 'volunteer' || u.user_type === 'donor').length}</div>
                <div className="text-base-content/50 text-sm">متطوعون وداعمون</div>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-base-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute top-3.5 right-3 text-base-content/40" />
                <input
                  type="text"
                  placeholder="بحث بالاسم أو رقم الهاتف..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="input input-bordered rounded-xl w-full pr-10"
                />
              </div>
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                className="select select-bordered rounded-xl"
              >
                <option value="all">جميع الأنواع</option>
                <option value="parent">أولياء أمور</option>
                <option value="member">أعضاء</option>
                <option value="volunteer">متطوعون</option>
                <option value="donor">داعمون</option>
              </select>
              <button onClick={fetchUsers} className="btn btn-ghost btn-sm gap-2">
                <FaSync /> تحديث
              </button>
            </div>

            {/* Users List */}
            <div className="bg-base-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-3">
                <FaUsers /> المستخدمون المسجلون
                <span className="badge badge-primary">{filteredUsers.length}</span>
              </h2>

              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-base-content/50">
                  {userSearch || userTypeFilter !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا يوجد مستخدمون مسجلون'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border border-base-200 rounded-2xl overflow-hidden">
                      {/* User Row */}
                      <div 
                        className="flex items-center gap-4 p-4 hover:bg-base-200/50 cursor-pointer transition-colors"
                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.parent_name || 'صورة المستخدم'} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/50">
                              <FaUserFriends />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base-content truncate">{user.parent_name || 'بدون اسم'}</div>
                          <div className="text-sm text-base-content/50 flex items-center gap-2">
                            <FaPhone className="text-xs" />
                            <span dir="ltr">{user.parent_phone || 'لا يوجد'}</span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span className={`badge badge-sm ${
                            user.user_type === 'parent' ? 'badge-primary' :
                            user.user_type === 'member' ? 'badge-secondary' :
                            user.user_type === 'volunteer' ? 'badge-accent' :
                            user.user_type === 'donor' ? 'badge-warning' :
                            'badge-ghost'
                          }`}>
                            {userTypeLabels[user.user_type] || 'مستخدم'}
                          </span>
                        </div>

                        {user.role === 'admin' && (
                          <span className="badge badge-error badge-sm">مدير</span>
                        )}

                        <div className="shrink-0 text-base-content/40">
                          {expandedUser === user.id ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedUser === user.id && (
                        <div className="px-4 pb-4 pt-2 bg-base-200/30 border-t border-base-200 space-y-4">
                          
                          <div className="text-xs text-base-content/40 font-mono break-all">
                            ID: {user.id}
                          </div>

                          {user.user_type === 'parent' && user.children && user.children.length > 0 && (
                            <div>
                              <h4 className="font-bold text-primary text-sm mb-2 flex items-center gap-2">
                                <FaChild /> الأبناء ({user.children.length})
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {user.children.map((child, idx) => (
                                  <div key={idx} className="bg-base-100 p-3 rounded-xl flex items-center justify-between">
                                    <span className="font-medium text-base-content">{child.name}</span>
                                    <span className="badge badge-primary badge-outline badge-sm">{child.age} سنة</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {user.user_type === 'member' && user.member_roles && user.member_roles.length > 0 && (
                            <div>
                              <h4 className="font-bold text-secondary text-sm mb-2 flex items-center gap-2">
                                <FaUserTag /> المناصب
                              </h4>
                              <div className="space-y-2">
                                {user.member_roles.map((role, idx) => (
                                  <div key={idx} className="bg-base-100 p-3 rounded-xl">
                                    <span className="font-bold text-base-content">{rankLabels[role.rank] || role.rank}</span>
                                    {role.office && (
                                      <span className="text-base-content/50 text-sm mr-2">• {officeLabels[role.office] || role.office}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {user.user_type === 'donor' && user.donor_party && (
                            <div>
                              <h4 className="font-bold text-warning text-sm mb-2">الجهة المانحة</h4>
                              <div className="bg-base-100 p-3 rounded-xl text-base-content">
                                {user.donor_party}
                              </div>
                            </div>
                          )}

                          {user.created_at && (
                            <div className="text-xs text-base-content/40">
                              تاريخ التسجيل: {new Date(user.created_at).toLocaleDateString('ar-SA')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: EVENT REGISTRATIONS
        ========================================== */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">

            {/* Event Selector */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FaCalendarAlt /> اختر النشاط
              </h2>
              
              {upcomingActivities.length === 0 ? (
                <div className="text-center py-8 text-base-content/50">
                  <FaCalendarAlt className="text-4xl mx-auto mb-3 text-base-content/30" />
                  <p>لا توجد نشاطات قادمة حالياً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {upcomingActivities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => setSelectedEventId(activity.id)}
                      className={`p-4 rounded-2xl border-2 text-right transition-all ${
                        selectedEventId === activity.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-base-200 hover:border-primary/30 hover:bg-base-200/50'
                      }`}
                    >
                      <div className="font-bold text-base-content truncate">{activity.title}</div>
                      <div className="text-sm text-base-content/50 mt-1">{activity.activity_date || 'تاريخ غير محدد'}</div>
                      {activity.capacity && (
                        <div className="text-xs text-primary mt-2">السعة: {activity.capacity} مشارك</div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {activities.filter(a => !a.is_upcoming).length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-base-content/50 hover:text-primary transition-colors">
                    عرض النشاطات السابقة ({activities.filter(a => !a.is_upcoming).length})
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {activities.filter(a => !a.is_upcoming).map((activity) => (
                      <button
                        key={activity.id}
                        onClick={() => setSelectedEventId(activity.id)}
                        className={`p-4 rounded-2xl border-2 text-right transition-all ${
                          selectedEventId === activity.id
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-base-200 hover:border-primary/30 hover:bg-base-200/50'
                        }`}
                      >
                        <div className="font-bold text-base-content truncate">{activity.title}</div>
                        <div className="text-sm text-base-content/50 mt-1">{activity.activity_date || 'تاريخ غير محدد'}</div>
                        <span className="badge badge-ghost badge-sm mt-2">منتهي</span>
                      </button>
                    ))}
                  </div>
                </details>
              )}
            </div>

            {/* Registrations List */}
            {selectedEventId && (
              <div className="bg-base-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                    <FaClipboardList /> المسجلون
                    <span className="badge badge-primary">{registrations.length}</span>
                  </h2>
                  <button onClick={() => fetchRegistrations(selectedEventId)} className="btn btn-ghost btn-sm gap-2">
                    <FaSync /> تحديث
                  </button>
                </div>

                {registrationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-12 text-base-content/50">
                    <FaClipboardList className="text-4xl mx-auto mb-3 text-base-content/30" />
                    <p>لا يوجد مسجلون في هذا النشاط بعد</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {registrations.map((reg, index) => {
                      const profile = reg.profiles;
                      if (!profile) return null;

                      return (
                        <div key={reg.id} className="border border-base-200 rounded-2xl overflow-hidden">
                          <div 
                            className="flex items-center gap-4 p-4 hover:bg-base-200/50 cursor-pointer transition-colors"
                            onClick={() => setExpandedRegistration(expandedRegistration === reg.id ? null : reg.id)}
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                              {index + 1}
                            </div>

                            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 shrink-0">
                              {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.parent_name || 'صورة المسجل'} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary/50">
                                  <FaUserFriends className="text-sm" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-base-content truncate">{profile.parent_name || 'بدون اسم'}</div>
                              <div className="text-xs text-base-content/50" dir="ltr">{profile.parent_phone || ''}</div>
                            </div>

                            <span className={`badge badge-sm shrink-0 ${
                              profile.user_type === 'parent' ? 'badge-primary' :
                              profile.user_type === 'member' ? 'badge-secondary' :
                              'badge-ghost'
                            }`}>
                              {userTypeLabels[profile.user_type] || 'مستخدم'}
                            </span>

                            <div className="text-xs text-base-content/40 hidden sm:block shrink-0">
                              {new Date(reg.created_at).toLocaleDateString('ar-SA')}
                            </div>

                            <div className="shrink-0 text-base-content/40">
                              {expandedRegistration === reg.id ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>

                          {expandedRegistration === reg.id && (
                            <div className="px-4 pb-4 pt-2 bg-base-200/30 border-t border-base-200 space-y-4">
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-base-100 p-3 rounded-xl flex items-center gap-3">
                                  <FaPhone className="text-primary shrink-0" />
                                  <div>
                                    <div className="text-xs text-base-content/50">الهاتف</div>
                                    <div className="font-medium text-base-content" dir="ltr">{profile.parent_phone || 'غير متوفر'}</div>
                                  </div>
                                </div>
                                <div className="bg-base-100 p-3 rounded-xl flex items-center gap-3">
                                  <FaCalendarAlt className="text-primary shrink-0" />
                                  <div>
                                    <div className="text-xs text-base-content/50">تاريخ التسجيل</div>
                                    <div className="font-medium text-base-content">{new Date(reg.created_at).toLocaleString('ar-SA')}</div>
                                  </div>
                                </div>
                              </div>

                              {profile.children && profile.children.length > 0 && (
                                <div>
                                  <h4 className="font-bold text-primary text-sm mb-2 flex items-center gap-2">
                                    <FaChild /> الأبناء المسجلين ({profile.children.length})
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {profile.children.map((child, idx) => (
                                      <div key={idx} className="bg-base-100 p-3 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <FaChild className="text-xs" />
                                          </div>
                                          <span className="font-medium text-base-content">{child.name}</span>
                                        </div>
                                        <span className="badge badge-primary badge-outline badge-sm">{child.age} سنة</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {profile.user_type === 'member' && profile.member_roles && profile.member_roles.length > 0 && (
                                <div>
                                  <h4 className="font-bold text-secondary text-sm mb-2 flex items-center gap-2">
                                    <FaUserTag /> المناصب
                                  </h4>
                                  <div className="space-y-2">
                                    {profile.member_roles.map((role, idx) => (
                                      <div key={idx} className="bg-base-100 p-3 rounded-xl">
                                        <span className="font-bold">{rankLabels[role.rank] || role.rank}</span>
                                        {role.office && <span className="text-base-content/50 text-sm mr-2">• {officeLabels[role.office] || role.office}</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {profile.user_type === 'donor' && profile.donor_party && (
                                <div className="bg-base-100 p-3 rounded-xl">
                                  <span className="text-sm text-base-content/50">الجهة المانحة: </span>
                                  <span className="font-bold text-base-content">{profile.donor_party}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {registrations.length > 0 && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <h4 className="font-bold text-primary text-sm mb-3">ملخص التسجيلات</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">{registrations.length}</div>
                        <div className="text-xs text-base-content/50">إجمالي المسجلين</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-secondary">
                          {registrations.reduce((sum, reg) => sum + (reg.profiles?.children?.length || 0), 0)}
                        </div>
                        <div className="text-xs text-base-content/50">إجمالي الأطفال</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">
                          {registrations.filter(r => r.profiles?.user_type === 'parent').length}
                        </div>
                        <div className="text-xs text-base-content/50">أولياء أمور</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-warning">
                          {registrations.filter(r => r.profiles?.user_type !== 'parent').length}
                        </div>
                        <div className="text-xs text-base-content/50">آخرون</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* DELETE MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setItemToDelete(null)}></div>
          <div className="bg-base-100 rounded-2xl p-8 relative z-10 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-3xl text-error" />
              </div>
              <h3 className="text-2xl font-bold text-error">حذف النشاط</h3>
              <p className="text-base-content/50 mt-2">هل أنت متأكد من حذف هذا النشاط؟ لا يمكن التراجع.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={executeDelete} disabled={isDeleting} className="btn btn-error flex-1 text-white">
                {isDeleting ? <span className="loading loading-spinner"></span> : 'نعم، حذف'}
              </button>
              <button onClick={() => setItemToDelete(null)} className="btn btn-ghost flex-1" disabled={isDeleting}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO MANAGER MODAL */}
      {photoManagerActivity && (
        <ActivityPhotoManager
          activityId={photoManagerActivity.id}
          activityTitle={photoManagerActivity.title}
          onClose={() => setPhotoManagerActivity(null)}
        />
      )}
    </div>
  );
}