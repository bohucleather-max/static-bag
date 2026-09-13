# Skill: Build Static Store for GitHub Pages

## Objective

Build and maintain a static website, from the HTML design already in the repository, that can be hosted entirely on GitHub Pages.

The project MUST:

* Have no backend.
* Have no database.
* Store all product data in JSON.
* Store all images/assets inside the repository.
* Keep product data and image folders consistently mapped.
* Reuse the HTML/design already in the repository as much as possible.
* Use Vite as the build tool.
* Use Vanilla JavaScript with ES Modules.
* Use Bootstrap/CSS already present in the project where appropriate.
* Deploy automatically through GitHub Actions to GitHub Pages.
* Avoid React/Vue/Next.js unless explicitly requested.
* Avoid external demo/template asset dependencies whenever the assets can be localized into the repository.

---

# 1. Input

The design already lives in the repository:

```text
index.html   markup, sections and static content
src/         styles, entry point and feature modules
public/      data JSON and images
```

Before implementing:

1. Read the markup, styles and modules as they currently stand.
2. Identify:

   * page sections
   * CSS files
   * JavaScript modules
   * images
   * fonts
   * vendor libraries
   * external dependencies
   * existing Bootstrap/template structure
3. Determine which files are actually required.
4. Preserve the existing visual design.
5. Do not redesign the UI unless explicitly requested.

The markup in the repository is the source of truth for visual design.

---

# 2. Technology Stack

Use:

```text
HTML5
CSS3
Bootstrap 5 (already in use)
Vanilla JavaScript
ES Modules
Vite
JSON
GitHub Pages
GitHub Actions
```

Do NOT introduce:

```text
React
Vue
Angular
Next.js
Nuxt
Node.js backend
Express
NestJS
PHP
MySQL
PostgreSQL
Supabase
Firebase
```

unless explicitly requested.

Node.js is allowed ONLY as a development/build dependency through Vite.

---

# 3. Target Architecture

The target architecture should be:

```text
GitHub Repository
        │
        ├── HTML
        ├── CSS
        ├── JavaScript
        ├── JSON
        └── Images
                │
                ▼
             Vite
                │
                ▼
             Static files
                │
                ▼
          GitHub Pages
```

Runtime:

```text
Browser
   │
   ├── Load HTML
   ├── Load CSS
   ├── Load JavaScript
   └── Fetch JSON
          │
          └── Render UI
```

There must be no server-side rendering or backend API.

---

# 4. Recommended Folder Structure

Use the following structure unless the existing project requires a justified variation:

```text
project-root/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│   ├── data/
│   │   ├── products.json
│   │   ├── categories.json
│   │   ├── navigation.json
│   │   └── site.json
│   │
│   ├── images/
│   │   ├── products/
│   │   │   ├── product-001/
│   │   │   │   ├── main.jpg
│   │   │   │   ├── thumb.jpg
│   │   │   │   └── gallery/
│   │   │   │       ├── 01.jpg
│   │   │   │       └── 02.jpg
│   │   │   │
│   │   │   └── product-002/
│   │   │       ├── main.jpg
│   │   │       └── thumb.jpg
│   │   │
│   │   ├── categories/
│   │   ├── banners/
│   │   └── common/
│   │
│   └── fonts/
│
├── src/
│   ├── components/
│   │   ├── header.js
│   │   ├── footer.js
│   │   ├── product-card.js
│   │   ├── product-gallery.js
│   │   ├── product-options.js
│   │   └── product-filter.js
│   │
│   ├── pages/
│   │   ├── home.js
│   │   ├── products.js
│   │   └── product-detail.js
│   │
│   ├── utils/
│   │   ├── data.js
│   │   ├── format.js
│   │   └── dom.js
│   │
│   ├── css/
│   │   ├── style.css
│   │   └── custom.css
│   │
│   └── main.js
│
├── index.html
├── products.html
├── product.html
├── package.json
├── vite.config.js
└── README.md
```

Do not blindly create files that are unnecessary. Adapt the structure to the actual markup.

---

# 5. Product Data Model

All products MUST be defined in:

```text
public/data/products.json
```

Recommended schema:

```json
{
  "products": [
    {
      "id": "product-001",
      "slug": "classic-leather-watch",
      "name": "Classic Leather Watch",
      "description": "Classic leather watch.",
      "price": 120,
      "currency": "USD",
      "category": "watch",
      "featured": true,
      "available": true,
      "images": {
        "main": "main.jpg",
        "thumbnail": "thumb.jpg",
        "gallery": [
          "01.jpg",
          "02.jpg"
        ]
      }
    }
  ]
}
```

The schema may be extended based on the actual catalogue.

Examples of valid additional fields:

```text
brand
sku
tags
salePrice
rating
colors
sizes
options
variants
badges
metadata
```

Do not add fields that are not needed.

---

# 6. Product ID ↔ Folder Mapping

This is a strict project convention.

Every product MUST have a unique ID.

Example:

```text
product-001
```

The corresponding image directory MUST be:

```text
public/images/products/product-001/
```

Therefore:

```text
products.json
      │
      │ id
      ▼
product-001
      │
      ├── public/images/products/product-001/
      │
      └── product.html?id=product-001
```

Never use arbitrary image folders unrelated to the product ID.

This convention must be documented in README.md.

---

# 7. Image Resolution

Prefer storing only filenames in JSON.

Example:

```json
{
  "id": "product-001",
  "images": {
    "main": "main.jpg",
    "thumbnail": "thumb.jpg",
    "gallery": [
      "01.jpg",
      "02.jpg"
    ]
  }
}
```

JavaScript should construct the path:

```js
function getProductImagePath(productId, filename) {
  return `/images/products/${productId}/${filename}`;
}
```

For gallery images:

```js
function getProductGalleryPath(productId, filename) {
  return `/images/products/${productId}/gallery/${filename}`;
}
```

Avoid storing absolute URLs.

Avoid storing:

```text
https://demo.templatesjungle.com/...
```

Avoid storing:

```text
gid://shopify/MediaImage/...
```

---

# 8. Data Loading

Create a reusable data utility.

Example:

```js
export async function loadJSON(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json();
}
```

Product loading:

```js
const data = await loadJSON('/data/products.json');

const products = data.products;
```

Do not duplicate fetch logic across multiple pages.

---

# 9. Product Listing

The product listing page should contain only the structural HTML required by the design.

Example:

```html
<div id="product-grid"></div>
```

Products should be rendered from JSON.

Example:

```js
const data = await loadJSON('/data/products.json');

productGrid.innerHTML = data.products
  .map(product => renderProductCard(product))
  .join('');
```

Do not hard-code product cards individually in HTML.

---

# 10. Product Card Component

Create:

```text
src/components/product-card.js
```

Example:

```js
export function renderProductCard(product) {
  return `
    <article class="product-card">
      <a href="/product.html?id=${product.id}">
        <img
          src="/images/products/${product.id}/${product.images.main}"
          alt="${product.name}"
        />

        <h3>${product.name}</h3>

        <span>${product.price}</span>
      </a>
    </article>
  `;
}
```

The exact markup MUST follow the existing design.

Do not replace the existing visual structure unnecessarily.

---

# 11. Product Detail

Use:

```text
product.html?id=product-001
```

or, where appropriate:

```text
product.html?slug=classic-leather-watch
```

Recommended implementation:

```js
const params = new URLSearchParams(window.location.search);

const productId = params.get('id');
```

Then:

```js
const product = products.find(
  product => product.id === productId
);
```

If no product is found:

* show a proper "Product not found" state
* do not throw an unhandled JavaScript error
* provide a link back to the product listing

---

# 12. Shared Components

Shared UI should not be duplicated unnecessarily.

At minimum consider reusable rendering for:

```text
Header
Footer
Product Card
Product Gallery
Product Options
Product Filter
```

Example:

```js
export function renderHeader(site) {
  return `
    ...
  `;
}
```

The existing HTML structure should be reused where possible.

---

# 13. Site Configuration

Global information belongs in:

```text
public/data/site.json
```

Example:

```json
{
  "name": "My Store",
  "logo": "/images/common/logo.png",
  "contact": {
    "email": "hello@example.com",
    "phone": "+84..."
  },
  "social": {
    "facebook": "",
    "instagram": ""
  }
}
```

Header/footer should consume this configuration instead of hard-coding duplicated values.

---

# 14. Categories

Use:

```text
public/data/categories.json
```

Example:

```json
{
  "categories": [
    {
      "id": "watch",
      "name": "Watches",
      "slug": "watches"
    },
    {
      "id": "wallet",
      "name": "Wallets",
      "slug": "wallets"
    }
  ]
}
```

Products reference categories by ID:

```json
{
  "category": "watch"
}
```

Avoid duplicating the entire category object inside every product.

---

# 15. Navigation

Global navigation should be defined in:

```text
public/data/navigation.json
```

Only use this if the site has meaningful dynamic navigation.

Example:

```json
{
  "items": [
    {
      "label": "Home",
      "url": "/"
    },
    {
      "label": "Products",
      "url": "/products.html"
    }
  ]
}
```

---

# 16. Existing Assets

The markup may still contain external references such as:

```text
demo.templatesjungle.com
```

Audit all external references.

For required:

```text
CSS
JS
fonts
images
icons
```

prefer downloading/localizing them into the repository.

Do not depend on the original demo website for core functionality.

After migration:

```bash
grep -R "demo.templatesjungle.com" .
```

should ideally return no core runtime dependencies.

External CDN dependencies may remain only if they are intentionally required and documented.

---

# 17. Preserve Existing Design

The existing design is the visual source of truth.

Do NOT:

* redesign the page
* change typography unnecessarily
* replace Bootstrap unnecessarily
* remove animations
* change spacing without reason
* change responsive behavior
* replace existing components merely for architectural purity

The goal is:

```text
Existing design
      +
Data-driven architecture
      +
Static hosting
```

not:

```text
Existing design
      ↓
Completely new UI
```

---

# 18. Vite Configuration

Create:

```text
vite.config.js
```

The GitHub repository name must be taken into account.

For repository:

```text
https://github.com/USERNAME/my-shop
```

GitHub Pages URL:

```text
https://USERNAME.github.io/my-shop/
```

Configure Vite base accordingly:

```js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/my-shop/'
});
```

Do not hard-code `/my-shop/` if the repository name is different.

Determine the actual repository name from git configuration where possible.

Prefer a configuration that can be easily changed for custom domains later.

---

# 19. Avoid Absolute Root Paths When Necessary

GitHub Pages project sites live under:

```text
/<repository-name>/
```

Therefore code such as:

```html
<img src="/images/product.jpg">
```

can be problematic depending on deployment configuration.

Use Vite-aware asset paths or relative paths appropriately.

For runtime JSON and public assets, ensure paths work both:

```text
npm run dev
```

and:

```text
GitHub Pages
```

Test the production build locally.

---

# 20. Package Configuration

Create a minimal:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^7.0.0"
  }
}
```

Use the latest compatible Vite version available when implementing.

Do not install unnecessary dependencies.

---

# 21. GitHub Actions

Create:

```text
.github/workflows/deploy.yml
```

The workflow must:

1. Checkout repository.
2. Install Node.
3. Install dependencies.
4. Run build.
5. Upload `dist`.
6. Deploy to GitHub Pages.

Use the official GitHub Pages deployment mechanism.

The workflow should trigger on:

```text
push to main
```

and optionally allow:

```text
workflow_dispatch
```

---

# 22. No Backend Assumption

The implementation MUST assume:

```text
GET JSON
GET images
render UI
```

Only.

Do not implement:

```text
POST /products
POST /orders
authentication
database
server API
admin dashboard
```

unless explicitly requested.

If a UI feature requires persistence, use client-side mechanisms only when appropriate:

```text
localStorage
sessionStorage
URL parameters
```

Do not introduce a backend.

---

# 23. Product Search / Filter

If the site has filtering:

```js
const filteredProducts = products.filter(...);
```

Filtering should happen entirely client-side.

Example:

```text
products.json
      ↓
JavaScript
      ↓
filter
      ↓
render
```

No API required.

---

# 24. Product Options

If the site has:

```text
Color
Size
Material
Options
Add-ons
```

represent them in JSON.

Example:

```json
{
  "options": {
    "color": [
      {
        "id": "black",
        "name": "Black"
      },
      {
        "id": "brown",
        "name": "Brown"
      }
    ],
    "size": [
      {
        "id": "small",
        "name": "Small"
      },
      {
        "id": "large",
        "name": "Large"
      }
    ]
  }
}
```

The UI should be generated from this data rather than hard-coded.

---

# 25. Data Validation

Create lightweight validation for product data.

At minimum validate:

```text
id
name
price
category
images.main
```

If invalid:

```text
console.error(...)
```

and fail gracefully.

Do not allow a malformed product to break the entire product listing.

---

# 26. Security / HTML Rendering

When inserting JSON values into HTML:

* escape user-controlled values where appropriate
* do not inject arbitrary HTML from JSON unless explicitly required
* avoid `eval`
* avoid dynamic script execution

For normal static data this can remain simple, but maintain safe rendering practices.

---

# 27. README

Create a useful README containing:

## Project setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Add product

Explain:

```text
1. Create product folder
2. Add images
3. Add product entry to products.json
4. Commit
5. Push
```

Example:

```text
public/images/products/product-003/
```

and:

```json
{
  "id": "product-003"
}
```

## GitHub Pages

Document:

```text
repository
     ↓
GitHub Actions
     ↓
Vite build
     ↓
GitHub Pages
```

---

# 28. Implementation Workflow

Follow this exact sequence.

## Phase 1 — Audit

Read `index.html`, `src/` and `public/` as they currently stand before changing anything.

Report:

```text
HTML pages
CSS
JS
images
fonts
vendors
external dependencies
```

Do not immediately rewrite everything.

---

## Phase 2 — Bootstrap project

Create:

```text
package.json
vite.config.js
src/
public/
.github/workflows/
```

Move/copy existing assets into the appropriate locations.

---

## Phase 3 — Preserve visual design

Make the existing design render correctly under Vite BEFORE introducing dynamic data.

This is important.

First achieve:

```text
Existing design ≈ original appearance
```

Then refactor data.

---

## Phase 4 — Data architecture

Create:

```text
products.json
categories.json
site.json
navigation.json
```

based on the actual content on the page.

Do not invent unnecessary fields.

---

## Phase 5 — Dynamic rendering

Replace hard-coded product content with JSON-driven rendering.

Implement:

```text
Product listing
Product card
Product detail
Gallery
Options
Filtering
```

only when present in the original design.

---

## Phase 6 — Shared components

Extract duplicated:

```text
Header
Footer
Product card
```

and other appropriate UI pieces into JS modules.

---

## Phase 7 — Production build

Run:

```bash
npm run build
```

Fix all build errors.

Then:

```bash
npm run preview
```

and manually verify the production output.

---

## Phase 8 — GitHub Pages

Create the GitHub Actions workflow.

Verify:

```text
push → build → deploy
```

---

# 29. Acceptance Criteria

Implementation is considered complete only when:

### Design

* [ ] Existing design is preserved.
* [ ] Desktop layout works.
* [ ] Mobile layout works.
* [ ] Existing animations/interactions still work where applicable.

### Data

* [ ] Products come from `products.json`.
* [ ] No product information is unnecessarily hard-coded into HTML.
* [ ] Product IDs are unique.
* [ ] Product IDs match image folders.
* [ ] Image paths resolve correctly.

### Product

* [ ] Product listing works.
* [ ] Product detail works.
* [ ] Invalid product ID shows a proper fallback.
* [ ] Product gallery works if present.
* [ ] Product options work if present.

### Assets

* [ ] Core assets are local.
* [ ] No dependency on the original demo website for required assets.
* [ ] Images are organized by product ID.

### Build

* [ ] `npm install` works.
* [ ] `npm run dev` works.
* [ ] `npm run build` works.
* [ ] `npm run preview` works.

### Deployment

* [ ] GitHub Actions workflow exists.
* [ ] GitHub Pages deployment is configured.
* [ ] Production paths work under repository subpath.

### Maintainability

* [ ] README explains project structure.
* [ ] README explains how to add a product.
* [ ] JSON schema is understandable.
* [ ] JavaScript is modular.
* [ ] No unnecessary framework/dependency is introduced.

---

# 30. Important Implementation Rules

## Rule 1

Do not rebuild the UI from scratch if the existing markup already provides it.

## Rule 2

Do not introduce React/Vue unless explicitly requested.

## Rule 3

Do not introduce a backend.

## Rule 4

Do not introduce a database.

## Rule 5

Do not hard-code product data into every HTML page.

## Rule 6

Every product must have a stable unique ID.

## Rule 7

Product ID must map to:

```text
JSON
↔
image folder
↔
product URL
```

## Rule 8

Do not rely on external demo assets for core functionality.

## Rule 9

Keep JSON human-editable.

## Rule 10

Prefer simple architecture over unnecessary abstraction.

---

# 31. Expected Final Result

The final repository should allow this workflow:

```text
Developer
   │
   ├── Create:
   │   public/images/products/product-005/
   │
   ├── Add images
   │
   ├── Edit:
   │   public/data/products.json
   │
   └── git push
          │
          ▼
     GitHub Actions
          │
          ▼
       Vite build
          │
          ▼
     GitHub Pages
```

No backend or manual server deployment should be necessary.

The final system should behave as a small static product catalog/store while remaining easy to migrate to a real backend or Shopify Storefront/API in the future.
