'use client'
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaCalendarAlt, FaClock, FaImage, FaInfoCircle, FaStar, FaHistory } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activities, setActivities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  
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

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    
    const toastId = toast.loading('جاري الحذف...');
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('فشل الحذف!', { id: toastId });
    } else {
      toast.success('تم الحذف!', { id: toastId });
      fetchActivities();
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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">رابط الصورة</span>
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="input input-bordered rounded-xl"
                    placeholder="https://..."
                    dir="ltr"
                  />
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
                <button type="submit" className="btn btn-primary text-white">
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
                  <th>العنوان</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
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
                        onClick={() => handleDelete(activity.id)}
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