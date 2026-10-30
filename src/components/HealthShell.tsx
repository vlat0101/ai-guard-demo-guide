/**
 * Public health service chrome.
 *
 * Modelled on how Australian public hospital sites are actually structured: a
 * utility bar of secondary links, a brand row, a single line of primary
 * navigation, a persistent emergency strip, and a footer that carries addresses,
 * phones and an Acknowledgement of Country.
 *
 * Deliberately NOT modelled on any one health service's identity. No real logo,
 * badge, coat of arms or licensed typeface is used — those are protected marks.
 */
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { DemoBanner, OrgMark } from './chrome'
import { AssistantDock } from './AssistantDock'
import { PresenterDrawer } from './PresenterDrawer'
import { CAMPUSES } from '../sites/mountdis/healthData'
import type { DemoStatus, SiteDef } from '../shared/types'

export interface NavItem {
  to: string
  label: string
}

const FOOTER_GROUPS: { heading: string; links: { to: string; label: string }[] }[] = [
  {
    heading: 'Patients and visitors',
    links: [
      { to: '/mountdis/appointments', label: 'Appointments' },
      { to: '/mountdis/wards', label: 'Wards and visiting hours' },
      { to: '/mountdis/patients', label: 'Before you arrive' },
      { to: '/mountdis/emergency', label: 'Emergency and after hours' },
      { to: '/mountdis/health-information', label: 'Health information' },
    ],
  },
  {
    heading: 'Health professionals',
    links: [
      { to: '/mountdis/services', label: 'Services and clinics' },
      { to: '/mountdis/find-a-doctor', label: 'Find a doctor' },
      { to: '/mountdis/careers', label: 'Careers' },
    ],
  },
  {
    heading: 'About us',
    links: [
      { to: '/mountdis/hospitals', label: 'Our hospitals' },
      { to: '/mountdis/news', label: 'News' },
      { to: '/mountdis/research', label: 'Research' },
      { to: '/mountdis/contact', label: 'Contact us' },
      { to: '/mountdis/accessibility', label: 'Accessibility' },
      { to: '/mountdis/privacy', label: 'Privacy' },
    ],
  },
]

export function HealthShell({
  site,
  nav,
  utilityNav,
  status,
  showDock = true,
  children,
}: {
  site: SiteDef
  nav: NavItem[]
  utilityNav: NavItem[]
  status: DemoStatus | null
  showDock?: boolean
  children: ReactNode
}) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className={`site theme-${site.id}`}>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <DemoBanner />

      <header className="hs-header">
        <div className="hs-utility">
          <div className="hs-utility__inner">
            <nav aria-label="Secondary">
              {utilityNav.map((n) => (
                <Link key={n.to} to={n.to}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="hs-brand">
          <div className="hs-brand__inner">
            <Link to={`/${site.id}`} className="hs-brand__link">
              <OrgMark org="mountdis" size={46} />
              <span className="hs-brand__text">
                <span className="hs-brand__name">{site.name}</span>
                <span className="hs-brand__abbr">
                  Public health service · fictional organisation
                </span>
              </span>
            </Link>

            <button
              type="button"
              className="hs-menu-toggle"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? 'Close menu' : 'Menu'}
            </button>
          </div>
        </div>

        <nav className={`hs-nav ${menuOpen ? 'hs-nav--open' : ''}`} aria-label="Primary">
          <div className="hs-nav__inner">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                aria-current={pathname === n.to ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="hs-emergency">
          <div className="hs-emergency__inner">
            <span>
              <strong>In an emergency, call 000.</strong>
            </span>
            <span className="hs-emergency__more">
              For advice when it is not an emergency, call healthdirect on 1800 022 222, 24 hours,
              free. <Link to="/mountdis/emergency">When to come to emergency</Link>
            </span>
          </div>
        </div>
      </header>

      <main className="site-main hs-main" id="main">
        {children}
      </main>

      <footer className="hs-footer">
        <div className="hs-footer__cols">
          <div className="hs-footer__col hs-footer__col--campuses">
            <h2>Our campuses</h2>
            {CAMPUSES.map((c) => (
              <div key={c.id} className="hs-footer__campus">
                <strong>{c.name}</strong>
                <span>
                  {c.address.split(', ').map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </span>
                <a href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}>{c.phone}</a>
              </div>
            ))}
          </div>

          {FOOTER_GROUPS.map((g) => (
            <div className="hs-footer__col" key={g.heading}>
              <h2>{g.heading}</h2>
              <ul>
                {g.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hs-ack">
          <p>
            <strong>Acknowledgement of Country.</strong> We acknowledge the Traditional Custodians
            of the lands on which we work, and pay our respects to Elders past and present. We
            welcome people of all cultures, faiths and backgrounds.
          </p>
        </div>

        <div className="hs-footer__base">
          <div className="hs-footer__legal">
            <span>{site.name} — a fictional organisation.</span>
            <Link to={`/${site.id}/accessibility`}>Accessibility</Link>
            <Link to={`/${site.id}/privacy`}>Privacy</Link>
          </div>
          <p className="hs-footer__disclaimer">
            This site is a demonstration environment for a security product. It is not affiliated
            with, endorsed by, or authorised by any state government or health service. No
            government logos, badges, coats of arms or licensed typefaces are used. No real
            people, patients or services are represented, and no identifier shown anywhere on this
            site belongs to a real person. Photographs are used under the licences recorded in the
            site's image credits.
          </p>
        </div>
      </footer>

      {showDock && (
        <AssistantDock assistant={site.assistants.public} status={status} siteName={site.name} />
      )}

      <PresenterDrawer assistant={site.assistants.public} />
    </div>
  )
}
