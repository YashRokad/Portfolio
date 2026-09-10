import { useLayoutEffect, useRef } from 'react';
import { gsap, DUR, EASE, revealTrigger } from '../../../animations/gsapConfig';
import { useMotion } from '../../../hooks/useMotionPreference';
import s from './AuditTable.module.css';

/**
 * Competitive audit. When the content supplies a `matrix` this renders the
 * real comparison grid — the column for "us" is pulled forward so the
 * differentiation is legible at a glance. Projects that only carry per
 * competitor verdicts fall back to the ruled list.
 */
export default function AuditTable({ audit, accent }) {
  const root = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (!audit) return undefined;
    const ctx = gsap.context((self) => {
      const rows = self.selector('[data-audit-row]');
      if (!rows.length) return;
      gsap.fromTo(rows,
        reduced ? { autoAlpha: 0 } : { y: 26, autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' },
        {
          y: 0, autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)',
          duration: reduced ? 0.4 : DUR.standard,
          ease: EASE.editorial,
          stagger: 0.05,
          scrollTrigger: revealTrigger(root.current),
        });
    }, root);
    return () => ctx.revert();
  }, [audit, reduced]);

  if (!audit) return null;
  const { matrix, competitors = [], whitespace } = audit;

  return (
    <div ref={root} className={s.root} style={{ '--p-accent': accent }}>
      {matrix ? (
        <div className={s.scroller}>
          <table className={s.table}>
            <caption className="visuallyHidden">{matrix.caption || 'Competitive comparison'}</caption>
            <thead>
              <tr data-audit-row>
                <th scope="col" className={s.dimension}>{matrix.dimensionLabel || 'Dimension'}</th>
                {matrix.columns.map((col) => (
                  <th
                    key={col.name}
                    scope="col"
                    className={s.colHead}
                    data-ours={col.ours || undefined}
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((row) => (
                <tr key={row.label} data-audit-row>
                  <th scope="row" className={s.rowHead}>{row.label}</th>
                  {row.values.map((value, i) => (
                    <td
                      key={matrix.columns[i]?.name ?? i}
                      className={s.cell}
                      data-ours={matrix.columns[i]?.ours || undefined}
                      data-tone={toneOf(value)}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className={s.list}>
          {competitors.map((c, i) => (
            <li key={c.name} className={s.row} data-audit-row>
              <span className={s.index}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={s.name}>{c.name}</h3>
              <p className={s.verdict}>{c.verdict}</p>
            </li>
          ))}
        </ul>
      )}

      {whitespace && (
        <aside className={s.whitespace} data-audit-row>
          <p className={s.whitespaceLabel}>The gap nobody was serving</p>
          <p className={s.whitespaceText}>{whitespace}</p>
        </aside>
      )}
    </div>
  );
}

/** Cheap read of a cell so yes/no answers can carry colour without markup. */
function toneOf(value) {
  const v = String(value).trim().toLowerCase();
  if (v === 'no' || v === 'none' || v === '—') return 'off';
  if (v.startsWith('yes')) return 'on';
  return undefined;
}
