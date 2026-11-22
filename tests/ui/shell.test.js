import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { syncActiveNavigation, initShell, initMenuToggle, initSkipLinks } from '../../src/ui/shell.js';

function readCss(fileName) {
  const p = fs.existsSync(`src/styles/${fileName}`) ? `src/styles/${fileName}` : `src/css/${fileName}`;
  return fs.readFileSync(p, 'utf8');
}

class MockElement {
  constructor(tagName, attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.children = [];
    this.textContent = '';
    this.className = attributes.class || '';
    this.id = attributes.id || '';
    this.eventListeners = {};
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'class') this.className = String(value);
    if (name === 'id') this.id = String(value);
  }

  removeAttribute(name) {
    delete this.attributes[name];
    if (name === 'class') this.className = '';
  }

  hasAttribute(name) {
    return name in this.attributes;
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(handler);
  }

  dispatchEvent(event) {
    const handlers = this.eventListeners[event.type] || [];
    for (const h of handlers) {
      h(event);
    }
  }

  classList = {
    add: (cls) => {
      const classes = new Set(this.className.split(' ').filter(Boolean));
      classes.add(cls);
      this.className = Array.from(classes).join(' ');
      this.attributes.class = this.className;
    },
    remove: (cls) => {
      const classes = new Set(this.className.split(' ').filter(Boolean));
      classes.delete(cls);
      this.className = Array.from(classes).join(' ');
      this.attributes.class = this.className;
    },
    contains: (cls) => {
      return this.className.split(' ').includes(cls);
    },
  };

  querySelectorAll(selector) {
    const results = [];
    const traverse = (node) => {
      for (const child of node.children) {
        if (selector.startsWith('#') && (child.id === selector.slice(1) || child.attributes.id === selector.slice(1))) {
          results.push(child);
        } else if (selector === 'a' && child.tagName === 'A') {
          results.push(child);
        } else if (selector === 'ul' && child.tagName === 'UL') {
          results.push(child);
        } else if (selector === 'li' && child.tagName === 'LI') {
          results.push(child);
        } else if (selector === '.nav-link' && child.className.includes('nav-link')) {
          results.push(child);
        } else if (selector === '.skip-link' && child.className.includes('skip-link')) {
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

  appendChild(child) {
    this.children.push(child);
    return child;
  }
}

class MockDocument {
  constructor() {
    this.body = new MockElement('body');
    this.eventListeners = {};
  }

  createElement(tagName) {
    return new MockElement(tagName);
  }

  querySelector(selector) {
    if (selector === 'body') return this.body;
    return this.body.querySelector(selector);
  }

  getElementById(id) {
    const traverse = (node) => {
      if (node.id === id || node.attributes?.id === id) return node;
      for (const child of node.children) {
        const found = traverse(child);
        if (found) return found;
      }
      return null;
    };
    return traverse(this.body);
  }

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(handler);
  }

  dispatchEvent(event) {
    const handlers = this.eventListeners[event.type] || [];
    for (const h of handlers) {
      h(event);
    }
  }
}

describe('FEAT-003: Shell de Navegação, Design Suíço e Menu Responsivo Acessível', () => {
  let doc;
  let toggleBtn;
  let nav;
  let ul;
  let links;

  beforeEach(() => {
    doc = new MockDocument();

    // Skip links
    const skip1 = new MockElement('a', { class: 'skip-link', href: '#lista-acordes' });
    skip1.textContent = 'Ir para a lista de acordes';
    const skip2 = new MockElement('a', { class: 'skip-link', href: '#menu-principal' });
    skip2.textContent = 'Ir para o menu';

    doc.body.appendChild(skip1);
    doc.body.appendChild(skip2);

    // Botão hambúrguer flutuante para mobile
    toggleBtn = new MockElement('button', {
      id: 'menu-toggle',
      class: 'menu-toggle-btn',
      'aria-expanded': 'false',
      'aria-controls': 'menu-principal',
      'aria-label': 'Abrir menu de navegação'
    });
    doc.body.appendChild(toggleBtn);

    // Header nav com lista semântica amigável para leitores de tela
    nav = new MockElement('nav', { id: 'menu-principal', class: 'main-navigation', 'aria-label': 'Navegação principal' });
    ul = new MockElement('ul', { class: 'nav-list', role: 'list' });

    links = [
      new MockElement('a', { class: 'nav-link', href: 'index.html' }),
      new MockElement('a', { class: 'nav-link', href: 'acordes-maiores.html' }),
      new MockElement('a', { class: 'nav-link', href: 'acordes-menores.html' }),
      new MockElement('a', { class: 'nav-link', href: 'acordes-diminutos.html' }),
      new MockElement('a', { class: 'nav-link', href: 'acordes-aumentados.html' }),
    ];
    links[0].textContent = 'Home';
    links[1].textContent = 'Acordes Maiores';
    links[2].textContent = 'Acordes Menores';
    links[3].textContent = 'Acordes Diminutos';
    links[4].textContent = 'Acordes Aumentados';

    for (const link of links) {
      const li = new MockElement('li');
      li.appendChild(link);
      ul.appendChild(li);
    }
    nav.appendChild(ul);
    doc.body.appendChild(nav);
  });

  test('deve conter o duplo skip-link acessível no topo da página (RN-01 / CA-03.1)', () => {
    const skipLinks = doc.querySelectorAll('.skip-link');
    assert.equal(skipLinks.length, 2);
    assert.equal(skipLinks[0].getAttribute('href'), '#lista-acordes');
    assert.equal(skipLinks[1].getAttribute('href'), '#menu-principal');
  });

  test('deve estruturar a navegação como uma lista semântica simples acessível para leitores de tela', () => {
    const navEl = doc.querySelector('#menu-principal');
    assert.ok(navEl);
    assert.equal(navEl.getAttribute('aria-label'), 'Navegação principal');

    const listEl = navEl.querySelector('ul');
    assert.ok(listEl);
    assert.equal(listEl.getAttribute('role'), 'list');

    const navItems = listEl.querySelectorAll('li');
    assert.equal(navItems.length, 5);
  });

  test('deve marcar com aria-current="page" exclusivamente a página ativa correspondente (RN-03 / CA-03.2)', () => {
    syncActiveNavigation(doc, 'acordes-diminutos.html');

    const diminutosLink = links[3];
    assert.equal(diminutosLink.getAttribute('aria-current'), 'page');

    const otherLinks = [links[0], links[1], links[2], links[4]];
    for (const link of otherLinks) {
      assert.equal(link.hasAttribute('aria-current'), false);
    }
  });

  test('deve alternar o menu móvel e atualizar estados ARIA ao clicar no botão hambúrguer', () => {
    initMenuToggle({ root: doc });

    assert.equal(toggleBtn.getAttribute('aria-expanded'), 'false');
    assert.equal(toggleBtn.getAttribute('aria-label'), 'Abrir menu de navegação');
    assert.equal(doc.body.classList.contains('menu-open'), false);

    // Abre o menu
    toggleBtn.dispatchEvent({ type: 'click', preventDefault: () => {} });
    assert.equal(toggleBtn.getAttribute('aria-expanded'), 'true');
    assert.equal(toggleBtn.getAttribute('aria-label'), 'Fechar menu de navegação');
    assert.equal(doc.body.classList.contains('menu-open'), true);

    // Fecha o menu
    toggleBtn.dispatchEvent({ type: 'click', preventDefault: () => {} });
    assert.equal(toggleBtn.getAttribute('aria-expanded'), 'false');
    assert.equal(toggleBtn.getAttribute('aria-label'), 'Abrir menu de navegação');
    assert.equal(doc.body.classList.contains('menu-open'), false);
  });

  test('deve fechar o menu móvel ao clicar em qualquer link de navegação', () => {
    initMenuToggle({ root: doc });

    // Abre
    toggleBtn.dispatchEvent({ type: 'click', preventDefault: () => {} });
    assert.equal(doc.body.classList.contains('menu-open'), true);

    // Clica no link
    links[1].dispatchEvent({ type: 'click' });
    assert.equal(doc.body.classList.contains('menu-open'), false);
    assert.equal(toggleBtn.getAttribute('aria-expanded'), 'false');
  });

  test('deve fechar o menu móvel ao pressionar a tecla Escape', () => {
    initMenuToggle({ root: doc });

    toggleBtn.dispatchEvent({ type: 'click', preventDefault: () => {} });
    assert.equal(doc.body.classList.contains('menu-open'), true);

    doc.dispatchEvent({ type: 'keydown', key: 'Escape' });
    assert.equal(doc.body.classList.contains('menu-open'), false);
    assert.equal(toggleBtn.getAttribute('aria-expanded'), 'false');
  });

  test('deve inicializar o shell com initShell de forma segura sem erros', () => {
    const result = initShell({ root: doc, currentPath: 'acordes-aumentados.html' });
    assert.equal(result.activeHref, 'acordes-aumentados.html');
    assert.equal(links[4].getAttribute('aria-current'), 'page');
  });

  test('initShell nao deve registrar bloqueios de copia, recorte ou selecao de texto (ADR-010)', () => {
    initShell({ root: doc, currentPath: 'acordes-aumentados.html' });

    assert.equal(doc.eventListeners['copy'], undefined);
    assert.equal(doc.eventListeners['cut'], undefined);
    assert.equal(doc.eventListeners['selectstart'], undefined);
  });

  test('deve impedir quebra de texto dos itens do menu com white-space nowrap em components.css', () => {
    const css = readCss('components.css');
    assert.match(css, /\.nav-link\s*{[^}]*white-space:\s*nowrap/s);
  });

  test('deve garantir que o botao hamburguer fique visivel em telas estreitas (<= 960px) em components.css', () => {
    const css = readCss('components.css');
    assert.match(css, /@media\s*\(\s*max-width:\s*960px\s*\)\s*{[^}]*\.menu-toggle-btn\s*{[^}]*display:\s*flex/s);
    assert.match(css, /@media\s*\(\s*min-width:\s*961px\s*\)\s*{[^}]*\.menu-toggle-btn\s*{[^}]*display:\s*none/s);
  });

  test('deve configurar botao de menu sem borda e com fundo transparente (FEAT-003)', () => {
    const css = readCss('components.css');
    assert.match(css, /\.menu-toggle-btn\s*{[^}]*border:\s*none/s);
    assert.match(css, /\.menu-toggle-btn\s*{[^}]*background-color:\s*transparent/s);
  });

  test('deve configurar menu aberto como gaveta editorial suica sem borda acima do rodape (FEAT-003 / FEAT-010)', () => {
    const layoutCss = readCss('layout.css');
    assert.match(layoutCss, /body\.menu-open\s+\.main-navigation[^{]*{[^}]*border:\s*none/s);
    assert.match(layoutCss, /body\.menu-open\s+\.main-navigation[^{]*{[^}]*min-width:\s*240px/s);
    assert.match(layoutCss, /body\.menu-open\s+\.main-navigation[^{]*{[^}]*top:\s*0/s);
    assert.match(layoutCss, /body\.menu-open\s+\.main-navigation[^{]*{[^}]*bottom:\s*48px/s);
    assert.match(layoutCss, /body\.menu-open\s+\.main-navigation[^{]*{[^}]*border-radius:\s*0/s);
  });

  test('deve anular ocupacao em bloco do site-header no mobile para o botao hamburguer flutuar lateralmente ao primeiro texto (FEAT-003)', () => {
    const layoutCss = readCss('layout.css');
    assert.match(layoutCss, /\.site-header\s*{[^}]*height:\s*0/s);
    assert.match(layoutCss, /\.chapter-title-vertical\s*{[^}]*padding-right:\s*56px/s);
  });

  test('deve transferir foco para o destino e ocultar o skip-link ao acionar clique ou Enter (CA-03.1)', () => {
    let blurred = false;
    let targetFocused = false;

    const skip1 = doc.querySelectorAll('.skip-link')[0];
    skip1.blur = () => { blurred = true; };

    const targetEl = new MockElement('div', { id: 'lista-acordes' });
    targetEl.focus = () => { targetFocused = true; };
    doc.body.appendChild(targetEl);

    initSkipLinks(doc);
    skip1.dispatchEvent({ type: 'click' });

    assert.equal(blurred, true, 'O skip-link deve desfocar (blur) imediatamente após ser acionado');
    assert.equal(targetFocused, true, 'O elemento alvo de destino deve receber o foco');
  });

  test('deve manter o skip-link rigorosamente oculto fora de :focus-visible em base.css', () => {
    const css = readCss('base.css');
    assert.match(css, /\.skip-link:not\(:focus-visible\)\s*{[^}]*clip:\s*rect\(0,\s*0,\s*0,\s*0\)\s*!important/s);
    assert.match(css, /\.skip-link:not\(:focus-visible\)\s*{[^}]*top:\s*-9999px\s*!important/s);
  });

  test('deve manter o skip-link estritamente invisivel na interface visual mesmo sob :focus e :focus-visible', () => {
    const css = readCss('base.css');
    assert.match(css, /\.skip-link,\s*\.skip-link:focus,\s*\.skip-link:focus-visible\s*{[^}]*top:\s*-9999px\s*!important/s);
    assert.match(css, /\.skip-link,\s*\.skip-link:focus,\s*\.skip-link:focus-visible\s*{[^}]*clip:\s*rect\(0,\s*0,\s*0,\s*0\)\s*!important/s);
  });

  test('deve garantir Header + Sidebar somando 100vh e sticky no topo (ADR-008)', () => {
    const layoutCss = readCss('layout.css');
    assert.match(layoutCss, /\.site-header\s*{[^}]*height:\s*var\(--ds-header-height\)/s);
    assert.match(layoutCss, /\.site-header\s*{[^}]*position:\s*sticky/s);
    assert.match(layoutCss, /\.site-header\s*{[^}]*top:\s*0/s);

    assert.match(layoutCss, /\.chapter-sidebar\s*{[^}]*position:\s*sticky/s);
    assert.match(layoutCss, /\.chapter-sidebar\s*{[^}]*top:\s*var\(--ds-header-height\)/s);
    assert.match(layoutCss, /\.chapter-sidebar\s*{[^}]*height:\s*calc\(100vh\s*-\s*var\(--ds-header-height\)\)/s);
    assert.match(layoutCss, /\.chapter-sidebar\s*{[^}]*justify-content:\s*flex-end/s);
    assert.match(layoutCss, /\.chapter-sidebar\s*{[^}]*align-items:\s*flex-start/s);
    assert.match(layoutCss, /\.chapter-sidebar\s*{[^}]*padding-left:\s*var\(--ds-space-xl\)/s);
    assert.match(layoutCss, /\.chapter-sidebar\s*{[^}]*border-right:\s*none/s);
  });

  test('deve aplicar tipografia vertical em duas linhas (Title Case) com escala fluida em vh (ADR-008)', () => {
    const layoutCss = readCss('layout.css');
    assert.match(layoutCss, /\.chapter-title-vertical\s*{[^}]*writing-mode:\s*vertical-rl/s);
    assert.match(layoutCss, /\.chapter-title-vertical\s*{[^}]*transform:\s*rotate\(180deg\)/s);
    assert.match(layoutCss, /\.chapter-title-vertical\s*{[^}]*text-transform:\s*none/s);
    assert.match(layoutCss, /\.chapter-title-vertical\s*{[^}]*font-size:\s*clamp\(2rem,\s*5\.5vh,\s*3\.6rem\)/s);
    assert.match(layoutCss, /\.chapter-title-line\s*{[^}]*display:\s*block/s);
  });

  test('deve renderizar travessao vertical e legenda da triade em duas linhas (ADR-008)', () => {
    const layoutCss = readCss('layout.css');
    assert.match(layoutCss, /\.chapter-dash\s*{[^}]*display:\s*block/s);
    assert.match(layoutCss, /\.chapter-dash\s*{[^}]*width:\s*1\.5px/s);
    assert.match(layoutCss, /\.chapter-dash\s*{[^}]*height:\s*clamp\(32px,\s*6vh,\s*56px\)/s);
    assert.match(layoutCss, /\.chapter-dash\s*{[^}]*background-color:\s*var\(--ds-color-line\)/s);

    assert.match(layoutCss, /\.formula-label\s*{[^}]*font-size:\s*0\.95rem/s);
    assert.match(layoutCss, /\.formula-intervals\s*{[^}]*font-size:\s*1\.25rem/s);
  });

  test('deve desativar 100vh e layout vertical no mobile (<= 960px) para acessibilidade e baixa visao', () => {
    const layoutCss = readCss('layout.css');
    assert.match(layoutCss, /@media\s*\(\s*max-width:\s*960px\s*\)\s*{[\s\S]*\.chapter-sidebar\s*{[^}]*height:\s*auto/);
    assert.match(layoutCss, /@media\s*\(\s*max-width:\s*960px\s*\)\s*{[\s\S]*\.chapter-title-vertical\s*{[^}]*writing-mode:\s*horizontal-tb/);
  });

  test('deve estilizar o footer centralizado na coluna de conteudo com espacamento compacto (ADR-008)', () => {
    const layoutCss = readCss('layout.css');
    assert.match(layoutCss, /\.site-footer\s*{[^}]*width:\s*100%/s);
    assert.match(layoutCss, /\.site-footer\s*{[^}]*text-align:\s*center/s);
    assert.match(layoutCss, /\.site-footer\s*{[^}]*margin-top:\s*var\(--ds-space-xl\)/s);
    assert.match(layoutCss, /\.site-footer\s*{[^}]*font-size:\s*0\.9rem/s);
  });
});
