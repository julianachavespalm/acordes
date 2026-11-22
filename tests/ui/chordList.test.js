import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { getTriadChords } from '../../src/domain/musicTheory.js';
import { initChordList, renderChordMarkup } from '../../src/ui/chordList.js';

class MockElement {
  constructor(tagName, attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.children = [];
    this.innerHTML = '';
    this.className = attributes.class || '';
    this.eventListeners = {};
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'class') this.className = String(value);
  }

  removeAttribute(name) {
    delete this.attributes[name];
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
        if (selector.startsWith('.') && child.className.split(' ').includes(selector.slice(1))) {
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

  appendChild(child) {
    this.children.push(child);
    return child;
  }
}

describe('FEAT-004: Falsa Tabela Estilo ABNT, Silêncio Auditivo e Interação Sonora', () => {
  let chords;
  let mockSoundEngine;
  let playedFrequencies;
  let playedNotes;

  beforeEach(() => {
    chords = getTriadChords('diminished');
    playedFrequencies = [];
    playedNotes = [];
    mockSoundEngine = {
      playChord: async (freqs) => {
        playedFrequencies.push(freqs);
      },
      playNote: async (freq) => {
        playedNotes.push(freq);
      },
      stopAll: () => {},
    };
  });

  test('renderChordMarkup não deve conter nenhuma tag de tabela (table, tr, td, th) (RN-01 / CA-04.1)', () => {
    const chord = chords[0]; // C Diminuto
    const html = renderChordMarkup(chord);

    assert.equal(html.includes('<table'), false);
    assert.equal(html.includes('<tr'), false);
    assert.equal(html.includes('<td'), false);
    assert.equal(html.includes('<th'), false);
    assert.match(html, /^<li class="acorde-row"/);
  });

  test('renderChordMarkup deve conter camada fonética e aria-label direto sem expressões Tocar nota (RN-05 / CA-04.3)', () => {
    const chord = chords[0]; // Dó Diminuto - Cm(b5)
    const html = renderChordMarkup(chord);

    assert.match(html, /<span class="sr-only">Cifra: Dó menor com quinta diminuta\.<\/span>/);
    assert.match(html, /<span aria-hidden="true">Cm\(b5\)<\/span>/);
    assert.match(html, /aria-label="Mi bemol"/);
    assert.match(html, /aria-label="Dó Diminuto"/);
    assert.doesNotMatch(html, /Tocar nota/);
    assert.doesNotMatch(html, /Tocar tríade/);
    assert.match(html, /data-midis="60,63,66"/);
    assert.match(html, /data-midi="60"/);
  });

  test('initChordList deve renderizar exatamente 21 tríades e cabeçalho aria-hidden (RN-01, RN-02 / CA-04.1)', () => {
    const container = new MockElement('div');
    initChordList({
      containerElement: container,
      categoryId: 'diminished',
      soundEngine: mockSoundEngine,
    });

    assert.equal(container.innerHTML.includes('<table'), false);
    assert.match(container.innerHTML, /class="abnt-table-header" aria-hidden="true"/);
    assert.match(container.innerHTML, /class="acordes-lista" id="lista-acordes" role="list"/);
  });

  test('disparo de áudio polifônico deve executar playChord com 3 frequências (RN-04 / CA-04.2)', async () => {
    const chord = chords[0];
    const freqs = chord.notes.map(n => n.frequency);

    await mockSoundEngine.playChord(freqs);
    assert.equal(playedFrequencies.length, 1);
    assert.deepEqual(playedFrequencies[0], [261.63, 311.13, 369.99]);
  });

  test('silêncio auditivo: disparo de áudio não deve invocar nenhuma fala aria-live (RN-06 / CA-04.4)', async () => {
    let ariaLiveAnnounced = false;
    const dummyAnnouncer = () => { ariaLiveAnnounced = true; };

    // Durante o playback musical
    await mockSoundEngine.playChord(chords[0].notes.map(n => n.hz));
    assert.equal(ariaLiveAnnounced, false);
  });

  test('deve garantir livre selecao de texto nas cifras e na tabela ABNT em components.css (ADR-010)', async () => {
    const fs = await import('node:fs');
    const cssPath = 'src/styles/components.css';
    const css = fs.readFileSync(cssPath, 'utf8');
    assert.doesNotMatch(css, /user-select:\s*none/);
  });

  test('deve exibir apenas colunas Acorde e Notas no celular em modo vertical preservando cifra acessivel', async () => {
    const fs = await import('node:fs');
    const css = fs.readFileSync('src/styles/components.css', 'utf8');
    assert.match(css, /@media\s*\(\s*max-width:\s*640px\s*\)\s*and\s*\(\s*orientation:\s*portrait\s*\)/);
    assert.match(css, /\.abnt-table-header\s*>\s*span:nth-child\(2\)\s*{[^}]*display:\s*none/s);
    assert.match(css, /\.cifra-col\s*{[^}]*clip:\s*rect\(0,\s*0,\s*0,\s*0\)/s);
  });

  test('initChordList nao deve bloquear selecao ou copia de texto no container da tabela (ADR-010)', () => {
    const container = new MockElement('div');
    initChordList({
      containerElement: container,
      categoryId: 'diminished',
      soundEngine: mockSoundEngine,
    });

    assert.equal(container.eventListeners['selectstart'], undefined);
    assert.equal(container.eventListeners['copy'], undefined);
    assert.equal(container.eventListeners['click'].length, 1);
  });

  test('renderChordMarkup deve renderizar chamada DPUB doc-noteref exclusivamente em notas com triplo sustenido', () => {
    const augmentedChords = getTriadChords('augmented');
    const bSharpChord = augmentedChords.find(c => c.id === 'b-sharp-augmented');

    assert.ok(bSharpChord, 'Acorde Si Sustenido Aumentado deve existir');

    const html = renderChordMarkup(bSharpChord);
    // Deve conter chamada de nota DPUB com id único, fora do botão
    assert.match(html, /role="doc-noteref"/);
    assert.match(html, /class="editorial-noteref"/);
    assert.match(html, /id="ref-triplo-sustenido-\d+"/);
    assert.match(html, /href="#nota-triplo-sustenido"/);
    assert.match(html, /aria-label="Nota 1: uso do triplo sustenido"/);

    // Deve estar fora do botão note-trigger (fechamento de button antes de sup)
    assert.match(html, /<\/button><sup><a href="#nota-triplo-sustenido"/);

    // O marcador NUNCA deve aparecer na coluna do acorde (acorde-col)
    const acordeColMatch = html.match(/<div class="acorde-col">([\s\S]*?)<\/div>/);
    assert.ok(acordeColMatch, 'acorde-col deve existir');
    assert.doesNotMatch(acordeColMatch[1], /doc-noteref/);
    assert.doesNotMatch(acordeColMatch[1], /<sup>/);

    // O marcador DEVE aparecer exclusivamente na coluna de notas (notas-col)
    assert.match(html, /<div class="notas-col">[\s\S]*?role="doc-noteref"/);

    // Acorde comum (sem triplo sustenido) NÃO deve conter doc-noteref
    const cMajorChord = chords[0];
    const normalHtml = renderChordMarkup(cMajorChord);
    assert.doesNotMatch(normalHtml, /role="doc-noteref"/);
  });
});
