/**
 * @fileoverview Métodos puros de consulta e regras da teoria musical (FEAT-001)
 * Desacoplado de DOM, áudio ou navegadores.
 */

import { TRIAD_CATEGORIES, TRIAD_DEFINITIONS, AUGMENTED_FOOTNOTE } from './triadsData.js';
import { calculateNoteFrequency } from './tuning.js';
import { getPhoneticChordDescription, sanitizePhoneticSymbol } from './phonetics.js';

export {
  TRIAD_CATEGORIES,
  TRIAD_DEFINITIONS,
  AUGMENTED_FOOTNOTE,
  calculateNoteFrequency,
  getPhoneticChordDescription,
  sanitizePhoneticSymbol
};

/**
 * Retorna as informações normativas da categoria de tríade solicitada.
 * @param {string} categoryId - 'major' | 'minor' | 'diminished' | 'augmented'
 * @returns {object|null}
 */
export function getTriadCategory(categoryId) {
  return TRIAD_DEFINITIONS[categoryId] || null;
}

/**
 * Retorna a lista de tríades de uma categoria.
 * @param {string} categoryId
 * @returns {Array<object>}
 */
export function getTriadChords(categoryId) {
  const category = getTriadCategory(categoryId);
  return category ? category.chords : [];
}

/**
 * Busca uma tríade específica pelo seu identificador alfanumérico único.
 * @param {string} chordId
 * @returns {object|undefined}
 */
export function getChordById(chordId) {
  for (const category of Object.values(TRIAD_DEFINITIONS)) {
    const chord = category.chords.find((c) => c.id === chordId);
    if (chord) return chord;
  }
  return undefined;
}

function normalizePitchClass(midiNote) {
  return ((Math.trunc(midiNote) % 12) + 12) % 12;
}

function countAccidentals(chord) {
  return chord.notes.reduce((total, note) => {
    const matches = (note.pitch || '').match(/[♯♭#b]/g);
    return total + (matches ? matches.length : 0);
  }, 0);
}

/**
 * Identifica tríades normativas do catálogo a partir de um conjunto de notas MIDI.
 * Requer exatamente 3 classes de altura distintas (módulo 12), priorizando
 * fundamental na nota mais grave e grafia com menos acidentes.
 * @param {Array<number>} midiNotes
 * @returns {Array<object>}
 */
export function identifyTriadFromMidis(midiNotes) {
  if (!Array.isArray(midiNotes) || midiNotes.length < 3) return [];

  const validMidis = midiNotes
    .map(Number)
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);

  if (validMidis.length < 3) return [];

  const pitchClasses = new Set(validMidis.map(normalizePitchClass));
  if (pitchClasses.size !== 3) return [];

  const bassPitchClass = normalizePitchClass(validMidis[0]);
  const matches = [];

  for (const category of Object.values(TRIAD_DEFINITIONS)) {
    for (const chord of category.chords) {
      const chordClasses = chord.notes.map((n) => normalizePitchClass(n.midi));
      const uniqueChordClasses = new Set(chordClasses);
      if (uniqueChordClasses.size !== 3) continue;

      const isMatch = chordClasses.every((pc) => pitchClasses.has(pc));
      if (isMatch) {
        matches.push(chord);
      }
    }
  }

  return matches.sort((a, b) => {
    const aRootMatch = normalizePitchClass(a.notes[0].midi) === bassPitchClass ? 0 : 1;
    const bRootMatch = normalizePitchClass(b.notes[0].midi) === bassPitchClass ? 0 : 1;
    if (aRootMatch !== bRootMatch) return aRootMatch - bRootMatch;

    return countAccidentals(a) - countAccidentals(b);
  });
}
