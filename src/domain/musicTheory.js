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
