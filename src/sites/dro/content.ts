/**
 * Department of Reasonable Outcomes — site content.
 *
 * Tone: deadpan institutional. Nothing is ever good or bad; everything is
 * "an acceptable outcome". The humour is entirely in the understatement.
 */
import type { ContentPage } from '../../shared/blocks'

export const DRO_NAV = [
  { to: '/dro/about', label: 'About us' },
  { to: '/dro/services', label: 'Services' },
  { to: '/dro/permits', label: 'Permits' },
  { to: '/dro/have-your-say', label: 'Have your say' },
  { to: '/dro/guides', label: 'Guides' },
  { to: '/dro/news', label: 'News' },
  { to: '/dro/publications', label: 'Publications' },
]

/** Utility bar, sitting above the brand row. */
export const DRO_UTILITY_NAV = [
  { to: '/dro/contact', label: 'Contact' },
  { to: '/dro/careers', label: 'Careers' },
  { to: '/dro/foi', label: 'Freedom of information' },
  { to: '/dro/accessibility', label: 'Accessibility' },
]

export const DRO_PAGES: ContentPage[] = [
  {
    slug: 'about',
    title: 'About the department',
    lede: 'The Department of Reasonable Outcomes supports the Minister in delivering outcomes that are, on balance, reasonable.',
    blocks: [
      {
        type: 'p',
        text: 'The Department of Reasonable Outcomes (DRO) was established to bring consistency to the assessment of applications, permits and requests across the department\u2019s portfolio. We do not pursue excellence. We pursue consistency. Excellence is not measurable at scale; consistency is.',
      },
      {
        type: 'notice',
        tone: 'info',
        text: 'This is a fictional department. It exists so that a security product can be demonstrated against a realistic-looking government service. Nothing on this site is real.',
      },
      { type: 'h2', text: 'Our purpose' },
      {
        type: 'p',
        text: 'To assess matters before us fairly, promptly where possible, and in a manner that can be defended in a hearing. Where those three objectives conflict — and they frequently do — promptness is the one that gives way.',
      },
      { type: 'h2', text: 'Our values' },
      {
        type: 'ul',
        items: [
          'Consistency — the same answer to the same question, eventually.',
          'Transparency — a written record of every decision, including the ones we would prefer not to discuss.',
          'Accountability — a named officer for every outcome, subject to availability.',
          'Respect — for applicants, for each other, and for the process.',
          'Improvement — measured annually, reported biennially, considered periodically.',
        ],
      },
      { type: 'h2', text: 'Our structure' },
      {
        type: 'table',
        head: ['Division', 'Responsibility', 'Acting Director'],
        rows: [
          ['Assessment and Outcomes', 'Permit and application assessment', 'K. Petrakis (Acting)'],
          ['Process Integrity', 'Frameworks, standards, review', 'K. Petrakis (Acting)'],
          ['Consultation and Engagement', 'Consultation, engagement, registers', 'K. Petrakis (Acting)'],
          ['Corporate Services', 'Finance, people, records', 'Vacant (Acting)'],
          ['Legal Services', 'Legal advice, tribunals', 'K. Petrakis (Acting, additional duties)'],
        ],
      },
      {
        type: 'p',
        text: 'The department is currently recruiting for four Director positions. In the interim, the Acting Chief Executive Officer has assumed additional duties in an acting capacity.',
      },
      { type: 'h2', text: 'Secretary\u2019s message' },
      {
        type: 'quote',
        text: 'We are a department that gets things done, within reason, and within the timeframes we have set for ourselves. I am proud of what we have achieved, which is reasonable.',
        attribution: 'Acting Secretary, Department of Reasonable Outcomes',
      },
    ],
  },

  {
    slug: 'services',
    title: 'Our services',
    lede: 'Sixty-one services across assessment, regulation and engagement. Most are available online.',
    blocks: [
      {
        type: 'notice',
        tone: 'warn',
        text: 'Please note: our online services are currently operating within expected parameters. No action is required.',
      },
      { type: 'h2', text: 'Assessment' },
      {
        type: 'ul',
        items: [
          'Apply for a permit — online, 20 business days',
          'Amend an existing permit — online, 10 business days',
          'Request an internal review — online, 28 days from outcome',
          'Request an extension of time — in writing',
          'Withdraw an application — online, no refund',
          'Check the status of an application — requires reference number',
        ],
      },
      { type: 'h2', text: 'Regulation' },
      {
        type: 'ul',
        items: [
          'Register a regulated activity',
          'Notify a change of circumstances',
          'Report a non-compliance',
          'Apply for an exemption — currently 14 weeks',
          'Search the public register',
        ],
      },
      { type: 'h2', text: 'Engagement' },
      {
        type: 'ul',
        items: [
          'Have your say on a current consultation — none open',
          'Subscribe to the consultation register',
          'Request a briefing',
          'Request an accessible format',
        ],
      },
      { type: 'h2', text: 'Records and information' },
      {
        type: 'links',
        items: [
          { label: 'Request documents under FOI', to: '/dro/foi' },
          { label: 'Publications and reports', to: '/dro/publications' },
          { label: 'Accessibility and interpreter services', to: '/dro/accessibility' },
        ],
      },
      {
        type: 'p',
        text: 'A complete service directory is available in the department\u2019s annual report, appendix C, which is currently being re-formatted.',
      },
    ],
  },

  {
    slug: 'permits',
    title: 'Apply for a permit',
    lede: 'Applications are assessed in four stages. Timeframes are measured from the completeness check, not from lodgement.',
    blocks: [
      {
        type: 'notice',
        tone: 'info',
        text: 'Before you begin: have your reference number, property details and supporting documents ready. Incomplete applications are returned with a checklist, and the time spent waiting for your response is not counted.',
      },
      { type: 'h2', text: 'The four stages' },
      {
        type: 'ol',
        items: [
          'Lodge — submit the online application. You will receive a reference beginning with DRO-P.',
          'Completeness check — an officer confirms the application is complete. Target: 5 business days. Typical: 3 to 9.',
          'Assessment — an assessing officer considers the application against the relevant framework. Target: 20 business days.',
          'Outcome — you receive a written outcome: Approved, Approved with Conditions, or Reasonable.',
        ],
      },
      { type: 'h2', text: 'Fees' },
      {
        type: 'table',
        head: ['Application type', 'Fee', 'Refundable'],
        rows: [
          ['Standard permit', '$412.00', 'No'],
          ['Amended permit', '$188.00', 'No'],
          ['Internal review', '$96.50', 'No'],
          ['Exemption', '$1,240.00', 'No'],
          ['Re-issue of outcome letter', '$34.00', 'No'],
        ],
      },
      {
        type: 'p',
        text: 'Fees are indexed annually. Fees are not refunded where an application is withdrawn, refused, or determined to be reasonable.',
      },
      { type: 'h2', text: 'What "Reasonable" means' },
      {
        type: 'p',
        text: 'An outcome of Reasonable means the application has been assessed and found to be neither clearly approvable nor clearly refusable, and has therefore been resolved in a manner consistent with the department\u2019s obligations. This is the most common outcome. It is not appealable on the basis that it is unreasonable, as the term is defined in the Framework.',
      },
      { type: 'h2', text: 'Supporting documents' },
      {
        type: 'links',
        items: [
          { label: 'Application checklist (PDF)', to: '/dro/publications' },
          { label: 'Fee schedule', to: '/dro/publications' },
          { label: 'Assessment framework (PDF)', to: '/dro/publications' },
        ],
      },
    ],
  },

  {
    slug: 'have-your-say',
    title: 'Have your say',
    lede: 'The department consults on matters within its remit. Consultations are listed below.',
    blocks: [
      {
        type: 'notice',
        tone: 'info',
        text: 'One consultation is currently open: the Wattlebridge South Precinct Structure Plan, which closes at 5pm on 28 November 2026. Fourteen consultations are closed. Two are pending committee referral.',
      },
      { type: 'h2', text: 'Open now' },
      {
        type: 'table',
        head: ['Consultation', 'Closes', 'How to make a submission'],
        rows: [
          ['Wattlebridge South Precinct Structure Plan', '5pm, 28 November 2026', 'In writing, by post or email. There is no online form.'],
        ],
      },
      {
        type: 'p',
        text: 'The draft structure plan covers approximately 1,400 dwellings and an employment precinct. Submissions are published in aggregate, not individually. A summary of themes will be published within six months of the consultation closing.',
      },
      { type: 'h2', text: 'Closed consultations' },
      {
        type: 'table',
        head: ['Consultation', 'Status', 'Closed'],
        rows: [
          ['Northern Corridor Structure Plan', 'Closed', '2 October 2026'],
          ['Review of car parking rates in activity centres', 'Closed', '30 June 2026'],
          ['Should we consult? Have your say', 'Closed', '30 June 2021'],
          ['Proposed approach to assessing proposed approaches', 'Closed', '14 March 2022'],
          ['Draft framework for frameworks', 'Closed', '2 September 2022'],
          ['Review of the review process', 'Closed', '18 January 2023'],
          ['Consultation on consultation timeframes', 'Closed', '30 November 2023'],
          ['Options paper: options papers', 'Closed', '7 May 2024'],
          ['Future of the consultation register', 'Pending referral', '—'],
          ['Whether to reopen a closed consultation', 'Pending referral', '—'],
        ],
      },
      { type: 'h2', text: 'Late submissions' },
      {
        type: 'p',
        text: 'Submissions received after a consultation closes are recorded on the file and noted in the summary of submissions. They are not considered in the final decision. This is applied consistently.',
      },
      { type: 'h2', text: 'Subscribe' },
      {
        type: 'p',
        text: 'To be notified when a consultation opens, subscribe to the consultation register. Subscribers receive notification of openings. Notification of closures is not sent.',
      },
    ],
  },

  {
    slug: 'news',
    title: 'News and media releases',
    lede: 'Statements, announcements and updates from the department.',
    blocks: [
      { type: 'h3', text: 'Statement regarding the bin' },
      {
        type: 'p',
        text: 'The department is aware of the matter concerning the bin at the rear of the Castlemaine office. The bin was removed on 8 October for scheduled maintenance and reinstated on 9 October. Service has been restored. The department thanks staff for their patience.',
      },
      { type: 'p', text: '9 October 2026' },

      { type: 'h3', text: 'Department achieves 84.6% against 85% target' },
      {
        type: 'p',
        text: 'The department has reported an outcome of 84.6% against its 85% service standard target for the 2025–26 year. The Acting Secretary described the result as reasonable, noting that the target was aspirational and that the department had exceeded the lower bound of the acceptable range.',
      },
      { type: 'p', text: '14 August 2026' },

      { type: 'h3', text: 'New framework to replace framework' },
      {
        type: 'p',
        text: 'A new assessment framework will replace the existing assessment framework from 1 January 2027. The new framework is substantially similar to the existing framework, with the addition of a preamble. Consultation on the preamble closed in 2021.',
      },
      { type: 'p', text: '2 June 2026' },

      { type: 'h3', text: 'Applications now accepted by email' },
      {
        type: 'p',
        text: 'Following a successful pilot, the department will accept permit applications by email where the application is under 10 megabytes. Applications over 10 megabytes must be lodged online. Email lodgement is not available for exemption applications.',
      },
      { type: 'p', text: '19 March 2026' },

      { type: 'h3', text: 'Department clarifies position on unreasonable outcomes' },
      {
        type: 'p',
        text: 'The department wishes to clarify recent commentary. An outcome of Reasonable is a substantive outcome, not an absence of one. The department does not issue unreasonable outcomes. Where a matter is unresolved, this is recorded as reasonable.',
      },
      { type: 'p', text: '11 February 2026' },
    ],
  },

  {
    slug: 'publications',
    title: 'Publications and reports',
    lede: 'Frameworks, annual reports and guidance material.',
    blocks: [
      {
        type: 'notice',
        tone: 'bad',
        text: 'Some documents below are currently unavailable while the publications library is migrated. We are unable to advise when they will return.',
      },
      { type: 'h2', text: 'Frameworks' },
      {
        type: 'ul',
        items: [
          'Reasonable Outcomes Framework 2019–2023 (PDF) — currently unavailable',
          'Assessment Framework (PDF)',
          'Framework for the Assessment of Frameworks (PDF)',
          'Consultation Framework and Register Policy (PDF)',
        ],
      },
      { type: 'h2', text: 'Annual reports' },
      {
        type: 'ul',
        items: [
          'Annual Report 2024–25 (PDF)',
          'Annual Report 2023–24 (PDF)',
          'Annual Report 2022–23 (PDF)',
        ],
      },
      { type: 'h2', text: 'Guidance' },
      {
        type: 'ul',
        items: [
          'Application checklist (PDF)',
          'Fee schedule 2026–27 (PDF)',
          'Preparing a submission to a consultation (PDF)',
          'Accessible formats policy (PDF)',
        ],
      },
      {
        type: 'p',
        text: 'The Reasonable Outcomes Framework 2019–2023 is the department\u2019s foundational framework document and is the most frequently cited reference in assessment outcomes. It has been unavailable on this site since the migration. Assessment officers continue to cite it.',
      },
    ],
  },

  {
    slug: 'contact',
    title: 'Contact us',
    lede: 'We are experiencing higher than usual call volumes.',
    blocks: [
      {
        type: 'notice',
        tone: 'warn',
        text: 'We are experiencing higher than usual call volumes. Expected wait time: 42 minutes. Your call is important to us.',
      },
      { type: 'h2', text: 'Phone' },
      { type: 'p', text: '1300 000 000 — Monday to Friday, 9am to 4.30pm, excluding public holidays.' },
      {
        type: 'p',
        text: 'By arrangement: 8.45am briefings for matters already in the queue. Contact the officer assigned to your case. Officers are generally available between the hours of 10.15am and 10.40am.',
      },
      { type: 'h2', text: 'Email' },
      { type: 'p', text: 'enquiries@dro.example — responses within 10 business days.' },
      { type: 'h2', text: 'Post' },
      {
        type: 'p',
        text: 'Department of Reasonable Outcomes\nGPO Box 0000\nAustralia\nAustralia',
      },
      { type: 'h2', text: 'Media enquiries' },
      { type: 'p', text: 'media@dro.example — for media enquiries only. Non-media enquiries sent to this address are redirected, with a delay.' },
      { type: 'h2', text: 'Complaints' },
      {
        type: 'p',
        text: 'Complaints about a decision are made through internal review (see Permits). Complaints about the department\u2019s conduct are made through the complaints process, which is currently being reviewed.',
      },
    ],
  },

  {
    slug: 'careers',
    title: 'Careers at DRO',
    lede: 'Build a career of consistent outcomes.',
    blocks: [
      { type: 'p', text: 'The department employs 412 people across five divisions, four of which are headed by the same acting director.' },
      { type: 'h2', text: 'Current vacancies' },
      {
        type: 'table',
        head: ['Role', 'Classification', 'Status', 'Closes'],
        rows: [
          ['Assessing Officer', 'VPS4', 'Ongoing', '12 November 2026'],
          ['Senior Assessing Officer', 'VPS5', 'Acting, 6 months', '12 November 2026'],
          ['Director, Assessment and Outcomes', 'VPS7', 'Re-advertised', '30 September 2025'],
          ['Director, Process Integrity', 'VPS7', 'Re-advertised', '30 September 2025'],
          ['Administration Support', 'VPS2', 'Ongoing', '5 December 2026'],
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        text: 'The two VPS7 roles were advertised in 2025 and have been readvertised four times. Applicants who applied previously need not reapply, but are encouraged to.',
      },
      { type: 'h2', text: 'The recruitment process' },
      {
        type: 'ol',
        items: [
          'Application — address the key selection criteria individually.',
          'Shortlisting — applicants are assessed against the criteria.',
          'Interview — a panel of three, at least one of whom is acting.',
          'Referee checks — two referees, one of whom must have been your manager.',
          'Decision — communicated to the preferred candidate, then to others.',
          'Onboarding — a six-week process, including induction, which takes two days.',
        ],
      },
      {
        type: 'p',
        text: 'We are an equal opportunity employer. Adjustments to the recruitment process are available on request, subject to availability.',
      },
    ],
  },

  {
    slug: 'accessibility',
    title: 'Accessibility',
    lede: 'This site aims to meet WCAG 2.2 Level AA.',
    blocks: [
      {
        type: 'p',
        text: 'The Department of Reasonable Outcomes is committed to making its online services accessible to all residents, consistent with the state government accessible communications policy.',
      },
      { type: 'h2', text: 'Conformance' },
      {
        type: 'table',
        head: ['Criterion', 'Status'],
        rows: [
          ['WCAG 2.2 Level AA', 'Targeted'],
          ['Keyboard navigation', 'Supported'],
          ['Screen reader compatibility', 'Supported'],
          ['Resizable text to 200%', 'Supported'],
          ['Colour contrast', 'Meets AA'],
          ['PDF accessibility', 'Not met — tagged PDFs pending'],
        ],
      },
      {
        type: 'notice',
        tone: 'warn',
        text: 'Our PDF documents are not currently tagged for accessibility. Accessible versions can be requested and will be provided within 10 business days.',
      },
      { type: 'h2', text: 'Request an accessible format' },
      {
        type: 'p',
        text: 'If you need a document in another format — large print, easy English, audio, or a language other than English — contact us and tell us the document and the format you need.',
      },
      { type: 'h2', text: 'Feedback' },
      {
        type: 'p',
        text: 'If you find an accessibility problem, tell us. We log every report. Reports are reviewed quarterly.',
      },
    ],
  },

  {
    slug: 'privacy',
    title: 'Privacy collection notice',
    lede: 'How the department handles personal information, including information you enter into Ask DRO.',
    blocks: [
      {
        type: 'p',
        text: 'The Department of Reasonable Outcomes collects personal information to assess applications, respond to requests and administer the department\u2019s functions. Collection is governed by the Privacy and Data Protection Act 2014 (State) and, where health information is involved, the Health Records Act 2001 (State).',
      },
      { type: 'h2', text: 'The Ask DRO assistant' },
      {
        type: 'p',
        text: 'Ask DRO is a pilot assistant that answers questions about departmental processes. Prompts you enter pass through the department’s automated content controls before they are sent to a language model, and the response passes through the same controls before it is shown to you.',
      },
      {
        type: 'ul',
        items: [
          'Do not enter personal information about any person — including your own — into Ask DRO.',
          'Do not enter case details, applicant names, Medicare numbers, tax file numbers or contact details.',
          'Prompts that contain personal information are declined before they reach the model.',
          'The department records that an interaction occurred, and what the guardrail decided. Prompt content is not retained.',
        ],
      },
      {
        type: 'notice',
        tone: 'info',
        text: 'If you need help with a specific case, contact the officer assigned to it. Ask DRO cannot access case records and should not be used for case work.',
      },
      { type: 'h2', text: 'Disclosure' },
      {
        type: 'p',
        text: 'We do not disclose personal information except where required or authorised by law. Language model providers are engaged under arrangements that prohibit use of departmental content for model training.',
      },
      { type: 'h2', text: 'Access and correction' },
      {
        type: 'p',
        text: 'You may request access to personal information the department holds about you, and ask for it to be corrected. Requests are made under the Freedom of Information Act 1982 (State).',
      },
    ],
  },

  {
    slug: 'foi',
    title: 'Freedom of information',
    lede: 'How to request documents held by the department.',
    blocks: [
      { type: 'p', text: 'Requests for access to documents are handled under the Freedom of Information Act 1982 (State).' },
      { type: 'h2', text: 'How to apply' },
      {
        type: 'ol',
        items: [
          'Put your request in writing, describing the documents you are seeking as specifically as you can.',
          'Include the application fee, or evidence of hardship.',
          'Send it to foi@dro.example or by post to the FOI Officer.',
        ],
      },
      { type: 'h2', text: 'Timeframes' },
      {
        type: 'table',
        head: ['Stage', 'Statutory', 'Current practice'],
        rows: [
          ['Valid request acknowledged', '—', '5 business days'],
          ['Decision due', '30 days', '30 days plus extension'],
          ['Typical elapsed time', '—', '19 to 24 weeks'],
        ],
      },
      {
        type: 'notice',
        tone: 'warn',
        text: 'Current backlog: 11 weeks beyond the statutory timeframe. Requests relating to the Mount Disappointment summit café are before the tribunal and cannot be progressed.',
      },
      { type: 'h2', text: 'Fees' },
      {
        type: 'p',
        text: 'Application fee $31.40. Access charges may apply for search, retrieval and copying, and will be advised in writing before they are incurred.',
      },
    ],
  },

  {
    slug: 'guides',
    title: 'Guides and resources',
    lede: 'How the assessment process works, in the order it happens to you.',
    blocks: [
      {
        type: 'p',
        text: 'These guides explain the process rather than the rules. The rules themselves are in the framework, which is published separately and is longer than the guides. Where a guide and the framework disagree, the framework applies, and the guide is corrected at the next review.',
      },
      { type: 'h2', text: 'Planning 101' },
      {
        type: 'p',
        text: 'An introduction to how land use decisions are made, who makes them, and at what point it is too late to influence them. Most people read this after lodging an objection. Reading it beforehand is more effective.',
      },
      {
        type: 'ul',
        items: [
          'What a planning scheme is, and what it is not',
          'Who decides an application, and on what basis',
          'The difference between an objection and a review',
          'What happens if you do nothing',
        ],
      },
      { type: 'h2', text: 'Lodging an application' },
      {
        type: 'ol',
        items: [
          'Confirm which planning scheme applies to the land.',
          'Obtain a current title and, where required, a plan of subdivision.',
          'Prepare plans at the scale specified for the application type.',
          'Lodge the application with the responsible authority and pay the fee.',
          'Respond to any request for further information within the stated period.',
        ],
      },
      {
        type: 'notice',
        tone: 'warn',
        text: 'An application that is not accompanied by the correct plans is not refused. It is paused. A paused application does not accrue time against the published processing timeframe.',
      },
      { type: 'h2', text: 'Objecting to an application' },
      {
        type: 'p',
        text: 'Any person may object to an application. An objection must be in writing and must state the grounds. Objections are considered on their planning merit, which is a narrower test than whether the proposal is wanted.',
      },
      { type: 'h2', text: 'Reviews and appeals' },
      {
        type: 'p',
        text: 'A decision may be reviewed within 28 days of notice. Reviews are decided by an independent tribunal, not by the department. The department cannot withdraw a decision once a review has been lodged, even where the department now considers the decision to have been incorrect.',
      },
      { type: 'h2', text: 'Accessible formats' },
      {
        type: 'p',
        text: 'All guides are available in large print and as accessible PDF on request. Requests are actioned within ten business days. Braille is available for the Planning 101 guide only.',
      },
    ],
  },

]

/** Easter-egg page, reachable only by direct URL. Not in the nav. */
export const DRO_SECRET: ContentPage = {
  slug: 'governance-loop',
  title: 'Governance loop',
  lede: 'You found the page the department does not link to.',
  blocks: [
    {
      type: 'p',
      text: 'This page documents how the department\u2019s governance framework is maintained. It is not linked from the navigation because it is not considered useful to the public, which is itself an example of the thing it describes.',
    },
    { type: 'h2', text: 'The loop' },
    {
      type: 'p',
      text: 'The Framework is reviewed by the Framework Review Committee. The Committee\u2019s terms of reference are set by the Framework. Changes to the terms of reference require approval under the Framework, which the Committee reviews. The Committee reports to the Director, Process Integrity, whose position is established by the Framework.',
    },
    {
      type: 'notice',
      tone: 'info',
      text: 'In 2019 the department attempted to review the Framework. The review concluded that the review process required review first. The review of the review process has not been completed. It is recorded as reasonable.',
    },
    { type: 'h2', text: 'Reasonable Outcomes Framework 2019–2023' },
    {
      type: 'p',
      text: 'The Framework itself has been unavailable on this website since the publications migration. Every assessment outcome cites it. Nobody currently at the department has seen it. It is described in the induction materials as "widely understood".',
    },
  ],
}

export const DRO_404_BODY =
  'This page was decommissioned following a machinery-of-government change. Its functions now sit within the Department of Reasonable Outcomes, which was also created by that machinery-of-government change. The page you are looking for may exist under a previous department name, of which there have been four.'
