// Site-wide settings live in public/data/site.json, so the studio address can
// be changed without touching markup or rebuilding the bundle.

import { assetPath } from './utils/paths.js';

export async function loadSite() {
  const response = await fetch(assetPath('data/site.json'));
  if (!response.ok) throw new Error(`Failed to load site.json: ${response.status}`);
  return response.json();
}

// The sidebar ships with a working address so the link is never broken or
// empty; this replaces it with whatever site.json says.
export function applySiteContact(site) {
  const email = site?.contact?.email;
  if (!email) return;
  document.querySelectorAll('.email-links a[href^="mailto:"]').forEach((link) => {
    link.setAttribute('href', `mailto:${email}`);
    link.textContent = email;
  });
}
