/**
 * @fileoverview Falsa Tabela ABNT e Controlador da Lista de Acordes (FEAT-004 / ADR-002, ADR-004, ADR-010, ADR-011)
 * Renderiza lista semântica acessível sem tags <table>, com gatilhos inline de áudio
 * em texto limpo, camada fonética .sr-only, livre seleção de texto e delegação única de eventos.
 */

import { getTriadChords } from '../domain/musicTheory.js';

/**
 * Gera a marcação HTML acessível para uma linha de acorde.
 * Anexa WAI-ARIA DPUB doc-noteref orientado a dados quando a nota possui metadado footnote no domínio.
 * @param {object} chord
 * @param {object} [options]
 * @param {{ value: number }} [options.noterefCounter]
 * @returns {string}
 */
export function renderChordMarkup(chord, { noterefCounter } = {}) {
  if (!chord || !chord.notes) return '';

  const counter = noterefCounter || { value: 0 };
  const midis = chord.notes.map((n) => n.midi).join(',');
  const frequencies = chord.notes.map((n) => n.frequency ?? n.hz).join(',');
  const phoneticSymbol = chord.symbolPhonetic || '';

  const notesHtml = chord.notes.map((n, index) => {
    const isLast = index === chord.notes.length - 1;
    const separator = isLast ? '' : '<span class="note-separator" aria-hidden="true"> · </span>';
    const freq = n.frequency ?? n.hz;

    let noterefMarkup = '';
    if (n.footnote) {
      counter.value += 1;
      const fn = n.footnote;
      noterefMarkup = `<sup><a href="#${fn.id}" id="ref-triplo-sustenido-${counter.value}" role="doc-noteref" class="editorial-noteref" aria-label="${fn.label}">${fn.number}</a></sup>`;
    }

    return `
      <button type="button" class="note-trigger" data-midi="${n.midi}" data-hz="${freq}" data-symbol="${chord.symbol}" aria-label="${n.phonetic}">
        <span aria-hidden="true">${n.pitch}</span>
      </button>${noterefMarkup}${separator}
    `.trim();
  }).join('');

  return `
    <li class="acorde-row">
      <div class="acorde-col">
        <button type="button" class="chord-trigger" data-chord-id="${chord.id}" data-midis="${midis}" data-frequencies="${frequencies}" data-symbol="${chord.symbol}" aria-label="${chord.name}">
          <span>${chord.name}</span>
        </button>
      </div>
      <div class="cifra-col">
        <span aria-hidden="true">${chord.symbol}</span>
        <span class="sr-only">${phoneticSymbol}</span>
      </div>
      <div class="notas-col">
        ${notesHtml}
      </div>
    </li>
  `.trim();
}

/**
 * Inicializa e monta a Falsa Tabela ABNT dentro de um elemento container.
 * Utiliza delegação única de eventos com suporte a AbortSignal (ADR-011).
 * @param {object} params
 * @param {HTMLElement} params.containerElement
 * @param {string} params.categoryId
 * @param {object} params.soundEngine
 * @param {AbortSignal} [params.signal]
 */
export function initChordList({ containerElement, categoryId, soundEngine, signal }) {
  if (!containerElement) return;

  const noterefCounter = { value: 0 };
  const chords = getTriadChords(categoryId);
  const rowsMarkup = chords.map((chord) => renderChordMarkup(chord, { noterefCounter })).join('\n');

  containerElement.innerHTML = `
    <div class="abnt-table" id="tabela-acordes">
      <div class="abnt-table-header" aria-hidden="true">
        <span>Acorde</span>
        <span>Cifra</span>
        <span>Notas</span>
      </div>
      <ul class="acordes-lista" id="lista-acordes" role="list" tabindex="-1">
        ${rowsMarkup}
      </ul>
    </div>
  `.trim();

  if (soundEngine && typeof soundEngine.preload === 'function') {
    const allMidis = chords.flatMap((c) => c.notes.map((n) => n.midi));
    soundEngine.preload(allMidis, { signal });
  }

  if (soundEngine && typeof containerElement.addEventListener === 'function') {
    const listenerOptions = signal ? { signal } : undefined;
    let activeTimer = null;

    function getFooterCifraEl() {
      return typeof document !== 'undefined' ? document.getElementById('footer-cifra') : null;
    }

    function showFooterCifra(symbol) {
      const el = getFooterCifraEl();
      if (!el || !symbol) return;
      el.textContent = `Cifra: ${symbol}`;
      el.classList?.add('is-visible');
    }

    function clearFooterCifra() {
      const el = getFooterCifraEl();
      if (!el) return;
      el.classList?.remove('is-visible');
      el.textContent = '';
    }

    if (signal) {
      signal.addEventListener('abort', () => {
        if (activeTimer) clearTimeout(activeTimer);
        clearFooterCifra();
      });
    }

    containerElement.addEventListener('click', async (e) => {
      const chordBtn = e.target?.closest?.('.chord-trigger');
      if (chordBtn) {
        e.preventDefault?.();
        if (activeTimer) clearTimeout(activeTimer);
        const rawMidis = chordBtn.getAttribute('data-midis') || '';
        const midis = rawMidis.split(',').filter(Boolean).map(Number);
        const symbol = chordBtn.getAttribute('data-symbol') || '';
        chordBtn.classList?.add('playing');
        showFooterCifra(symbol);
        try {
          if (midis.length > 0) {
            await soundEngine.playChord(midis);
          }
        } finally {
          activeTimer = setTimeout(() => {
            chordBtn.classList?.remove('playing');
            clearFooterCifra();
          }, 1200);
        }
        return;
      }

      const noteBtn = e.target?.closest?.('.note-trigger');
      if (noteBtn) {
        e.preventDefault?.();
        if (activeTimer) clearTimeout(activeTimer);
        const rawMidi = noteBtn.getAttribute('data-midi');
        const midi = rawMidi ? Number(rawMidi) : null;
        const symbol = noteBtn.getAttribute('data-symbol') || '';
        noteBtn.classList?.add('playing');
        showFooterCifra(symbol);
        try {
          if (midi !== null && Number.isFinite(midi)) {
            await soundEngine.playNote(midi);
          }
        } finally {
          activeTimer = setTimeout(() => {
            noteBtn.classList?.remove('playing');
            clearFooterCifra();
          }, 1000);
        }
      }
    }, listenerOptions);
  }
}
