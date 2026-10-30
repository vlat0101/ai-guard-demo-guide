import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Blocks } from '../../components/Blocks'
import { HealthShell } from '../../components/HealthShell'
import { SITES } from '../../shared/sites'
import type { DemoStatus } from '../../shared/types'
import {
  MOUNTDIS_404_BODY,
  MOUNTDIS_NAV,
  MOUNTDIS_PAGES,
  MOUNTDIS_SECRET,
  MOUNTDIS_UTILITY_NAV,
} from './content'
import { CAMPUSES, NEWS_ITEMS, QUICK_ACTIONS, SERVICES } from './healthData'

const site = SITES.mountdis

const FEATURED_SERVICES = [
  'Emergency department',
  'Maternity and birthing',
  'Orthopaedics',
  'Cardiology',
  'Medical imaging',
  'Adult mental health',
]

function Icon({ name }: { name: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      )
    case 'bed':
      return (
        <svg {...common}>
          <path d="M3 20V9m0 6h18v5M7 9h5a3 3 0 0 1 3 3v3H7z" />
          <circle cx="6.5" cy="6.5" r="1.8" />
        </svg>
      )
    case 'people':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.6M17 20a5.5 5.5 0 0 0-1.6-3.9" />
        </svg>
      )
    case 'doctor':
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3.4" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0M12 10.5V16m-2.5-3h5" />
        </svg>
      )
    case 'info':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 7.8v.4" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4l3 2" />
        </svg>
      )
  }
}

function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  return (
    <>
      <section className="hs-hero">
        <div className="hs-hero__media">
          <img
            src="/img/hero-campus.jpg"
            alt="The main entrance and drop-off canopy at Mount Disappointment Health Service"
            width={1800}
            height={1000}
          />
        </div>
        <div className="hs-hero__text">
          <div className="hs-hero__inner">
            <p className="hs-hero__eyebrow">Mount Disappointment Health Service</p>
            <h1>Care close to home</h1>
            <p className="hs-hero__lede">
              Emergency, surgical, maternity and community health across three campuses. Our
              emergency department is open 24 hours, every day of the year.
            </p>
            <div className="hs-hero__actions">
              <Link className="btn btn--primary" to="/mountdis/appointments">
                Book an appointment
              </Link>
              <Link className="btn btn--ghost-light" to="/mountdis/emergency">
                Emergency and after hours
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="hs-finder">
        <form
          className="hs-finder__inner"
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/mountdis/services')
          }}
        >
          <label htmlFor="svc-search">Search services and clinics</label>
          <div className="hs-finder__row">
            <input
              id="svc-search"
              type="search"
              placeholder="e.g. physiotherapy, maternity, imaging"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn--primary" type="submit">
              Search
            </button>
          </div>
          <p className="hs-finder__hint">
            Not sure which service you need? Call the switchboard on{' '}
            <a href="tel:0357730000">(03) 5773 0000</a>, 24 hours.
          </p>
        </form>
      </section>

      <section className="hs-section">
        <div className="hs-section__inner">
          <h2 className="hs-section__title">What do you need today?</h2>
          <div className="hs-actions">
            {QUICK_ACTIONS.map((a) => (
              <Link className="hs-action" to={a.to} key={a.label}>
                <span className="hs-action__icon">
                  <Icon name={a.icon} />
                </span>
                <span className="hs-action__label">{a.label}</span>
                <span className="hs-action__body">{a.body}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hs-section hs-section--tint">
        <div className="hs-section__inner">
          <div className="hs-section__head">
            <h2 className="hs-section__title">Our campuses</h2>
            <Link className="hs-section__link" to="/mountdis/hospitals">
              All locations
            </Link>
          </div>
          <div className="hs-campuses">
            {CAMPUSES.map((c) => (
              <article className="hs-campus" key={c.id}>
                <div className="hs-campus__media">
                  <img src={c.image} alt={c.imageAlt} width={1000} height={667} loading="lazy" />
                  <span className="hs-campus__tag">{c.tag}</span>
                </div>
                <div className="hs-campus__body">
                  <h3>{c.name}</h3>
                  <p className="hs-campus__note">{c.note}</p>
                  <p className="hs-campus__meta">{c.address}</p>
                  <p className="hs-campus__meta">
                    <a href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}>{c.phone}</a>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hs-section">
        <div className="hs-section__inner">
          <div className="hs-section__head">
            <h2 className="hs-section__title">Popular services</h2>
            <Link className="hs-section__link" to="/mountdis/services">
              Services and clinics A–Z
            </Link>
          </div>
          <div className="hs-services">
            {FEATURED_SERVICES.map((name) => {
              const svc = SERVICES.find((s) => s.name === name)
              return (
                <Link className="hs-service" to="/mountdis/services" key={name}>
                  <h3>{name}</h3>
                  {svc && (
                    <p>
                      {svc.campus} · {svc.referral}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="hs-section hs-section--tint">
        <div className="hs-section__inner">
          <div className="hs-section__head">
            <h2 className="hs-section__title">Latest news</h2>
            <Link className="hs-section__link" to="/mountdis/news">
              All news
            </Link>
          </div>
          <div className="hs-news">
            {NEWS_ITEMS.map((n) => (
              <article className="hs-news__item" key={n.title}>
                <p className="hs-news__kind">{n.kind}</p>
                <h3>
                  <Link to="/mountdis/news">{n.title}</Link>
                </h3>
                <p className="hs-news__date">{n.date}</p>
                <p>{n.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hs-band">
        <div className="hs-band__media">
          <img
            src="/img/equipment.jpg"
            alt="A patient monitor beside a bed space on a ward"
            width={1000}
            height={667}
            loading="lazy"
          />
        </div>
        <div className="hs-band__text">
          <h2>For health professionals</h2>
          <p>
            Referral criteria, clinical pathways, ward contacts and discharge summary guidance.
            Referrals sent to an individual clinician rather than to the clinic are frequently
            delayed.
          </p>
          <div className="hs-band__actions">
            <Link className="btn btn--primary" to="/mountdis/find-a-doctor">
              Find a doctor
            </Link>
            <Link className="btn btn--ghost" to="/mountdis/services">
              Services and clinics
            </Link>
          </div>
        </div>
      </section>

      <section className="hs-section">
        <div className="hs-section__inner">
          <div className="notice notice--info">
            <p>
              <strong>Ask Mount Disappointment</strong> is available on every page — use the button
              in the corner for appointments, visiting hours and parking. It is not a clinical
              service and should not be used for anything urgent.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export function MountDisSite({ status }: { status: DemoStatus | null }) {
  const { slug } = useParams()
  const page = useMemo(
    () => (slug ? MOUNTDIS_PAGES.find((p) => p.slug === slug) : undefined),
    [slug],
  )
  const secret = slug === MOUNTDIS_SECRET.slug ? MOUNTDIS_SECRET : undefined

  let body: JSX.Element

  if (!slug) {
    body = <Home />
  } else if (page) {
    body = (
      <div className="hs-prose">
        <div className="breadcrumb">
          <Link to="/mountdis">Home</Link> / {page.title}
        </div>
        <h1>{page.title}</h1>
        {page.lede && <p className="lede">{page.lede}</p>}
        <Blocks blocks={page.blocks} />
      </div>
    )
  } else if (secret) {
    body = (
      <div className="hs-prose">
        <div className="breadcrumb">
          <Link to="/mountdis">Home</Link> / {secret.title}
        </div>
        <h1>{secret.title}</h1>
        <p className="lede">{secret.lede}</p>
        <Blocks blocks={secret.blocks} />
      </div>
    )
  } else {
    body = (
      <div className="hs-prose">
        <h1>Page not found</h1>
        <div className="notice notice--warn">
          <p>{MOUNTDIS_404_BODY}</p>
        </div>
        <p>
          <Link to="/mountdis">Return to the home page</Link>
        </p>
      </div>
    )
  }

  return (
    <HealthShell
      site={site}
      nav={MOUNTDIS_NAV}
      utilityNav={MOUNTDIS_UTILITY_NAV}
      status={status}
    >
      {body}
    </HealthShell>
  )
}
