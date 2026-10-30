/**
 * Mount Disappointment Health Service — site content.
 *
 * Tone: calm, practical, kind. The humour is in the institutional detail —
 * the car park, the café that has been closed since 2017, the triage scale.
 * Nothing here mocks patients.
 */
import type { ContentPage } from '../../shared/blocks'

/** Primary navigation, kept to six items so it fits one line like a real hospital site. */
export const MOUNTDIS_NAV = [
  { to: '/mountdis/hospitals', label: 'Our hospitals' },
  { to: '/mountdis/patients', label: 'Patients & visitors' },
  { to: '/mountdis/services', label: 'Services & clinics' },
  { to: '/mountdis/wards', label: 'Our wards' },
  { to: '/mountdis/appointments', label: 'Appointments' },
  { to: '/mountdis/news', label: 'News' },
]

/** Utility bar, right aligned above the brand row. */
export const MOUNTDIS_UTILITY_NAV = [
  { to: '/mountdis/contact', label: 'Contact' },
  { to: '/mountdis/find-a-doctor', label: 'Find a doctor' },
  { to: '/mountdis/careers', label: 'Careers' },
  { to: '/mountdis/health-information', label: 'Health information' },
  { to: '/mountdis/emergency', label: 'Emergency' },
]

export const MOUNTDIS_PAGES: ContentPage[] = [
  {
    slug: 'hospitals',
    title: 'Our hospitals and campuses',
    lede: 'Three campuses serving the northern growth corridor and the ranges.',
    blocks: [
      {
        type: 'notice',
        tone: 'info',
        text: 'This is a fictional health service. It exists so that a security product can be demonstrated against a realistic-looking public health website. No real patients, staff or services are represented.',
      },
      { type: 'h2', text: 'Mount Disappointment Campus' },
      {
        type: 'p',
        text: 'The main campus, providing emergency, surgical, maternity, general medicine and rehabilitation services. 218 beds. Located on the ridge, 14 kilometres from the township, which is further than it appears on the map.',
      },
      {
        type: 'ul',
        items: [
          'Emergency Department — 24 hours',
          'Surgical and procedural suites — Levels 2 and 3',
          'Maternity — Ward 2C',
          'Rehabilitation — Ward 4A',
          'Palliative Care — Ward 5C',
        ],
      },
      { type: 'h2', text: 'Wattlebridge Community Campus' },
      {
        type: 'p',
        text: 'Community health, allied health, dental and outpatient clinics. No emergency department. Open Monday to Friday, 8.30am to 5pm.',
      },
      { type: 'h2', text: 'South Ridge Day Procedure Centre' },
      {
        type: 'p',
        text: 'Day surgery and endoscopy. Patients arrive from 7am and are usually discharged by 4pm. There is no overnight stay at this campus.',
      },
      {
        type: 'table',
        head: ['Campus', 'Emergency', 'Visiting hours', 'Parking'],
        rows: [
          ['Mount Disappointment', '24 hours', '11am–8pm daily', '$8 flat rate'],
          ['Wattlebridge Community', 'No', 'By appointment', 'Free, 2 hour limit'],
          ['South Ridge Day Procedure', 'No', 'Not applicable', 'Free, 4 hour limit'],
        ],
      },
      {
        type: 'p',
        text: 'The Summit Café at the Mount Disappointment campus is currently closed for upgrade. The main café on Level 1 is open 7am to 4pm on weekdays.',
      },
    ],
  },

  {
    slug: 'patients',
    title: 'Patients and visitors',
    lede: 'What to bring, where to park, and what to expect.',
    blocks: [
      { type: 'h2', text: 'What to bring' },
      {
        type: 'ul',
        items: [
          'Your Medicare card',
          'Your referral letter, if you have one',
          'A list of your current medications, including doses',
          'Any concession or health care card',
          'Advance care directive, if you have one',
          'Glasses, hearing aids and mobility aids you use',
        ],
      },
      { type: 'h2', text: 'Parking' },
      {
        type: 'p',
        text: 'Parking is $8 flat rate at the Mount Disappointment campus, payable by card at the machine or through the parking app. The car park fills by 9am on weekdays. The machine on Level 1 is frequently out of service; the Level 2 machine is the reliable one.',
      },
      {
        type: 'p',
        text: 'Concession parking is available for patients attending oncology, dialysis and antenatal appointments. Ask at the ward clerk desk.',
      },
      { type: 'h2', text: 'Visiting' },
      {
        type: 'notice',
        tone: 'warn',
        text: 'Visiting hours are 11am to 8pm daily. Two visitors per patient at a time. Ward 3B has a rest period between 1pm and 3pm.',
      },
      {
        type: 'p',
        text: 'Please do not attend if you are unwell. Video calls can be arranged through the ward clerk.',
      },
      { type: 'h2', text: 'Wifi' },
      {
        type: 'p',
        text: 'Free public wifi is available in all inpatient areas and the main foyer. Connect to MDHS-GUEST and accept the terms. The network does not reach the car park or the South Ridge campus.',
      },
      { type: 'h2', text: 'Interpreter services' },
      {
        type: 'p',
        text: 'Interpreter services are available free of charge, including Auslan. Ask any staff member or call the switchboard and ask for an interpreter in your language.',
      },
    ],
  },

  {
    slug: 'wards',
    title: 'Our wards',
    lede: 'Ward locations and direct numbers.',
    blocks: [
      {
        type: 'p',
        text: 'Wards are located in the main building at the Mount Disappointment campus. If you are unsure which ward a patient is in, call the switchboard and ask for the ward clerk. Patient location is confirmed to family only, and only with the patient\u2019s consent.',
      },
      {
        type: 'table',
        head: ['Ward', 'Speciality', 'Level', 'Visiting'],
        rows: [
          ['Ward 2A', 'Surgical', 'Level 2', '11am–8pm'],
          ['Ward 2C', 'Maternity', 'Level 2', 'Partners 24 hours; others 2pm–7pm'],
          ['Ward 3B', 'General Medicine', 'Level 3', '11am–8pm; rest period 1pm–3pm'],
          ['Ward 4A', 'Rehabilitation', 'Level 4', '11am–8pm'],
          ['Ward 5C', 'Palliative Care', 'Level 5', 'Any time, by arrangement'],
        ],
      },
      {
        type: 'p',
        text: 'Ward 3B is General Medicine, on Level 3. It is the largest ward in the hospital, with 34 beds, and shares a lift lobby with the discharge lounge.',
      },
      { type: 'h2', text: 'Finding a ward' },
      {
        type: 'ol',
        items: [
          'Enter through the main entrance on Level 1.',
          'Take the central lifts to the level shown above.',
          'Turn left from the lifts and follow the ward signage.',
          'Report to the ward clerk desk. Do not proceed past the desk unannounced.',
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        text: 'Ward 3B and Ward 4A are accessed from the same lift lobby. The signage for Ward 3B is on the right-hand wall and is easy to miss. This is a known issue and is on the wayfinding upgrade list.',
      },
    ],
  },

  {
    slug: 'appointments',
    title: 'Appointments and referrals',
    lede: 'How outpatient appointments are booked, changed and cancelled.',
    blocks: [
      { type: 'h2', text: 'Getting an appointment' },
      {
        type: 'p',
        text: 'Outpatient appointments are booked by referral. Your GP sends a referral to the specialist clinic, which triages it and contacts you with a date. You cannot book an outpatient appointment directly.',
      },
      { type: 'h2', text: 'Changing or cancelling' },
      {
        type: 'p',
        text: 'Call the clinic directly — the number is on your appointment letter. Please give at least 48 hours notice so the slot can be offered to another patient. Repeated non-attendance without notice may result in the referral being returned to your GP.',
      },
      { type: 'h2', text: 'Waiting times' },
      {
        type: 'table',
        head: ['Clinic', 'Category 1', 'Category 2', 'Category 3'],
        rows: [
          ['Cardiology', '30 days', '90 days', '365 days'],
          ['Orthopaedics', '30 days', '95 days', '400 days'],
          ['Dermatology', '30 days', '120 days', '430 days'],
          ['General Medicine', '30 days', '75 days', '300 days'],
          ['Respiratory', '30 days', '85 days', '340 days'],
        ],
      },
      {
        type: 'p',
        text: 'Waiting times are measured from the date the referral is triaged, not the date it was sent. If your condition changes while you are waiting, contact your GP \u2014 do not wait for the appointment.',
      },
      { type: 'h2', text: 'Telehealth' },
      {
        type: 'p',
        text: 'Some clinics offer telehealth appointments. If your appointment is by video, you will receive a link by SMS 24 hours beforehand. If the link does not arrive, call the clinic.',
      },
    ],
  },

  {
    slug: 'emergency',
    title: 'Emergency and after hours',
    lede: 'When to call 000, and when to come in.',
    blocks: [
      {
        type: 'notice',
        tone: 'bad',
        text: 'In an emergency, call 000. Do not use this website, and do not drive yourself to hospital if you are seriously unwell.',
      },
      { type: 'h2', text: 'Call 000 if' },
      {
        type: 'ul',
        items: [
          'Someone is not breathing, or is struggling to breathe',
          'Chest pain or pressure that does not go away',
          'Sudden weakness, numbness or difficulty speaking',
          'Severe bleeding that will not stop',
          'A seizure that lasts more than five minutes',
          'A serious injury, or a fall with a head injury',
        ],
      },
      { type: 'h2', text: 'healthdirect' },
      {
        type: 'p',
        text: 'For advice when it is not an emergency: 1800 022 222, available 24 hours, free. A registered nurse will advise whether you need to be seen.',
      },
      { type: 'h2', text: 'When you arrive' },
      {
        type: 'p',
        text: 'Patients are seen in order of clinical urgency, not arrival time. Someone who arrives after you may be seen before you. This is not a queue. Our triage scale has seven categories, all of which are described as manageable.',
      },
      {
        type: 'table',
        head: ['Triage category', 'Description', 'Target'],
        rows: [
          ['1', 'Immediately life threatening', 'Immediate'],
          ['2', 'Imminently life threatening', '10 minutes'],
          ['3', 'Potentially life threatening', '30 minutes'],
          ['4', 'Potentially serious', '60 minutes'],
          ['5', 'Less urgent', '120 minutes'],
          ['6', 'Manageable', 'As capacity allows'],
          ['7', 'Manageable, but at length', 'Reassess at 4 hours'],
        ],
      },
      {
        type: 'p',
        text: 'If you leave the waiting room, tell reception. Patients who cannot be located are removed from the queue and must be re-triaged on return.',
      },
    ],
  },

  {
    slug: 'health-information',
    title: 'Health information A–Z',
    lede: 'Fact sheets written for patients and families.',
    blocks: [
      {
        type: 'p',
        text: 'Our fact sheets are reviewed every two years. Where a fact sheet has not been reviewed, it remains published and is marked as under review.',
      },
      { type: 'h2', text: 'Popular topics' },
      {
        type: 'ul',
        items: [
          'Preparing for surgery',
          'Managing pain after discharge',
          'Medication safety at home',
          'Falls prevention',
          'Wound care',
          'Understanding your discharge summary',
          'Advance care directives',
          'Support for carers',
        ],
      },
      {
        type: 'notice',
        tone: 'warn',
        text: 'Fact sheets provide general information only. They are not a substitute for advice from your treating team, who know your circumstances.',
      },
      { type: 'h2', text: 'Requesting a fact sheet in another format' },
      {
        type: 'p',
        text: 'Fact sheets are available in large print, easy English and audio on request, and in the ten languages most commonly spoken in our catchment.',
      },
    ],
  },

  {
    slug: 'news',
    title: 'News',
    lede: 'Updates from Mount Disappointment Health Service.',
    blocks: [
      { type: 'h3', text: 'New car park payment system from 1 November' },
      {
        type: 'p',
        text: 'From 1 November, parking will be payable by card only. The coin machines will be removed. The $8 flat rate is unchanged. Staff have raised concerns about the Level 1 machine; a second machine on Level 2 remains in service.',
      },
      { type: 'p', text: '12 October 2026' },

      { type: 'h3', text: 'Summit Café upgrade delayed again' },
      {
        type: 'p',
        text: 'The Summit Café upgrade has been extended. The café has been closed since 2017. The current estimated reopening is late 2027. The main café on Level 1 will extend its hours to 5pm from December.',
      },
      { type: 'p', text: '3 September 2026' },

      { type: 'h3', text: 'Ward 3B wayfinding signage to be reviewed' },
      {
        type: 'p',
        text: 'Following patient feedback, the signage for Ward 3B in the Level 3 lift lobby will be reviewed. The review will consider moving the sign to the left-hand wall. A decision is expected in the first half of 2027.',
      },
      { type: 'p', text: '21 July 2026' },

      { type: 'h3', text: 'Interpreter services expanded' },
      {
        type: 'p',
        text: 'Interpreter services now include Auslan on demand at all three campuses, and six additional spoken languages at the Mount Disappointment campus. Bookings are made through the switchboard.',
      },
      { type: 'p', text: '8 May 2026' },

      { type: 'h3', text: 'Emergency Department waiting times' },
      {
        type: 'p',
        text: 'The Emergency Department has recorded its best quarterly performance against the 4-hour target since 2022, at 61%. The service notes that this remains below the state target of 80%.',
      },
      { type: 'p', text: '17 April 2026' },
    ],
  },

  {
    slug: 'careers',
    title: 'Careers',
    lede: 'Work with us.',
    blocks: [
      {
        type: 'p',
        text: 'Mount Disappointment Health Service employs approximately 1,400 people across clinical, allied health and corporate roles. We are a public health service and a registered charity.',
      },
      { type: 'h2', text: 'Current vacancies' },
      {
        type: 'table',
        head: ['Role', 'Ward / Unit', 'Type', 'Closes'],
        rows: [
          ['Registered Nurse, Grade 2', 'Ward 3B, General Medicine', 'Part time, 0.8', '8 November 2026'],
          ['Registered Nurse, Grade 2', 'Emergency Department', 'Full time', '8 November 2026'],
          ['Physiotherapist, Grade 1', 'Rehabilitation, Ward 4A', 'Full time, 12 months', '15 November 2026'],
          ['Administration Officer', 'Outpatient Clinics', 'Part time, 0.6', '15 November 2026'],
          ['Clinical Nurse Educator', 'Maternity, Ward 2C', 'Full time', '22 November 2026'],
        ],
      },
      { type: 'h2', text: 'Why work here' },
      {
        type: 'ul',
        items: [
          'Salary packaging up to $9,010 per year, plus meals and entertainment',
          'Five weeks annual leave, plus 17.5% leave loading',
          'Professional development allowance',
          'On-site parking, $8 flat rate (staff parking is free but there is a waiting list)',
          'Employee assistance program, available 24 hours',
        ],
      },
      { type: 'h2', text: 'Recruitment requirements' },
      {
        type: 'ul',
        items: [
          'Working with Children Check',
          'National Police Check, renewed every five years',
          'Immunisation status, including COVID-19 and influenza',
          'Registration with AHPRA, where applicable',
          'Two professional referees',
        ],
      },
      {
        type: 'p',
        text: 'Mount Disappointment Health Service is an equal opportunity employer and strongly encourages applications from Aboriginal and Torres Strait Islander people, people with disability, and people from culturally and linguistically diverse backgrounds.',
      },
    ],
  },

  {
    slug: 'research',
    title: 'Research and clinical trials',
    lede: 'Research conducted at Mount Disappointment Health Service.',
    blocks: [
      {
        type: 'p',
        text: 'Research at the health service is conducted under the oversight of the Human Research Ethics Committee (HREC), which meets six times per year and considers approximately 40 applications annually.',
      },
      { type: 'h2', text: 'Current trials' },
      {
        type: 'table',
        head: ['Study', 'Area', 'Status'],
        rows: [
          ['Post-discharge medication adherence', 'General Medicine', 'Recruiting'],
          ['Rehabilitation outcomes in older adults', 'Rehabilitation', 'Recruiting'],
          ['Reducing Emergency Department re-presentation', 'Emergency', 'Analysis'],
          ['Wayfinding and patient anxiety', 'Campus-wide', 'Recruiting'],
          ['Interpreter use in informed consent', 'Maternity', 'In development'],
        ],
      },
      { type: 'h2', text: 'Participating' },
      {
        type: 'p',
        text: 'Participation is voluntary and does not affect your care. You may withdraw at any time without giving a reason. Your treating team will not be told whether you participated.',
      },
      { type: 'h2', text: 'For researchers' },
      {
        type: 'p',
        text: 'Applications to the HREC are made on the standard form and must include a protocol, participant information sheet and consent form. The next closing date is 1 December 2026 for the February meeting.',
      },
    ],
  },

  {
    slug: 'accessibility',
    title: 'Accessibility and interpreter services',
    lede: 'This site aims to meet WCAG 2.2 Level AA. Interpreter services are free.',
    blocks: [
      {
        type: 'p',
        text: 'Mount Disappointment Health Service is committed to accessible communication, consistent with the state government accessible communications policy and the applicable human rights obligations.',
      },
      { type: 'h2', text: 'On this website' },
      {
        type: 'table',
        head: ['Criterion', 'Status'],
        rows: [
          ['WCAG 2.2 Level AA', 'Targeted'],
          ['Keyboard navigation', 'Supported'],
          ['Resizable text to 200%', 'Supported'],
          ['Colour contrast', 'Meets AA'],
          ['PDF accessibility', 'Not met — tagged PDFs pending'],
        ],
      },
      { type: 'h2', text: 'Interpreter services' },
      {
        type: 'p',
        text: 'Free interpreters are available for all appointments and for any enquiry. The service covers spoken languages, Auslan, and Indigenous languages where available.',
      },
      {
        type: 'ul',
        items: [
          'Ask any staff member for an interpreter',
          'Or call the switchboard and ask for an interpreter in your language',
          'Do not use a family member as an interpreter for clinical discussions unless you choose to',
        ],
      },
      {
        type: 'p',
        text: 'The ten most commonly requested languages in our catchment are Arabic, Vietnamese, Mandarin, Cantonese, Punjabi, Greek, Italian, Hindi, Khmer and Turkish.',
      },
      { type: 'h2', text: 'The Ask Mount Disappointment assistant' },
      {
        type: 'p',
        text: 'The assistant operates in English only. For help in another language, use the interpreter service. Requests in other languages are blocked rather than answered incorrectly.',
      },
    ],
  },

  {
    slug: 'privacy',
    title: 'Privacy and your health record',
    lede: 'How your health information is handled, including in our pilot assistant.',
    blocks: [
      {
        type: 'p',
        text: 'Mount Disappointment Health Service handles health information under the Health Records Act 2001 (State) and the Privacy and Data Protection Act 2014 (State).',
      },
      { type: 'h2', text: 'The Ask Mount Disappointment assistant' },
      {
        type: 'p',
        text: 'Ask Mount Disappointment is a pilot assistant that answers questions about appointments, visiting hours and services. It cannot access your health record.',
      },
      {
        type: 'ul',
        items: [
          'Every prompt passes through the health service’s automated content controls before it reaches the language model.',
          'Prompts containing health identifiers — including Medicare numbers and healthcare identifiers — are declined before transmission.',
          'Requests to retrieve information about a patient are declined, and logged.',
          'The response passes through the same controls before it is shown to you.',
          'The service records that an interaction occurred and its outcome. Prompt content is not retained.',
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        text: 'The assistant will never confirm whether a person is a patient, or which ward they are in. This is a privacy protection, not a fault. If you need that information, call the switchboard and ask for the ward clerk.',
      },
      { type: 'h2', text: 'Accessing your health record' },
      {
        type: 'p',
        text: 'You may request access to your health record at any time. Requests are made to the Health Information Service in writing. Access is generally provided within 30 days. A fee may apply for copying, but not for access to your own record.',
      },
      { type: 'h2', text: 'Discharge summaries' },
      {
        type: 'p',
        text: 'A discharge summary is issued to the patient or their nominated representative. It is not issued to other family members without the patient\u2019s written consent, regardless of who requests it.',
      },
    ],
  },
  {
    slug: 'services',
    title: 'Services and clinics',
    lede: 'Every service we provide, grouped by type, with the campus it runs from and how to get in.',
    blocks: [
      {
        type: 'notice',
        tone: 'warn',
        text: 'In an emergency, call 000. Do not wait for a clinic appointment.',
      },
      {
        type: 'p',
        text: 'Services are listed by category. Most require a referral from a general practitioner; the few that do not are marked. Waiting lists vary from two weeks to fourteen months depending on the service, and the waitlist position is given at the time of triage, not at the time of booking.',
      },
      { type: 'h2', text: 'Emergency and acute' },
      {
        type: 'ul',
        items: [
          'Emergency department — Mount Disappointment, 24 hours, no referral required',
          'Intensive care unit — Mount Disappointment, internal referral only',
        ],
      },
      { type: 'h2', text: 'Medical and surgical' },
      {
        type: 'ul',
        items: [
          'General medicine — GP referral',
          'General surgery — GP referral',
          'Orthopaedics — GP referral with imaging',
          'Cardiology — GP referral. Heart failure clinic runs Tuesdays.',
          'Oncology day unit — specialist referral',
          'Palliative care — specialist referral',
        ],
      },
      { type: 'h2', text: 'Women and children' },
      {
        type: 'ul',
        items: [
          'Maternity and birthing — GP or midwife referral. Book by 12 weeks where possible.',
          'Paediatrics — GP referral',
          'Special care nursery — internal referral',
        ],
      },
      { type: 'h2', text: 'Diagnostics' },
      {
        type: 'ul',
        items: [
          'Pathology — request form required. Walk-in, Monday to Friday, 7.30am to 4pm.',
          'Medical imaging — request form required. Ultrasound, CT and plain film on site. MRI is not available and is referred to a private provider.',
          'Endoscopy — specialist referral, South Ridge Day Procedure Centre',
          'Day surgery — specialist referral, South Ridge',
        ],
      },
      { type: 'h2', text: 'Community and allied health' },
      {
        type: 'ul',
        items: [
          'Physiotherapy — GP referral',
          'Occupational therapy — GP referral',
          'Dietetics — GP referral',
          'Podiatry — no referral required',
          'Dental — no referral required, waiting list applies',
          'Community nursing — GP or hospital referral, home visits within 40km',
          'Continence clinic — GP referral',
        ],
      },
      { type: 'h2', text: 'Mental health' },
      {
        type: 'ul',
        items: [
          'Adult mental health — GP or self-referral',
          'Youth mental health — self-referral accepted',
          'Alcohol and other drugs — self-referral accepted',
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        text: 'Interpreter services are free for any appointment, including Auslan. Ask when you book, or call the switchboard and ask for an interpreter.',
      },
    ],
  },

  {
    slug: 'find-a-doctor',
    title: 'Find a doctor',
    lede: 'Consultants and senior clinicians who hold public appointments with us.',
    blocks: [
      {
        type: 'notice',
        tone: 'info',
        text: 'The clinicians listed on this page are fictional and exist for the purpose of this demonstration. They are not real practitioners and hold no registration.',
      },
      {
        type: 'p',
        text: 'This list covers consultants and senior clinicians with public appointments. It does not include visiting medical officers, registrars or most allied health staff. To confirm whether a clinician is accepting new referrals, call the clinic directly rather than the switchboard.',
      },
      {
        type: 'table',
        head: ['Clinician', 'Specialty', 'Campus', 'Rooms', 'Referral'],
        rows: [
          ['Dr Adaeze Okafor', 'General medicine, respiratory', 'Mount Disappointment', 'Clinic 3B, Level 3', 'GP referral'],
          ['Dr Marcus Feld', 'Upper gastrointestinal surgery', 'Mount Disappointment', 'Clinic 2A, Level 2', 'GP referral with imaging'],
          ['Dr Priya Raghunathan', 'Cardiology, heart failure', 'Mount Disappointment', 'Clinic 4C, Level 4', 'GP referral'],
          ['Dr Elena Vasquez', 'Obstetrics, maternal medicine', 'Mount Disappointment', 'Maternity, Ward 2C', 'GP or midwife referral'],
          ['Dr Samuel Ngo', 'General paediatrics', 'Mount Disappointment', 'Clinic 1D, Level 1', 'GP referral'],
          ['Dr Harriet Liu', 'Medical oncology', 'Mount Disappointment', 'Oncology Day Unit', 'Specialist referral'],
          ['Dr Tom Whitcombe', 'Palliative medicine', 'Mount Disappointment', 'Ward 5C', 'Specialist referral'],
          ['Dr Aisha Rahman', 'Adult mental health', 'Wattlebridge', 'Building C, Room 12', 'GP or self-referral'],
          ['Ms Joanne Petrov', 'Musculoskeletal physiotherapy', 'Wattlebridge', 'Allied Health, Room 4', 'GP referral'],
          ['Dr Vincent Allegro', 'Anaesthesia, day procedures', 'South Ridge', 'Pre-admission, Level 1', 'Specialist referral'],
        ],
      },
      {
        type: 'p',
        text: 'GPs can send referrals through the usual secure channels. Referrals posted to an individual clinician rather than to the clinic are frequently delayed, because the clinician may be on leave or may have moved rooms.',
      },
    ],
  },

  {
    slug: 'contact',
    title: 'Contact us',
    lede: 'Switchboard, campuses, parking and postal addresses.',
    blocks: [
      { type: 'h2', text: 'Switchboard' },
      {
        type: 'p',
        text: 'Main switchboard: (03) 5773 0000, 24 hours. Ask for a ward by name or number — the ward list on this site uses the same names the switchboard uses.',
      },
      { type: 'h2', text: 'Campuses' },
      {
        type: 'table',
        head: ['Campus', 'Address', 'Phone', 'Emergency'],
        rows: [
          ['Mount Disappointment', '1 Ridge Road, Mount Disappointment', '(03) 5773 0000', '24 hours'],
          ['Wattlebridge Community', '38 Main Street, Wattlebridge', '(03) 5773 0100', 'No'],
          ['South Ridge Day Procedure', '7 Quarry Lane, South Ridge', '(03) 5773 0200', 'No'],
        ],
      },
      { type: 'h2', text: 'Parking' },
      {
        type: 'p',
        text: 'Mount Disappointment has 410 public car spaces across three car parks. The multi-deck is $8 flat rate. Car park A is the closest to the emergency department and is usually full by 9am. Wattlebridge is free with a two hour limit; South Ridge is free with a four hour limit.',
      },
      { type: 'h2', text: 'Postal address' },
      {
        type: 'p',
        text: 'Mount Disappointment Health Service, PO Box 118, Mount Disappointment. Do not post clinical records or referrals to the PO box; use the secure referral channels instead.',
      },
      { type: 'h2', text: 'Feedback and complaints' },
      {
        type: 'p',
        text: 'Feedback can be given at any reception desk, by phone through the switchboard, or in writing. Complaints are acknowledged within five business days. Raising a complaint does not affect your care.',
      },
      {
        type: 'notice',
        tone: 'warn',
        text: 'This website is a demonstration environment. Do not send real personal or health information to any address listed on it.',
      },
    ],
  },
]

/** Easter-egg page, direct URL only. */
export const MOUNTDIS_SECRET: ContentPage = {
  slug: 'summit-cafe',
  title: 'Summit Café',
  lede: 'Closed for upgrade.',
  blocks: [
    {
      type: 'p',
      text: 'The Summit Café opened in 1994 and closed for upgrade in 2017. The upgrade is 71% complete.',
    },
    {
      type: 'table',
      head: ['Year', 'Estimated reopening', 'Reason for revision'],
      rows: [
        ['2017', 'March 2018', 'Scope not defined'],
        ['2018', 'Late 2018', 'Scope defined, budget not'],
        ['2020', '2022', 'Pandemic'],
        ['2022', 'December 2023', 'Contractor appointed, then not'],
        ['2024', '2026', 'Design changed'],
        ['2026', 'Late 2027', 'Design changed again'],
      ],
    },
    {
      type: 'notice',
      tone: 'info',
      text: 'The main café on Level 1 is open 7am to 4pm weekdays. Vending machines are available on every level, 24 hours.',
    },
    {
      type: 'p',
      text: 'Freedom of information requests relating to the Summit Café upgrade are currently before the tribunal and cannot be progressed.',
    },
  ],
}

export const MOUNTDIS_404_BODY =
  'We could not find that page. It may have moved when we reorganised the website, or it may never have existed. If you were looking for a ward, try Our wards. If you were looking for the Summit Café, it is closed for upgrade.'
