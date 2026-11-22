/**
 * @fileoverview Aba Piano Virtual Interativo (FEAT-010 / ADR-004, ADR-008, ADR-011, ADR-012)
 * Piano auto-proporcional (2 oitavas -> 1ª oitava -> 7ª maior) com amostras .mp3 reais,
 * multitouch via Pointer Events, modo acessível Fixar notas, popover Como usar em tela inteira,
 * atalhos de teclado físico no desktop e reconhecimento de tríades no domínio.
 */

import { identifyTriadFromMidis } from '../domain/musicTheory.js';

export const PIANO_KEYS = Object.freeze([
  // 7ª maior (MIDI 60 a 71 — 7 brancas + 5 pretas = 12 teclas)
  Object.freeze({ midi: 60, pitch: 'Dó', keyLabel: 'Dó', phonetic: 'Dó', isSharp: false, octave: 1, tier: 'major-seventh', shortcut: 'a' }),
  Object.freeze({ midi: 61, pitch: 'Dó♯', keyLabel: 'Dó♯ Ré♭', phonetic: 'Dó sustenido ou Ré bemol', isSharp: true, octave: 1, tier: 'major-seventh', shortcut: 'w' }),
  Object.freeze({ midi: 62, pitch: 'Ré', keyLabel: 'Ré', phonetic: 'Ré', isSharp: false, octave: 1, tier: 'major-seventh', shortcut: 's' }),
  Object.freeze({ midi: 63, pitch: 'Ré♯', keyLabel: 'Ré♯ Mi♭', phonetic: 'Ré sustenido ou Mi bemol', isSharp: true, octave: 1, tier: 'major-seventh', shortcut: 'e' }),
  Object.freeze({ midi: 64, pitch: 'Mi', keyLabel: 'Mi', phonetic: 'Mi', isSharp: false, octave: 1, tier: 'major-seventh', shortcut: 'd' }),
  Object.freeze({ midi: 65, pitch: 'Fá', keyLabel: 'Fá', phonetic: 'Fá', isSharp: false, octave: 1, tier: 'major-seventh', shortcut: 'f' }),
  Object.freeze({ midi: 66, pitch: 'Fá♯', keyLabel: 'Fá♯ Sol♭', phonetic: 'Fá sustenido ou Sol bemol', isSharp: true, octave: 1, tier: 'major-seventh', shortcut: 't' }),
  Object.freeze({ midi: 67, pitch: 'Sol', keyLabel: 'Sol', phonetic: 'Sol', isSharp: false, octave: 1, tier: 'major-seventh', shortcut: 'g' }),
  Object.freeze({ midi: 68, pitch: 'Sol♯', keyLabel: 'Sol♯ Lá♭', phonetic: 'Sol sustenido ou Lá bemol', isSharp: true, octave: 1, tier: 'major-seventh', shortcut: 'y' }),
  Object.freeze({ midi: 69, pitch: 'Lá', keyLabel: 'Lá', phonetic: 'Lá', isSharp: false, octave: 1, tier: 'major-seventh', shortcut: 'h' }),
  Object.freeze({ midi: 70, pitch: 'Lá♯', keyLabel: 'Lá♯ Si♭', phonetic: 'Lá sustenido ou Si bemol', isSharp: true, octave: 1, tier: 'major-seventh', shortcut: 'u' }),
  Object.freeze({ midi: 71, pitch: 'Si', keyLabel: 'Si', phonetic: 'Si', isSharp: false, octave: 1, tier: 'major-seventh', shortcut: 'j' }),

  // Completa a 1ª oitava (MIDI 72 — 8 brancas + 5 pretas = 13 teclas)
  Object.freeze({ midi: 72, pitch: 'Dó', keyLabel: 'Dó', phonetic: 'Dó agudo', isSharp: false, octave: 1, tier: 'one-octave', shortcut: 'k' }),

  // 2ª Oitava (MIDI 73 a 84 — 15 brancas + 10 pretas = 25 teclas)
  Object.freeze({ midi: 73, pitch: 'Dó♯', keyLabel: 'Dó♯ Ré♭', phonetic: 'Dó sustenido ou Ré bemol agudo', isSharp: true, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 74, pitch: 'Ré', keyLabel: 'Ré', phonetic: 'Ré agudo', isSharp: false, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 75, pitch: 'Ré♯', keyLabel: 'Ré♯ Mi♭', phonetic: 'Ré sustenido ou Mi bemol agudo', isSharp: true, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 76, pitch: 'Mi', keyLabel: 'Mi', phonetic: 'Mi agudo', isSharp: false, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 77, pitch: 'Fá', keyLabel: 'Fá', phonetic: 'Fá agudo', isSharp: false, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 78, pitch: 'Fá♯', keyLabel: 'Fá♯ Sol♭', phonetic: 'Fá sustenido ou Sol bemol agudo', isSharp: true, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 79, pitch: 'Sol', keyLabel: 'Sol', phonetic: 'Sol agudo', isSharp: false, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 80, pitch: 'Sol♯', keyLabel: 'Sol♯ Lá♭', phonetic: 'Sol sustenido ou Lá bemol agudo', isSharp: true, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 81, pitch: 'Lá', keyLabel: 'Lá', phonetic: 'Lá agudo', isSharp: false, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 82, pitch: 'Lá♯', keyLabel: 'Lá♯ Si♭', phonetic: 'Lá sustenido ou Si bemol agudo', isSharp: true, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 83, pitch: 'Si', keyLabel: 'Si', phonetic: 'Si agudo', isSharp: false, octave: 2, tier: 'two-octaves', shortcut: '' }),
  Object.freeze({ midi: 84, pitch: 'Dó', keyLabel: 'Dó', phonetic: 'Dó superagudo', isSharp: false, octave: 2, tier: 'two-octaves', shortcut: '' })
]);

const KEY_BY_MIDI = new Map(PIANO_KEYS.map((k) => [k.midi, k]));
const MIDI_BY_SHORTCUT = new Map(
  PIANO_KEYS.filter((k) => k.shortcut).map((k) => [k.shortcut.toLowerCase(), k.midi])
);

/**
 * Calcula o modo proporcional de extensão do teclado (2 oitavas -> 1ª oitava -> 7ª maior)
 * e a altura exata proporcional das teclas a partir das dimensões disponíveis.
 * @param {number} containerWidth
 * @param {number} availableHeight
 * @returns {{ mode: 'two-octaves'|'one-octave'|'major-seventh', height: number }}
 */
export function computePianoScale(containerWidth, availableHeight) {
  const safeWidth = Math.max(240, Number(containerWidth) || 0);
  const safeHeight = Math.max(170, Math.min(Number(availableHeight) || 300, 460));

  const MIN_KEY_WIDTH_2_OCT = 46;
  const MIN_KEY_WIDTH_1_OCT = 48;
  const TARGET_RATIO = 5.2;

  let mode = 'two-octaves';
  let whiteCount = 15;

  if (safeWidth / 15 >= MIN_KEY_WIDTH_2_OCT && (safeHeight / (safeWidth / 15)) >= 3.2) {
    mode = 'two-octaves';
    whiteCount = 15;
  } else if (safeWidth / 8 >= MIN_KEY_WIDTH_1_OCT && (safeHeight / (safeWidth / 8)) >= 3.5) {
    mode = 'one-octave';
    whiteCount = 8;
  } else {
    mode = 'major-seventh';
    whiteCount = 7;
  }

  const whiteWidth = safeWidth / whiteCount;
  const height = Math.round(Math.min(safeHeight, Math.max(170, whiteWidth * TARGET_RATIO)));
  return { mode, height };
}

export function renderPianoMarkup() {
  const keysHtml = PIANO_KEYS.map((key) => {
    const typeClass = key.isSharp ? 'piano-key--black' : 'piano-key--white';
    const shortcutHtml = key.shortcut
      ? `<span class="piano-key-shortcut" aria-hidden="true">${key.shortcut.toUpperCase()}</span>`
      : '';

    return `
      <button type="button" class="piano-key ${typeClass}" data-midi="${key.midi}" data-octave="${key.octave}" data-tier="${key.tier}" aria-label="${key.phonetic}">
        <span class="piano-key-content" aria-hidden="true">
          ${shortcutHtml}
          <span class="piano-key-label">${key.keyLabel}</span>
        </span>
      </button>
    `.trim();
  }).join('\n          ');

  return `
    <div class="piano-layout" id="conteudo-principal" tabindex="-1">
      <h1 class="sr-only" id="titulo-piano" tabindex="-1">Piano Virtual</h1>

      <p class="piano-orientation-hint" role="note">
        <span class="material-symbols-outlined" aria-hidden="true">screen_rotation</span>
        <span>Para tocar com duas oitavas e multitouch, gire o celular na horizontal.</span>
      </p>

      <div class="piano-toolbar" role="region" aria-label="Controles do piano">
        <div class="piano-controls-grid">
          <button type="button" class="piano-control-btn btn-area-pin" id="piano-pin-toggle" aria-pressed="false">
            <svg class="piano-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor" aria-hidden="true"><path d="M9.18,19.83Q8,18.65 8,17t1.18-2.83T12,13q0.58,0 1.06,0.14T14,13.55V3h6V7H16V17q0,1.65-1.17,2.82T12,21T9.18,19.83ZM7,11V8H4V6H7V3H9V6h3V8H9v3H7Z"/></svg>
            <span>Fixar notas</span>
          </button>

          <button type="button" class="piano-control-btn btn-area-clear" id="piano-clear-pinned" disabled>
            <span class="material-symbols-outlined" aria-hidden="true">ink_eraser</span>
            <span>Limpar</span>
          </button>

          <button type="button" class="piano-control-btn btn-area-play" id="piano-play-pinned" disabled>
            <span class="material-symbols-outlined" aria-hidden="true">play_arrow</span>
            <span>Tocar juntas</span>
          </button>

          <button type="button" class="piano-control-btn btn-area-help" id="piano-help-btn" aria-expanded="false" aria-controls="piano-help-popover">
            <span class="material-symbols-outlined" aria-hidden="true">help</span>
            <span>Como usar</span>
          </button>
        </div>
      </div>

      <div class="piano-help-popover" id="piano-help-popover" role="dialog" aria-label="Instruções de uso do piano virtual" hidden>
        <div class="piano-help-popover-header">
          <h2>Como usar o piano</h2>
          <button type="button" class="piano-help-close-btn" id="piano-help-close" aria-label="Fechar instruções">
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        <ul class="piano-help-list">
          <li>
            <strong>Toque livre</strong>
            <span>Clique nas teclas, use A–K e W–U no teclado físico ou toque várias teclas juntas no celular deitado.</span>
          </li>
          <li>
            <strong>Fixar notas</strong>
            <span>Ative para marcar as teclas de um acorde, pressione Tocar juntas para ouvir e Limpar para recomeçar.</span>
          </li>
          <li>
            <strong>Reconhecimento</strong>
            <span>Ao formar 3 notas de uma tríade do guia, o nome e a cifra aparecem abaixo do piano.</span>
          </li>
        </ul>
      </div>

      <div class="piano-stage">
        <div class="piano-keyboard" id="piano-keyboard" role="group" aria-label="Teclado do piano virtual">
          ${keysHtml}
        </div>
      </div>

      <div class="piano-readout" id="piano-readout" aria-live="polite" aria-atomic="true">Toque nas teclas para ouvir</div>
    </div>
  `.trim();
}

/**
 * Renderiza a aba Piano Virtual e retorna a função teardown (ADR-011).
 * @param {object|null} soundEngine
 * @param {HTMLElement} mountElement
 * @param {object} [options]
 * @param {EventTarget|null} [options.windowTarget]
 * @returns {Function}
 */
export function renderPianoPage(soundEngine, mountElement, options = {}) {
  if (!mountElement) return () => {};

  const windowTarget = options.windowTarget !== undefined
    ? options.windowTarget
    : (typeof window !== 'undefined' ? window : null);

  mountElement.innerHTML = renderPianoMarkup();

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const signal = controller?.signal;
  const listenerOptions = signal ? { signal } : undefined;

  if (soundEngine && typeof soundEngine.preload === 'function') {
    soundEngine.preload(PIANO_KEYS.map((k) => k.midi), { signal });
  }

  const keyboardEl = mountElement.querySelector?.('#piano-keyboard');
  const pinToggleBtn = mountElement.querySelector?.('#piano-pin-toggle');
  const playPinnedBtn = mountElement.querySelector?.('#piano-play-pinned');
  const clearPinnedBtn = mountElement.querySelector?.('#piano-clear-pinned');
  const helpBtn = mountElement.querySelector?.('#piano-help-btn');
  const helpPopover = mountElement.querySelector?.('#piano-help-popover');
  const helpCloseBtn = mountElement.querySelector?.('#piano-help-close');
  const readoutEl = mountElement.querySelector?.('#piano-readout');

  const keyButtons = new Map();
  if (mountElement.querySelectorAll) {
    for (const btn of mountElement.querySelectorAll('.piano-key')) {
      const midi = Number(btn.getAttribute('data-midi'));
      if (Number.isFinite(midi)) {
        keyButtons.set(midi, btn);
      }
    }
  }

  let isPinMode = false;
  const pinnedNotes = new Set();
  const activePointers = new Map();
  const activePhysicalKeys = new Set();
  let lastRecognizedChordText = '';

  function syncKeyboardScale() {
    if (!keyboardEl || !windowTarget) return;
    const containerWidth = keyboardEl.clientWidth || windowTarget.innerWidth || 0;
    const rectTop = typeof keyboardEl.getBoundingClientRect === 'function'
      ? keyboardEl.getBoundingClientRect().top
      : 120;
    const spaceBelow = (windowTarget.innerHeight || 720) - rectTop - 108;
    const { mode, height } = computePianoScale(containerWidth, spaceBelow);

    keyboardEl.setAttribute?.('data-piano-mode', mode);
    if (keyboardEl.style && typeof keyboardEl.style.setProperty === 'function') {
      keyboardEl.style.setProperty('--piano-height', `${height}px`);
    }
  }

  function setHelpOpen(isOpen) {
    if (!helpBtn || !helpPopover) return;
    helpBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    helpPopover.hidden = !isOpen;
    if (isOpen) {
      helpPopover.removeAttribute?.('hidden');
    } else {
      helpPopover.setAttribute?.('hidden', '');
    }
  }

  function getActiveMidis() {
    if (isPinMode) {
      return Array.from(pinnedNotes).sort((a, b) => a - b);
    }
    const combined = new Set([...activePointers.values(), ...activePhysicalKeys]);
    return Array.from(combined).sort((a, b) => a - b);
  }

  function syncVisualState() {
    const activeFree = new Set([...activePointers.values(), ...activePhysicalKeys]);

    for (const [midi, btn] of keyButtons.entries()) {
      const isPressed = isPinMode ? pinnedNotes.has(midi) : activeFree.has(midi);
      if (isPressed) {
        btn.classList?.add('is-active');
      } else {
        btn.classList?.remove('is-active');
      }

      if (isPinMode) {
        btn.setAttribute('aria-pressed', pinnedNotes.has(midi) ? 'true' : 'false');
      } else {
        btn.removeAttribute?.('aria-pressed');
      }
    }

    if (pinToggleBtn) {
      pinToggleBtn.setAttribute('aria-pressed', isPinMode ? 'true' : 'false');
      if (isPinMode) {
        pinToggleBtn.classList?.add('is-active');
      } else {
        pinToggleBtn.classList?.remove('is-active');
      }
    }

    if (playPinnedBtn) {
      playPinnedBtn.disabled = pinnedNotes.size < 2;
      if (pinnedNotes.size < 2) {
        playPinnedBtn.setAttribute('disabled', '');
      } else {
        playPinnedBtn.removeAttribute?.('disabled');
      }
    }

    if (clearPinnedBtn) {
      clearPinnedBtn.disabled = pinnedNotes.size === 0;
      if (pinnedNotes.size === 0) {
        clearPinnedBtn.setAttribute('disabled', '');
      } else {
        clearPinnedBtn.removeAttribute?.('disabled');
      }
    }

    if (readoutEl) {
      const midis = getActiveMidis();
      if (midis.length === 0) {
        readoutEl.textContent = isPinMode
          ? 'Selecione as notas para montar um acorde'
          : 'Toque nas teclas para ouvir';
        lastRecognizedChordText = '';
        return;
      }

      const noteNames = midis
        .map((m) => KEY_BY_MIDI.get(m)?.pitch)
        .filter(Boolean)
        .join(' · ');

      const triads = identifyTriadFromMidis(midis);
      if (triads.length > 0) {
        const primary = triads[0];
        const chordText = `${noteNames} — ${primary.name} (${primary.symbol})`;
        if (chordText !== lastRecognizedChordText) {
          readoutEl.textContent = chordText;
          lastRecognizedChordText = chordText;
        }
      } else {
        readoutEl.textContent = noteNames;
        lastRecognizedChordText = '';
      }
    }
  }

  function triggerMidiAudio(midi) {
    if (!soundEngine) return;
    if (typeof soundEngine.triggerNote === 'function') {
      soundEngine.triggerNote(midi);
    } else if (typeof soundEngine.playNote === 'function') {
      soundEngine.playNote(midi);
    }
  }

  function togglePinnedMidi(midi) {
    if (pinnedNotes.has(midi)) {
      pinnedNotes.delete(midi);
    } else {
      pinnedNotes.add(midi);
    }
    triggerMidiAudio(midi);
    syncVisualState();
  }

  function resolveKeyMidi(target) {
    const btn = target?.closest?.('.piano-key')
      || (target?.className?.includes('piano-key') ? target : null);
    if (!btn) return null;
    const midi = Number(btn.getAttribute('data-midi'));
    return Number.isFinite(midi) ? midi : null;
  }

  if (keyboardEl && typeof keyboardEl.addEventListener === 'function') {
    keyboardEl.addEventListener('pointerdown', (e) => {
      const midi = resolveKeyMidi(e.target);
      if (midi === null) return;
      e.preventDefault?.();

      if (isPinMode) {
        togglePinnedMidi(midi);
        return;
      }

      const pointerId = e.pointerId ?? 'mouse';
      activePointers.set(pointerId, midi);
      triggerMidiAudio(midi);
      syncVisualState();
    }, listenerOptions);

    const releasePointer = (e) => {
      const pointerId = e.pointerId ?? 'mouse';
      if (activePointers.has(pointerId)) {
        activePointers.delete(pointerId);
        syncVisualState();
      }
    };

    keyboardEl.addEventListener('pointerup', releasePointer, listenerOptions);
    keyboardEl.addEventListener('pointercancel', releasePointer, listenerOptions);
    keyboardEl.addEventListener('pointerleave', releasePointer, listenerOptions);

    // Suporte a ativação por teclado assistivo (Enter/Espaço no botão focado, detail === 0)
    keyboardEl.addEventListener('click', (e) => {
      if (e.detail && e.detail > 0) return;
      const midi = resolveKeyMidi(e.target);
      if (midi === null) return;

      if (isPinMode) {
        togglePinnedMidi(midi);
      } else {
        triggerMidiAudio(midi);
        const keyBtn = keyButtons.get(midi);
        keyBtn?.classList?.add('is-active');
        setTimeout(() => keyBtn?.classList?.remove('is-active'), 300);
      }
    }, listenerOptions);
  }

  if (pinToggleBtn && typeof pinToggleBtn.addEventListener === 'function') {
    pinToggleBtn.addEventListener('click', () => {
      isPinMode = !isPinMode;
      activePointers.clear();
      if (!isPinMode) {
        pinnedNotes.clear();
      }
      syncVisualState();
    }, listenerOptions);
  }

  if (playPinnedBtn && typeof playPinnedBtn.addEventListener === 'function') {
    playPinnedBtn.addEventListener('click', async () => {
      const midis = Array.from(pinnedNotes).sort((a, b) => a - b);
      if (midis.length >= 2 && soundEngine && typeof soundEngine.playChord === 'function') {
        await soundEngine.playChord(midis);
      }
    }, listenerOptions);
  }

  if (clearPinnedBtn && typeof clearPinnedBtn.addEventListener === 'function') {
    clearPinnedBtn.addEventListener('click', () => {
      pinnedNotes.clear();
      soundEngine?.stopAll?.();
      syncVisualState();
    }, listenerOptions);
  }

  if (helpBtn && typeof helpBtn.addEventListener === 'function') {
    helpBtn.addEventListener('click', (e) => {
      e?.stopPropagation?.();
      const isCurrentlyOpen = helpBtn.getAttribute('aria-expanded') === 'true';
      setHelpOpen(!isCurrentlyOpen);
    }, listenerOptions);
  }

  if (helpCloseBtn && typeof helpCloseBtn.addEventListener === 'function') {
    helpCloseBtn.addEventListener('click', () => {
      setHelpOpen(false);
      helpBtn?.focus?.();
    }, listenerOptions);
  }

  if (windowTarget && typeof windowTarget.addEventListener === 'function') {
    windowTarget.addEventListener('resize', syncKeyboardScale, listenerOptions);

    windowTarget.addEventListener('keydown', (e) => {
      if (!e) return;
      if (e.key === 'Escape' && helpBtn?.getAttribute('aria-expanded') === 'true') {
        setHelpOpen(false);
        helpBtn?.focus?.();
        return;
      }

      if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
      const keyName = typeof e.key === 'string' ? e.key.toLowerCase() : '';
      const midi = MIDI_BY_SHORTCUT.get(keyName);
      if (midi === undefined) return;

      if (isPinMode) {
        togglePinnedMidi(midi);
        return;
      }

      if (!activePhysicalKeys.has(midi)) {
        activePhysicalKeys.add(midi);
        triggerMidiAudio(midi);
        syncVisualState();
      }
    }, listenerOptions);

    windowTarget.addEventListener('keyup', (e) => {
      if (!e) return;
      const keyName = typeof e.key === 'string' ? e.key.toLowerCase() : '';
      const midi = MIDI_BY_SHORTCUT.get(keyName);
      if (midi === undefined) return;

      if (activePhysicalKeys.has(midi)) {
        activePhysicalKeys.delete(midi);
        syncVisualState();
      }
    }, listenerOptions);
  }

  syncVisualState();
  syncKeyboardScale();

  return function teardown() {
    controller?.abort();
    activePointers.clear();
    activePhysicalKeys.clear();
    pinnedNotes.clear();
  };
}
