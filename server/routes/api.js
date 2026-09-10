import { Router } from 'express';
import { read, write } from '../store.js';

const router = Router();

router.get('/projects', (_req, res) => {
  const projects = read('projects', []);
  // The grid only needs card-level fields; case-study bodies stay on the
  // detail endpoint so the list response stays small.
  res.json(projects.map(({
    slug, title, tagline, industry, year, role, cover, accent, summary,
  }) => ({ slug, title, tagline, industry, year, role, cover, accent, summary })));
});

router.get('/projects/:slug', (req, res) => {
  const projects = read('projects', []);
  const index = projects.findIndex((p) => p.slug === req.params.slug);
  if (index === -1) return res.status(404).json({ error: 'No project with that slug.' });

  const next = projects[(index + 1) % projects.length];
  return res.json({
    ...projects[index],
    next: { slug: next.slug, title: next.title, tagline: next.tagline, cover: next.cover, industry: next.industry },
  });
});

router.get('/testimonials', (_req, res) => res.json(read('testimonials', [])));

router.get('/about', (_req, res) => res.json(read('about', {})));

router.post('/messages', (req, res) => {
  const { name, email, company = '', budget = '', message } = req.body || {};
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Tell me what to call you.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'That email address looks off.';
  if (!message || message.trim().length < 10) errors.message = 'A little more detail helps me reply well.';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const messages = read('messages', []);
  const entry = {
    id: `msg_${Date.now().toString(36)}`,
    name: name.trim(),
    email: email.trim(),
    company: company.trim(),
    budget,
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  };
  messages.push(entry);
  write('messages', messages);
  return res.status(201).json({ ok: true, id: entry.id });
});

export default router;
