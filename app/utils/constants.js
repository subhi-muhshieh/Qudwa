export const userTypeLabels = {
  'parent': 'ولي أمر',
  'member': 'عضو جمعية',
  'volunteer': 'متطوع',
  'donor': 'داعم/مانح'
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
];