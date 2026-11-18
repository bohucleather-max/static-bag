// Site-wide settings live in public/data/site.json, so the studio address can
// be changed without touching markup or rebuilding the bundle.

import { assetPath } from './utils/paths.js';

export async function loadSite() {
  const response = await fetch(assetPath('data/site.json'));
  if (!response.ok) throw new Error(`Failed to load site.json: ${response.status}`);
  return response.json();
}

// The sidebar shows contact.name. The address itself is only shown and linked
// when contact.linkEmail is true — while the studio's address is not final the
// link stays inert, and flipping the flag turns the mailto back on.
export function applySiteContact(site) {
  const { name, email, linkEmail } = site?.contact || {};
  document.querySelectorAll('.email-links a').forEach((link) => {
    if (linkEmail && email) {
      link.setAttribute('href', `mailto:${email}`);
      link.textContent = name || email;
    } else {
      link.removeAttribute('href');
      if (name) link.textContent = name;
    }
  });
}
