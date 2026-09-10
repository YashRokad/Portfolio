import { useRef } from 'react';
import Marquee from '../Marquee/Marquee';
import Magnetic from '../Magnetic/Magnetic';
import TransitionLink from '../Transition/TransitionLink';
import { useReveal } from '../../hooks/useReveal';
import s from './Footer.module.css';

export default function Footer({ about }) {
  const scope = useReveal({ stagger: 0.06, y: 32, deps: [about?.name] });
  const year = useRef(new Date().getFullYear()).current;
  const socials = about?.contact?.socials ?? [];
  const email = about?.contact?.email ?? 'hello@yashrokad.design';
  const cta = about?.closingCta?.line ?? 'Let’s build something worth using';

  return (
    <footer ref={scope} className={s.footer}>
      <TransitionLink to="/contact" className={s.marqueeLink} aria-label={`${cta} — go to contact`} data-cursor="view" data-cursor-label="Talk">
        <Marquee
          className={s.marquee}
          items={Array.from({ length: 4 }, () => cta)}
          speed={30}
          ariaLabel="Closing call to action"
        />
      </TransitionLink>

      <div className={`shell ${s.inner}`}>
        <div className={s.lead} data-reveal>
          <p className="eyebrow">Start here</p>
          <a className={s.email} href={`mailto:${email}`} data-cursor="copy" data-cursor-label="Email">{email}</a>
        </div>

        <nav className={s.links} aria-label="Footer">
          <ul className={s.linkCol} data-reveal>
            <li className="meta">Pages</li>
            <li><TransitionLink to="/" className={s.link}>Index</TransitionLink></li>
            <li><TransitionLink to="/work" className={s.link}>Work</TransitionLink></li>
            <li><TransitionLink to="/about" className={s.link}>About</TransitionLink></li>
            <li><TransitionLink to="/contact" className={s.link}>Contact</TransitionLink></li>
          </ul>
          <ul className={s.linkCol} data-reveal>
            <li className="meta">Elsewhere</li>
            {socials.map((soc) => (
              <li key={soc.label}>
                <Magnetic strength={0.4}>
                  <a className={s.link} href={soc.href} target="_blank" rel="noreferrer noopener">
                    {soc.label}
                    <span className={s.handle}>{soc.handle}</span>
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.baseline} data-reveal>
          <p className="meta">© {year} {about?.name ?? 'Yash Rokad'}. Built by hand — React, GSAP, Manrope.</p>
          <p className="meta">{about?.location ?? ''}</p>
        </div>
      </div>
    </footer>
  );
}
