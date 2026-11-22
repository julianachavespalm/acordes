/**
 * @fileoverview Testes unitários para o Core Harmônico (FEAT-001)
 * Valida a integridade das 21 tríades por categoria, enarmonias exatas,
 * frequências em Hertz e transcrições fonéticas acessíveis.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  TRIAD_CATEGORIES,
  TRIAD_DEFINITIONS
} from '../../src/domain/triadsData.js';

import {
  getTriadCategory,
  getTriadChords,
  getChordById,
  calculateNoteFrequency,
  getPhoneticChordDescription
} from '../../src/domain/musicTheory.js';

describe('FEAT-001: Core Harmônico e Modelagem de Tríades', () => {
  it('deve conter as 4 categorias normativas de tríades', () => {
    assert.equal(TRIAD_CATEGORIES.MAJOR, 'major');
    assert.equal(TRIAD_CATEGORIES.MINOR, 'minor');
    assert.equal(TRIAD_CATEGORIES.DIMINISHED, 'diminished');
    assert.equal(TRIAD_CATEGORIES.AUGMENTED, 'augmented');
  });

  it('deve retornar exatamente 21 tríades para cada uma das 4 categorias (CA-01.1)', () => {
    const categories = ['major', 'minor', 'diminished', 'augmented'];

    for (const cat of categories) {
      const data = getTriadCategory(cat);
      assert.ok(data, `Categoria ${cat} deve existir`);
      assert.ok(data.title, 'Título deve estar presente');
      assert.ok(data.formula, 'Fórmula deve estar presente');
      assert.equal(data.chords.length, 21, `Categoria ${cat} deve conter exatamente 21 tríades`);
    }
  });

  it('deve calcular frequências exatas em Hertz com base na afinação A4 = 440 Hz (CA-01.3)', () => {
    // MIDI 69 = A4 = 440.00 Hz
    assert.equal(calculateNoteFrequency(69), 440.00);

    // MIDI 60 = C4 = 261.63 Hz
    assert.equal(calculateNoteFrequency(60), 261.63);

    // MIDI 57 = A3 = 220.00 Hz
    assert.equal(calculateNoteFrequency(57), 220.00);
  });

  it('deve preservar enarmonias rigorosas para tríades com bemol e sustenido (CA-01.2)', () => {
    // Ré bemol diminuto: Tônica Ré♭, Terça Menor Fá♭, Quinta Diminuta Lá♭
    const dbDim = getChordById('db-diminished');
    assert.ok(dbDim, 'Ré bemol diminuto deve existir no catálogo');
    assert.equal(dbDim.symbol, 'D♭m(b5)');
    assert.equal(dbDim.notes.length, 3);
    assert.equal(dbDim.notes[0].pitch, 'Ré♭');
    assert.equal(dbDim.notes[1].pitch, 'Fá♭');
    assert.equal(dbDim.notes[2].pitch, 'Lá♭');

    // Dó diminuto: Tônica Dó, Terça Menor Mi♭, Quinta Diminuta Sol♭
    const cDim = getChordById('c-diminished');
    assert.ok(cDim);
    assert.equal(cDim.symbol, 'Cm(b5)');
    assert.equal(cDim.notes[0].pitch, 'Dó');
    assert.equal(cDim.notes[1].pitch, 'Mi♭');
    assert.equal(cDim.notes[2].pitch, 'Sol♭');

    // Dó aumentado: Cifra exata do HTML Dó(♯5), sem notações genéricas em inglês (ex: Caug)
    const cAug = getChordById('c-augmented');
    assert.ok(cAug, 'Dó aumentado deve existir no catálogo');
    assert.equal(cAug.symbol, 'Dó(♯5)');

    const cSharpAug = getChordById('c-sharp-augmented');
    assert.equal(cSharpAug.symbol, 'Dó♯(♯5)');

    const cFlatAug = getChordById('c-flat-augmented');
    assert.equal(cFlatAug.symbol, 'Dó♭(♯5)');

    const dAug = getChordById('d-augmented');
    assert.equal(dAug.symbol, 'D(♯5)');

    // Nenhuma tríade aumentada deve conter notação em inglês "aug"
    const augChords = getTriadChords('augmented');
    for (const chord of augChords) {
      assert.equal(chord.symbol.includes('aug'), false, `Tríade ${chord.name} não deve usar notação em inglês "aug"`);
      assert.ok(chord.symbol.includes('(♯5)'), `Tríade ${chord.name} deve utilizar sufixo (♯5)`);
    }
  });

  it('deve fornecer representação fonética descritiva para leitor de tela sem abreviações dúbias', () => {
    const dbDim = getChordById('db-diminished');
    const desc = getPhoneticChordDescription(dbDim);
    assert.ok(desc.includes('Ré bemol'), 'Deve pronunciar a fundamental por extenso');
    assert.ok(desc.includes('Fá bemol'), 'Deve pronunciar a terça por extenso');
    assert.ok(desc.includes('Lá bemol'), 'Deve pronunciar a quinta por extenso');
  });

  it('deve tratar categorias ou identificadores inválidos com segurança (EC-01.1)', () => {
    assert.equal(getTriadCategory('categoria-invalida'), null);
    assert.equal(getChordById('id-inexistente'), undefined);
    assert.equal(getTriadChords('inexistente').length, 0);
  });

  it('deve garantir que o catálogo de dados seja estritamente imutável (Object.isFrozen)', () => {
    assert.ok(Object.isFrozen(TRIAD_DEFINITIONS), 'Dicionário principal deve estar congelado');
    assert.ok(Object.isFrozen(TRIAD_CATEGORIES), 'Categorias devem estar congeladas');
  });

  it('deve manter o domínio puramente musical sem acoplamento a arquivos .mp3 (DDD)', () => {
    const cMajor = getChordById('c-major');
    assert.ok(cMajor);
    for (const note of cMajor.notes) {
      assert.equal('tune' in note, false, 'Nota do domínio não deve expor número de arquivo tune');
      assert.equal('tuneFile' in note, false, 'Nota do domínio não deve expor extensão .mp3');
      assert.equal(typeof note.midi, 'number');
      assert.equal(typeof note.frequency, 'number');
    }
  });
});
