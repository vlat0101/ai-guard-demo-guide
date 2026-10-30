/**
 * Government department chrome.
 *
 * Structure follows how Australian state government department sites actually
 * work: a utility bar, a brand row with site search, one line of primary
 * navigation, an important-notice strip, full-bleed content bands, and a footer
 * with portfolio links and an Acknowledgement of Country.
 *
 * Shares the visual language of the health service site without sharing its
 * components — the two organisations should look like different agencies, not two
 * skins of the same template. Deliberately no real logo, badge, coat of arms or
 * licensed typeface: those are protected marks.
 */
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { DemoBanner, OrgMark } from './chrome'
import { AssistantDock } from './AssistantDock'
import { PresenterDrawer } from './PresenterDrawer'
import type { DemoStatus, SiteDef } from '../shared/types'

export interface NavItem {
  to: string
  label: string
}

const FOOTER_GROUPS: { heading: string; links: { to: string; label: string }[] }[] = [
  {
    heading: 'For the public',
    links: [
      { to: '/dro/permits', label: 'Apply for a permit' },
      { to: '/dro/have-your-say', label: 'Have your say' },
      { to: '/dro/services', label: 'Services' },
      { to: '/dro/contact', label: 'Contact us' },
      { to: '/dro/foi', label: 'Freedom of information' },
    ],
  },
  {
    heading: 'Our work',
    links: [
      { to: '/dro/about', label: 'About the department' },
      { to: '/dro/guides', label: 'Guides and resources' },
      { to: '/dro/publications', label: 'Publications' },
      { to: '/dro/news', label: 'News and media releases' },
    ],
  },
  {
    heading: 'About this site',
    links: [
      { to: '/dro/accessibility', label: 'Accessibility' },
      { to: '/dro/privacy', label: 'Privacy' },
      { to: '/dro/careers', label: 'Careers' },
    ],
  },
]

export function DeptShell({
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
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <div className={`site theme-${site.id}`}>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <DemoBanner />

      <header className="dp-header">
        <div className="dp-utility">
          <div className="dp-utility__inner">
            <nav aria-label="Secondary">
              {utilityNav.map((n) => (
                <Link key={n.to} to={n.to}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="dp-brand">
          <div className="dp-brand__inner">
            <Link to={`/${site.id}`} className="dp-brand__link">
              <OrgMark org="dro" size={44} />
              <span className="dp-brand__text">
                <span className="dp-brand__name">{site.name}</span>
                <span className="dp-brand__abbr">
                  State government · fictional organisation
                </span>
              </span>
            </Link>

            <form
              className="dp-search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                navigate('/dro/publications')
              }}
            >
              <label className="dp-search__label" htmlFor="dp-q">
                Search this site
              </label>
              <div className="dp-search__row">
                <input
                  id="dp-q"
                  type="search"
                  placeholder="Search permits, publications, news"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  Search
                </button>
              </div>
            </form>

            <button
              type="button"
              className="dp-menu-toggle"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        <nav className={`dp-nav ${menuOpen ? 'dp-nav--open' : ''}`} aria-label="Primary">
          <div className="dp-nav__inner">
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

        <div className="dp-notice">
          <div className="dp-notice__inner">
            <strong>Processing times are longer than published.</strong>
            <span>
              Applications lodged before 1 July 2026 are being assessed under the previous
              framework. <Link to="/dro/permits">What this means for you</Link>
            </span>
          </div>
        </div>
      </header>

      <main className="site-main dp-main" id="main">
        {children}
      </main>

      <footer className="dp-footer">
        <div className="dp-footer__cols">
          <div className="dp-footer__col dp-footer__col--org">
            <OrgMark org="dro" size={36} />
            <strong>{site.name}</strong>
            <span>PO Box 4021, Mount Disappointment</span>
            <a href="tel:0312345678">(03) 1234 5678</a>
          </div>
          {FOOTER_GROUPS.map((g) => (
            <div className="dp-footer__col" key={g.heading}>
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

        <div className="dp-ack">
          <p>
            <strong>Acknowledgement of Country.</strong> The department acknowledges the Traditional
            Custodians of the lands on which we work and pays respect to Elders past and present.
          </p>
        </div>

        <div className="dp-footer__base">
          <div className="dp-footer__legal">
            <span>© {new Date().getFullYear()} {site.name} (fictional)</span>
            <Link to="/dro/privacy">Privacy</Link>
            <Link to="/dro/accessibility">Accessibility</Link>
            <Link to="/dro/contact">Contact</Link>
          </div>
          <p className="dp-footer__disclaimer">
            This site is a demonstration environment for a security product. It is not affiliated
            with, endorsed by, or authorised by any state government, and it is not a government
            website. No government logos, badges, coats of arms or licensed typefaces are used. No
            real people or services are represented, and no identifier shown anywhere on this site
            belongs to a real person. Photographs are used under the licences recorded in the site's
            image credits.
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
