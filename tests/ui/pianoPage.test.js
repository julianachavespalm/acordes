import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PIANO_KEYS, renderPianoMarkup, renderPianoPage } from '../../src/ui/pianoPage.js';

class MockElement {
  constructor(tagName, attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.children = [];
    this.innerHTML = '';
    this.textContent = '';
    this.className = attributes.class || '';
    this.id = attributes.id || '';
    this.disabled = 'disabled' in attributes;
    this.listeners = [];
  }

  getAttribute(name) {
    if (name === 'id') return this.id || this.attributes.id || null;
    return this.attributes[name] ?? null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'id') this.id = String(value);
    if (name === 'class') this.className = String(value);
    if (name === 'disabled') this.disabled = true;
  }

  removeAttribute(name) {
    delete this.attributes[name];
    if (name === 'disabled') this.disabled = false;
  }

  classList = {
    add: (cls) => {
      const set = new Set(this.className.split(' ').filter(Boolean));
      set.add(cls);
      this.className = Array.from(set).join(' ');
      this.attributes.class = this.className;
    },
    remove: (cls) => {
      const set = new Set(this.className.split(' ').filter(Boolean));
      set.delete(cls);
      this.className = Array.from(set).join(' ');
      this.attributes.class = this.className;
    },
    contains: (cls) => this.className.split(' ').includes(cls)
  };

  addEventListener(type, handler, options) {
    const entry = { type, handler };
    this.listeners.push(entry);
    if (options?.signal) {
      options.signal.addEventListener('abort', () => {
        const idx = this.listeners.indexOf(entry);
        if (idx >= 0) this.listeners.splice(idx, 1);
      });
    }
  }

  dispatchEvent(event) {
    for (const entry of [...this.listeners]) {
      if (entry.type === event.type) {
        entry.handler(event);
      }
    }
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  querySelectorAll(selector) {
    const results = [];
    const walk = (node) => {
      for (const child of node.children) {
        if (selector.startsWith('.') && child.className.split(' ').includes(selector.slice(1))) {
          results.push(child);
        } else if (selector.startsWith('#') && child.id === selector.slice(1)) {
          results.push(child);
        }
        walk(child);
      }
    };
    walk(this);
    return results;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
}

function buildMountedPiano(soundEngine) {
  const mount = new MockElement('main', { id: 'app' });
  const win = new MockElement('window');

  // Constrói a árvore DOM simplificada quando innerHTML é atribuído
  const origDescriptor = Object.getOwnPropertyDescriptor(mount, 'innerHTML');
  let rawHtml = '';
  Object.defineProperty(mount, 'innerHTML', {
    get: () => rawHtml,
    set: (val) => {
      rawHtml = val;
      mount.children = [];
      const pinBtn = new MockElement('button', { id: 'piano-pin-toggle', class: 'piano-control-btn', 'aria-pressed': 'false' });
      const playBtn = new MockElement('button', { id: 'piano-play-pinned', class: 'piano-control-btn', disabled: '' });
      const clearBtn = new MockElement('button', { id: 'piano-clear-pinned', class: 'piano-control-btn', disabled: '' });
      const readout = new MockElement('div', { id: 'piano-readout', class: 'piano-readout' });
      const keyboard = new MockElement('div', { id: 'piano-keyboard', class: 'piano-keyboard' });

      for (const key of PIANO_KEYS) {
        const cls = `piano-key ${key.isSharp ? 'piano-key--black' : 'piano-key--white'}`;
        keyboard.appendChild(new MockElement('button', {
          class: cls,
          'data-midi': String(key.midi),
          'data-octave': String(key.octave),
          'aria-label': key.phonetic
        }));
      }

      mount.appendChild(pinBtn);
      mount.appendChild(playBtn);
      mount.appendChild(clearBtn);
      mount.appendChild(readout);
      mount.appendChild(keyboard);
    }
  });

  const teardown = renderPianoPage(soundEngine, mount, { windowTarget: win });
  return { mount, win, teardown };
}

describe('FEAT-010: Piano Virtual Interativo, Multitouch e Reconhecimento de Tríades', () => {
  test('renderPianoMarkup deve gerar 25 teclas (2 oitavas) com aviso de orientacao e controles acessiveis', () => {
    const html = renderPianoMarkup();
    assert.equal(PIANO_KEYS.length, 25);
    assert.match(html, /id="titulo-piano"/);
    assert.match(html, /piano-orientation-hint/);
    assert.match(html, /id="piano-pin-toggle" aria-pressed="false"/);
    assert.match(html, /id="piano-play-pinned" disabled/);
    assert.match(html, /id="piano-clear-pinned" disabled/);
    assert.match(html, /data-midi="60" data-octave="1"/);
    assert.match(html, /data-midi="84" data-octave="2"/);
  });

  test('deve suportar multitouch simultaneo por pointerId e reconhecer triade (CA-10.3)', () => {
    const triggered = [];
    const mockSound = {
      triggerNote: (midi) => triggered.push(midi),
      playChord: async () => {},
      stopAll: () => {},
      preload: () => {}
    };

    const { mount } = buildMountedPiano(mockSound);
    const keyboard = mount.querySelector('#piano-keyboard');
    const readout = mount.querySelector('#piano-readout');
    const keys = mount.querySelectorAll('.piano-key');

    const cKey = keys.find((k) => k.getAttribute('data-midi') === '60');
    const eKey = keys.find((k) => k.getAttribute('data-midi') === '64');
    const gKey = keys.find((k) => k.getAttribute('data-midi') === '67');

    keyboard.dispatchEvent({ type: 'pointerdown', pointerId: 1, target: cKey, preventDefault: () => {} });
    keyboard.dispatchEvent({ type: 'pointerdown', pointerId: 2, target: eKey, preventDefault: () => {} });
    keyboard.dispatchEvent({ type: 'pointerdown', pointerId: 3, target: gKey, preventDefault: () => {} });

    assert.deepEqual(triggered, [60, 64, 67]);
    assert.equal(cKey.classList.contains('is-active'), true);
    assert.equal(eKey.classList.contains('is-active'), true);
    assert.equal(gKey.classList.contains('is-active'), true);
    assert.match(readout.textContent, /Dó Maior \(C\)/);

    // Solta 1 dedo — os outros dois permanecem ativos
    keyboard.dispatchEvent({ type: 'pointerup', pointerId: 2 });
    assert.equal(eKey.classList.contains('is-active'), false);
    assert.equal(cKey.classList.contains('is-active'), true);
    assert.equal(gKey.classList.contains('is-active'), true);
  });

  test('deve fixar notas, tocar acorde conjunto e limpar selecao (CA-10.4)', async () => {
    const chordsPlayed = [];
    const triggered = [];
    let stopped = 0;

    const mockSound = {
      triggerNote: (midi) => triggered.push(midi),
      playChord: async (midis) => chordsPlayed.push(midis),
      stopAll: () => { stopped += 1; },
      preload: () => {}
    };

    const { mount } = buildMountedPiano(mockSound);
    const pinBtn = mount.querySelector('#piano-pin-toggle');
    const playBtn = mount.querySelector('#piano-play-pinned');
    const clearBtn = mount.querySelector('#piano-clear-pinned');
    const keyboard = mount.querySelector('#piano-keyboard');
    const readout = mount.querySelector('#piano-readout');
    const keys = mount.querySelectorAll('.piano-key');

    const cKey = keys.find((k) => k.getAttribute('data-midi') === '60');
    const ebKey = keys.find((k) => k.getAttribute('data-midi') === '63');
    const gKey = keys.find((k) => k.getAttribute('data-midi') === '67');

    // Liga Fixar notas
    pinBtn.dispatchEvent({ type: 'click' });
    assert.equal(pinBtn.getAttribute('aria-pressed'), 'true');

    // Marca 3 notas (Dó Menor)
    keyboard.dispatchEvent({ type: 'pointerdown', pointerId: 1, target: cKey, preventDefault: () => {} });
    keyboard.dispatchEvent({ type: 'pointerdown', pointerId: 1, target: ebKey, preventDefault: () => {} });
    keyboard.dispatchEvent({ type: 'pointerdown', pointerId: 1, target: gKey, preventDefault: () => {} });

    assert.equal(playBtn.disabled, false);
    assert.equal(clearBtn.disabled, false);
    assert.match(readout.textContent, /Dó Menor/);

    // Toca juntas
    await playBtn.dispatchEvent({ type: 'click' });
    assert.deepEqual(chordsPlayed, [[60, 63, 67]]);

    // Limpa
    clearBtn.dispatchEvent({ type: 'click' });
    assert.equal(playBtn.disabled, true);
    assert.equal(clearBtn.disabled, true);
    assert.equal(stopped, 1);
  });

  test('deve mapear teclado fisico e cancelar listeners no teardown (CA-10.5)', () => {
    const triggered = [];
    const mockSound = {
      triggerNote: (midi) => triggered.push(midi),
      playChord: async () => {},
      stopAll: () => {},
      preload: () => {}
    };

    const { win, teardown } = buildMountedPiano(mockSound);

    win.dispatchEvent({ type: 'keydown', key: 'a', repeat: false });
    win.dispatchEvent({ type: 'keydown', key: 'a', repeat: true }); // deve ignorar repeat
    win.dispatchEvent({ type: 'keydown', key: 'd', repeat: false });
    assert.deepEqual(triggered, [60, 64]);

    // Executa teardown da rota
    teardown();
    win.dispatchEvent({ type: 'keydown', key: 'g', repeat: false });
    assert.deepEqual(triggered, [60, 64], 'Após teardown, teclado físico não deve mais disparar áudio');
  });

  test('deve estilizar piano com design classico, tokens, touch-action e adaptacao de orientacao (CA-10.6)', () => {
    const componentsCss = fs.readFileSync('src/styles/components.css', 'utf8');
    const layoutCss = fs.readFileSync('src/styles/layout.css', 'utf8');
    const html = renderPianoMarkup();

    assert.match(html, /class="piano-key-shortcut"/);
    assert.match(componentsCss, /\.piano-keyboard\s*{[^}]*touch-action:\s*none/s);
    assert.match(componentsCss, /\.piano-key--white\s*{[^}]*background:\s*var\(--ds-piano-white-bg\)/s);
    assert.match(componentsCss, /\.piano-key--black\s*{[^}]*background:\s*var\(--ds-piano-black-bg\)/s);
    assert.match(componentsCss, /\.piano-key\[aria-pressed="true"\]\s*{[^}]*background:\s*var\(--ds-color-accent-amber\)/s);
    assert.match(layoutCss, /@media\s*\(\s*max-width:\s*649px\s*\),\s*\(\s*max-width:\s*960px\s*\)\s*and\s*\(\s*orientation:\s*portrait\s*\)/);
    assert.match(layoutCss, /@media\s*\(\s*min-width:\s*650px\s*\)\s*and\s*\(\s*max-width:\s*960px\s*\)\s*and\s*\(\s*orientation:\s*landscape\s*\)/);
  });
});
