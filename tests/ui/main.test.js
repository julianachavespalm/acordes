import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ROUTES, normalizeHash, handleRouteChange, initApp } from '../../src/main.js';

class MockElement {
  constructor(tagName, attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.children = [];
    this.innerHTML = '';
    this.textContent = '';
    this.className = attributes.class || '';
    this.id = attributes.id || '';
    this.eventListeners = {};
    this.focused = false;
  }

  getAttribute(name) {
    if (name === 'id') return this.id || this.attributes['id'] || null;
    return this.attributes[name] ?? null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'id') this.id = String(value);
    if (name === 'class') this.className = String(value);
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  hasAttribute(name) {
    return name in this.attributes;
  }

  focus() {
    this.focused = true;
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(handler);
  }

  querySelectorAll(selector) {
    const results = [];
    const traverse = (node) => {
      for (const child of node.children) {
        if (selector.startsWith('.') && (child.className || '').split(' ').includes(selector.slice(1))) {
          results.push(child);
        } else if (selector.startsWith('#') && (child.id === selector.slice(1))) {
          results.push(child);
        } else if (selector === child.tagName.toLowerCase()) {
          results.push(child);
        }
        traverse(child);
      }
    };
    traverse(this);
    return results;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  getElementById(id) {
    return this.querySelector(`#${id}`);
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }
}

describe('FEAT-007: Roteador SPA por Hash e Acessibilidade (WCAG 2.1 AAA)', () => {
  let doc;
  let appElement;
  let announcer;
  let navLinks;

  beforeEach(() => {
    doc = new MockElement('html');
    appElement = new MockElement('main', { id: 'app' });
    announcer = new MockElement('div', { id: 'route-announcer', class: 'sr-only' });

    const header = new MockElement('header', { class: 'site-header' });
    const nav = new MockElement('nav', { id: 'menu-principal' });
    navLinks = [
      new MockElement('a', { class: 'nav-link', href: '#/' }),
      new MockElement('a', { class: 'nav-link', href: '#/maiores' }),
      new MockElement('a', { class: 'nav-link', href: '#/menores' }),
      new MockElement('a', { class: 'nav-link', href: '#/diminutos' }),
      new MockElement('a', { class: 'nav-link', href: '#/aumentados' }),
      new MockElement('a', { class: 'nav-link', href: '#/piano' })
    ];
    for (const l of navLinks) nav.appendChild(l);
    header.appendChild(nav);

    doc.appendChild(announcer);
    doc.appendChild(header);
    doc.appendChild(appElement);
  });

  test('normalizeHash deve redirecionar hashes invalidos para #/', () => {
    assert.equal(normalizeHash(''), '#/');
    assert.equal(normalizeHash('#'), '#/');
    assert.equal(normalizeHash('#/'), '#/');
    assert.equal(normalizeHash('#/invalido'), '#/');
    assert.equal(normalizeHash('#/maiores'), '#/maiores');
    assert.equal(normalizeHash('#/aumentados?param=1'), '#/aumentados');
  });

  test('handleRouteChange deve renderizar a Home para rota #/ e anunciar em aria-live', () => {
    handleRouteChange({ root: doc, hash: '#/' });

    assert.match(appElement.innerHTML, /Acordes Básicos/);
    assert.match(appElement.innerHTML, /ESTUDO DAS TRÍADES/);
    assert.equal(announcer.textContent, 'Página inicial carregada');
    assert.equal(navLinks[0].getAttribute('aria-current'), 'page');
  });

  test('handleRouteChange deve renderizar o capitulo de acordes para rota #/maiores', () => {
    handleRouteChange({ root: doc, hash: '#/maiores' });

    assert.match(appElement.innerHTML, /Acordes/);
    assert.match(appElement.innerHTML, /Maiores/);
    assert.match(appElement.innerHTML, /1 · 3 · 5/);
    assert.equal(announcer.textContent, 'Capítulo de Acordes Maiores carregado');
    assert.equal(navLinks[1].getAttribute('aria-current'), 'page');
    assert.equal(navLinks[0].hasAttribute('aria-current'), false);
  });

  test('handleRouteChange deve renderizar notas de rodape DPUB no capitulo #/aumentados', () => {
    handleRouteChange({ root: doc, hash: '#/aumentados' });

    assert.match(appElement.innerHTML, /nota-triplo-sustenido/);
    assert.match(appElement.innerHTML, /editorial-backlink/);
    assert.equal(announcer.textContent, 'Capítulo de Acordes Aumentados carregado');
    assert.equal(navLinks[4].getAttribute('aria-current'), 'page');
  });

  test('handleRouteChange deve executar teardown da rota anterior e parar audio ao trocar de rota (ADR-011)', () => {
    let stopAllCalls = 0;
    const mockSoundEngine = {
      stopAll: () => { stopAllCalls += 1; },
      playNote: async () => {},
      playChord: async () => {},
      preload: () => {}
    };

    const firstTeardown = handleRouteChange({ root: doc, hash: '#/aumentados', soundEngine: mockSoundEngine });
    assert.equal(typeof firstTeardown, 'function');

    handleRouteChange({ root: doc, hash: '#/maiores', soundEngine: mockSoundEngine });
    assert.equal(stopAllCalls, 2);
  });

  test('handleRouteChange deve renderizar a aba Piano Virtual para rota #/piano e marcar aba ativa (RN-01)', () => {
    const teardown = handleRouteChange({ root: doc, hash: '#/piano' });

    assert.equal(typeof teardown, 'function');
    assert.match(appElement.innerHTML, /Piano Virtual/);
    assert.match(appElement.innerHTML, /piano-keyboard/);
    assert.equal(announcer.textContent, 'Piano Virtual carregado');
    assert.equal(navLinks[5].getAttribute('aria-current'), 'page');
  });

  test('handleRouteChange deve sincronizar faixa superior mobile, limpar cifra no rodape e focar titulo', () => {
    const mobileTitle = new MockElement('span', { id: 'mobile-topbar-title' });
    const mobileSub = new MockElement('span', { id: 'mobile-topbar-subtitle' });
    const footerCifra = new MockElement('span', { id: 'footer-cifra', class: 'is-visible' });
    footerCifra.textContent = 'Cifra: C';
    let headingFocused = false;
    const fakeHeading = new MockElement('h1', { id: 'titulo-capitulo' });
    fakeHeading.focus = () => { headingFocused = true; };

    doc.appendChild(mobileTitle);
    doc.appendChild(mobileSub);
    doc.appendChild(footerCifra);
    doc.appendChild(fakeHeading);

    handleRouteChange({ root: doc, hash: '#/maiores' });
    assert.equal(mobileTitle.textContent, 'Acordes Maiores');
    assert.equal(mobileSub.textContent, 'Tríade 1 · 3 · 5');
    assert.equal(mobileSub.hidden, false);
    assert.equal(footerCifra.textContent, '');
    assert.equal(headingFocused, true);

    handleRouteChange({ root: doc, hash: '#/' });
    assert.equal(mobileTitle.textContent, 'Acordes Básicos');
    assert.equal(mobileSub.hidden, true);
  });

  test('initApp deve inicializar shell, osciloscopio e executar a rota inicial', () => {
    doc.appendChild(new MockElement('path', { id: 'footer-separator-line' }));
    const appState = initApp(doc);
    assert.ok(appState.soundEngine);
    assert.ok(appState.acousticAnalyzer);
    assert.ok(appState.oscilloscopeView);
    assert.equal(typeof appState.routeHandler, 'function');
    assert.match(appElement.innerHTML, /Acordes Básicos/);
  });
});
