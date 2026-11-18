# BOHUC — leather bags

A single-page shop front for a small leather-bag studio, built from the
supplied HTML template. It uses Vite, Bootstrap 5 and vanilla JavaScript
modules, with no backend or database, and is ready for GitHub Pages.

Orders are arranged by message rather than a checkout, so there is no cart and
no payment integration — the `#how-to-order` and `#contact` sections carry that
flow.

`index.html` keeps the template's original one-page markup, fixed sidebar
navigation, masonry layout and motion system. AOS, Swiper, Chocolat and Isotope
are installed from npm and bundled by Vite; images live under `public/images/`.
Google Fonts is the only intentional external presentation dependency, so the
original typography is preserved.

## Project setup

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The default Vite base is `/static-bag/`, matching the repository name. For a
custom domain or root deployment, build with `VITE_BASE_PATH=/ npm run build`.

## Structure

```text
index.html              nav, sections and all static content
src/mock-home.js        entry point: styles, AOS, Swiper, Isotope, Chocolat, menu
src/home-gallery.js     renders the #home gallery from products.json
src/site.js             reads site.json and applies the studio address
src/contact-form.js     builds the mailto: link on submit
src/css/theme.css       the template's theme stylesheet
src/utils/text-fx.js    the template's per-letter heading animation
public/data/            products.json, site.json (categories.json is unused)
public/images/          one folder per section (see below)
```

Sections are `#home`, `#collection`, `#how-its-made`, `#about`,
`#how-to-order` and `#contact`, in that order. The sidebar menu links to those anchors, and Bootstrap's scrollspy
highlights the current one.

## Images

Each section keeps its images in its own folder, so it is obvious what a file is
for and what breaks if you remove it:

```text
public/images/brand/           logo
public/images/products/        #home gallery, one file per product id
public/images/making/          #how-its-made story, one file per stage
public/images/collection/      #collection grid
```

Only `products/` is addressed through JSON; the others are referenced directly
from `index.html`. The files in `making/` are placeholders — replace them with
real workshop photographs.

Gallery photos (`products/`, `collection/`) come in three WebP sizes, made from
the camera originals:

```text
<name>-600.webp    grid, phones and 1x screens   (srcset 600w)
<name>-1000.webp   grid, retina screens          (srcset 1000w, also the src)
<name>-1600.webp   lightbox only, fetched on click
```

Resize to 600 and 1000 px wide and to fit inside 1600×1600, WebP quality ~80.
Keep the `width`/`height` of the 600 file in the markup or JSON so the masonry
reserves space before the image arrives.

## The #home gallery

`#home` is the only data-driven section: `src/home-gallery.js` reads
`public/data/products.json` and builds the masonry, so the catalogue is edited
in JSON rather than in markup. Every other section is static HTML.

```json
{
  "id": "product-001",
  "name": "Top-Handle Bag",
  "available": true,
  "images": {
    "main": "images/products/product-001-1000.webp",
    "small": "images/products/product-001-600.webp",
    "large": "images/products/product-001-1600.webp",
    "width": 600, "height": 900
  }
}
```

`name` and `images.main` are required; a record missing any of them, or
marked `"available": false`, is skipped and logged to the console. `images.main`
is resolved against the Vite base, so write it without a leading slash. `small`
(srcset 600w) and `large` (lightbox) are optional and fall back to `main`.

Items are spread over three columns, spares going to the middle column first, so
seven products reproduce the template's original 2/3/2 layout. The product name
appears in the hover overlay (no prices are shown) and the image opens in the Chocolat lightbox.

The other files in `public/data/` are leftovers from an earlier multi-page
version and are not read by anything.

## Editing content

Copy and images outside `#home` are edited directly in `index.html`. To add a section,
follow the pattern the others use so it picks up the same motion:

```html
<section id="your-section" class="my-5 py-5" data-aos="fade-up">
  <span class="text-muted text-uppercase">eyebrow</span>
  <h4 class="display-5 fw-normal">Heading</h4>
</section>
```

Then add a matching `<li class="pb-3">` to `#one-page-menu` in document order.

## GitHub Pages

Pushes to `main` run `.github/workflows/deploy.yml`:

```text
repository → npm ci → Vite build → Pages artifact → GitHub Pages
```

Enable **GitHub Actions** as the Pages source in the repository settings before
the first deployment.

## Studio email address

The address lives in `public/data/site.json` under `contact.email`. It is read
at runtime, so changing it needs no rebuild — edit the JSON and refresh:

```json
{
  "contact": {
    "name": "The Lab Atelier LLC",
    "email": "studio@example.com",
    "linkEmail": false
  }
}
```

The sidebar shows `contact.name`. While `linkEmail` is `false` it is plain text
with no mailto link and the address is not printed anywhere on the page; set it
to `true` to turn the sidebar link back on (and show the address in the form's
status message). The contact form always sends to `contact.email`.

## Static interactions

Portfolio filtering and the lightbox run in the browser. The contact form has no
endpoint — submitting builds a `mailto:` link and hands the message to the
visitor's own mail client, which does nothing if their OS has no mail app
registered. No API, authentication or server is used.
