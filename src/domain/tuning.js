/**
 * @fileoverview Matriz de Afinação Musical Temperada (ADR-001)
 * Cálculo puro de frequência fundamental baseado em A4 = 440 Hz (MIDI 69).
 * Sem conhecimento de arquivos de áudio ou infraestrutura.
 */

/**
 * Calcula a frequência em Hertz a partir do índice MIDI temperado.
 * @param {number} midiNote
 * @returns {number} Frequência com 2 casas decimais.
 */
export function calculateNoteFrequency(midiNote) {
  return Number((440 * Math.pow(2, (midiNote - 69) / 12)).toFixed(2));
}
