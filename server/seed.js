/**
 * Writes the full dummy dataset into server/data so the app is populated on
 * first run. `npm run seed` regenerates everything except messages.json.
 */
import { fileURLToPath } from 'node:url';
import { write, exists, read } from './store.js';
import { projects } from './content/projects.js';
import { about } from './content/about.js';
import { testimonials } from './content/testimonials.js';
import { shots } from './content/shots.js';
import { generateMedia } from './generateMedia.js';

export function seed({ force = false } = {}) {
  write('projects', projects);
  write('about', about);
  write('testimonials', testimonials);
  write('shots', shots);
  if (force || !exists('messages')) write('messages', []);
  const dir = generateMedia();
  return { projects: projects.length, shots: shots.length, testimonials: testimonials.length, media: dir };
}

/** Called on server boot — only writes when content files are missing. */
export function ensureSeeded() {
  if (!exists('projects') || !exists('about') || !exists('testimonials') || !exists('shots')) seed();
  if (!exists('messages')) write('messages', []);
  return read('projects', []).length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = seed({ force: false });
  console.log(`[seed] wrote ${result.projects} projects, ${result.shots} design shots, ${result.testimonials} testimonials, about.json`);
  console.log(`[seed] generated media into ${result.media}`);
}
