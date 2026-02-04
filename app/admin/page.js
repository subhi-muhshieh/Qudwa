'use client'
import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FaCloudUploadAlt, FaSync, FaStickyNote, FaTrash, FaEdit, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  // Form States
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullReport, setFullReport] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notableNotes, setNotableNotes] = useState('');
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  // System States
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activitiesList, setActivitiesList] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  
  // NEW: State for the Delete Modal
  const [deleteId, setDeleteId] = useState(null);
  
  const supabase = createClient();
  const router = useRouter();

  // 1. Check Admin & Fetch Data
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role !== 'admin') { 
        toast.error("عذراً، هذه الصفحة للإدارة فقط"); 
        router.push('/'); 
      } else { 
        setIsAdmin(true);
        fetchActivities();
      }
    };
    init();
  }, [router]);

  const fetchActivities = async () => {
    const { data } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    if (data) setActivitiesList(data);
  };

  // 2. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(editingId ? "جاري التحديث..." : "جاري النشر...");

    try {
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`; 
        const { error: uploadError } = await supabase.storage.from('activity-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('activity-images').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const payload = {
        title,
        short_description: shortDesc,
        full_report: fullReport,
        activity_date: activityDate || null,
        start_time: startTime || null,
        end_time: endTime || null,
        notable_notes: notableNotes,
        is_upcoming: isUpcoming,
      };

      if (imageUrl) payload.image_url = imageUrl;

      if (editingId) {
        const { error } = await supabase.from('activities').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success("تم التحديث بنجاح!", { id: toastId });
      } else {
        if (!imageUrl) payload.image_url = null; 
        const { error } = await supabase.from('activities').insert([payload]);
        if (error) throw error;
        toast.success("تم النشر بنجاح!", { id: toastId });
      }
      
      resetForm();
      fetchActivities();

    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // 3. Confirm Delete (The Real Action)
  const confirmDelete = async () => {
    if (!deleteId) return;

    const toastId = toast.loading("جاري الحذف...");
    const { error } = await supabase.from('activities').delete().eq('id', deleteId);
    
    if (error) {
        toast.error("فشل الحذف", { id: toastId });
    } else {
        toast.success("تم الحذف", { id: toastId });
        fetchActivities();
        if (editingId === deleteId) resetForm();
    }
    setDeleteId(null); // Close modal
  };

  // 4. Start Editing
  const handleEditClick = (activity) => {
    setEditingId(activity.id);
    setTitle(activity.title);
    setShortDesc(activity.short_description || '');
    setFullReport(activity.full_report || '');
    setActivityDate(activity.activity_date || '');
    setStartTime(activity.start_time || '');
    setEndTime(activity.end_time || '');
    setNotableNotes(activity.notable_notes || '');
    setIsUpcoming(activity.is_upcoming);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast("أنت الآن في وضع التعديل", { icon: '✏️' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle(''); setShortDesc(''); setFullReport(''); setActivityDate(''); setStartTime(''); setEndTime(''); setNotableNotes(''); setImageFile(null); setIsUpcoming(false);
  };

  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-dots loading-lg text-primary"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 pt-28 pb-10 px-4 relative">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* --- FORM SECTION --- */}
        <div className="bg-base-100 rounded-[2rem] shadow-xl overflow-hidden relative border border-white/50">
          {editingId && (
            <div className="bg-warning text-warning-content p-2 text-center text-sm font-bold flex items-center justify-center gap-2">
                <FaSync className="animate-spin" /> أنت تقوم بتعديل نشاط موجود حالياً
                <button onClick={resetForm} className="btn btn-xs btn-ghost underline ml-2">إلغاء التعديل</button>
            </div>
          )}

          <div className={`p-8 text-center ${editingId ? 'bg-warning/10' : 'bg-primary text-primary-content'}`}>
              <h1 className={`text-3xl font-bold ${editingId ? 'text-warning-content' : ''}`}>
                  {editingId ? "تعديل نشاط" : "لوحة إدارة المحتوى"}
              </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
            <div className="form-control">
              <label className="label"><span className="label-text font-bold text-lg">عنوان النشاط</span></label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input input-bordered w-full rounded-xl" required />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
               <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-bold">التاريخ</span></label>
                  <input type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} className="input input-bordered w-full rounded-xl" />
               </div>
               <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-bold">وقت البدء</span></label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="input input-bordered w-full rounded-xl" />
               </div>
               <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-bold">وقت الانتهاء</span></label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="input input-bordered w-full rounded-xl" />
               </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">وصف مختصر</span></label>
              <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="textarea textarea-bordered h-20 rounded-xl" required></textarea>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">التقرير الكامل</span></label>
              <textarea value={fullReport} onChange={e => setFullReport(e.target.value)} className="textarea textarea-bordered h-32 rounded-xl" required></textarea>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">ملاحظات هامة</span></label>
              <div className="relative">
                  <FaStickyNote className="absolute top-4 left-4 text-gray-400" />
                  <textarea value={notableNotes} onChange={e => setNotableNotes(e.target.value)} className="textarea textarea-bordered h-24 rounded-xl w-full pl-10"></textarea>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 bg-base-200 p-6 rounded-2xl border border-base-300">
                <div className="form-control flex-1">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input type="checkbox" checked={isUpcoming} onChange={e => setIsUpcoming(e.target.checked)} className="checkbox checkbox-secondary checkbox-lg" />
                    <span className="label-text font-bold text-lg">هل هذا نشاط قادم؟</span>
                  </label>
                </div>
                <div className="form-control flex-1">
                  <label className="label"><span className="label-text font-bold">
                    {editingId ? "تغيير الصورة (اتركه فارغاً للإبقاء)" : "صورة النشاط"}
                  </span></label>
                  <input type="file" onChange={e => setImageFile(e.target.files[0])} className="file-input file-input-bordered file-input-primary w-full rounded-full" />
                </div>
            </div>

            <div className="flex gap-4 mt-4">
                {editingId && (
                    <button type="button" onClick={resetForm} className="btn btn-ghost btn-lg rounded-full flex-1">
                        <FaTimes /> إلغاء
                    </button>
                )}
                <button type="submit" className={`btn btn-lg w-full rounded-full flex-[2] ${editingId ? 'btn-warning' : 'btn-primary'}`} disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : (editingId ? <><FaSync /> تحديث النشاط</> : <><FaCloudUploadAlt /> نشر النشاط</>)}
                </button>
            </div>
          </form>
        </div>

        {/* --- LIST SECTION --- */}
        <div>
            <h3 className="text-2xl font-bold mb-6 text-neutral pr-4 border-r-4 border-primary">إدارة النشاطات الحالية</h3>
            <div className="grid gap-4">
                {activitiesList.map((activity) => (
                    <div key={activity.id} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-full md:w-24 h-24 rounded-xl overflow-hidden bg-base-200 flex-shrink-0">
                            {activity.image_url ? (
                                <img src={activity.image_url} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20 font-bold text-xs">لا يوجد صورة</div>
                            )}
                        </div>
                        <div className="flex-1 text-center md:text-right w-full">
                            <h4 className="font-bold text-lg">{activity.title}</h4>
                            <div className="flex flex-wrap gap-2 mt-1 justify-center md:justify-start">
                                <span className={`badge ${activity.is_upcoming ? 'badge-secondary' : 'badge-ghost'}`}>
                                    {activity.is_upcoming ? 'قادم' : 'منجز'}
                                </span>
                                {activity.activity_date && <span className="badge badge-outline">{activity.activity_date}</span>}
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => handleEditClick(activity)} className="btn btn-sm btn-info btn-outline rounded-xl flex-1 md:flex-none gap-2">
                                <FaEdit /> تعديل
                            </button>
                            <button onClick={() => setDeleteId(activity.id)} className="btn btn-sm btn-error btn-outline rounded-xl flex-1 md:flex-none gap-2">
                                <FaTrash /> حذف
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
            
            {/* Modal */}
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full relative z-10 text-center shadow-2xl animate-fade-in-up">
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaExclamationTriangle className="text-4xl text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">هل أنت متأكد؟</h3>
                <p className="text-neutral/60 mb-8">سيتم حذف هذا النشاط نهائياً. لا يمكن التراجع عن هذا الإجراء.</p>
                <div className="flex gap-3">
                    <button onClick={() => setDeleteId(null)} className="btn btn-lg btn-ghost rounded-full flex-1">إلغاء</button>
                    <button onClick={confirmDelete} className="btn btn-lg btn-error rounded-full flex-1 shadow-lg shadow-red-200">نعم، احذف</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}