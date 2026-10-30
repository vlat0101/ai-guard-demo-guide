import { Link } from 'react-router-dom'
import type { Block } from '../shared/blocks'

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <p key={i}>{b.text}</p>
          case 'h2':
            return <h2 key={i}>{b.text}</h2>
          case 'h3':
            return <h3 key={i}>{b.text}</h3>
          case 'ul':
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            )
          case 'table':
            return (
              <table key={i}>
                <thead>
                  <tr>
                    {b.head.map((h, j) => (
                      <th key={j}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((r, j) => (
                    <tr key={j}>
                      {r.map((c, k) => (
                        <td key={k}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          case 'notice':
            return (
              <div key={i} className={`notice notice--${b.tone}`}>
                <p>{b.text}</p>
              </div>
            )
          case 'cards':
            return (
              <div className="grid" key={i}>
                {b.items.map((c, j) => (
                  <Link className="card" to={c.to} key={j}>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </Link>
                ))}
              </div>
            )
          case 'links':
            return (
              <ul key={i}>
                {b.items.map((l, j) => (
                  <li key={j}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            )
          case 'quote':
            return (
              <blockquote
                key={i}
                style={{
                  borderLeft: '4px solid var(--accent)',
                  margin: '0 0 var(--space-4)',
                  padding: '0 0 0 var(--space-4)',
                  fontSize: 'var(--fs-md)',
                }}
              >
                <p style={{ fontStyle: 'italic' }}>&ldquo;{b.text}&rdquo;</p>
                <footer className="small muted">— {b.attribution}</footer>
              </blockquote>
            )
          default:
            return null
        }
      })}
    </>
  )
}
