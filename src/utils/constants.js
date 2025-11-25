// West Visayas State University Colleges
export const COLLEGES = [
  { value: 'CICT', label: 'College of ICT' },
  { value: 'CBM', label: 'College of Business & Management' },
  { value: 'CAS', label: 'College of Arts & Sciences' },
  { value: 'COE', label: 'College of Education' },
  { value: 'CON', label: 'College of Nursing' },
  { value: 'PESCAR', label: 'College of PESCAR' },
  { value: 'COM', label: 'College of Medicine' },
  { value: 'COD', label: 'College of Dentistry' },
  { value: 'COL', label: 'College of Law' },
  { value: 'COC', label: 'College of Communication' }
];

export const YEAR_LEVELS = [
  '1st years',
  '2nd years',
  '3rd years',
  '4th years'
];

// Combined scopes for Event targeting
export const SCOPES = [
  'All Students',
  ...YEAR_LEVELS,
  ...COLLEGES.map(c => c.value)
];

// Map default center (WVSU Campus)
export const DEFAULT_MAP_CENTER = [10.712805, 122.562543];
export const DEFAULT_ZOOM = 17;