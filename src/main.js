/**
 * @fileoverview Ponto de Entrada Único (Composition Root) e Roteador SPA por Hash (FEAT-007 / ADR-011)
 * Orquestra as rotas #/, #/maiores, #/menores, #/diminutos, #/aumentados
 * com desmontagem explícita entre rotas, anúncio em aria-live e gestão de foco WCAG 2.1 AAA.
 */

import { createSoundEngine } from './audio/soundEngine.js';
import { createAcousticAnalyzer } from './audio/oscilloscope.js';
import { initOscilloscopeView } from './ui/oscilloscopeView.js';
import { initShell, syncActiveNavigation } from './ui/shell.js';
import { renderHomePage } from './ui/homePage.js';
import { renderChapterPage } from './ui/chapterPage.js';
import { renderPianoPage } from './ui/pianoPage.js';

export const ROUTES = Object.freeze({
  '#/': {
    title: 'Acordes Básicos · Guia Acessível de Formação de Tríades',
    announcement: 'Página inicial carregada',
    render: (app) => renderHomePage(app),
    headingId: 'titulo-home'
  },
  '#/maiores': {
    title: 'Acordes Maiores · Acordes Básicos',
    announcement: 'Capítulo de Acordes Maiores carregado',
    render: (app, sound) => renderChapterPage('major', sound, app),
    headingId: 'titulo-capitulo'
  },
  '#/menores': {
    title: 'Acordes Menores · Acordes Básicos',
    announcement: 'Capítulo de Acordes Menores carregado',
    render: (app, sound) => renderChapterPage('minor', sound, app),
    headingId: 'titulo-capitulo'
  },
  '#/diminutos': {
    title: 'Acordes Diminutos · Acordes Básicos',
    announcement: 'Capítulo de Acordes Diminutos carregado',
    render: (app, sound) => renderChapterPage('diminished', sound, app),
    headingId: 'titulo-capitulo'
  },
  '#/aumentados': {
    title: 'Acordes Aumentados · Acordes Básicos',
    announcement: 'Capítulo de Acordes Aumentados carregado',
    render: (app, sound) => renderChapterPage('augmented', sound, app),
    headingId: 'titulo-capitulo'
  },
  '#/piano': {
    title: 'Piano Virtual · Acordes Básicos',
    announcement: 'Piano Virtual carregado',
    render: (app, sound) => renderPianoPage(sound, app),
    headingId: 'titulo-piano'
  }
});

let activeRouteTeardown = null;

export function normalizeHash(hash) {
  if (!hash || hash === '#' || hash === '#/') return '#/';
  const clean = hash.split('?')[0];
  return ROUTES[clean] ? clean : '#/';
}

export function handleRouteChange(options = {}) {
  const root = options.root || document;
  const soundEngine = options.soundEngine || null;
  const currentHash = normalizeHash(options.hash || (typeof window !== 'undefined' ? window.location.hash : '#/'));
  const route = ROUTES[currentHash] || ROUTES['#/'];

  const appElement = root.getElementById ? root.getElementById('app') : root.querySelector?.('#app');
  if (!appElement) return null;

  // Desmonta a rota anterior e interrompe áudio pendente (ADR-011)
  if (typeof activeRouteTeardown === 'function') {
    try { activeRouteTeardown(); } catch {}
    activeRouteTeardown = null;
  }
  if (soundEngine && typeof soundEngine.stopAll === 'function') {
    soundEngine.stopAll();
  }

  // Renderiza a nova tela e registra sua desmontagem
  const teardown = route.render(appElement, soundEngine);
  activeRouteTeardown = typeof teardown === 'function' ? teardown : null;

  // Atualiza título
  if (typeof document !== 'undefined') {
    document.title = route.title;
  }

  // Sincroniza estado de navegação
  syncActiveNavigation(root, currentHash);

  // Anúncio em leitor de tela
  const announcer = root.getElementById ? root.getElementById('route-announcer') : root.querySelector?.('#route-announcer');
  if (announcer) {
    announcer.textContent = route.announcement;
  }

  // Rola suavemente ao topo e transfere foco para o título
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const heading = root.getElementById ? root.getElementById(route.headingId) : root.querySelector?.(`#${route.headingId}`);
  if (heading && typeof heading.focus === 'function') {
    heading.focus();
  }

  return activeRouteTeardown;
}

export function initApp(root = document) {
  const soundEngine = createSoundEngine();
  const acousticAnalyzer = createAcousticAnalyzer();

  initShell(root);
  const oscilloscopeView = initOscilloscopeView({
    root,
    soundEngine,
    analyzer: acousticAnalyzer
  });

  const routeHandler = () => handleRouteChange({ root, soundEngine });

  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', routeHandler);
  }

  routeHandler();
  return { soundEngine, acousticAnalyzer, oscilloscopeView, routeHandler };
}

// Auto-inicialização em ambiente de navegador
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initApp(document));
  } else {
    initApp(document);
  }
}
