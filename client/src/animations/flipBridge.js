/**
 * Carries a Flip state across a React Router navigation so a work-grid card
 * can morph into the project-detail hero. Anything stale (older than the
 * budget, or from a different slug) is discarded and the detail page falls
 * back to a cross-fade reveal.
 */
const BUDGET_MS = 1200;
let payload = null;

export function stashFlip(slug, state, imageSrc) {
  payload = { slug, state, imageSrc, at: performance.now() };
}

export function claimFlip(slug) {
  if (!payload) return null;
  const fresh = payload.slug === slug && performance.now() - payload.at < BUDGET_MS;
  const claimed = fresh ? payload : null;
  payload = null;
  return claimed;
}

export function clearFlip() { payload = null; }
