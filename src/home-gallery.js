// Renders the #home gallery from public/data/products.json, reusing the mock's
// own item markup so the masonry, hover overlay and Chocolat lightbox behave
// exactly as they do in the static sections.

import { assetPath } from './utils/paths.js';

function escapeHTML(value = '') {
  const element = document.createElement('span');
  element.textContent = String(value);
  return element.innerHTML;
}

function formatPrice(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

// Spread items over the mock's three columns, handing spares to the middle
// column first so a seven-product catalogue reproduces the mock's 2/3/2 shape.
function splitIntoColumns(items, columnCount = 3) {
  const sizes = Array(columnCount).fill(Math.floor(items.length / columnCount));
  const spareOrder = [1, 0, 2];
  for (let i = 0; i < items.length % columnCount; i += 1) sizes[spareOrder[i]] += 1;

  const columns = [];
  let cursor = 0;
  for (const size of sizes) {
    columns.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  return columns;
}

// The mock holds the first two items at 200ms, then steps by 100ms up to 700ms.
function revealDelay(index) {
  return Math.min(200 + Math.max(0, index - 1) * 100, 700);
}

function renderItem(product, index) {
  const src = assetPath(product.images.main);
  const name = escapeHTML(product.name);
  return `
                <div class="item">
                  <a href="${src}" title="${name}" class="image-link">
                    <img src="${src}" class="img-fluid" data-aos="fade-up" data-aos-delay="${revealDelay(index)}"
                      alt="${name}" />
                    <div class="overlay"></div>
                    <div class="description">
                      <h4 class="text-center">${name} <span class="fw-normal">${formatPrice(product.price, product.currency)}</span></h4>
                    </div>
                  </a>
                </div>`;
}

function isRenderable(product) {
  return Boolean(
    product
    && typeof product.name === 'string' && product.name
    && typeof product.images?.main === 'string' && product.images.main
    && typeof product.price === 'number'
    && product.available !== false,
  );
}

export async function renderHomeGallery() {
  const root = document.querySelector('#home-gallery');
  if (!root) return;

  const response = await fetch(assetPath('data/products.json'));
  if (!response.ok) throw new Error(`Failed to load products.json: ${response.status}`);

  const { products = [] } = await response.json();
  const renderable = products.filter((product) => {
    if (isRenderable(product)) return true;
    console.error('Skipping incomplete product:', product);
    return false;
  });

  let index = 0;
  root.innerHTML = splitIntoColumns(renderable).map((column) => `
              <div class="col-lg-4 mb-4 mb-lg-0">${column.map((product) => renderItem(product, index++)).join('')}
              </div>`).join('');
}
