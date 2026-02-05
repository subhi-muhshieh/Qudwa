'use client'
import { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaCalendarAlt, FaClock, FaImage, FaInfoCircle, FaStar, FaHistory, FaUpload, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activities, setActivities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_report: '',
    activity_date: '',
    start_time: '',
    end_time: '',
    notable_notes: '',
    image_url: '',
    is_upcoming: false
  });

  const supabase = createClient();

  useEffect(() => {
    fetchActivities();
    fetchMessages();
  }, []);

  const fetchActivities = async () => {
    const { data } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setActivities(data);
    setLoading(false);
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

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار صورة صالحة');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 5 ميغابايت');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('جاري رفع الصورة...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('activity-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('activity-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update form data
      setFormData({ ...formData, image_url: publicUrl });
      
      toast.success('تم رفع الصورة بنجاح!', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('فشل رفع الصورة: ' + error.message, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(editingId ? 'جاري التحديث...' : 'جاري الإضافة...');

    try {
      if (editingId) {
        const { error } = await supabase
          .from('activities')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('تم التحديث بنجاح!', { id: toastId });
      } else {
        const { error } = await supabase
          .from('activities')
          .insert([formData]);

        if (error) throw error;
        toast.success('تم الإضافة بنجاح!', { id: toastId });
      }

      resetForm();
      fetchActivities();
    } catch (error) {
      toast.error('حدث خطأ!', { id: toastId });
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    
    const toastId = toast.loading('جاري الحذف...');

    try {
      // Delete image from storage if exists
      if (imageUrl && imageUrl.includes('activity-images')) {
        const imagePath = imageUrl.split('/activity-images/')[1];
        if (imagePath) {
          await supabase.storage.from('activity-images').remove([imagePath]);
        }
      }

      // Delete activity
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('تم الحذف!', { id: toastId });
      fetchActivities();
    } catch (error) {
      toast.error('فشل الحذف!', { id: toastId });
    }
  };

  const handleEdit = (activity) => {
    setFormData(activity);
    setEditingId(activity.id);
    setIsAddingNew(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      short_description: '',
      full_report: '',
      activity_date: '',
      start_time: '',
      end_time: '',
      notable_notes: '',
      image_url: '',
      is_upcoming: false
    });
    setEditingId(null);
    setIsAddingNew(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4">لوحة التحكم الإدارية</h1>
          <p className="text-gray-600">إدارة النشاطات والفعاليات</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat bg-white rounded-2xl shadow-sm">
            <div className="stat-figure text-primary">
              <FaStar className="text-3xl" />
            </div>
            <div className="stat-title">إجمالي النشاطات</div>
            <div className="stat-value text-primary">{activities.length}</div>
          </div>

          <div className="stat bg-white rounded-2xl shadow-sm">
            <div className="stat-figure text-secondary">
              <FaCalendarAlt className="text-3xl" />
            </div>
            <div className="stat-title">النشاطات القادمة</div>
            <div className="stat-value text-secondary">
              {activities.filter(a => a.is_upcoming).length}
            </div>
          </div>

          <div className="stat bg-white rounded-2xl shadow-sm">
            <div className="stat-figure text-accent">
              <FaHistory className="text-3xl" />
            </div>
            <div className="stat-title">النشاطات السابقة</div>
            <div className="stat-value text-accent">
              {activities.filter(a => !a.is_upcoming).length}
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAddingNew && (
          <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-primary">
              {editingId ? 'تعديل النشاط' : 'إضافة نشاط جديد'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">عنوان النشاط</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="input input-bordered rounded-xl"
                    required
                  />
                </div>

                {/* IMAGE UPLOAD - NEW! */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">صورة النشاط</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input file-input-bordered file-input-primary rounded-xl flex-1"
                      disabled={uploading}
                    />
                    {uploading && (
                      <button type="button" className="btn btn-square btn-primary" disabled>
                        <FaSpinner className="animate-spin" />
                      </button>
                    )}
                  </div>
                  {formData.image_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, image_url: ''})}
                        className="btn btn-xs btn-error btn-outline mt-2"
                      >
                        <FaTimes /> إزالة الصورة
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold">الوصف المختصر</span>
                  </label>
                  <textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                    className="textarea textarea-bordered rounded-xl h-24"
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold">التقرير الكامل</span>
                  </label>
                  <textarea
                    value={formData.full_report}
                    onChange={(e) => setFormData({...formData, full_report: e.target.value})}
                    className="textarea textarea-bordered rounded-xl h-32"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">تاريخ النشاط</span>
                  </label>
                  <input
                    type="date"
                    value={formData.activity_date}
                    onChange={(e) => setFormData({...formData, activity_date: e.target.value})}
                    className="input input-bordered rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">وقت البداية</span>
                    </label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                      className="input input-bordered rounded-xl"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">وقت النهاية</span>
                    </label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                      className="input input-bordered rounded-xl"
                    />
                  </div>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold">ملاحظات مهمة</span>
                  </label>
                  <textarea
                    value={formData.notable_notes}
                    onChange={(e) => setFormData({...formData, notable_notes: e.target.value})}
                    className="textarea textarea-bordered rounded-xl"
                    placeholder="اختياري..."
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      checked={formData.is_upcoming}
                      onChange={(e) => setFormData({...formData, is_upcoming: e.target.checked})}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text font-bold">نشاط قادم</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn btn-primary text-white" disabled={uploading}>
                  {editingId ? 'حفظ التعديلات' : 'إضافة النشاط'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-ghost">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add New Button */}
        {!isAddingNew && (
          <div className="text-center mb-8">
            <button
              onClick={() => setIsAddingNew(true)}
              className="btn btn-primary btn-lg rounded-full text-white gap-2"
            >
              <FaPlus /> إضافة نشاط جديد
            </button>
          </div>
        )}

        {/* Activities List */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-primary">النشاطات الحالية</h2>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>الصورة</th>
                  <th>العنوان</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      {activity.image_url ? (
                        <img 
                          src={activity.image_url} 
                          alt={activity.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FaImage className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="font-bold">{activity.title}</td>
                    <td>{activity.activity_date || 'غير محدد'}</td>
                    <td>
                      <span className={`badge ${activity.is_upcoming ? 'badge-primary' : 'badge-ghost'}`}>
                        {activity.is_upcoming ? 'قادم' : 'منتهي'}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="btn btn-sm btn-ghost text-primary"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id, activity.image_url)}
                        className="btn btn-sm btn-ghost text-error"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Messages */}
        {messages.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">آخر الرسائل</h2>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="p-4 bg-base-100 rounded-xl">
                  <p className="text-sm text-gray-500 mb-2">{msg.user_email}</p>
                  <p>{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(msg.created_at).toLocaleString('ar-SA')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}