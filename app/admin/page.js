'use client'
import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FaCloudUploadAlt, FaPen, FaCheckCircle, FaCalendarCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullReport, setFullReport] = useState('');
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  // Check Admin Status
  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); 
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role !== 'admin') {
        toast.error("عذراً، هذه الصفحة للإدارة فقط");
        router.push('/');
      } else {
        setIsAdmin(true);
      }
    };
    checkRole();
  }, [router, supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("جاري النشر...");

    try {
      let imageUrl = null;

      if (imageFile) {
        // Clean filename
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`; 

        const { error: uploadError } = await supabase.storage
          .from('activity-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('activity-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const { error: dbError } = await supabase
        .from('activities')
        .insert([{
          title,
          short_description: shortDesc,
          full_report: fullReport,
          is_upcoming: isUpcoming,
          image_url: imageUrl
        }]);

      if (dbError) throw dbError;

      toast.success("تم نشر النشاط بنجاح!", { id: toastId });
      
      // Reset Form
      setTitle('');
      setShortDesc('');
      setFullReport('');
      setImageFile(null);
      setIsUpcoming(false);

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
        
        {/* Header */}
        <div className="bg-primary text-primary-content p-8 text-center">
            <h1 className="text-3xl font-bold">لوحة إدارة المحتوى</h1>
            <p className="opacity-80 mt-2">أضف نشاطاً جديداً للموقع</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          
          {/* Title */}
          <div className="form-control">
            <label className="label"><span className="label-text font-bold text-lg">عنوان النشاط</span></label>
            <div className="relative">
                <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="input input-bordered w-full rounded-xl pr-10 focus:input-primary" 
                    placeholder="مثال: حملة توزيع سلال غذائية"
                    required 
                />
                <FaPen className="absolute top-4 right-4 text-gray-400" />
            </div>
          </div>

          {/* Short Description */}
          <div className="form-control">
            <label className="label"><span className="label-text font-bold">وصف مختصر (يظهر في الواجهة)</span></label>
            <textarea 
                value={shortDesc} 
                onChange={e => setShortDesc(e.target.value)} 
                className="textarea textarea-bordered h-24 rounded-xl text-lg focus:textarea-primary" 
                placeholder="اكتب ملخصاً صغيراً..."
                required
            ></textarea>
          </div>

          {/* Full Report */}
          <div className="form-control">
            <label className="label"><span className="label-text font-bold">التقرير الكامل / التفاصيل</span></label>
            <textarea 
                value={fullReport} 
                onChange={e => setFullReport(e.target.value)} 
                className="textarea textarea-bordered h-40 rounded-xl focus:textarea-primary" 
                placeholder="اكتب كل التفاصيل هنا..."
                required
            ></textarea>
          </div>

          {/* Switches & Uploads Row */}
          <div className="flex flex-col md:flex-row gap-6 bg-base-200 p-6 rounded-2xl border border-base-300">
              
              {/* Upcoming Toggle */}
              <div className="form-control flex-1">
                <label className="label cursor-pointer justify-start gap-4">
                  <input 
                    type="checkbox" 
                    checked={isUpcoming} 
                    onChange={e => setIsUpcoming(e.target.checked)} 
                    className="checkbox checkbox-secondary checkbox-lg" 
                  />
                  <div className="flex flex-col">
                      <span className="label-text font-bold text-lg flex items-center gap-2">
                        <FaCalendarCheck /> هل هذا نشاط قادم؟
                      </span>
                      <span className="text-xs opacity-60">فعّل هذا الخيار إذا كان الحدث في المستقبل</span>
                  </div>
                </label>
              </div>

              {/* Image Upload */}
              <div className="form-control flex-1">
                <label className="label"><span className="label-text font-bold">صورة النشاط</span></label>
                <div className="relative">
                    <input 
                        type="file" 
                        onChange={e => setImageFile(e.target.files[0])} 
                        className="file-input file-input-bordered file-input-primary w-full rounded-full" 
                    />
                </div>
              </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary btn-lg w-full rounded-full mt-4 shadow-lg hover:scale-[1.02] transition-transform gap-2" disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : <><FaCloudUploadAlt className="text-xl" /> نشر النشاط</>}
          </button>

        </form>
      </div>
    </div>
  );
}