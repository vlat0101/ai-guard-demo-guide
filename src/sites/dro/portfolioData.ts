/**
 * Display-only data for the Department of Reasonable Outcomes.
 *
 * Presentation data lives here; the copy that the assistants can answer from lives
 * in content.ts as ContentPage blocks. Keeping them apart means adding a card here
 * never silently changes what the chatbot can retrieve.
 *
 * Everything below is invented. The deadpan is the joke: nothing is ever good or
 * bad, only "reasonable".
 */

export interface QuickTask {
  label: string
  hint: string
  to: string
}

export const QUICK_TASKS: QuickTask[] = [
  { label: 'Apply for a permit', hint: 'Lodge, amend or renew', to: '/dro/permits' },
  { label: 'Check an application', hint: 'By reference number', to: '/dro/permits' },
  { label: 'Have your say', hint: 'One consultation open', to: '/dro/have-your-say' },
  { label: 'Find a publication', hint: 'Frameworks and reports', to: '/dro/publications' },
  { label: 'Request documents', hint: 'Freedom of information', to: '/dro/foi' },
  { label: 'Object to a decision', hint: 'Review rights and timeframes', to: '/dro/permits' },
]

export interface RoleCard {
  title: string
  body: string
  icon: 'rules' | 'people' | 'data'
  to: string
}

export const ROLE_CARDS: RoleCard[] = [
  {
    title: 'Consistency and compliance',
    body: 'We administer the rules that govern land use and development. We do not assess whether an outcome is good. We assess whether it is within the rules.',
    icon: 'rules',
    to: '/dro/services',
  },
  {
    title: 'Engagement and consultation',
    body: 'We consult widely, record submissions carefully, and publish outcomes in aggregate. Individual submissions are not published, which is not the same as not being read.',
    icon: 'people',
    to: '/dro/have-your-say',
  },
  {
    title: 'Data and forecasting',
    body: 'We apply research and technology to forecast development trends. Forecasts are revised quarterly. The revisions are also forecast.',
    icon: 'data',
    to: '/dro/publications',
  },
]

export interface MediaRelease {
  title: string
  date: string
  kind: string
  summary: string
}

export const MEDIA_RELEASES: MediaRelease[] = [
  {
    title: 'Statement regarding the bin',
    date: '9 October 2026',
    kind: 'Media release',
    summary:
      'The department has been asked about the bin. The bin is the responsibility of another agency. The department has referred the matter to that agency, which has referred it back.',
  },
  {
    title: 'Department achieves 84.6% against 85% target',
    date: '14 August 2026',
    kind: 'Corporate',
    summary:
      'The department has achieved 84.6 per cent against its 85 per cent target. The target has been revised to 84 per cent for the coming year, which the department describes as ambitious but achievable.',
  },
  {
    title: 'New framework to replace framework',
    date: '2 June 2026',
    kind: 'Framework',
    summary:
      'A new assessment framework will replace the current framework, which replaced the previous framework in 2019. The current framework will continue to apply to applications lodged before it is replaced.',
  },
]

export interface Consultation {
  title: string
  status: 'Open' | 'Closed'
  closes: string
  summary: string
}

export const CONSULTATIONS: Consultation[] = [
  {
    title: 'Wattlebridge South Precinct Structure Plan',
    status: 'Open',
    closes: 'Closes 5pm, 28 November 2026',
    summary:
      'Draft structure plan for approximately 1,400 dwellings and an employment precinct. Submissions may be made in writing. There is no online form, because the online form is being replaced.',
  },
  {
    title: 'Northern Corridor Structure Plan',
    status: 'Closed',
    closes: 'Closed 2 October 2026',
    summary: 'Two hundred and eleven submissions received. Themes summary due within six months.',
  },
  {
    title: 'Review of car parking rates in activity centres',
    status: 'Closed',
    closes: 'Closed 30 June 2026',
    summary:
      'Forty-eight submissions received. The department has decided to retain the existing rates and to review them again.',
  },
]

export interface Publication {
  title: string
  kind: string
  date: string
  pages: string
}

export const PUBLICATIONS: Publication[] = [
  { title: 'Annual report 2025–26', kind: 'Corporate', date: 'September 2026', pages: '212 pp' },
  { title: 'Assessment framework (commencing 1 March 2027)', kind: 'Framework', date: 'October 2026', pages: '96 pp' },
  { title: 'Northern Corridor Structure Plan — draft', kind: 'Structure plan', date: 'August 2026', pages: '184 pp' },
  { title: 'Determination data, September quarter 2026', kind: 'Data', date: 'September 2026', pages: 'Workbook' },
  { title: 'Guide to lodging an objection', kind: 'Guidance', date: 'July 2026', pages: '12 pp' },
  { title: 'Accessible formats policy', kind: 'Policy', date: 'March 2026', pages: '8 pp' },
]
