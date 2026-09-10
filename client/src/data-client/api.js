/**
 * The only place in the client that touches fetch. Components consume the
 * hooks below; nothing calls an endpoint directly.
 *
 * @typedef {{slug:string,title:string,tagline:string,industry:string,year:string,
 *   role:string,cover:string,accent:string,summary:string}} ProjectCard
 */
const BASE = '/api';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : null;
  if (!res.ok) {
    const error = new Error(payload?.error || `Request failed (${res.status})`);
    error.status = res.status;
    error.errors = payload?.errors;
    throw error;
  }
  return payload;
}

export const api = {
  /** @returns {Promise<ProjectCard[]>} */
  getProjects: () => request('/projects'),
  getProject: (slug) => request(`/projects/${encodeURIComponent(slug)}`),
  getShots: () => request('/shots'),
  getTestimonials: () => request('/testimonials'),
  getAbout: () => request('/about'),
  sendMessage: (body) => request('/messages', { method: 'POST', body: JSON.stringify(body) }),
};
