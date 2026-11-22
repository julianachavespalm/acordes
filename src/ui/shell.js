/**
 * @fileoverview Shell de Navegação e Acessibilidade (FEAT-003, FEAT-007 / ADR-001, ADR-008, ADR-010)
 * Gerencia o header unificado, navegação por hash, skip-links e menu responsivo.
 */

export const NAV_ITEMS = Object.freeze([
  { hash: '#/', label: 'Home' },
  { hash: '#/maiores', label: 'Acordes Maiores' },
  { hash: '#/menores', label: 'Acordes Menores' },
  { hash: '#/diminutos', label: 'Acordes Diminutos' },
  { hash: '#/aumentados', label: 'Acordes Aumentados' },
  { hash: '#/piano', label: 'Piano Virtual' }
]);

const KNOWN_HASHES = new Set(NAV_ITEMS.map((item) => item.hash));

export function renderHeaderMarkup() {
  const linksHtml = NAV_ITEMS.map(
    (item) => `<li><a href="${item.hash}" class="nav-link">${item.label}</a></li>`
  ).join('\n        ');

  return `
    <header class="site-header">
      <div class="mobile-topbar-heading" aria-hidden="true">
        <span class="mobile-topbar-title" id="mobile-topbar-title">Acordes Básicos</span>
        <span class="mobile-topbar-subtitle" id="mobile-topbar-subtitle" hidden></span>
      </div>
      <button type="button" class="menu-toggle-btn" id="menu-toggle" aria-expanded="false" aria-controls="menu-principal" aria-label="Abrir menu de navegação">
        <svg class="icon-hamburger" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg class="icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="sr-only">Menu de navegação</span>
      </button>

      <nav class="main-navigation" id="menu-principal" aria-label="Navegação principal" tabindex="-1">
        <ul class="nav-list" role="list">
          ${linksHtml}
        </ul>
      </nav>
    </header>
  `.trim();
}

export function renderFooterMarkup() {
  return `
    <footer class="site-footer">
      <div class="footer-separator-row" aria-hidden="true">
        <span class="footer-cifra-indicator" id="footer-cifra"></span>
        <div class="footer-separator-bar">
          <svg class="footer-separator-svg" viewBox="0 0 1000 40" preserveAspectRatio="none">
            <path id="footer-separator-line" class="footer-separator-line" d="M 0 20.5 L 1000 20.5" />
          </svg>
        </div>
      </div>
      <p class="footer-credit">Por <a href="https://github.com/julianachavespalm" class="footer-author-link" target="_blank" rel="noopener noreferrer">Juliana Chaves Palm</a></p>
    </footer>
  `.trim();
}

function normalizePathSegment(value) {
  if (!value || value === '' || value === '#' || value === '#/' || value === '/' || value.includes('index.html')) {
    return 'index.html';
  }
  const clean = value.split('?')[0].split('#')[0];
  const segments = clean.split(/[\\/]/).filter(Boolean);
  return segments[segments.length - 1] || 'index.html';
}

function normalizeHashValue(value) {
  if (!value) return '#/';
  const hashPart = value.startsWith('#') ? value : `#${value.split('#')[1] || ''}`;
  const clean = hashPart.split('?')[0];
  if (clean === '#' || clean === '' || clean === '#/') return '#/';
  return KNOWN_HASHES.has(clean) ? clean : clean;
}

export function syncActiveNavigation(container = document, currentVal = '') {
  if (!container) return null;

  const current = currentVal || (typeof window !== 'undefined' ? (window.location.hash || window.location.pathname) : '');
  const isHashMode = current.includes('#');
  const activeHash = isHashMode ? normalizeHashValue(current) : '';
  const activePath = isHashMode ? '' : normalizePathSegment(current);

  const navLinks = container.querySelectorAll ? container.querySelectorAll('.nav-link') : [];
  let matchedHref = null;

  for (const link of navLinks) {
    const rawHref = link.getAttribute('href') || '';
    const isMatch = isHashMode
      ? normalizeHashValue(rawHref) === activeHash
      : normalizePathSegment(rawHref) === activePath;

    if (isMatch) {
      link.setAttribute('aria-current', 'page');
      const label = link.textContent?.trim() || '';
      link.setAttribute('aria-label', `${label}, aba atual`);
      link.setAttribute('tabindex', '-1');
      if (link.style) {
        link.style.pointerEvents = 'none';
        link.style.cursor = 'default';
      }
      matchedHref = rawHref;
    } else {
      link.removeAttribute('aria-current');
      link.removeAttribute('aria-label');
      link.removeAttribute('tabindex');
      if (link.style) {
        link.style.pointerEvents = '';
        link.style.cursor = '';
      }
    }
  }

  return matchedHref;
}

export function initMenuToggle(optionsOrRoot = {}) {
  const root = (optionsOrRoot && (optionsOrRoot.querySelector || optionsOrRoot.getElementById))
    ? optionsOrRoot
    : (optionsOrRoot?.root || (typeof document !== 'undefined' ? document : null));

  if (!root) return null;

  const toggleBtn = root.querySelector ? root.querySelector('#menu-toggle') : null;
  const menuNav = root.querySelector ? root.querySelector('#menu-principal') : null;

  if (!toggleBtn || !menuNav) return null;

  function setMenuOpen(isOpen) {
    const body = root.body || (root.querySelector ? root.querySelector('body') : null);
    if (isOpen) {
      body?.classList?.add('menu-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Fechar menu de navegação');
    } else {
      body?.classList?.remove('menu-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e?.preventDefault?.();
    const isCurrentlyOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isCurrentlyOpen);
  });

  const navLinks = menuNav.querySelectorAll ? menuNav.querySelectorAll('.nav-link') : [];
  for (const link of navLinks) {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('aria-current') === 'page') {
        e?.preventDefault?.();
        return;
      }
      setMenuOpen(false);
    });
  }

  if (typeof root.addEventListener === 'function') {
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggleBtn.focus?.();
      }
    });

    root.addEventListener('click', (e) => {
      if (toggleBtn.getAttribute('aria-expanded') === 'true') {
        const clickedInsideBtn = toggleBtn.contains ? toggleBtn.contains(e.target) : false;
        const clickedInsideNav = menuNav.contains ? menuNav.contains(e.target) : false;
        if (!clickedInsideBtn && !clickedInsideNav) {
          setMenuOpen(false);
        }
      }
    });
  }

  return { setMenuOpen };
}

export function initSkipLinks(container = document) {
  if (!container || typeof container.querySelectorAll !== 'function') return;

  const skipLinks = container.querySelectorAll('.skip-link');
  for (const link of skipLinks) {
    const handleActivation = (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.slice(1);
        const target = container.getElementById ? container.getElementById(targetId) : container.querySelector?.(`#${targetId}`);
        if (target) {
          e?.preventDefault?.();
          target.focus?.();
          target.scrollIntoView?.({ behavior: 'smooth' });
        }
      }
      link.blur?.();
    };

    link.addEventListener('click', handleActivation);
    link.addEventListener('keydown', (e) => {
      if (e && (e.key === 'Enter' || e.key === ' ')) {
        handleActivation(e);
      }
    });
  }
}

export function syncMenuOverflow(root = document, windowTarget = typeof window !== 'undefined' ? window : null) {
  if (!root || !windowTarget) return false;
  const body = root.body || root.querySelector?.('body');
  if (!body || !body.classList) return false;

  if (windowTarget.innerWidth <= 960) {
    body.classList.remove('force-hamburger');
    return false;
  }

  body.classList.remove('force-hamburger');
  const header = root.querySelector?.('.site-header');
  const navList = root.querySelector?.('.nav-list');
  if (!header || !navList) return false;

  const overflows = navList.scrollWidth > (header.clientWidth - 64);
  if (overflows) {
    body.classList.add('force-hamburger');
  }
  return overflows;
}

export function initShell(optionsOrRoot = {}) {
  const root = (optionsOrRoot && (optionsOrRoot.querySelector || optionsOrRoot.getElementById))
    ? optionsOrRoot
    : (optionsOrRoot?.root || (typeof document !== 'undefined' ? document : null));

  if (!root) {
    return { activeHref: null, menuController: null };
  }

  const currentPath = optionsOrRoot?.currentPath || '';
  const effectivePath = currentPath || (typeof window !== 'undefined' ? (window.location.hash || window.location.pathname) : '');
  const activeHref = syncActiveNavigation(root, effectivePath);
  initSkipLinks(root);
  const menuController = initMenuToggle({ root });

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    const onResize = () => syncMenuOverflow(root, window);
    window.addEventListener('resize', onResize);
    onResize();

    const headerEl = root.querySelector?.('.site-header');
    const mainEl = root.getElementById ? root.getElementById('app') : root.querySelector?.('#app');
    if (headerEl) {
      const onScroll = () => {
        const scrolled = (window.scrollY > 8) || (mainEl && mainEl.scrollTop > 8);
        headerEl.classList?.toggle('is-scrolled', Boolean(scrolled));
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      mainEl?.addEventListener?.('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  return {
    activeHref,
    menuController,
  };
}
