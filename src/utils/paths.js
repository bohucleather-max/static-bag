const BASE = import.meta.env.BASE_URL;

// Anything under public/ has to be addressed through the Vite base, which
// differs between a project-page deploy and a root deploy.
export function assetPath(path) {
  return `${BASE}${String(path).replace(/^\//, '')}`;
}
