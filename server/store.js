import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(__dirname, 'data');

export const filePath = (name) => path.join(DATA_DIR, `${name}.json`);

export function read(name, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath(name), 'utf8'));
  } catch {
    return fallback;
  }
}

export function write(name, value) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(name), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return value;
}

export function exists(name) {
  return fs.existsSync(filePath(name));
}
