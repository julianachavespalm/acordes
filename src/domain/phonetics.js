/**
 * @fileoverview Regras Fonéticas e Audiodescrição Musical para Leitores de Tela (ADR-004)
 * Converte símbolos e acidentes em descrições claras por extenso.
 */

/**
 * Monta a descrição fonética por extenso da tríade para leitores de tela (.sr-only).
 * @param {object} chord
 * @returns {string}
 */
export function getPhoneticChordDescription(chord) {
  if (!chord || !chord.notes) return '';
  const notesText = chord.notes.map((n) => n.phonetic).join(', ');
  return `${chord.name}. Notas: ${notesText}. ${chord.symbolPhonetic || ''}`;
}

/**
 * Sanitiza texto de cifra removendo prefixos automáticos para leitura concisa.
 * @param {string} phoneticSymbol
 * @returns {string}
 */
export function sanitizePhoneticSymbol(phoneticSymbol) {
  if (!phoneticSymbol) return '';
  return phoneticSymbol.replace(/^Cifra:\s*/i, '').replace(/\.$/, '').trim();
}
