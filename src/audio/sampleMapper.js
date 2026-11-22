/**
 * @fileoverview Mapeador de Notas MIDI para Amostras Acústicas de Piano (.mp3) (ADR-003)
 * Isola exclusivamente na camada de áudio o conhecimento sobre numeração e extensão
 * dos 26 arquivos gravados em public/tunes/ (28.mp3 a 53.mp3).
 */

export const MIN_SAMPLE_ID = 28;
export const MAX_SAMPLE_ID = 53;
export const DEFAULT_TUNES_BASE_PATH = './public/tunes/';

/**
 * Converte um índice MIDI musical puro para o identificador da amostra acústica (28 a 53).
 * @param {number} midiNote
 * @returns {number}
 */
export function midiToSampleId(midiNote) {
  let note = Number(midiNote);
  while (note - 32 < MIN_SAMPLE_ID) note += 12;
  while (note - 32 > MAX_SAMPLE_ID) note -= 12;
  return note - 32;
}

/**
 * Resolve um identificador (MIDI musical ou ID de amostra 28..53 / "28.mp3")
 * para o número inteiro da amostra acústica em [28, 53].
 * @param {number|string|null|undefined} identifier
 * @returns {number|null}
 */
export function resolveSampleId(identifier) {
  if (identifier === null || identifier === undefined || identifier === '') {
    return null;
  }

  const cleaned = String(identifier).replace(/\.mp3$/i, '').trim();
  if (!cleaned) return null;

  const numeric = Number(cleaned);
  if (!Number.isFinite(numeric)) return null;

  if (numeric >= MIN_SAMPLE_ID && numeric <= MAX_SAMPLE_ID) {
    return Math.trunc(numeric);
  }

  return midiToSampleId(Math.trunc(numeric));
}

/**
 * Monta o caminho relativo para o arquivo .mp3 da amostra acústica.
 * @param {number|string} identifier
 * @param {string} [basePath]
 * @returns {string|null}
 */
export function resolveSamplePath(identifier, basePath = DEFAULT_TUNES_BASE_PATH) {
  const sampleId = resolveSampleId(identifier);
  if (sampleId === null) return null;
  return `${basePath}${sampleId}.mp3`;
}
