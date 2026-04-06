'use client'
import { useState, useEffect, useMemo, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { 
  FaCalendarAlt, FaChild, FaCheckCircle, FaUserPlus, FaTrash, 
  FaSync, FaClipboardCheck, FaUsers, FaPhone, FaPlus, FaTimes, 
  FaSearch, FaCheckDouble, FaChevronDown, FaTimesCircle, FaCheck, FaCrown
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { levelDefinitions, getLevelDef } from '../utils/constants';
import ChildProfileModal from './ChildProfileModal';import { motion, AnimatePresence } from 'framer-motion';

export default function AttendanceManager({ activities }) {
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState({});
  const [togglingHonor, setTogglingHonor] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Walk-in state
  const [showWalkInForm, setShowWalkInForm] = useState(false);
const [childrenMap, setChildrenMap] = useState({});
const [selectedChildProfile, setSelectedChildProfile] = useState(null);
const [changingLevel, setChangingLevel] = useState({});
  const [walkInForm, setWalkInForm] = useState({ child_name: '', child_age: '', parent_name: '' });
const [addingWalkIn, setAddingWalkIn] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false);

const supabase = createClient();
const dropdownRef = useRef(null);
  // Auto-select first activity
  useEffect(() => {
    if (!selectedActivityId && activities.length > 0) {
      const upcoming = activities.filter(a => a.is_upcoming);
      if (upcoming.length > 0) {
        setSelectedActivityId(upcoming[0].id);
      } else {
        setSelectedActivityId(activities[0].id);
      }
    }
  }, [activities, selectedActivityId]);

  // Fetch data when activity changes
  // Fetch data when activity changes
  useEffect(() => {
    if (selectedActivityId) {
      fetchData();
    }
  }, [selectedActivityId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch registrations with profiles
      const { data: regs, error: regsError } = await supabase
  .from('activity_registrations')
  .select(`
    id, created_at, user_id, activity_id,
    profiles!activity_registrations_user_id_fkey (id, parent_name, parent_phone, children, user_type)
  `)
  .eq('activity_id', selectedActivityId)
  .order('created_at', { ascending: true });

      if (regsError) throw regsError;
      setRegistrations(regs || []);

      // Fetch attendance records
      const { data: att, error: attError } = await supabase
  .from('attendance')
  .select('*')
  .eq('activity_id', selectedActivityId);

if (attError) throw attError;
setAttendanceRecords(att || []);

// Fetch children table records for level data
const parentIds = [...new Set((regs || []).map(r => r.user_id).filter(Boolean))];
if (parentIds.length > 0) {
  const { data: childrenData } = await supabase
    .from('children')
    .select('*')
    .in('parent_id', parentIds);

  const map = {};
  (childrenData || []).forEach(c => {
    map[`${c.parent_id}-${c.name}`] = c;
  });
  setChildrenMap(map);
}
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Check if a child is marked as attended
  const isChildAttended = (parentId, childName) => {
    return attendanceRecords.some(
      r => r.parent_id === parentId && r.child_name === childName
    );
  };

  // Get attendance record for a child
  const getAttendanceRecord = (parentId, childName) => {
    return attendanceRecords.find(
      r => r.parent_id === parentId && r.child_name === childName
    );
  };

  const isChildHonored = (parentId, childName) => {
  const record = attendanceRecords.find(
    r => r.parent_id === parentId && r.child_name === childName
  );
  return record?.is_honored || false;
};

const toggleHonor = async (parentId, childName) => {
  const key = `honor-${parentId}-${childName}`;
  if (togglingHonor[key]) return;

  const record = getAttendanceRecord(parentId, childName);
  if (!record) return;

  setTogglingHonor(prev => ({ ...prev, [key]: true }));
  const newValue = !record.is_honored;

  try {
    const { error } = await supabase
      .from('attendance')
      .update({ is_honored: newValue })
      .eq('id', record.id);

    if (error) throw error;

    setAttendanceRecords(prev =>
      prev.map(r => r.id === record.id ? { ...r, is_honored: newValue } : r)
    );
    toast.success(newValue ? 'تم منح وسام قدوة النشاط ⭐' : 'تم إزالة الوسام');
  } catch (error) {
    console.error('Honor toggle error:', error);
    toast.error('حدث خطأ');
  } finally {
    setTogglingHonor(prev => ({ ...prev, [key]: false }));
  }
};

const toggleWalkInHonor = async (recordId) => {
  const key = `honor-walkin-${recordId}`;
  if (togglingHonor[key]) return;

  const record = attendanceRecords.find(r => r.id === recordId);
  if (!record) return;

  setTogglingHonor(prev => ({ ...prev, [key]: true }));
  const newValue = !record.is_honored;

  try {
    const { error } = await supabase
      .from('attendance')
      .update({ is_honored: newValue })
      .eq('id', recordId);

    if (error) throw error;

    setAttendanceRecords(prev =>
      prev.map(r => r.id === recordId ? { ...r, is_honored: newValue } : r)
    );
    toast.success(newValue ? 'تم منح وسام قدوة النشاط ⭐' : 'تم إزالة الوسام');
  } catch (error) {
    toast.error('حدث خطأ');
  } finally {
    setTogglingHonor(prev => ({ ...prev, [key]: false }));
  }
};
  // Toggle single child attendance
  const toggleAttendance = async (parentId, parentName, childName, childAge) => {
    const key = `${parentId}-${childName}`;
    if (toggling[key]) return;

    setToggling(prev => ({ ...prev, [key]: true }));
    const existing = getAttendanceRecord(parentId, childName);

    try {
      if (existing) {
        // Remove
        const { error } = await supabase.from('attendance').delete().eq('id', existing.id);
        if (error) throw error;
        setAttendanceRecords(prev => prev.filter(r => r.id !== existing.id));
      } else {
        // Add
        const { data, error } = await supabase
          .from('attendance')
          .insert({
            activity_id: selectedActivityId,
            child_name: childName,
            child_age: childAge || null,
            parent_id: parentId,
            parent_name: parentName
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setAttendanceRecords(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('حدث خطأ');
    } finally {
      setToggling(prev => ({ ...prev, [key]: false }));
    }
  };

  // Mark all children in a family
  const markAllFamily = async (registration, markPresent) => {
    const profile = registration.profiles;
    if (!profile?.children || profile.children.length === 0) return;

    const toastId = toast.loading(markPresent ? 'تسجيل حضور الجميع...' : 'إلغاء حضور الجميع...');

    try {
      if (markPresent) {
        // Insert all children who aren't already marked
        const toInsert = profile.children.filter(
          child => !isChildAttended(profile.id, child.name)
        );

        if (toInsert.length === 0) {
          toast.success('جميع الأبناء مسجلون بالفعل', { id: toastId });
          return;
        }

        const records = toInsert.map(child => ({
          activity_id: selectedActivityId,
          child_name: child.name,
          child_age: child.age || null,
          parent_id: profile.id,
          parent_name: profile.parent_name
        }));

        const { data, error } = await supabase
          .from('attendance')
          .insert(records)
          .select();

        if (error) throw error;
        if (data) setAttendanceRecords(prev => [...prev, ...data]);
        toast.success(`تم تسجيل حضور ${toInsert.length} طفل`, { id: toastId });
      } else {
        // Remove all attendance records for this family in this activity
        const familyRecords = attendanceRecords.filter(
          r => r.parent_id === profile.id
        );

        if (familyRecords.length === 0) {
          toast.success('لا يوجد حضور مسجل', { id: toastId });
          return;
        }

        const ids = familyRecords.map(r => r.id);
        const { error } = await supabase
          .from('attendance')
          .delete()
          .in('id', ids);

        if (error) throw error;
        setAttendanceRecords(prev => prev.filter(r => !ids.includes(r.id)));
        toast.success('تم إلغاء الحضور', { id: toastId });
      }
    } catch (error) {
      console.error('Bulk toggle error:', error);
      toast.error('حدث خطأ', { id: toastId });
    }
  };

  // Mark ALL registered children present
  const markAllPresent = async () => {
    const toastId = toast.loading('تسجيل حضور الجميع...');
    try {
      const toInsert = [];

      registrations.forEach(reg => {
        const profile = reg.profiles;
        if (!profile?.children) return;

        profile.children.forEach(child => {
          if (!isChildAttended(profile.id, child.name)) {
            toInsert.push({
              activity_id: selectedActivityId,
              child_name: child.name,
              child_age: child.age || null,
              parent_id: profile.id,
              parent_name: profile.parent_name
            });
          }
        });
      });

      if (toInsert.length === 0) {
        toast.success('جميع الأطفال مسجلون بالفعل', { id: toastId });
        return;
      }

      const { data, error } = await supabase
        .from('attendance')
        .insert(toInsert)
        .select();

      if (error) throw error;
      if (data) setAttendanceRecords(prev => [...prev, ...data]);
      toast.success(`تم تسجيل حضور ${toInsert.length} طفل`, { id: toastId });
    } catch (error) {
      console.error('Mark all error:', error);
      toast.error('حدث خطأ', { id: toastId });
    }
  };

  // Add walk-in
  const handleAddWalkIn = async (e) => {
    e.preventDefault();
    if (!walkInForm.child_name.trim()) {
      toast.error('اسم الشاب مطلوب');
      return;
    }

    setAddingWalkIn(true);
    try {
      const { data, error } = await supabase
        .from('attendance')
        .insert({
          activity_id: selectedActivityId,
          child_name: walkInForm.child_name.trim(),
          child_age: walkInForm.child_age || null,
          parent_id: null,
          parent_name: walkInForm.parent_name.trim() || null
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setAttendanceRecords(prev => [...prev, data]);
        setWalkInForm({ child_name: '', child_age: '', parent_name: '' });
        setShowWalkInForm(false);
        toast.success('تمت الإضافة');
      }
    } catch (error) {
      console.error('Walk-in error:', error);
      toast.error('فشلت الإضافة');
    } finally {
      setAddingWalkIn(false);
    }
  };

  const getChildRecord = (parentId, childName) => {
  return childrenMap[`${parentId}-${childName}`] || null;
};

const handleLevelChange = async (parentId, childName, childAge, newLevel) => {
  const key = `level-${parentId}-${childName}`;
  if (changingLevel[key]) return;
  setChangingLevel(prev => ({ ...prev, [key]: true }));

  let record = childrenMap[`${parentId}-${childName}`];

  try {
    if (!record && parentId) {
      const { data, error } = await supabase
        .from('children')
        .insert({ parent_id: parentId, name: childName, age: childAge || null, level: newLevel })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setChildrenMap(prev => ({ ...prev, [`${parentId}-${childName}`]: data }));
        toast.success(`تم تحديث المستوى: ${getLevelDef(newLevel).label}`);
      }
    } else if (record) {
      const { error } = await supabase
        .from('children')
        .update({ level: newLevel, updated_at: new Date().toISOString() })
        .eq('id', record.id);

      if (error) throw error;
      setChildrenMap(prev => ({
        ...prev,
        [`${parentId}-${childName}`]: { ...record, level: newLevel }
      }));
      toast.success(`تم تحديث المستوى: ${getLevelDef(newLevel).label}`);
    }
  } catch (error) {
    console.error('Level change error:', error);
    toast.error('حدث خطأ');
  } finally {
    setChangingLevel(prev => ({ ...prev, [key]: false }));
  }
};

const openChildProfile = (parentId, childName) => {
  const record = childrenMap[`${parentId}-${childName}`];
  if (record) {
    setSelectedChildProfile({ record, parentId });
  }
};
  // Remove walk-in
  const removeWalkIn = async (recordId) => {
    try {
      const { error } = await supabase.from('attendance').delete().eq('id', recordId);
      if (error) throw error;
      setAttendanceRecords(prev => prev.filter(r => r.id !== recordId));
      toast.success('تم الحذف');
    } catch (error) {
      toast.error('فشل الحذف');
    }
  };

  // Walk-in records (no parent_id)
  const walkInRecords = attendanceRecords.filter(r => !r.parent_id);

  // Only parent registrations with children
  const parentRegistrations = registrations.filter(
    r => r.profiles?.children && r.profiles.children.length > 0
  );

  // Filter by search
  const filteredRegistrations = useMemo(() => {
    if (!searchQuery.trim()) return parentRegistrations;
    const q = searchQuery.toLowerCase();
    return parentRegistrations.filter(reg => {
      const profile = reg.profiles;
      if (profile.parent_name?.toLowerCase().includes(q)) return true;
      if (profile.children?.some(c => c.name.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [parentRegistrations, searchQuery]);

  // Stats
  const totalRegisteredChildren = parentRegistrations.reduce(
    (sum, reg) => sum + (reg.profiles?.children?.length || 0), 0
  );
  const attendedFromRegistered = attendanceRecords.filter(r => r.parent_id).length;
  const totalAttended = attendanceRecords.length;
  const attendanceRate = totalRegisteredChildren > 0
    ? Math.round((attendedFromRegistered / totalRegisteredChildren) * 100)
    : 0;

  const selectedActivity = activities.find(a => a.id === selectedActivityId);

  return (
    <div className="space-y-6">

      {/* ==========================================
          ACTIVITY SELECTOR
      ========================================== */}
      <div className="bg-base-100 rounded-2xl p-5 md:p-6 shadow-sm">
        <h2 className="text-lg md:text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <FaCalendarAlt /> اختر النشاط
        </h2>
        <div ref={dropdownRef} className="relative w-full max-w-md" dir="rtl">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`w-full bg-base-100 border-2 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 transition-all ${
              dropdownOpen
                ? 'border-primary shadow-[0_0_0_3px_rgba(18,129,195,0.12)]'
                : 'border-base-300 hover:border-primary'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-base-200 flex items-center justify-center shrink-0">
                <FaCalendarAlt className="text-primary text-sm" />
              </div>
              <div className="text-right flex-1 min-w-0">
                <p className="text-sm font-bold text-base-content truncate">
                  {selectedActivityId
                    ? activities.find(a => a.id === selectedActivityId)?.title || 'اختر نشاطاً...'
                    : 'اختر نشاطاً...'}
                </p>
                <p className="text-xs text-base-content/50 mt-0.5">
                  {selectedActivityId
                    ? activities.find(a => a.id === selectedActivityId)?.activity_date || ''
                    : 'لم يتم الاختيار بعد'}
                </p>
              </div>
            </div>
            <FaChevronDown className={`text-primary text-sm shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 left-0 bg-base-100 border-2 border-base-300 rounded-2xl overflow-hidden z-50 shadow-lg">
              <div className="p-2">
                {activities.filter(a => a.is_upcoming).length > 0 && (
                  <>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-primary">
                      <span>النشاطات القادمة</span>
                      <div className="flex-1 h-px bg-base-200" />
                    </div>
                    {activities.filter(a => a.is_upcoming).map(activity => (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() => { setSelectedActivityId(activity.id); setSearchQuery(''); setDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-colors ${
                          selectedActivityId === activity.id ? 'bg-base-200' : 'hover:bg-base-200/60'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FaCalendarAlt className="text-primary text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-base-content truncate">{activity.title}</p>
                          <p className="text-xs text-base-content/50">{activity.activity_date || 'تاريخ غير محدد'} • السعة: {activity.capacity}</p>
                        </div>
                        {selectedActivityId === activity.id
                          ? <span className="badge badge-primary badge-sm shrink-0">محدد</span>
                          : <span className="badge badge-sm shrink-0" style={{background:'#dbeafe',color:'#1281c3'}}>قادم</span>
                        }
                      </button>
                    ))}
                  </>
                )}
                {activities.filter(a => !a.is_upcoming).length > 0 && (
                  <>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-base-content/40 mt-1">
                      <span>النشاطات السابقة</span>
                      <div className="flex-1 h-px bg-base-200" />
                    </div>
                    {activities.filter(a => !a.is_upcoming).map(activity => (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() => { setSelectedActivityId(activity.id); setSearchQuery(''); setDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-colors ${
                          selectedActivityId === activity.id ? 'bg-base-200' : 'hover:bg-base-200/60'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                          <FaClipboardCheck className="text-base-content/40 text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-base-content truncate">{activity.title}</p>
                          <p className="text-xs text-base-content/50">{activity.activity_date || 'تاريخ غير محدد'}</p>
                        </div>
                        {selectedActivityId === activity.id
                          ? <span className="badge badge-primary badge-sm shrink-0">محدد</span>
                          : <span className="badge badge-ghost badge-sm shrink-0">منتهي</span>
                        }
                      </button>
                    ))}
                  </>
                )}
                {activities.length === 0 && (
                  <div className="text-center py-6 text-base-content/50 text-sm">لا توجد نشاطات</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show content only when activity is selected */}
      {selectedActivityId && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <>
              {/* ==========================================
                  SUMMARY STATS BAR
              ========================================== */}
              <div className="bg-base-100 rounded-2xl p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    <FaClipboardCheck /> ملخص الحضور
                  </h3>
                  <button onClick={fetchData} className="btn btn-ghost btn-sm gap-2">
                    <FaSync /> تحديث
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                  <div className="bg-primary/5 rounded-xl p-3 md:p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary">{totalAttended}</div>
                    <div className="text-xs md:text-sm text-base-content/50">إجمالي الحاضرين</div>
                  </div>
                  <div className="bg-secondary/5 rounded-xl p-3 md:p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-secondary">{attendedFromRegistered}</div>
                    <div className="text-xs md:text-sm text-base-content/50">من المسجلين</div>
                  </div>
                  <div className="bg-accent/5 rounded-xl p-3 md:p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-accent">{walkInRecords.length}</div>
                    <div className="text-xs md:text-sm text-base-content/50">حضور مباشر</div>
                  </div>
                  <div className="bg-success/5 rounded-xl p-3 md:p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-success">{attendanceRate}%</div>
                    <div className="text-xs md:text-sm text-base-content/50">نسبة الحضور</div>
                  </div>
                  <div className="bg-warning/5 rounded-xl p-3 md:p-4 text-center">
  <div className="text-2xl md:text-3xl font-bold text-warning">{attendanceRecords.filter(r => r.is_honored).length}</div>
  <div className="text-xs md:text-sm text-base-content/50">قدوة النشاط ⭐</div>
</div>
                </div>

                {/* Progress bar */}
                {totalRegisteredChildren > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-base-content/50 mb-1">
                      <span>{attendedFromRegistered} من {totalRegisteredChildren} طفل مسجل</span>
                      <span>{attendanceRate}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-base-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500"
                        style={{ width: `${attendanceRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ==========================================
                  SEARCH + BULK ACTIONS
              ========================================== */}
              <div className="bg-base-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <FaSearch className="absolute top-3.5 right-3 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="بحث باسم الشاب أو ولي الأمر..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input input-bordered rounded-xl w-full pr-10 input-sm md:input-md"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={markAllPresent}
                    className="btn btn-sm md:btn-md btn-success btn-outline rounded-xl gap-1 md:gap-2 flex-1 sm:flex-none"
                  >
                    <FaCheckDouble className="text-xs md:text-sm" />
                    <span className="text-xs md:text-sm">الكل حاضر</span>
                  </button>
                  <button
                    onClick={() => setShowWalkInForm(!showWalkInForm)}
                    className="btn btn-sm md:btn-md btn-primary btn-outline rounded-xl gap-1 md:gap-2 flex-1 sm:flex-none"
                  >
                    <FaUserPlus className="text-xs md:text-sm" />
                    <span className="text-xs md:text-sm">حضور يدوي</span>
                  </button>
                </div>
              </div>

              {/* ==========================================
                  WALK-IN FORM
              ========================================== */}
              <AnimatePresence>
                {showWalkInForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-primary flex items-center gap-2 text-sm md:text-base">
                          <FaUserPlus /> إضافة حضور يدوي (بدون تسجيل مسبق)
                        </h3>
                        <button onClick={() => setShowWalkInForm(false)} className="btn btn-ghost btn-sm btn-circle">
                          <FaTimes />
                        </button>
                      </div>

                      <form onSubmit={handleAddWalkIn} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="form-control">
                          <label className="label py-1"><span className="label-text text-xs font-bold">اسم الشاب *</span></label>
                          <input
                            type="text"
                            value={walkInForm.child_name}
                            onChange={(e) => setWalkInForm({ ...walkInForm, child_name: e.target.value })}
                            className="input input-bordered input-sm rounded-xl"
                            placeholder="اسم الشاب"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label py-1"><span className="label-text text-xs font-bold">العمر</span></label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={walkInForm.child_age}
                            onChange={(e) => setWalkInForm({ ...walkInForm, child_age: e.target.value.replace(/[^0-9]/g, '') })}
                            className="input input-bordered input-sm rounded-xl"
                            placeholder="اختياري"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label py-1"><span className="label-text text-xs font-bold">اسم ولي الأمر</span></label>
                          <input
                            type="text"
                            value={walkInForm.parent_name}
                            onChange={(e) => setWalkInForm({ ...walkInForm, parent_name: e.target.value })}
                            className="input input-bordered input-sm rounded-xl"
                            placeholder="اختياري"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <button type="submit" disabled={addingWalkIn} className="btn btn-primary btn-sm rounded-xl w-full gap-2 text-white">
                            {addingWalkIn ? <span className="loading loading-spinner loading-xs"></span> : <FaPlus />}
                            إضافة
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ==========================================
                  REGISTERED FAMILIES ATTENDANCE
              ========================================== */}
              <div className="bg-base-100 rounded-3xl p-5 md:p-6 shadow-sm">
                <h3 className="text-lg md:text-xl font-bold text-primary mb-5 flex items-center gap-2">
                  <FaUsers /> العائلات المسجلة
                  <span className="badge badge-primary badge-sm">{filteredRegistrations.length}</span>
                </h3>

                {filteredRegistrations.length === 0 ? (
                  <div className="text-center py-12 text-base-content/50">
                    <FaUsers className="text-4xl mx-auto mb-3 text-base-content/20" />
                    <p>{searchQuery ? 'لا توجد نتائج مطابقة' : 'لا توجد عائلات مسجلة في هذا النشاط'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRegistrations.map((reg) => {
                      const profile = reg.profiles;
                      if (!profile) return null;

                      const children = profile.children || [];
                      const attendedCount = children.filter(c => isChildAttended(profile.id, c.name)).length;
                      const allPresent = children.length > 0 && attendedCount === children.length;

                      return (
                        <div
                          key={reg.id}
                          className={`border-2 rounded-2xl overflow-hidden transition-colors duration-200 ${
                            allPresent
                              ? 'border-success/30 bg-success/5'
                              : attendedCount > 0
                              ? 'border-warning/20 bg-warning/5'
                              : 'border-base-200'
                          }`}
                        >
                          {/* Family Header */}
                          <div className="flex items-center gap-3 p-3 md:p-4">
                            {/* Status indicator */}
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                              allPresent ? 'bg-success/20 text-success' : attendedCount > 0 ? 'bg-warning/20 text-warning' : 'bg-base-200 text-base-content/30'
                            }`}>
                              {allPresent ? <FaCheckCircle className="text-sm md:text-base" /> : <FaChild className="text-sm md:text-base" />}
                            </div>

                            {/* Parent info */}
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-base-content text-sm md:text-base truncate">
                                {profile.parent_name || 'بدون اسم'}
                              </div>
                              <div className="text-xs text-base-content/50 flex items-center gap-1">
                                <FaPhone className="text-[10px]" />
                                <span dir="ltr">{profile.parent_phone || '-'}</span>
                              </div>
                            </div>

                            {/* Attendance counter */}
                            <div className="text-center shrink-0">
                              <div className={`text-sm md:text-base font-bold ${allPresent ? 'text-success' : 'text-base-content/70'}`}>
                                {attendedCount}/{children.length}
                              </div>
                              <div className="text-[10px] text-base-content/40">حاضر</div>
                            </div>

                            {/* Family bulk action */}
                            <button
                              onClick={() => markAllFamily(reg, !allPresent)}
                              className={`btn btn-xs md:btn-sm rounded-lg shrink-0 gap-1 ${
                                allPresent
                                  ? 'btn-ghost text-error hover:bg-error/10'
                                  : 'btn-success btn-outline'
                              }`}
                              title={allPresent ? 'إلغاء حضور الكل' : 'تسجيل حضور الكل'}
                            >
                              {allPresent ? <FaTimesCircle className="text-xs" /> : <FaCheckDouble className="text-xs" />}
                              <span className="hidden sm:inline text-xs">{allPresent ? 'إلغاء الكل' : 'الكل حاضر'}</span>
                            </button>
                          </div>

                          {/* Children List */}
                          {children.length > 0 && (
                            <div className="border-t border-base-200/50 px-3 md:px-4 py-2 md:py-3 space-y-1.5">
                              {children.map((child, idx) => {
                                const attended = isChildAttended(profile.id, child.name);
                                const key = `${profile.id}-${child.name}`;
                                const isToggling = toggling[key];

                                return (
                                  <div
  key={idx}
  className={`w-full flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-xl transition-all duration-200 text-right ${
    attended
      ? isChildHonored(profile.id, child.name)
        ? 'bg-warning/10 hover:bg-warning/15 ring-1 ring-warning/20'
        : 'bg-success/10 hover:bg-success/20'
      : 'bg-base-200/50 hover:bg-base-200'
  } ${isToggling ? 'opacity-50' : ''}`}
>
  {/* Attendance toggle */}
  <button
    onClick={() => toggleAttendance(profile.id, profile.parent_name, child.name, child.age)}
    disabled={isToggling}
    className={`w-6 h-6 md:w-7 md:h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
      attended
        ? 'bg-success border-success text-white'
        : 'border-base-300 bg-base-100'
    }`}
  >
    {isToggling ? (
      <span className="loading loading-spinner loading-xs"></span>
    ) : attended ? (
      <FaCheck className="text-xs" />
    ) : null}
  </button>

  {/* Child name — clickable */}
  <button
    onClick={() => openChildProfile(profile.id, child.name)}
    className="flex-1 min-w-0 text-right hover:underline decoration-dotted underline-offset-4"
    title="عرض بطاقة الطفل"
  >
    <span className={`font-medium text-sm md:text-base ${
      isChildHonored(profile.id, child.name) ? 'text-warning' : attended ? 'text-success' : 'text-base-content'
    }`}>
      {child.name}
    </span>
  </button>

  {/* Level badge */}
  {(() => {
    const rec = getChildRecord(profile.id, child.name);
    const lvl = getLevelDef(rec?.level);
    if (rec && rec.level && rec.level !== 'new') {
      return (
        <span className={`badge badge-xs shrink-0 gap-0.5 ${lvl.bg} ${lvl.text} ${lvl.border} border`}>
          {lvl.emoji}
          <span className="hidden sm:inline">{lvl.label}</span>
        </span>
      );
    }
    return null;
  })()}

  {/* Honor badge */}
  {isChildHonored(profile.id, child.name) && (
    <span className="badge badge-warning badge-xs gap-0.5 shrink-0">
      <FaCrown className="text-[8px]" /> قدوة
    </span>
  )}

  {/* Age */}
  {child.age && (
    <span className={`badge badge-sm shrink-0 ${attended ? 'badge-success badge-outline' : 'badge-ghost'}`}>
      {child.age} سنة
    </span>
  )}

  {/* Honor toggle */}
  {attended && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleHonor(profile.id, child.name);
      }}
      disabled={togglingHonor[`honor-${profile.id}-${child.name}`]}
      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
        isChildHonored(profile.id, child.name)
          ? 'bg-warning/20 text-warning hover:bg-warning/30'
          : 'bg-base-200 text-base-content/20 hover:text-warning hover:bg-warning/10'
      }`}
      title={isChildHonored(profile.id, child.name) ? 'إزالة وسام قدوة النشاط' : 'منح وسام قدوة النشاط'}
    >
      {togglingHonor[`honor-${profile.id}-${child.name}`] ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <FaCrown className="text-xs md:text-sm" />
      )}
    </button>
  )}

  {/* Level selector — admin only, when attended */}
  {attended && (
    <select
      value={getChildRecord(profile.id, child.name)?.level || 'new'}
      onChange={(e) => handleLevelChange(profile.id, child.name, child.age, e.target.value)}
      disabled={changingLevel[`level-${profile.id}-${child.name}`]}
      className="select select-xs rounded-lg bg-base-200/50 border-base-300 text-xs w-20 md:w-24 shrink-0"
      title="تغيير المستوى"
    >
      {levelDefinitions.map(l => (
        <option key={l.id} value={l.id}>{l.emoji} {l.label}</option>
      ))}
    </select>
  )}
</div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ==========================================
                  WALK-IN RECORDS
              ========================================== */}
              {walkInRecords.length > 0 && (
                <div className="bg-base-100 rounded-3xl p-5 md:p-6 shadow-sm">
                  <h3 className="text-lg md:text-xl font-bold text-accent mb-5 flex items-center gap-2">
                    <FaUserPlus /> حضور مباشر (بدون تسجيل)
                    <span className="badge badge-accent badge-sm">{walkInRecords.length}</span>
                  </h3>

                  <div className="space-y-2">
                    {walkInRecords.map((record) => (
  <div
    key={record.id}
    className={`flex items-center gap-3 p-3 rounded-xl border ${
      record.is_honored
        ? 'bg-warning/10 border-warning/20'
        : 'bg-accent/5 border-accent/10'
    }`}
  >
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
      record.is_honored ? 'bg-warning/20 text-warning' : 'bg-accent/20 text-accent'
    }`}>
      {record.is_honored ? <FaCrown className="text-sm" /> : <FaChild className="text-sm" />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-bold text-base-content text-sm truncate flex items-center gap-2">
        {record.child_name}
        {record.is_honored && (
          <span className="badge badge-warning badge-xs gap-0.5">
            <FaCrown className="text-[8px]" /> قدوة
          </span>
        )}
      </div>
      <div className="text-xs text-base-content/50">
        {record.child_age && `${record.child_age} سنة`}
        {record.child_age && record.parent_name && ' • '}
        {record.parent_name && `ولي الأمر: ${record.parent_name}`}
      </div>
    </div>
    <button
      onClick={() => toggleWalkInHonor(record.id)}
      disabled={togglingHonor[`honor-walkin-${record.id}`]}
      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
        record.is_honored
          ? 'bg-warning/20 text-warning hover:bg-warning/30'
          : 'bg-base-200 text-base-content/20 hover:text-warning hover:bg-warning/10'
      }`}
      title={record.is_honored ? 'إزالة الوسام' : 'منح وسام قدوة النشاط'}
    >
      {togglingHonor[`honor-walkin-${record.id}`] ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <FaCrown className="text-xs" />
      )}
    </button>
    <button
      onClick={() => removeWalkIn(record.id)}
      className="btn btn-ghost btn-xs text-error hover:bg-error/10 shrink-0"
    >
      <FaTrash />
    </button>
  </div>
))}
                  </div>
                </div>
              )}

              {/* ==========================================
                  NO DATA STATE
              ========================================== */}
              {parentRegistrations.length === 0 && walkInRecords.length === 0 && (
                <div className="text-center py-16 text-base-content/50">
                  <FaClipboardCheck className="text-5xl mx-auto mb-4 text-base-content/20" />
                  <p className="text-lg font-medium mb-2">لا يوجد بيانات حضور</p>
                  <p className="text-sm">لا توجد عائلات مسجلة في هذا النشاط. يمكنك إضافة حضور يدوي.</p>
                </div>
              )}
            </>
          )}
        </>
      )}
      {selectedChildProfile && (
  <ChildProfileModal
    child={selectedChildProfile.record}
    parentId={selectedChildProfile.parentId}
    isAdmin={true}
    isOwner={false}
    onClose={() => setSelectedChildProfile(null)}
    onUpdate={(updated) => {
      setChildrenMap(prev => ({
        ...prev,
        [`${updated.parent_id}-${updated.name}`]: { ...prev[`${updated.parent_id}-${updated.name}`], ...updated }
      }));
      setSelectedChildProfile(null);
    }}
  />
)}
    </div>
  );
}