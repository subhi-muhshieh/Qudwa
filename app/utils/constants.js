export const userTypeLabels = {
  'parent': 'ولي أمر',
  'member': 'عضو جمعية',
  'volunteer': 'متطوع',
  'donor': 'داعم/مانح',
  'follower': 'متابع'
};

export const rankLabels = {
  'president': 'رئيس الجمعية',
  'vice_president': 'نائب رئيس الجمعية',
  'office_manager': 'مدير مكتب',
  'secretary': 'أمين سر',
  'monetary_manager': 'مدير مالي',
  'member': 'عضو'
};

export const officeLabels = {
  'activity': 'مكتب الأنشطة',
  'media': 'المكتب الإعلامي',
  'scientific': 'المكتب العلمي',
  'logistic': 'المكتب اللوجستي'
};

export const memberRanks = [
  { id: 'president', label: 'رئيس الجمعية', noOffice: true },
  { id: 'vice_president', label: 'نائب رئيس الجمعية', noOffice: false },
  { id: 'office_manager', label: 'مدير مكتب', noOffice: false },
  { id: 'secretary', label: 'أمين سر', noOffice: false },
  { id: 'monetary_manager', label: 'مدير مالي', noOffice: false },
  { id: 'member', label: 'عضو', noOffice: false },
];

export const offices = [
  { id: 'activity', label: 'مكتب الأنشطة' },
  { id: 'media', label: 'المكتب الإعلامي' },
  { id: 'scientific', label: 'المكتب العلمي' },
  { id: 'logistic', label: 'المكتب اللوجستي' },
];

export const userTypes = [
  { id: 'parent', label: 'ولي أمر', desc: 'لتسجيل أبنائك' },
  { id: 'member', label: 'عضو جمعية', desc: 'للكادر الإداري' },
  { id: 'volunteer', label: 'متطوع', desc: 'للانضمام للفريق' },
  { id: 'donor', label: 'داعم/مانح', desc: 'لدعم الجمعية' },
  { id: 'follower', label: 'متابع', desc: 'للمتابعة والاطلاع' },
];

export const levelDefinitions = [
  { id: 'new', label: 'جديد', emoji: '🌱', bg: 'bg-green-400/10', text: 'text-green-400', border: 'border-green-400/20' },
  { id: 'promising', label: 'واعد', emoji: '✨', bg: 'bg-blue-400/10', text: 'text-blue-400', border: 'border-blue-400/20' },
  { id: 'distinguished', label: 'متميز', emoji: '⭐', bg: 'bg-orange-400/10', text: 'text-orange-400', border: 'border-orange-400/20' },
  { id: 'star', label: 'نجم قدوة', emoji: '🌟', bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20' },
  { id: 'ideal', label: 'قدوة مثالية', emoji: '👑', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
];

export const getLevelDef = (levelId) => {
  return levelDefinitions.find(l => l.id === levelId) || levelDefinitions[0];
};