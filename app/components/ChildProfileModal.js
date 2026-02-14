'use client'
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { motion } from 'framer-motion';
import { 
  FaTimes, FaSave, FaEdit, FaStar, FaCrown, FaChild,
  FaBullseye, FaHeart, FaUser, FaPalette, FaLightbulb,
  FaCalendarCheck, FaSeedling, FaCheck, FaCalendarAlt, FaLock
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { levelDefinitions, getLevelDef } from '../utils/constants';

const FUN_FACT_FIELDS = [
  { key: 'dream_profession', label: 'ماذا أريد أن أصبح؟', icon: <FaBullseye />, placeholder: 'مثال: طبيب، مهندسة، معلم...' },
  { key: 'biggest_dream', label: 'أكبر أحلامي', icon: <FaStar />, placeholder: 'مثال: أن أسافر حول العالم...' },
  { key: 'role_model', label: 'قدوتي في الحياة', icon: <FaUser />, placeholder: 'مثال: أبي، معلمتي...' },
  { key: 'role_model_why', label: 'لماذا هو/هي قدوتي؟', icon: <FaHeart />, placeholder: 'مثال: لأنه يساعد الجميع...', dependsOn: 'role_model' },
  { key: 'hobby', label: 'هوايتي المفضلة', icon: <FaPalette />, placeholder: 'مثال: الرسم، كرة القدم...' },
  { key: 'fun_fact', label: 'حقيقة ممتعة عني', icon: <FaLightbulb />, placeholder: 'مثال: أحب الديناصورات...' },
];

export default function ChildProfileModal({ child, parentId, isAdmin, isOwner, onClose, onUpdate }) {
  const canEditFacts = isAdmin || isOwner;
  const canEditLevel = isAdmin;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingLevel, setSavingLevel] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({ attended: 0, honored: 0 });
  const [activityHistory, setActivityHistory] = useState([]);

  const [formData, setFormData] = useState({
    dream_profession: child.dream_profession || '',
    biggest_dream: child.biggest_dream || '',
    role_model: child.role_model || '',
    role_model_why: child.role_model_why || '',
    hobby: child.hobby || '',
    fun_fact: child.fun_fact || '',
  });

  const [currentLevel, setCurrentLevel] = useState(child.level || 'new');

  const supabase = createClient();
  const level = getLevelDef(currentLevel);
  const initial = child.name ? child.name[0] : '?';
  const hasRecord = !!child.id;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const query = supabase
          .from('attendance')
          .select('id, is_honored, activity_id')
          .eq('child_name', child.name);

        if (parentId) query.eq('parent_id', parentId);

        const { data: attendanceData } = await query;

        if (!attendanceData) { setStatsLoading(false); return; }

        setStats({
          attended: attendanceData.length,
          honored: attendanceData.filter(r => r.is_honored).length
        });

        const activityIds = [...new Set(attendanceData.map(a => a.activity_id))];
        if (activityIds.length > 0) {
          const { data: activities } = await supabase
            .from('activities')
            .select('id, title, activity_date')
            .in('id', activityIds)
            .order('activity_date', { ascending: false });

          const activitiesMap = {};
          (activities || []).forEach(a => { activitiesMap[a.id] = a; });

          const history = attendanceData.map(a => ({
            id: a.id,
            is_honored: a.is_honored,
            title: activitiesMap[a.activity_id]?.title || 'نشاط',
            date: activitiesMap[a.activity_id]?.activity_date || ''
          }));

          // Deduplicate
          const seen = new Set();
          const unique = history.filter(h => {
            if (seen.has(h.title)) return false;
            seen.add(h.title);
            return true;
          });
          setActivityHistory(unique);
        }
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [child.name, parentId]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleSave = async () => {
    if (!hasRecord) return;
    setSaving(true);
    const toastId = toast.loading('جاري حفظ البطاقة...');
    try {
      const { error } = await supabase
        .from('children')
        .update({
          dream_profession: formData.dream_profession || null,
          biggest_dream: formData.biggest_dream || null,
          role_model: formData.role_model || null,
          role_model_why: formData.role_model_why || null,
          hobby: formData.hobby || null,
          fun_fact: formData.fun_fact || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', child.id);

      if (error) throw error;
      toast.success('تم حفظ البطاقة بنجاح!', { id: toastId });
      setIsEditing(false);
      if (onUpdate) onUpdate({ ...child, ...formData, level: currentLevel });
    } catch (error) {
      console.error('Save error:', error);
      toast.error('حدث خطأ في الحفظ', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleLevelChange = async (newLevel) => {
    if (!hasRecord || !canEditLevel) return;
    setSavingLevel(true);
    try {
      const { error } = await supabase
        .from('children')
        .update({ level: newLevel, updated_at: new Date().toISOString() })
        .eq('id', child.id);

      if (error) throw error;
      setCurrentLevel(newLevel);
      toast.success(`تم تحديث المستوى إلى: ${getLevelDef(newLevel).label}`);
      if (onUpdate) onUpdate({ ...child, ...formData, level: newLevel });
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setSavingLevel(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dream_profession: child.dream_profession || '',
      biggest_dream: child.biggest_dream || '',
      role_model: child.role_model || '',
      role_model_why: child.role_model_why || '',
      hobby: child.hobby || '',
      fun_fact: child.fun_fact || '',
    });
    setIsEditing(false);
  };

  const hasFunFacts = formData.dream_profession || formData.biggest_dream || 
    formData.role_model || formData.hobby || formData.fun_fact;

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <motion.div
        className="bg-base-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative z-10 max-h-[92vh] overflow-y-auto"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute top-4 left-4 flex gap-2">
            {canEditFacts && !isEditing && hasRecord && (
              <button onClick={() => setIsEditing(true)} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all" title="تعديل البطاقة">
                <FaEdit className="text-sm" />
              </button>
            )}
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center text-white transition-all">
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* Viewer badge */}
          {!canEditFacts && (
            <div className="absolute bottom-3 right-3">
              <span className="badge badge-sm bg-white/20 border-none text-white gap-1">
                <FaLock className="text-[8px]" /> عرض فقط
              </span>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">

          {/* Avatar + Name */}
          <div className="flex flex-col items-center -mt-14 mb-5">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-4xl font-bold border-4 border-base-100 shadow-lg relative`}>
              {initial}
              {currentLevel !== 'new' && (
                <div className="absolute -bottom-1 -right-1 text-lg">{level.emoji}</div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-base-content mt-3">{child.name}</h2>
            {child.age && <p className="text-base-content/50">{child.age} سنوات</p>}

            {/* Level badge */}
            <div className={`mt-2 badge badge-lg gap-1.5 py-3 px-4 ${level.bg} ${level.text} ${level.border} border`}>
              <span>{level.emoji}</span>
              <span className="font-bold">{level.label}</span>
            </div>
          </div>

          {/* Admin Level Selector */}
          {canEditLevel && hasRecord && (
            <div className="bg-base-200/50 rounded-2xl p-4 mb-5">
              <h4 className="text-xs font-bold text-base-content/50 mb-3 flex items-center gap-2">
                <FaCrown className="text-warning" /> تغيير المستوى (مسؤول)
              </h4>
              <div className="flex flex-wrap gap-2">
                {levelDefinitions.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleLevelChange(l.id)}
                    disabled={savingLevel || currentLevel === l.id}
                    className={`btn btn-sm rounded-xl gap-1 transition-all ${
                      currentLevel === l.id
                        ? `${l.bg} ${l.text} border ${l.border} btn-active`
                        : 'btn-ghost opacity-60 hover:opacity-100'
                    }`}
                  >
                    {savingLevel && currentLevel !== l.id ? null : <span>{l.emoji}</span>}
                    <span className="text-xs">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-primary/5 rounded-2xl p-3 text-center border border-primary/10">
              <FaCalendarCheck className="text-primary text-xs mx-auto mb-1" />
              {statsLoading ? (
                <span className="loading loading-spinner loading-xs text-primary"></span>
              ) : (
                <div className="text-2xl font-bold text-primary">{stats.attended}</div>
              )}
              <div className="text-[10px] text-base-content/50">نشاط حضره</div>
            </div>
            <div className="bg-warning/5 rounded-2xl p-3 text-center border border-warning/10">
              <FaCrown className="text-warning text-xs mx-auto mb-1" />
              {statsLoading ? (
                <span className="loading loading-spinner loading-xs text-warning"></span>
              ) : (
                <div className="text-2xl font-bold text-warning">{stats.honored}</div>
              )}
              <div className="text-[10px] text-base-content/50">قدوة النشاط</div>
            </div>
            <div className={`rounded-2xl p-3 text-center border ${level.bg} ${level.border}`}>
              <div className="text-lg mb-0.5">{level.emoji}</div>
              <div className={`text-sm font-bold ${level.text}`}>{level.label}</div>
              <div className="text-[10px] text-base-content/50">المستوى</div>
            </div>
          </div>

          {/* Fun Facts Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-base-200"></div>
            <span className="text-sm font-bold text-primary flex items-center gap-2">
              <FaChild /> بطاقة التعريف
            </span>
            <div className="h-px flex-1 bg-base-200"></div>
          </div>

          {/* Fun Facts */}
          {isEditing ? (
            <div className="space-y-4">
              {FUN_FACT_FIELDS.map((field) => {
                if (field.dependsOn && !formData[field.dependsOn]) return null;
                return (
                  <div key={field.key} className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-sm font-bold flex items-center gap-2">
                        <span className="text-primary">{field.icon}</span>
                        {field.label}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="input input-bordered rounded-xl input-sm"
                      placeholder={field.placeholder}
                    />
                  </div>
                );
              })}
              <div className="flex gap-3 pt-3">
                <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1 rounded-xl text-white gap-2">
                  {saving ? <span className="loading loading-spinner loading-xs"></span> : <FaSave />}
                  حفظ البطاقة
                </button>
                <button onClick={resetForm} className="btn btn-ghost rounded-xl">إلغاء</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {hasFunFacts ? (
                <>
                  {FUN_FACT_FIELDS.map((field) => {
                    const value = formData[field.key];
                    if (!value) return null;
                    if (field.dependsOn && !formData[field.dependsOn]) return null;
                    return (
                      <div key={field.key} className="flex items-start gap-3 p-3 bg-base-200/30 rounded-xl">
                        <div className="text-primary mt-0.5 shrink-0">{field.icon}</div>
                        <div>
                          <div className="text-xs text-base-content/50 mb-0.5">{field.label}</div>
                          <div className="text-sm font-medium text-base-content">{value}</div>
                        </div>
                      </div>
                    );
                  })}
                  {canEditFacts && hasRecord && (
                    <button onClick={() => setIsEditing(true)} className="btn btn-ghost btn-sm w-full rounded-xl text-primary gap-2 mt-2">
                      <FaEdit /> تعديل البطاقة
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-base-content/40">
                  <FaSeedling className="text-4xl mx-auto mb-3 text-base-content/20" />
                  <p className="font-medium mb-1">لم تتم تعبئة البطاقة بعد</p>
                  {canEditFacts && hasRecord ? (
                    <>
                      <p className="text-xs mb-4">أضف معلومات ممتعة عن الطفل</p>
                      <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm rounded-xl text-white gap-2">
                        <FaEdit /> تعبئة البطاقة
                      </button>
                    </>
                  ) : (
                    <p className="text-xs">لم يتم إضافة معلومات بعد</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Activity History */}
          {!statsLoading && activityHistory.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-6 mb-4">
                <div className="h-px flex-1 bg-base-200"></div>
                <span className="text-sm font-bold text-secondary flex items-center gap-2">
                  <FaCalendarAlt /> سجل النشاطات
                </span>
                <div className="h-px flex-1 bg-base-200"></div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activityHistory.map((a) => (
                  <div key={a.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${a.is_honored ? 'bg-warning/10' : 'bg-base-200/30'}`}>
                    {a.is_honored ? (
                      <FaCrown className="text-warning text-xs shrink-0" />
                    ) : (
                      <FaCheck className="text-success text-xs shrink-0" />
                    )}
                    <span className="text-sm flex-1 text-base-content/80 truncate">{a.title}</span>
                    {a.is_honored && (
                      <span className="badge badge-warning badge-xs shrink-0">قدوة</span>
                    )}
                    {a.date && <span className="text-[10px] text-base-content/40 shrink-0">{a.date}</span>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}