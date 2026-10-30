/**
 * Display-only data for the Mount Disappointment site.
 *
 * This is presentation data — campuses, service listings, clinicians, news. The
 * page *copy* lives in content.ts as ContentPage blocks so that it is harvested
 * into the assistants' retrieval index. Keeping the two separate means adding a
 * card here never silently changes what the chatbot can answer.
 *
 * Every clinician below is invented. Any resemblance to a real practitioner is
 * coincidental; the site states this in the footer and on the page itself.
 */

export interface Campus {
  id: string
  name: string
  shortName: string
  tag: string
  address: string
  phone: string
  note: string
  image: string
  imageAlt: string
}

export const CAMPUSES: Campus[] = [
  {
    id: 'mountdis',
    name: 'Mount Disappointment Campus',
    shortName: 'Mount Disappointment',
    tag: 'Acute and emergency',
    address: '1 Ridge Road, Mount Disappointment',
    phone: '(03) 5773 0000',
    note: 'Emergency department open 24 hours. 218 beds.',
    image: '/img/hero-campus.jpg',
    imageAlt: 'The main entrance and drop-off canopy at the Mount Disappointment campus',
  },
  {
    id: 'wattlebridge',
    name: 'Wattlebridge Community Campus',
    shortName: 'Wattlebridge',
    tag: 'Community and allied health',
    address: '38 Main Street, Wattlebridge',
    phone: '(03) 5773 0100',
    note: 'No emergency department. Open Monday to Friday, 8.30am to 5pm.',
    image: '/img/waiting.jpg',
    imageAlt: 'The waiting area at the Wattlebridge community campus',
  },
  {
    id: 'southridge',
    name: 'South Ridge Day Procedure Centre',
    shortName: 'South Ridge',
    tag: 'Day procedures',
    address: '7 Quarry Lane, South Ridge',
    phone: '(03) 5773 0200',
    note: 'Day surgery and endoscopy. Patients arrive from 7am. No overnight stay.',
    image: '/img/corridor.jpg',
    imageAlt: 'A corridor leading to the procedure rooms at South Ridge',
  },
]

export interface QuickAction {
  label: string
  body: string
  to: string
  icon: 'calendar' | 'bed' | 'people' | 'info' | 'phone' | 'doctor'
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Book an appointment',
    body: 'Outpatient clinics, imaging and pathology.',
    to: '/mountdis/appointments',
    icon: 'calendar',
  },
  {
    label: 'Wards and visiting hours',
    body: 'Ward locations, direct numbers and rest periods.',
    to: '/mountdis/wards',
    icon: 'bed',
  },
  {
    label: 'Patients and visitors',
    body: 'Parking, wifi, what to bring, and leaving hospital.',
    to: '/mountdis/patients',
    icon: 'people',
  },
  {
    label: 'Find a clinician',
    body: 'Search consultants, clinics and referral details.',
    to: '/mountdis/find-a-doctor',
    icon: 'doctor',
  },
]

export interface ServiceItem {
  name: string
  category: 'Emergency and acute' | 'Medical and surgical' | 'Women and children' | 'Community and allied health' | 'Mental health' | 'Diagnostics'
  campus: string
  referral: string
}

export const SERVICES: ServiceItem[] = [
  { name: 'Emergency department', category: 'Emergency and acute', campus: 'Mount Disappointment', referral: 'No referral required' },
  { name: 'Intensive care unit', category: 'Emergency and acute', campus: 'Mount Disappointment', referral: 'Internal referral' },
  { name: 'General medicine', category: 'Medical and surgical', campus: 'Mount Disappointment', referral: 'GP referral' },
  { name: 'General surgery', category: 'Medical and surgical', campus: 'Mount Disappointment', referral: 'GP referral' },
  { name: 'Orthopaedics', category: 'Medical and surgical', campus: 'Mount Disappointment', referral: 'GP referral with imaging' },
  { name: 'Cardiology', category: 'Medical and surgical', campus: 'Mount Disappointment', referral: 'GP referral' },
  { name: 'Oncology day unit', category: 'Medical and surgical', campus: 'Mount Disappointment', referral: 'Specialist referral' },
  { name: 'Palliative care', category: 'Medical and surgical', campus: 'Mount Disappointment', referral: 'Specialist referral' },
  { name: 'Maternity and birthing', category: 'Women and children', campus: 'Mount Disappointment', referral: 'GP or midwife referral' },
  { name: 'Paediatrics', category: 'Women and children', campus: 'Mount Disappointment', referral: 'GP referral' },
  { name: 'Special care nursery', category: 'Women and children', campus: 'Mount Disappointment', referral: 'Internal referral' },
  { name: 'Physiotherapy', category: 'Community and allied health', campus: 'Wattlebridge', referral: 'GP referral' },
  { name: 'Occupational therapy', category: 'Community and allied health', campus: 'Wattlebridge', referral: 'GP referral' },
  { name: 'Dietetics', category: 'Community and allied health', campus: 'Wattlebridge', referral: 'GP referral' },
  { name: 'Podiatry', category: 'Community and allied health', campus: 'Wattlebridge', referral: 'No referral required' },
  { name: 'Dental', category: 'Community and allied health', campus: 'Wattlebridge', referral: 'No referral required' },
  { name: 'Community nursing', category: 'Community and allied health', campus: 'Wattlebridge', referral: 'GP or hospital referral' },
  { name: 'Continence clinic', category: 'Community and allied health', campus: 'Wattlebridge', referral: 'GP referral' },
  { name: 'Adult mental health', category: 'Mental health', campus: 'Wattlebridge', referral: 'GP or self-referral' },
  { name: 'Youth mental health', category: 'Mental health', campus: 'Wattlebridge', referral: 'Self-referral accepted' },
  { name: 'Alcohol and other drugs', category: 'Mental health', campus: 'Wattlebridge', referral: 'Self-referral accepted' },
  { name: 'Pathology', category: 'Diagnostics', campus: 'Mount Disappointment', referral: 'Request form required' },
  { name: 'Medical imaging', category: 'Diagnostics', campus: 'Mount Disappointment', referral: 'Request form required' },
  { name: 'Endoscopy', category: 'Diagnostics', campus: 'South Ridge', referral: 'Specialist referral' },
  { name: 'Day surgery', category: 'Diagnostics', campus: 'South Ridge', referral: 'Specialist referral' },
]

export interface Clinician {
  name: string
  role: string
  specialty: string
  campus: string
  rooms: string
  referral: string
}

/**
 * Fictional clinicians. Names are invented; rooms follow the campus letter
 * scheme; no real practitioner or registration number is represented.
 */
export const CLINICIANS: Clinician[] = [
  { name: 'Dr Adaeze Okafor', role: 'Consultant physician', specialty: 'General medicine, respiratory', campus: 'Mount Disappointment', rooms: 'Clinic 3B, Level 3', referral: 'GP referral' },
  { name: 'Dr Marcus Feld', role: 'Consultant surgeon', specialty: 'Upper gastrointestinal surgery', campus: 'Mount Disappointment', rooms: 'Clinic 2A, Level 2', referral: 'GP referral with imaging' },
  { name: 'Dr Priya Raghunathan', role: 'Consultant', specialty: 'Cardiology, heart failure', campus: 'Mount Disappointment', rooms: 'Clinic 4C, Level 4', referral: 'GP referral' },
  { name: 'Dr Elena Vasquez', role: 'Consultant obstetrician', specialty: 'Obstetrics and maternal medicine', campus: 'Mount Disappointment', rooms: 'Maternity, Ward 2C', referral: 'GP or midwife referral' },
  { name: 'Dr Samuel Ngo', role: 'Consultant paediatrician', specialty: 'General paediatrics', campus: 'Mount Disappointment', rooms: 'Clinic 1D, Level 1', referral: 'GP referral' },
  { name: 'Dr Harriet Liu', role: 'Consultant', specialty: 'Medical oncology', campus: 'Mount Disappointment', rooms: 'Oncology Day Unit', referral: 'Specialist referral' },
  { name: 'Dr Tom Whitcombe', role: 'Consultant', specialty: 'Palliative medicine', campus: 'Mount Disappointment', rooms: 'Ward 5C', referral: 'Specialist referral' },
  { name: 'Dr Aisha Rahman', role: 'Consultant psychiatrist', specialty: 'Adult mental health', campus: 'Wattlebridge', rooms: 'Building C, Room 12', referral: 'GP or self-referral' },
  { name: 'Ms Joanne Petrov', role: 'Senior physiotherapist', specialty: 'Musculoskeletal and rehabilitation', campus: 'Wattlebridge', rooms: 'Allied Health, Room 4', referral: 'GP referral' },
  { name: 'Dr Vincent Allegro', role: 'Consultant anaesthetist', specialty: 'Anaesthesia, day procedures', campus: 'South Ridge', rooms: 'Pre-admission, Level 1', referral: 'Specialist referral' },
]

export interface NewsItem {
  title: string
  date: string
  kind: string
  summary: string
  slug?: string
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    title: 'New car park payment system from 1 November',
    date: '12 October 2026',
    kind: 'Construction and access',
    summary:
      'The ticket machines at the Mount Disappointment campus will be replaced. The $8 flat rate is unchanged, but the machines will no longer accept cash.',
    slug: 'news',
  },
  {
    title: 'Summit Café upgrade delayed again',
    date: '3 September 2026',
    kind: 'Facilities',
    summary:
      'The reopening has moved to the first quarter of 2027. The main café on Level 1 remains open 7am to 4pm on weekdays.',
    slug: 'news',
  },
  {
    title: 'Ward 3B wayfinding signage to be reviewed',
    date: '21 July 2026',
    kind: 'Patients and visitors',
    summary:
      'Following patient feedback, the signage at the Ward 3B lift lobby will be reviewed. Volunteers are available at the main entrance in the meantime.',
    slug: 'news',
  },
]

/** Category order for the services A–Z page. */
export const SERVICE_CATEGORIES: ServiceItem['category'][] = [
  'Emergency and acute',
  'Medical and surgical',
  'Women and children',
  'Diagnostics',
  'Community and allied health',
  'Mental health',
]
