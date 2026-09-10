/**
 * Generates the placeholder visual assets (covers, UI shots, portrait) as
 * SVG so the build has real compositions rather than grey boxes. When real
 * photography and screenshots arrive, drop them into client/public/media
 * using the same filenames and delete this script.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from './content/projects.js';
import { shots } from './content/shots.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'client', 'public', 'media');

const BG = '#0d0e10';
const PANEL = '#16181c';
const PANEL2 = '#1e2126';
const LINE = 'rgba(236,235,231,0.10)';
const DIM = 'rgba(236,235,231,0.22)';
const TEXT = 'rgba(236,235,231,0.55)';

/* Small deterministic PRNG so regenerating produces identical assets. */
function rng(seed) {
  let s = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">${body}</svg>\n`;

function cover(slug, title, accent) {
  const r = rng(slug);
  const w = 1200; const h = 900;
  let body = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.30"/>
      <stop offset="0.55" stop-color="${accent}" stop-opacity="0.05"/>
      <stop offset="1" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="r" cx="0.72" cy="0.22" r="0.7">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="c"><rect width="${w}" height="${h}"/></clipPath>
  </defs>
  <g clip-path="url(#c)">
    <rect width="${w}" height="${h}" fill="${BG}"/>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect width="${w}" height="${h}" fill="url(#r)"/>`;

  // Editorial rule grid
  for (let i = 1; i < 12; i += 1) {
    body += `<line x1="${(w / 12) * i}" y1="0" x2="${(w / 12) * i}" y2="${h}" stroke="${LINE}" stroke-width="1"/>`;
  }
  // Concentric arcs — a "system" motif
  const cx = 250 + r() * 200; const cy = 620;
  for (let i = 0; i < 7; i += 1) {
    const rad = 90 + i * 62;
    body += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${accent}" stroke-opacity="${0.26 - i * 0.03}" stroke-width="${i === 2 ? 2 : 1}"/>`;
  }
  // Data bars
  for (let i = 0; i < 9; i += 1) {
    const bh = 40 + r() * 260;
    body += `<rect x="${740 + i * 44}" y="${560 - bh}" width="18" height="${bh}" rx="3" fill="${accent}" fill-opacity="${i === 5 ? 0.9 : 0.16}"/>`;
  }
  body += `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="${LINE}"/>`;
  body += `<text x="72" y="120" fill="${TEXT}" font-family="Manrope, sans-serif" font-size="22" font-weight="600" letter-spacing="4">${title.toUpperCase()}</text>`;
  body += '</g>';
  return svg(w, h, body);
}

function uiShot(slug, index, accent, caption) {
  const r = rng(`${slug}${index}`);
  const w = 1440; const h = 900;
  let body = `<rect width="${w}" height="${h}" fill="${BG}"/>`;
  // sidebar
  body += `<rect x="0" y="0" width="230" height="${h}" fill="${PANEL}"/>`;
  body += `<rect x="28" y="34" width="26" height="26" rx="7" fill="${accent}"/>`;
  for (let i = 0; i < 8; i += 1) {
    const active = i === index % 8;
    if (active) body += `<rect x="16" y="${104 + i * 46 - 10}" width="198" height="36" rx="8" fill="${PANEL2}"/>`;
    body += `<rect x="30" y="${104 + i * 46}" width="14" height="14" rx="4" fill="${active ? accent : DIM}"/>`;
    body += `<rect x="56" y="${107 + i * 46}" width="${70 + r() * 80}" height="9" rx="4" fill="${active ? 'rgba(236,235,231,0.8)' : DIM}"/>`;
  }
  // top bar
  body += `<rect x="230" y="0" width="${w - 230}" height="78" fill="${PANEL}"/>`;
  body += `<rect x="270" y="32" width="240" height="14" rx="6" fill="rgba(236,235,231,0.72)"/>`;
  body += `<rect x="${w - 190}" y="26" width="140" height="28" rx="14" fill="${accent}" fill-opacity="0.9"/>`;

  // metric row
  for (let i = 0; i < 4; i += 1) {
    const x = 268 + i * 288;
    body += `<rect x="${x}" y="112" width="264" height="118" rx="14" fill="${PANEL}" stroke="${LINE}"/>`;
    body += `<rect x="${x + 22}" y="140" width="${60 + r() * 60}" height="8" rx="4" fill="${DIM}"/>`;
    body += `<rect x="${x + 22}" y="166" width="${90 + r() * 60}" height="24" rx="6" fill="${i === index % 4 ? accent : 'rgba(236,235,231,0.72)'}"/>`;
    body += `<rect x="${x + 22}" y="204" width="${110 + r() * 80}" height="7" rx="3" fill="${LINE}"/>`;
  }

  // chart panel
  body += `<rect x="268" y="256" width="700" height="330" rx="14" fill="${PANEL}" stroke="${LINE}"/>`;
  let poly = '';
  for (let i = 0; i <= 22; i += 1) {
    const px = 300 + i * 29;
    const py = 520 - (60 + r() * 190);
    poly += `${px},${py} `;
  }
  body += `<polyline points="${poly}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round"/>`;
  for (let i = 0; i < 5; i += 1) {
    body += `<line x1="300" y1="${300 + i * 55}" x2="936" y2="${300 + i * 55}" stroke="${LINE}"/>`;
  }

  // side panel
  body += `<rect x="996" y="256" width="416" height="330" rx="14" fill="${PANEL}" stroke="${LINE}"/>`;
  for (let i = 0; i < 5; i += 1) {
    body += `<circle cx="1030" cy="${300 + i * 62}" r="12" fill="${i === 0 ? accent : PANEL2}"/>`;
    body += `<rect x="1056" y="${292 + i * 62}" width="${160 + r() * 160}" height="9" rx="4" fill="${DIM}"/>`;
    body += `<rect x="1056" y="${309 + i * 62}" width="${90 + r() * 90}" height="7" rx="3" fill="${LINE}"/>`;
  }

  // table
  body += `<rect x="268" y="614" width="1144" height="240" rx="14" fill="${PANEL}" stroke="${LINE}"/>`;
  for (let i = 0; i < 5; i += 1) {
    const y = 654 + i * 40;
    body += `<rect x="296" y="${y}" width="${120 + r() * 90}" height="9" rx="4" fill="${i === 1 ? accent : DIM}" fill-opacity="${i === 1 ? 0.9 : 1}"/>`;
    body += `<rect x="620" y="${y}" width="${80 + r() * 70}" height="9" rx="4" fill="${LINE}"/>`;
    body += `<rect x="900" y="${y}" width="${70 + r() * 60}" height="9" rx="4" fill="${LINE}"/>`;
    body += `<rect x="1240" y="${y - 6}" width="${64}" height="20" rx="10" fill="${accent}" fill-opacity="0.18"/>`;
    if (i < 4) body += `<line x1="296" y1="${y + 22}" x2="1384" y2="${y + 22}" stroke="${LINE}"/>`;
  }
  body += `<text x="268" y="884" fill="${TEXT}" font-family="Manrope, sans-serif" font-size="15">${caption}</text>`;
  return svg(w, h, body);
}

/* Full-bleed hero backdrop. A stand-in for the photograph that will replace
   it — same filename, drop a .jpg in and update the path in about.js. */
function heroBackdrop() {
  const r = rng('hero');
  const w = 2400; const h = 1400;
  let body = `
  <defs>
    <radialGradient id="hg" cx="0.62" cy="0.34" r="0.78">
      <stop offset="0" stop-color="#5c6b34" stop-opacity="1"/>
      <stop offset="0.45" stop-color="#242a1b" stop-opacity="1"/>
      <stop offset="1" stop-color="${BG}" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="hg2" cx="0.24" cy="0.78" r="0.6">
      <stop offset="0" stop-color="#d8f24e" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#d8f24e" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${BG}" stop-opacity="0.4"/>
      <stop offset="0.45" stop-color="${BG}" stop-opacity="0"/>
      <stop offset="1" stop-color="${BG}" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#hg)"/>
  <rect width="${w}" height="${h}" fill="url(#hg2)"/>`;

  /* A soft interference field — reads as depth behind the wordmark without
     competing with it. */
  for (let i = 0; i < 42; i += 1) {
    const cy = 120 + r() * (h - 240);
    const amp = 30 + r() * 150;
    let d = `M -50 ${cy}`;
    for (let x = 0; x <= w + 100; x += 120) {
      d += ` Q ${x + 60} ${cy + (r() - 0.5) * amp} ${x + 120} ${cy}`;
    }
    body += `<path d="${d}" fill="none" stroke="#d8f24e" stroke-opacity="${0.07 + r() * 0.13}" stroke-width="${0.6 + r() * 1.4}"/>`;
  }
  body += `<rect width="${w}" height="${h}" fill="url(#hv)"/>`;
  return svg(w, h, body);
}

/* Design-shot imagery — bolder and more graphic than the case-study covers,
   because this section is about visual craft rather than product screens. */
function shotImage(slug, accent) {
  const r = rng(`shot${slug}`);
  const w = 1600; const h = 1200;
  let body = `
  <defs>
    <linearGradient id="sg" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.9"/>
      <stop offset="0.55" stop-color="${accent}" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#0a0b0c" stop-opacity="1"/>
    </linearGradient>
    <clipPath id="sc"><rect width="${w}" height="${h}"/></clipPath>
  </defs>
  <g clip-path="url(#sc)">
    <rect width="${w}" height="${h}" fill="#0a0b0c"/>
    <rect width="${w}" height="${h}" fill="url(#sg)"/>`;

  const cx = w * (0.32 + r() * 0.36);
  const cy = h * (0.34 + r() * 0.3);
  for (let i = 0; i < 26; i += 1) {
    const rad = 30 + i * 34;
    body += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#0a0b0c" stroke-opacity="${0.06 + (i % 3) * 0.05}" stroke-width="${i % 4 === 0 ? 3 : 1}"/>`;
  }
  for (let i = 0; i < 14; i += 1) {
    const x = r() * w;
    body += `<rect x="${x}" y="0" width="${1 + r() * 3}" height="${h}" fill="#0a0b0c" opacity="${0.05 + r() * 0.12}"/>`;
  }
  body += `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="rgba(255,255,255,0.08)"/>`;
  body += '</g>';
  return svg(w, h, body);
}

function portrait() {
  const w = 900; const h = 1200;
  const body = `
  <defs>
    <linearGradient id="pg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="#2a2e35"/>
      <stop offset="1" stop-color="${BG}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#pg)"/>
  <circle cx="450" cy="470" r="190" fill="${PANEL2}"/>
  <path d="M170 1200 C 200 880, 320 760, 450 760 C 580 760, 700 880, 730 1200 Z" fill="${PANEL2}"/>
  <circle cx="450" cy="470" r="190" fill="none" stroke="#d8f24e" stroke-opacity="0.35" stroke-width="2"/>
  <text x="60" y="1140" fill="${TEXT}" font-family="Manrope, sans-serif" font-size="24" font-weight="600" letter-spacing="4">PORTRAIT PLACEHOLDER</text>`;
  return svg(w, h, body);
}

const favicon = () => svg(64, 64,
  `<rect width="64" height="64" rx="14" fill="#0d0e10"/><path d="M14 18 L32 40 L50 18" fill="none" stroke="#d8f24e" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><line x1="32" y1="40" x2="32" y2="48" stroke="#d8f24e" stroke-width="6" stroke-linecap="round"/>`);

export function generateMedia() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'hero-backdrop.svg'), heroBackdrop());
  shots.forEach((shot) => {
    fs.writeFileSync(path.join(OUT, path.basename(shot.image)), shotImage(shot.slug, shot.accent));
  });
  projects.forEach((p) => {
    fs.writeFileSync(path.join(OUT, `${p.slug}-cover.svg`), cover(p.slug, p.title, p.accent));
    p.visualDesign.gallery.forEach((shot, i) => {
      fs.writeFileSync(path.join(OUT, path.basename(shot.src)), uiShot(p.slug, i, p.accent, shot.caption));
    });
  });
  fs.writeFileSync(path.join(OUT, 'portrait.svg'), portrait());
  fs.writeFileSync(path.join(__dirname, '..', 'client', 'public', 'favicon.svg'), favicon());
  return OUT;
}
