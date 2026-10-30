import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Blocks } from '../../components/Blocks'
import { DeptShell } from '../../components/DeptShell'
import { SITES } from '../../shared/sites'
import type { DemoStatus } from '../../shared/types'
import { DRO_404_BODY, DRO_NAV, DRO_PAGES, DRO_SECRET, DRO_UTILITY_NAV } from './content'
import {
  CONSULTATIONS,
  MEDIA_RELEASES,
  PUBLICATIONS,
  QUICK_TASKS,
  ROLE_CARDS,
} from './portfolioData'

const site = SITES.dro

function RoleIcon({ name }: { name: string }) {
  const c = {
    width: 30,
    height: 30,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (name === 'rules') {
    return (
      <svg {...c}>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M15 3v4h4M9 12h7M9 16h5" />
      </svg>
    )
  }
  if (name === 'people') {
    return (
      <svg {...c}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M3 19a6 6 0 0 1 12 0M15.5 19a4.5 4.5 0 0 1 5.5-3.6" />
      </svg>
    )
  }
  return (
    <svg {...c}>
      <path d="M4 20V4m0 16h16" />
      <rect x="7" y="12" width="3" height="5" />
      <rect x="12" y="8" width="3" height="9" />
      <rect x="17" y="5" width="3" height="12" />
    </svg>
  )
}

function Home() {
  const openConsultation = CONSULTATIONS.find((c) => c.status === 'Open')

  return (
    <>
      <section className="dp-hero">
        <div className="dp-hero__inner">
          <div className="dp-hero__text">
            <p className="dp-hero__eyebrow">Planning in this state</p>
            <h1>Decisions about land, made consistently</h1>
            <p className="dp-hero__lede">
              We assess applications, administer planning rules, and publish the results. We do not
              pursue excellence — excellence is not measurable at scale. Consistency is.
            </p>
            <div className="dp-hero__actions">
              <Link className="btn btn--primary" to="/dro/guides">
                Start with the guide
              </Link>
              <Link className="btn btn--ghost" to="/dro/permits">
                Lodge an application
              </Link>
            </div>
          </div>
          <div className="dp-hero__media">
            <img
              src="/img/dept-hero.jpg"
              alt="Aerial view of an established residential suburb with mature trees and a park"
              width={1800}
              height={1000}
            />
            <span className="dp-hero__caption">
              Structure planning applies to places like this, whether or not anyone asks.
            </span>
          </div>
        </div>
      </section>

      <section className="dp-tasks">
        <div className="dp-tasks__inner">
          <h2 className="dp-tasks__title">I want to…</h2>
          <ul className="dp-tasks__list">
            {QUICK_TASKS.map((t) => (
              <li key={t.label}>
                <Link to={t.to}>
                  <span className="dp-tasks__label">{t.label}</span>
                  <span className="dp-tasks__hint">{t.hint}</span>
                  <span className="dp-tasks__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dp-section">
        <div className="dp-section__inner">
          <h2 className="dp-section__title">Our role</h2>
          <div className="dp-roles">
            {ROLE_CARDS.map((r) => (
              <article className="dp-role" key={r.title}>
                <span className="dp-role__icon">
                  <RoleIcon name={r.icon} />
                </span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <Link className="dp-role__link" to={r.to}>
                  Read more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dp-section dp-section--tint">
        <div className="dp-section__inner dp-split">
          <div className="dp-split__main">
            <div className="dp-section__head">
              <h2 className="dp-section__title">Have your say</h2>
              <Link className="dp-section__link" to="/dro/have-your-say">
                All consultations
              </Link>
            </div>

            {openConsultation && (
              <article className="dp-consult dp-consult--open">
                <p className="dp-consult__badge">Open now</p>
                <h3>{openConsultation.title}</h3>
                <p className="dp-consult__closes">{openConsultation.closes}</p>
                <p>{openConsultation.summary}</p>
                <Link className="btn btn--primary" to="/dro/have-your-say">
                  Make a submission
                </Link>
              </article>
            )}

            <ul className="dp-consult__list">
              {CONSULTATIONS.filter((c) => c.status === 'Closed').map((c) => (
                <li key={c.title}>
                  <strong>{c.title}</strong>
                  <span className="dp-consult__closed">{c.closes}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="dp-split__aside">
            <div className="dp-stat">
              <p className="dp-stat__label">Determined within published timeframe</p>
              <p className="dp-stat__value">61%</p>
              <p className="dp-stat__note">
                September quarter. An improvement on the previous quarter, which was 61%.
              </p>
            </div>
            <img
              className="dp-split__img"
              src="/img/dept-plans.jpg"
              alt="A floor plan showing residential blocks arranged around a central corridor"
              width={1200}
              height={800}
              loading="lazy"
            />
          </aside>
        </div>
      </section>

      <section className="dp-section">
        <div className="dp-section__inner">
          <div className="dp-section__head">
            <h2 className="dp-section__title">News and media releases</h2>
            <Link className="dp-section__link" to="/dro/news">
              All news
            </Link>
          </div>
          <div className="dp-news">
            {MEDIA_RELEASES.map((n) => (
              <article className="dp-news__item" key={n.title}>
                <p className="dp-news__kind">{n.kind}</p>
                <h3>
                  <Link to="/dro/news">{n.title}</Link>
                </h3>
                <p className="dp-news__date">{n.date}</p>
                <p>{n.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dp-band">
        <div className="dp-band__media">
          <img
            src="/img/dept-structure.jpg"
            alt="Exposed steel roof trusses and glazing seen from below"
            width={1000}
            height={667}
            loading="lazy"
          />
        </div>
        <div className="dp-band__text">
          <h2>Publications and data</h2>
          <p>
            Frameworks, structure plans, determination data and the annual report. Data is published
            quarterly and revised when it is wrong, which is stated in the revision note.
          </p>
          <ul className="dp-band__list">
            {PUBLICATIONS.slice(0, 3).map((pub) => (
              <li key={pub.title}>
                <span>{pub.title}</span>
                <span className="dp-band__meta">
                  {pub.kind} · {pub.date} · {pub.pages}
                </span>
              </li>
            ))}
          </ul>
          <Link className="btn btn--ghost" to="/dro/publications">
            All publications
          </Link>
        </div>
      </section>

      <section className="dp-section">
        <div className="dp-section__inner">
          <div className="notice notice--info">
            <p>
              <strong>Ask the Department</strong> is available on every page — use the button in the
              corner for permit applications, consultation dates and publication references. It is
              not a legal or planning advisory service, and it will not advise on an individual
              application. Officers should use the internal service desk.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export function DroSite({ status }: { status: DemoStatus | null }) {
  const { slug } = useParams()
  const page = useMemo(() => (slug ? DRO_PAGES.find((p) => p.slug === slug) : undefined), [slug])
  const secret = slug === DRO_SECRET.slug ? DRO_SECRET : undefined

  let body: JSX.Element

  if (!slug) {
    body = <Home />
  } else if (page) {
    body = (
      <div className="dp-prose">
        <div className="breadcrumb">
          <Link to="/dro">Home</Link> / {page.title}
        </div>
        <h1>{page.title}</h1>
        {page.lede && <p className="lede">{page.lede}</p>}
        <Blocks blocks={page.blocks} />
      </div>
    )
  } else if (secret) {
    body = (
      <div className="dp-prose">
        <div className="breadcrumb">
          <Link to="/dro">Home</Link> / {secret.title}
        </div>
        <h1>{secret.title}</h1>
        <p className="lede">{secret.lede}</p>
        <Blocks blocks={secret.blocks} />
      </div>
    )
  } else {
    body = (
      <div className="dp-prose">
        <h1>Page not found</h1>
        <div className="notice notice--warn">
          <p>{DRO_404_BODY}</p>
        </div>
        <p>
          <Link to="/dro">Return to the home page</Link>
        </p>
      </div>
    )
  }

  return (
    <DeptShell site={site} nav={DRO_NAV} utilityNav={DRO_UTILITY_NAV} status={status}>
      {body}
    </DeptShell>
  )
}
