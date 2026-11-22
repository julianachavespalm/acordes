/**
 * @fileoverview Dicionário normativo imutável das 21 tríades por categoria (FEAT-001)
 * Define as 84 tríades da teoria musical com enarmonia estrita,
 * frequências fundamentais em Hertz e descrições fonéticas acessíveis.
 */

import { calculateNoteFrequency } from './tuning.js';

export const TRIAD_CATEGORIES = Object.freeze({
  MAJOR: 'major',
  MINOR: 'minor',
  DIMINISHED: 'diminished',
  AUGMENTED: 'augmented'
});

export const AUGMENTED_FOOTNOTE = Object.freeze({
  id: 'nota-triplo-sustenido',
  number: '1',
  label: 'Nota 1: uso do triplo sustenido',
  text: 'A teoria musical tradicional não usa o triplo sustenido, mas mantemos essa escrita para seguir a técnica de formação de acordes do livro <cite>Compêndio de Teoria Elementar da Música</cite>, de Oswaldo Lacerda (1961).',
  defaultRefId: 'ref-triplo-sustenido-1'
});

function createNote(pitch, phonetic, midiNote, extra = {}) {
  return Object.freeze({
    pitch,
    phonetic,
    midi: midiNote,
    frequency: calculateNoteFrequency(midiNote),
    ...extra
  });
}

function createChord(id, name, symbol, symbolPhonetic, category, [n1, n2, n3], extra = {}) {
  return Object.freeze({
    id,
    name,
    symbol,
    symbolPhonetic,
    category,
    notes: Object.freeze([n1, n2, n3]),
    ...extra
  });
}

// 1. Tríades Maiores (1 · 3 · 5)
const MAJOR_CHORDS = Object.freeze([
  // Naturais (7)
  createChord('c-major', 'Dó Maior', 'C', 'Cifra: Dó maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Dó', 'Dó', 60), createNote('Mi', 'Mi', 64), createNote('Sol', 'Sol', 67)
  ]),
  createChord('d-major', 'Ré Maior', 'D', 'Cifra: Ré maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Ré', 'Ré', 62), createNote('Fá♯', 'Fá sustenido', 66), createNote('Lá', 'Lá', 69)
  ]),
  createChord('e-major', 'Mi Maior', 'E', 'Cifra: Mi maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Mi', 'Mi', 64), createNote('Sol♯', 'Sol sustenido', 68), createNote('Si', 'Si', 71)
  ]),
  createChord('f-major', 'Fá Maior', 'F', 'Cifra: Fá maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Fá', 'Fá', 65), createNote('Lá', 'Lá', 69), createNote('Dó', 'Dó', 72)
  ]),
  createChord('g-major', 'Sol Maior', 'G', 'Cifra: Sol maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Sol', 'Sol', 67), createNote('Si', 'Si', 71), createNote('Ré', 'Ré', 74)
  ]),
  createChord('a-major', 'Lá Maior', 'A', 'Cifra: Lá maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Lá', 'Lá', 69), createNote('Dó♯', 'Dó sustenido', 73), createNote('Mi', 'Mi', 76)
  ]),
  createChord('b-major', 'Si Maior', 'B', 'Cifra: Si maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Si', 'Si', 71), createNote('Ré♯', 'Ré sustenido', 75), createNote('Fá♯', 'Fá sustenido', 78)
  ]),

  // Sustenidos (7)
  createChord('c-sharp-major', 'Dó Sustenido Maior', 'C♯', 'Cifra: Dó sustenido maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Dó♯', 'Dó sustenido', 61), createNote('Mi♯', 'Mi sustenido', 65), createNote('Sol♯', 'Sol sustenido', 68)
  ]),
  createChord('d-sharp-major', 'Ré Sustenido Maior', 'D♯', 'Cifra: Ré sustenido maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Ré♯', 'Ré sustenido', 63), createNote('Fá♯♯', 'Fá dobrado sustenido', 67), createNote('Lá♯', 'Lá sustenido', 70)
  ]),
  createChord('e-sharp-major', 'Mi Sustenido Maior', 'E♯', 'Cifra: Mi sustenido maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Mi♯', 'Mi sustenido', 65), createNote('Sol♯♯', 'Sol dobrado sustenido', 69), createNote('Si♯', 'Si sustenido', 72)
  ]),
  createChord('f-sharp-major', 'Fá Sustenido Maior', 'F♯', 'Cifra: Fá sustenido maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Fá♯', 'Fá sustenido', 66), createNote('Lá♯', 'Lá sustenido', 70), createNote('Dó♯', 'Dó sustenido', 73)
  ]),
  createChord('g-sharp-major', 'Sol Sustenido Maior', 'G♯', 'Cifra: Sol sustenido maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Sol♯', 'Sol sustenido', 68), createNote('Si♯', 'Si sustenido', 72), createNote('Ré♯', 'Ré sustenido', 75)
  ]),
  createChord('a-sharp-major', 'Lá Sustenido Maior', 'A♯', 'Cifra: Lá sustenido maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Lá♯', 'Lá sustenido', 70), createNote('Dó♯♯', 'Dó dobrado sustenido', 74), createNote('Mi♯', 'Mi sustenido', 77)
  ]),
  createChord('b-sharp-major', 'Si Sustenido Maior', 'B♯', 'Cifra: Si sustenido maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('B♯', 'Si sustenido', 72), createNote('Ré♯♯', 'Ré dobrado sustenido', 76), createNote('Fá♯♯', 'Fá dobrado sustenido', 79)
  ]),

  // Bemóis (7)
  createChord('c-flat-major', 'Dó Bemol Maior', 'C♭', 'Cifra: Dó bemol maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Dó♭', 'Dó bemol', 59), createNote('Mi♭', 'Mi bemol', 63), createNote('Sol♭', 'Sol bemol', 66)
  ]),
  createChord('db-major', 'Ré Bemol Maior', 'D♭', 'Cifra: Ré bemol maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Ré♭', 'Ré bemol', 61), createNote('Fá', 'Fá', 65), createNote('Lá♭', 'Lá bemol', 68)
  ]),
  createChord('eb-major', 'Mi Bemol Maior', 'E♭', 'Cifra: Mi bemol maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Mi♭', 'Mi bemol', 63), createNote('Sol', 'Sol', 67), createNote('Si♭', 'Si bemol', 70)
  ]),
  createChord('f-flat-major', 'Fá Bemol Maior', 'F♭', 'Cifra: Fá bemol maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Fá♭', 'Fá bemol', 64), createNote('Lá♭', 'Lá bemol', 68), createNote('Dó♭', 'Dó bemol', 71)
  ]),
  createChord('gb-major', 'Sol Bemol Maior', 'G♭', 'Cifra: Sol bemol maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Sol♭', 'Sol bemol', 66), createNote('Si♭', 'Si bemol', 70), createNote('Ré♭', 'Ré bemol', 73)
  ]),
  createChord('ab-major', 'Lá Bemol Maior', 'A♭', 'Cifra: Lá bemol maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Lá♭', 'Lá bemol', 68), createNote('Dó', 'Dó', 72), createNote('Mi♭', 'Mi bemol', 75)
  ]),
  createChord('bb-major', 'Si Bemol Maior', 'B♭', 'Cifra: Si bemol maior.', TRIAD_CATEGORIES.MAJOR, [
    createNote('Si♭', 'Si bemol', 70), createNote('Ré', 'Ré', 74), createNote('Fá', 'Fá', 77)
  ])
]);

// 2. Tríades Menores (1 · ♭3 · 5)
const MINOR_CHORDS = Object.freeze([
  // Naturais (7)
  createChord('c-minor', 'Dó Menor', 'Cm', 'Cifra: Dó menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Dó', 'Dó', 60), createNote('Mi♭', 'Mi bemol', 63), createNote('Sol', 'Sol', 67)
  ]),
  createChord('d-minor', 'Ré Menor', 'Dm', 'Cifra: Ré menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Ré', 'Ré', 62), createNote('Fá', 'Fá', 65), createNote('Lá', 'Lá', 69)
  ]),
  createChord('e-minor', 'Mi Menor', 'Em', 'Cifra: Mi menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Mi', 'Mi', 64), createNote('Sol', 'Sol', 67), createNote('Si', 'Si', 71)
  ]),
  createChord('f-minor', 'Fá Menor', 'Fm', 'Cifra: Fá menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Fá', 'Fá', 65), createNote('Lá♭', 'Lá bemol', 68), createNote('Dó', 'Dó', 72)
  ]),
  createChord('g-minor', 'Sol Menor', 'Gm', 'Cifra: Sol menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Sol', 'Sol', 67), createNote('Si♭', 'Si bemol', 70), createNote('Ré', 'Ré', 74)
  ]),
  createChord('a-minor', 'Lá Menor', 'Am', 'Cifra: Lá menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Lá', 'Lá', 69), createNote('Dó', 'Dó', 72), createNote('Mi', 'Mi', 76)
  ]),
  createChord('b-minor', 'Si Menor', 'Bm', 'Cifra: Si menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Si', 'Si', 71), createNote('Ré', 'Ré', 74), createNote('Fá♯', 'Fá sustenido', 78)
  ]),

  // Sustenidos (7)
  createChord('c-sharp-minor', 'Dó Sustenido Menor', 'C♯m', 'Cifra: Dó sustenido menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Dó♯', 'Dó sustenido', 61), createNote('Mi', 'Mi', 64), createNote('Sol♯', 'Sol sustenido', 68)
  ]),
  createChord('d-sharp-minor', 'Ré Sustenido Menor', 'D♯m', 'Cifra: Ré sustenido menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Ré♯', 'Ré sustenido', 63), createNote('Fá♯', 'Fá sustenido', 66), createNote('Lá♯', 'Lá sustenido', 70)
  ]),
  createChord('e-sharp-minor', 'Mi Sustenido Menor', 'E♯m', 'Cifra: Mi sustenido menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Mi♯', 'Mi sustenido', 65), createNote('Sol♯', 'Sol sustenido', 68), createNote('Si♯', 'Si sustenido', 72)
  ]),
  createChord('f-sharp-minor', 'Fá Sustenido Menor', 'F♯m', 'Cifra: Fá sustenido menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Fá♯', 'Fá sustenido', 66), createNote('Lá', 'Lá', 69), createNote('Dó♯', 'Dó sustenido', 73)
  ]),
  createChord('g-sharp-minor', 'Sol Sustenido Menor', 'G♯m', 'Cifra: Sol sustenido menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Sol♯', 'Sol sustenido', 68), createNote('Si', 'Si', 71), createNote('Ré♯', 'Ré sustenido', 75)
  ]),
  createChord('a-sharp-minor', 'Lá Sustenido Menor', 'A♯m', 'Cifra: Lá sustenido menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Lá♯', 'Lá sustenido', 70), createNote('Dó♯', 'Dó sustenido', 73), createNote('Mi♯', 'Mi sustenido', 77)
  ]),
  createChord('b-sharp-minor', 'Si Sustenido Menor', 'B♯m', 'Cifra: Si sustenido menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('B♯', 'Si sustenido', 72), createNote('Ré♯', 'Ré sustenido', 75), createNote('Fá♯♯', 'Fá dobrado sustenido', 79)
  ]),

  // Bemóis (7)
  createChord('c-flat-minor', 'Dó Bemol Menor', 'C♭m', 'Cifra: Dó bemol menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Dó♭', 'Dó bemol', 59), createNote('Mi♭♭', 'Mi dobrado bemol', 62), createNote('Sol♭', 'Sol bemol', 66)
  ]),
  createChord('db-minor', 'Ré Bemol Menor', 'D♭m', 'Cifra: Ré bemol menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Ré♭', 'Ré bemol', 61), createNote('Fá♭', 'Fá bemol', 64), createNote('Lá♭', 'Lá bemol', 68)
  ]),
  createChord('eb-minor', 'Mi Bemol Menor', 'E♭m', 'Cifra: Mi bemol menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Mi♭', 'Mi bemol', 63), createNote('Sol♭', 'Sol bemol', 66), createNote('Si♭', 'Si bemol', 70)
  ]),
  createChord('f-flat-minor', 'Fá Bemol Menor', 'F♭m', 'Cifra: Fá bemol menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Fá♭', 'Fá bemol', 64), createNote('Lá♭♭', 'Lá dobrado bemol', 67), createNote('Dó♭', 'Dó bemol', 71)
  ]),
  createChord('gb-minor', 'Sol Bemol Menor', 'G♭m', 'Cifra: Sol bemol menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Sol♭', 'Sol bemol', 66), createNote('Si♭♭', 'Si dobrado bemol', 69), createNote('Ré♭', 'Ré bemol', 73)
  ]),
  createChord('ab-minor', 'Lá Bemol Menor', 'A♭m', 'Cifra: Lá bemol menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Lá♭', 'Lá bemol', 68), createNote('Dó♭', 'Dó bemol', 71), createNote('Mi♭', 'Mi bemol', 75)
  ]),
  createChord('bb-minor', 'Si Bemol Menor', 'B♭m', 'Cifra: Si bemol menor.', TRIAD_CATEGORIES.MINOR, [
    createNote('Si♭', 'Si bemol', 70), createNote('Ré♭', 'Ré bemol', 73), createNote('Fá', 'Fá', 77)
  ])
]);

// 3. Tríades Diminutas (1 · ♭3 · ♭5)
const DIMINISHED_CHORDS = Object.freeze([
  // Naturais (7)
  createChord('c-diminished', 'Dó Diminuto', 'Cm(b5)', 'Cifra: Dó menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Dó', 'Dó', 60), createNote('Mi♭', 'Mi bemol', 63), createNote('Sol♭', 'Sol bemol', 66)
  ]),
  createChord('d-diminished', 'Ré Diminuto', 'Dm(b5)', 'Cifra: Ré menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Ré', 'Ré', 62), createNote('Fá', 'Fá', 65), createNote('Lá♭', 'Lá bemol', 68)
  ]),
  createChord('e-diminished', 'Mi Diminuto', 'Em(b5)', 'Cifra: Mi menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Mi', 'Mi', 64), createNote('Sol', 'Sol', 67), createNote('Si♭', 'Si bemol', 70)
  ]),
  createChord('f-diminished', 'Fá Diminuto', 'Fm(b5)', 'Cifra: Fá menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Fá', 'Fá', 65), createNote('Lá♭', 'Lá bemol', 68), createNote('Dó♭', 'Dó bemol', 71)
  ]),
  createChord('g-diminished', 'Sol Diminuto', 'Gm(b5)', 'Cifra: Sol menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Sol', 'Sol', 67), createNote('Si♭', 'Si bemol', 70), createNote('Ré♭', 'Ré bemol', 73)
  ]),
  createChord('a-diminished', 'Lá Diminuto', 'Am(b5)', 'Cifra: Lá menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Lá', 'Lá', 69), createNote('Dó', 'Dó', 72), createNote('Mi♭', 'Mi bemol', 75)
  ]),
  createChord('b-diminished', 'Si Diminuto', 'Bm(b5)', 'Cifra: Si menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Si', 'Si', 71), createNote('Ré', 'Ré', 74), createNote('Fá', 'Fá', 77)
  ]),

  // Sustenidos (7)
  createChord('c-sharp-diminished', 'Dó Sustenido Diminuto', 'C♯m(b5)', 'Cifra: Dó sustenido menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Dó♯', 'Dó sustenido', 61), createNote('Mi', 'Mi', 64), createNote('Sol', 'Sol', 67)
  ]),
  createChord('d-sharp-diminished', 'Ré Sustenido Diminuto', 'D♯m(b5)', 'Cifra: Ré sustenido menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Ré♯', 'Ré sustenido', 63), createNote('Fá♯', 'Fá sustenido', 66), createNote('Lá', 'Lá', 69)
  ]),
  createChord('e-sharp-diminished', 'Mi Sustenido Diminuto', 'E♯m(b5)', 'Cifra: Mi sustenido menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Mi♯', 'Mi sustenido', 65), createNote('Sol♯', 'Sol sustenido', 68), createNote('Si', 'Si', 71)
  ]),
  createChord('f-sharp-diminished', 'Fá Sustenido Diminuto', 'F♯m(b5)', 'Cifra: Fá sustenido menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Fá♯', 'Fá sustenido', 66), createNote('Lá', 'Lá', 69), createNote('Dó', 'Dó', 72)
  ]),
  createChord('g-sharp-diminished', 'Sol Sustenido Diminuto', 'G♯m(b5)', 'Cifra: Sol sustenido menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Sol♯', 'Sol sustenido', 68), createNote('Si', 'Si', 71), createNote('Ré', 'Ré', 74)
  ]),
  createChord('a-sharp-diminished', 'Lá Sustenido Diminuto', 'A♯m(b5)', 'Cifra: Lá sustenido menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Lá♯', 'Lá sustenido', 70), createNote('Dó♯', 'Dó sustenido', 73), createNote('Mi', 'Mi', 76)
  ]),
  createChord('b-sharp-diminished', 'Si Sustenido Diminuto', 'B♯m(b5)', 'Cifra: Si sustenido menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('B♯', 'Si sustenido', 72), createNote('Ré♯', 'Ré sustenido', 75), createNote('Fá♯', 'Fá sustenido', 78)
  ]),

  // Bemóis (7)
  createChord('c-flat-diminished', 'Dó Bemol Diminuto', 'C♭m(b5)', 'Cifra: Dó bemol menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Dó♭', 'Dó bemol', 59), createNote('Mi♭♭', 'Mi dobrado bemol', 62), createNote('Sol♭♭', 'Sol dobrado bemol', 65)
  ]),
  createChord('db-diminished', 'Ré Bemol Diminuto', 'D♭m(b5)', 'Cifra: Ré bemol menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Ré♭', 'Ré bemol', 61), createNote('Fá♭', 'Fá bemol', 64), createNote('Lá♭', 'Lá bemol', 67)
  ]),
  createChord('eb-diminished', 'Mi Bemol Diminuto', 'E♭m(b5)', 'Cifra: Mi bemol menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Mi♭', 'Mi bemol', 63), createNote('Sol♭', 'Sol bemol', 66), createNote('Si♭♭', 'Si dobrado bemol', 69)
  ]),
  createChord('f-flat-diminished', 'Fá Bemol Diminuto', 'F♭m(b5)', 'Cifra: Fá bemol menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Fá♭', 'Fá bemol', 64), createNote('Lá♭♭', 'Lá dobrado bemol', 67), createNote('Dó♭♭', 'Dó dobrado bemol', 70)
  ]),
  createChord('gb-diminished', 'Sol Bemol Diminuto', 'G♭m(b5)', 'Cifra: Sol bemol menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Sol♭', 'Sol bemol', 66), createNote('Si♭♭', 'Si dobrado bemol', 69), createNote('Ré♭♭', 'Ré dobrado bemol', 72)
  ]),
  createChord('ab-diminished', 'Lá Bemol Diminuto', 'A♭m(b5)', 'Cifra: Lá bemol menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Lá♭', 'Lá bemol', 68), createNote('Dó♭', 'Dó bemol', 71), createNote('Mi♭♭', 'Mi dobrado bemol', 74)
  ]),
  createChord('bb-diminished', 'Si Bemol Diminuto', 'B♭m(b5)', 'Cifra: Si bemol menor com quinta diminuta.', TRIAD_CATEGORIES.DIMINISHED, [
    createNote('Si♭', 'Si bemol', 70), createNote('Ré♭', 'Ré bemol', 73), createNote('Fá♭', 'Fá bemol', 76)
  ])
]);

// 4. Tríades Aumentadas (1 · 3 · ♯5)
const AUGMENTED_CHORDS = Object.freeze([
  // Naturais (7)
  createChord('c-augmented', 'Dó Aumentado', 'Dó(♯5)', 'Cifra: Dó com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Dó', 'Dó', 60), createNote('Mi', 'Mi', 64), createNote('Sol♯', 'Sol sustenido', 68)
  ]),
  createChord('d-augmented', 'Ré Aumentado', 'D(♯5)', 'Cifra: Ré com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Ré', 'Ré', 62), createNote('Fá♯', 'Fá sustenido', 66), createNote('Lá♯', 'Lá sustenido', 70)
  ]),
  createChord('e-augmented', 'Mi Aumentado', 'E(♯5)', 'Cifra: Mi com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Mi', 'Mi', 64), createNote('Sol♯', 'Sol sustenido', 68), createNote('Si♯', 'Si sustenido', 72)
  ]),
  createChord('f-augmented', 'Fá Aumentado', 'F(♯5)', 'Cifra: Fá com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Fá', 'Fá', 65), createNote('Lá', 'Lá', 69), createNote('Dó♯', 'Dó sustenido', 73)
  ]),
  createChord('g-augmented', 'Sol Aumentado', 'G(♯5)', 'Cifra: Sol com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Sol', 'Sol', 67), createNote('Si', 'Si', 71), createNote('Ré♯', 'Ré sustenido', 75)
  ]),
  createChord('a-augmented', 'Lá Aumentado', 'A(♯5)', 'Cifra: Lá com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Lá', 'Lá', 69), createNote('Dó♯', 'Dó sustenido', 73), createNote('Mi♯', 'Mi sustenido', 77)
  ]),
  createChord('b-augmented', 'Si Aumentado', 'B(♯5)', 'Cifra: Si com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Si', 'Si', 71), createNote('Ré♯', 'Ré sustenido', 75), createNote('Fá♯♯', 'Fá dobrado sustenido', 79)
  ]),

  // Sustenidos (7)
  createChord('c-sharp-augmented', 'Dó Sustenido Aumentado', 'Dó♯(♯5)', 'Cifra: Dó sustenido com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Dó♯', 'Dó sustenido', 61), createNote('Mi♯', 'Mi sustenido', 65), createNote('Sol♯♯', 'Sol dobrado sustenido', 69)
  ]),
  createChord('d-sharp-augmented', 'Ré Sustenido Aumentado', 'D♯(♯5)', 'Cifra: Ré sustenido com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Ré♯', 'Ré sustenido', 63), createNote('Fá♯♯', 'Fá dobrado sustenido', 67), createNote('Lá♯♯', 'Lá dobrado sustenido', 71)
  ]),
  createChord('e-sharp-augmented', 'Mi Sustenido Aumentado', 'E♯(♯5)', 'Cifra: Mi sustenido com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Mi♯', 'Mi sustenido', 65), createNote('Sol♯♯', 'Sol dobrado sustenido', 69), createNote('Si♯♯', 'Si dobrado sustenido', 73)
  ]),
  createChord('f-sharp-augmented', 'Fá Sustenido Aumentado', 'F♯(♯5)', 'Cifra: Fá sustenido com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Fá♯', 'Fá sustenido', 66), createNote('Lá♯', 'Lá sustenido', 70), createNote('Dó♯♯', 'Dó dobrado sustenido', 74)
  ]),
  createChord('g-sharp-augmented', 'Sol Sustenido Aumentado', 'G♯(♯5)', 'Cifra: Sol sustenido com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Sol♯', 'Sol sustenido', 68), createNote('Si♯', 'Si sustenido', 72), createNote('Ré♯♯', 'Ré dobrado sustenido', 76)
  ]),
  createChord('a-sharp-augmented', 'Lá Sustenido Aumentado', 'A♯(♯5)', 'Cifra: Lá sustenido com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Lá♯', 'Lá sustenido', 70), createNote('Dó♯♯', 'Dó dobrado sustenido', 74), createNote('Mi♯♯', 'Mi dobrado sustenido', 78)
  ]),
  createChord('b-sharp-augmented', 'Si Sustenido Aumentado', 'B♯(♯5)', 'Cifra: Si sustenido com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('B♯', 'Si sustenido', 72),
    createNote('Ré♯♯', 'Ré dobrado sustenido', 76),
    createNote('Fá♯♯♯', 'Fá triplo sustenido', 80, { footnote: AUGMENTED_FOOTNOTE })
  ], {
    footnote: AUGMENTED_FOOTNOTE
  }),

  // Bemóis (7)
  createChord('c-flat-augmented', 'Dó Bemol Aumentado', 'Dó♭(♯5)', 'Cifra: Dó bemol com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Dó♭', 'Dó bemol', 59), createNote('Mi♭', 'Mi bemol', 63), createNote('Sol', 'Sol', 67)
  ]),
  createChord('db-augmented', 'Ré Bemol Aumentado', 'D♭(♯5)', 'Cifra: Ré bemol com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Ré♭', 'Ré bemol', 61), createNote('Fá', 'Fá', 65), createNote('Lá', 'Lá', 69)
  ]),
  createChord('eb-augmented', 'Mi Bemol Aumentado', 'E♭(♯5)', 'Cifra: Mi bemol com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Mi♭', 'Mi bemol', 63), createNote('Sol', 'Sol', 67), createNote('Si', 'Si', 71)
  ]),
  createChord('f-flat-augmented', 'Fá Bemol Aumentado', 'F♭(♯5)', 'Cifra: Fá bemol com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Fá♭', 'Fá bemol', 64), createNote('Lá♭', 'Lá bemol', 68), createNote('Dó', 'Dó', 72)
  ]),
  createChord('gb-augmented', 'Sol Bemol Aumentado', 'G♭(♯5)', 'Cifra: Sol bemol com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Sol♭', 'Sol bemol', 66), createNote('Si♭', 'Si bemol', 70), createNote('Ré', 'Ré', 74)
  ]),
  createChord('ab-augmented', 'Lá Bemol Aumentado', 'A♭(♯5)', 'Cifra: Lá bemol com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Lá♭', 'Lá bemol', 68), createNote('Dó', 'Dó', 72), createNote('Mi', 'Mi', 76)
  ]),
  createChord('bb-augmented', 'Si Bemol Aumentado', 'B♭(♯5)', 'Cifra: Si bemol com quinta aumentada.', TRIAD_CATEGORIES.AUGMENTED, [
    createNote('Si♭', 'Si bemol', 70), createNote('Ré', 'Ré', 74), createNote('Fá♯', 'Fá sustenido', 78)
  ])
]);

export const TRIAD_DEFINITIONS = Object.freeze({
  [TRIAD_CATEGORIES.MAJOR]: Object.freeze({
    id: TRIAD_CATEGORIES.MAJOR,
    title: 'Acordes Maiores',
    titleLines: Object.freeze(['Acordes', 'Maiores']),
    formula: 'Tríade 1 · 3 · 5',
    formulaIntervals: '1 · 3 · 5',
    leads: Object.freeze([
      'A tríade maior é formada pela sobreposição de uma terça maior e uma terça menor a partir da fundamental (tônica, terça maior e quinta justa). Apresenta sonoridade estável, luminosa e consonante, sendo a base do sistema tonal ocidental.',
      'Abaixo encontram-se as 21 formações maiores com enarmonias rigorosas. Selecione o nome do acorde para ouvir a tríade simultânea, ou cada nota individual para estudar seus intervalos.'
    ]),
    footnote: null,
    chords: MAJOR_CHORDS
  }),
  [TRIAD_CATEGORIES.MINOR]: Object.freeze({
    id: TRIAD_CATEGORIES.MINOR,
    title: 'Acordes Menores',
    titleLines: Object.freeze(['Acordes', 'Menores']),
    formula: 'Tríade 1 · ♭3 · 5',
    formulaIntervals: '1 · ♭3 · 5',
    leads: Object.freeze([
      'A tríade menor é formada pela sobreposição de uma terça menor e uma terça maior a partir da fundamental (tônica, terça menor e quinta justa). Apresenta sonoridade reflexiva, suave e melancólica, estabelecendo o polo relativo ao modo maior.',
      'Abaixo encontram-se as 21 formações menores com enarmonias rigorosas. Selecione o nome do acorde para ouvir a tríade simultânea, ou cada nota individual para estudar seus intervalos.'
    ]),
    footnote: null,
    chords: MINOR_CHORDS
  }),
  [TRIAD_CATEGORIES.DIMINISHED]: Object.freeze({
    id: TRIAD_CATEGORIES.DIMINISHED,
    title: 'Acordes Diminutos',
    titleLines: Object.freeze(['Acordes', 'Diminutos']),
    formula: 'Tríade 1 · ♭3 · ♭5',
    formulaIntervals: '1 · ♭3 · ♭5',
    leads: Object.freeze([
      'A tríade diminuta é formada pela sobreposição de duas terças menores a partir da fundamental (tônica, terça menor e quinta diminuta). Possui sonoridade instável e tensa, com forte tendência de resolução harmônica.',
      'Abaixo encontram-se as 21 formações diminutas com enarmonias rigorosas. Selecione o nome do acorde para ouvir a tríade simultânea, ou cada nota individual para estudar seus intervalos.'
    ]),
    footnote: null,
    chords: DIMINISHED_CHORDS
  }),
  [TRIAD_CATEGORIES.AUGMENTED]: Object.freeze({
    id: TRIAD_CATEGORIES.AUGMENTED,
    title: 'Acordes Aumentados',
    titleLines: Object.freeze(['Acordes', 'Aumentados']),
    formula: 'Tríade 1 · 3 · ♯5',
    formulaIntervals: '1 · 3 · ♯5',
    leads: Object.freeze([
      'A tríade aumentada é formada pela sobreposição de duas terças maiores a partir da fundamental (tônica, terça maior e quinta aumentada). Apresenta sonoridade aberta, suspensa e de grande expansão harmônica.',
      'Use os botões abaixo para ouvir cada acorde completo ou suas notas individuais.'
    ]),
    footnote: AUGMENTED_FOOTNOTE,
    chords: AUGMENTED_CHORDS
  })
});
