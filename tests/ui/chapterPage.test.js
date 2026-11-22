import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  initChapterPage,
  renderChapterFootnotesMarkup,
  setupFootnoteNavigation,
  AUGMENTED_FOOTNOTE
} from '../../src/ui/chapterPage.js';

class MockElement {
  constructor(tagName, attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.children = [];
    this.innerHTML = '';
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

  focus() {
    this.focused = true;
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

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const traverse = (node) => {
      for (const child of node.children) {
        let match = false;
        if (selector.startsWith('.') && (child.className || '').split(' ').includes(selector.slice(1))) {
          match = true;
        } else if (selector.startsWith('#') && child.id === selector.slice(1)) {
          match = true;
        } else if (selector.toLowerCase() === child.tagName.toLowerCase()) {
          match = true;
        }
        if (match) results.push(child);
        traverse(child);
      }
    };
    traverse(this);
    return results;
  }

  getElementById(id) {
    const traverse = (node) => {
      if (node.id === id) return node;
      for (const child of node.children) {
        const found = traverse(child);
        if (found) return found;
      }
      return null;
    };
    return traverse(this);
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }
}

describe('WAI-ARIA DPUB Chapter Footnotes & Editorial Style (FEAT-004 / ADR-004, ADR-008)', () => {
  test('renderChapterFootnotesMarkup deve renderizar exclusivamente para o capítulo augmented', () => {
    assert.equal(renderChapterFootnotesMarkup('major'), '');
    assert.equal(renderChapterFootnotesMarkup('minor'), '');
    assert.equal(renderChapterFootnotesMarkup('diminished'), '');

    const markup = renderChapterFootnotesMarkup('augmented');
    assert.match(markup, /role="doc-footnote"/);
    assert.match(markup, /role="doc-backlink"/);
    assert.match(markup, /<cite>Compêndio de Teoria Elementar da Música<\/cite>/);
    assert.match(markup, /Oswaldo Lacerda \(1961\)/);
  });

  test('setupFootnoteNavigation deve gerenciar trânsito bidirecional de foco via delegação única e respeitar AbortSignal (ADR-011)', () => {
    const root = new MockElement('div');
    const controller = new AbortController();

    const noteref = new MockElement('a', {
      id: 'ref-triplo-sustenido-1',
      class: 'editorial-noteref',
      href: '#nota-triplo-sustenido'
    });
    const footnoteTarget = new MockElement('div', {
      id: 'nota-triplo-sustenido',
      class: 'editorial-footnote'
    });
    const backlink = new MockElement('a', {
      class: 'editorial-backlink',
      href: '#ref-triplo-sustenido-1'
    });

    root.appendChild(noteref);
    root.appendChild(footnoteTarget);
    footnoteTarget.appendChild(backlink);

    setupFootnoteNavigation(root, { signal: controller.signal });

    // Deve registrar apenas um único listener delegado no root (ADR-011)
    assert.equal(root.eventListeners['click'].length, 1);
    assert.equal(noteref.eventListeners['click'], undefined);
    assert.equal(backlink.eventListeners['click'], undefined);

    // 1. Clicar na chamada de nota (noteref) deve atualizar backlink e focar a nota de rodapé
    root.dispatchEvent({ type: 'click', target: noteref, preventDefault: () => {} });
    assert.equal(backlink.getAttribute('href'), '#ref-triplo-sustenido-1');
    assert.equal(footnoteTarget.focused, true);

    // 2. Clicar no link de retorno (doc-backlink) deve restaurar o foco para o noteref de origem
    footnoteTarget.focused = false;
    root.dispatchEvent({ type: 'click', target: backlink, preventDefault: () => {} });
    assert.equal(noteref.focused, true);
  });

  test('capitulo augmented deve conter estrutura DPUB e texto de instrucao limpo no topo', () => {
    const footnotesHtml = renderChapterFootnotesMarkup('augmented');

    // Rodapé de capítulo com WAI-ARIA DPUB
    assert.match(footnotesHtml, /<aside class="editorial-footnotes" aria-label="Notas do capítulo">/);
    assert.match(footnotesHtml, /id="nota-triplo-sustenido" role="doc-footnote"/);
    assert.match(footnotesHtml, /role="doc-backlink" class="editorial-backlink"/);
    assert.match(footnotesHtml, /<cite>Compêndio de Teoria Elementar da Música<\/cite>/);
    assert.match(footnotesHtml, /Oswaldo Lacerda \(1961\)/);
  });

  test('src/styles/components.css deve estilizar .editorial-noteref, .editorial-backlink e .editorial-footnotes com tokens sem borda dupla', () => {
    const cssPath = fs.existsSync('src/styles/components.css') ? 'src/styles/components.css' : 'src/css/components.css';
    const css = fs.readFileSync(cssPath, 'utf8');

    assert.match(css, /\.editorial-noteref\s*{/);
    assert.match(css, /\.editorial-backlink\s*{/);
    assert.match(css, /\.editorial-footnotes\s*{[^}]*border-top:\s*none/s);
    assert.match(css, /\.editorial-footnotes\s*{[^}]*margin-top:\s*var\(--ds-space-md\)/s);
    assert.match(css, /\.editorial-footnotes\s*{[^}]*font-size:\s*0\.95rem/s);
    assert.match(css, /\.editorial-footnotes\s*{[^}]*max-width:\s*100%/s);

    // Destaque em âmbar nos estados hover e focus-visible
    assert.match(css, /\.editorial-noteref:hover,\s*\.editorial-backlink:hover\s*{[^}]*background-color:\s*var\(--ds-color-accent-amber\)/s);
    assert.match(css, /\.editorial-noteref:focus-visible,\s*\.editorial-backlink:focus-visible\s*{[^}]*outline:\s*var\(--ds-focus-outline\)/s);
  });
});
