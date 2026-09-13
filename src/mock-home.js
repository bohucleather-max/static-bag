import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import 'swiper/css/bundle';
import 'chocolat/dist/css/chocolat.css';
import './css/theme.css';
import './css/site.css';
import 'bootstrap';
import AOS from 'aos';
import Swiper from 'swiper/bundle';
import Isotope from 'isotope-layout';
import Chocolat from 'chocolat';
import { initTextFx } from './utils/text-fx.js';
import { assetPath } from './utils/paths.js';
import { renderHomeGallery } from './home-gallery.js';
import { applySiteContact, loadSite } from './site.js';
import { initContactForm } from './contact-form.js';

function initMenu() {
  const button = document.querySelector('.menu-btn');
  if (!button) return;
  button.addEventListener('click', (event) => {
    event.preventDefault();
    document.body.classList.toggle('nav-active');
  });
}

function initPortfolioGrid() {
  document.querySelectorAll('.isotope-container').forEach((container) => {
    const grid = new Isotope(container, {
      itemSelector: '.item',
      layoutMode: 'masonry',
    });

    container.querySelectorAll('img').forEach((image) => {
      if (!image.complete) image.addEventListener('load', () => grid.layout(), { once: true });
    });

    document.querySelectorAll('.filter-button').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelector('.filter-button.active')?.classList.remove('active');
        button.classList.add('active');
        grid.arrange({ filter: button.dataset.filter || '*' });
      });
    });
  });
}

function initPortfolioSlider() {
  if (!document.querySelector('.portfolio-Swiper')) return;
  new Swiper('.portfolio-Swiper', {
    slidesPerView: 4,
    spaceBetween: 30,
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      300: { slidesPerView: 2 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      1200: { slidesPerView: 3, spaceBetween: 30 },
    },
  });
}

function initLightbox() {
  const links = document.querySelectorAll('.image-link');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    // Static sections use root-relative paths and still need the Vite base;
    // generated markup already carries it, so skip those or it doubles up.
    if (href?.startsWith('/') && !href.startsWith(import.meta.env.BASE_URL)) {
      link.setAttribute('href', assetPath(href));
    }
  });
  if (links.length) Chocolat(links, { imageSize: 'contain', loop: true });
}

document.addEventListener('DOMContentLoaded', async () => {
  initMenu();
  initTextFx();
  initPortfolioSlider();

  // Reveal the static sections as soon as the bundle runs. Every [data-aos]
  // element sits at opacity 0 until AOS starts, so waiting for the fetches
  // below would paint an almost empty page and then pop everything in at once.
  AOS.init({ duration: 1200 });

  const [site] = await Promise.all([
    loadSite().catch((error) => { console.error(error); return null; }),
    renderHomeGallery().catch((error) => { console.error(error); }),
  ]);

  if (site) applySiteContact(site);
  initContactForm(site?.contact?.email);

  // Chocolat and AOS both need the gallery markup that has only just arrived;
  // refreshHard re-scans the DOM so the new items animate too.
  initLightbox();
  AOS.refreshHard();
});

window.addEventListener('load', () => {
  initPortfolioGrid();
});
