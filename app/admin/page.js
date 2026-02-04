'use client'
import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FaCloudUploadAlt, FaPen, FaCalendarCheck, FaClock, FaStickyNote } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullReport, setFullReport] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notableNotes, setNotableNotes] = useState('');
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role !== 'admin') { toast.error("عذراً، هذه الصفحة للإدارة فقط"); router.push('/'); } 
      else { setIsAdmin(true); }
    };
    checkRole();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("جاري النشر...");

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

      const { error: dbError } = await supabase.from('activities').insert([{
          title,
          short_description: shortDesc,
          full_report: fullReport,
          activity_date: activityDate || null,
          start_time: startTime || null,
          end_time: endTime || null,
          notable_notes: notableNotes,
          is_upcoming: isUpcoming,
          image_url: imageUrl
        }]);

      if (dbError) throw dbError;
      toast.success("تم نشر النشاط بنجاح!", { id: toastId });
      
      // Reset
      setTitle(''); setShortDesc(''); setFullReport(''); setActivityDate(''); setStartTime(''); setEndTime(''); setNotableNotes(''); setImageFile(null); setIsUpcoming(false);

    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء النشر", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-dots loading-lg text-primary"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 pt-28 pb-10 px-4">
      <div className="max-w-3xl mx-auto bg-base-100 rounded-[2rem] shadow-xl overflow-hidden">
        <div className="bg-primary text-primary-content p-8 text-center">
            <h1 className="text-3xl font-bold">لوحة إدارة المحتوى</h1>
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
            <label className="label"><span className="label-text font-bold">التقرير الكامل / التفاصيل</span></label>
            <textarea value={fullReport} onChange={e => setFullReport(e.target.value)} className="textarea textarea-bordered h-32 rounded-xl" required></textarea>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-bold">ملاحظات هامة / أبرز النقاط</span></label>
            <div className="relative">
                <FaStickyNote className="absolute top-4 left-4 text-gray-400" />
                <textarea value={notableNotes} onChange={e => setNotableNotes(e.target.value)} className="textarea textarea-bordered h-24 rounded-xl w-full pl-10" placeholder="أشياء يجب الانتباه لها..."></textarea>
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
                <label className="label"><span className="label-text font-bold">صورة النشاط</span></label>
                <input type="file" onChange={e => setImageFile(e.target.files[0])} className="file-input file-input-bordered file-input-primary w-full rounded-full" />
              </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full rounded-full mt-4" disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : <><FaCloudUploadAlt className="text-xl" /> نشر النشاط</>}
          </button>
        </form>
      </div>
    </div>
  );
}