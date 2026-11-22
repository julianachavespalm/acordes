import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createSoundEngine } from '../../src/audio/soundEngine.js';

class MockAudio {
  constructor(src) {
    this.src = src;
    this.currentTime = 0;
    this.paused = true;
    this.played = false;
  }

  async play() {
    this.played = true;
    this.paused = false;
  }

  pause() {
    this.paused = true;
  }
}

describe('FEAT-002: Piano Sample Audio Engine (public/tunes/*.mp3)', () => {
  let createdAudios;
  let engine;

  beforeEach(() => {
    createdAudios = [];
    engine = createSoundEngine({
      audioFactory: (src) => {
        const audio = new MockAudio(src);
        createdAudios.push(audio);
        return audio;
      },
      basePath: './public/tunes/'
    });
  });

  test('deve tocar nota isolada com a amostra real de piano em public/tunes (RN-02 / CA-02.1)', async () => {
    await engine.playNote(28); // 28.mp3 (Dó)

    assert.equal(createdAudios.length, 1);
    assert.equal(createdAudios[0].src, './public/tunes/28.mp3');
    assert.equal(createdAudios[0].played, true);
    assert.equal(createdAudios[0].paused, false);
  });

  test('deve tocar tríade polifônica com 3 amostras simultâneas de piano (RN-03 / CA-02.2)', async () => {
    const chordTunes = [28, 32, 35]; // C Major: C, E, G
    await engine.playChord(chordTunes);

    assert.equal(createdAudios.length, 3);
    assert.deepEqual(createdAudios.map(a => a.src), [
      './public/tunes/28.mp3',
      './public/tunes/32.mp3',
      './public/tunes/35.mp3'
    ]);
    for (const audio of createdAudios) {
      assert.equal(audio.played, true);
      assert.equal(audio.paused, false);
    }
  });

  test('deve interromper e resetar amostras anteriores ao acionar stopAll (RN-04, RN-05 / CA-02.3)', async () => {
    await engine.playChord([28, 32, 35]);
    assert.equal(createdAudios.length, 3);

    engine.stopAll();

    for (const audio of createdAudios) {
      assert.equal(audio.paused, true);
      assert.equal(audio.currentTime, 0);
    }
    assert.equal(engine.getActiveAudios().length, 0);
  });

  test('deve ignorar com segurança chamadas com listas vazias ou nulas (EC-02.1)', async () => {
    await engine.playChord([]);
    assert.equal(createdAudios.length, 0);

    await engine.playChord(null);
    assert.equal(createdAudios.length, 0);

    await engine.playNote(null);
    assert.equal(createdAudios.length, 0);
  });

  test('deve resolver notas MIDI puras para amostras .mp3 reais na camada de áudio (DDD)', async () => {
    await engine.playNote(60); // MIDI 60 (Dó 4) -> 28.mp3
    assert.equal(createdAudios.length, 1);
    assert.equal(createdAudios[0].src, './public/tunes/28.mp3');

    await engine.playChord([60, 64, 67]); // Dó Maior: 28, 32, 35
    assert.equal(engine.getPoolSize(), 3);
    assert.deepEqual(createdAudios.map((a) => a.src), [
      './public/tunes/28.mp3',
      './public/tunes/32.mp3',
      './public/tunes/35.mp3'
    ]);
  });

  test('deve reutilizar instâncias do pool de áudio sem recriar Audio a cada clique (ADR-011)', async () => {
    await engine.playNote(60);
    await engine.playNote(60);
    await engine.playNote(60);

    assert.equal(createdAudios.length, 1, 'Deve reutilizar a mesma instância Audio do pool');
    assert.equal(engine.getPoolSize(), 1);
  });

  test('deve tocar notas simultaneas sem corte via triggerNote (CA-10.2)', async () => {
    await engine.triggerNote(60); // 28.mp3
    await engine.triggerNote(64); // 32.mp3
    await engine.triggerNote(67); // 35.mp3

    assert.equal(createdAudios.length, 3);
    assert.equal(engine.getActiveAudios().length, 3);
    for (const audio of createdAudios) {
      assert.equal(audio.played, true);
      assert.equal(audio.paused, false);
    }
  });

  test('deve pre-carregar amostras unicas no pool com preload e respeitar AbortSignal (ADR-011)', async () => {
    let loadedCount = 0;
    const preloadEngine = createSoundEngine({
      audioFactory: (src) => ({
        src,
        currentTime: 0,
        load() { loadedCount += 1; },
        play: async () => {},
        pause() {}
      })
    });

    preloadEngine.preload([]);
    assert.equal(preloadEngine.getPoolSize(), 0);

    const controller = new AbortController();
    preloadEngine.preload([60, 64, 60], { signal: controller.signal });
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.equal(preloadEngine.getPoolSize(), 2);
    assert.equal(loadedCount, 2);

    const abortedController = new AbortController();
    abortedController.abort();
    preloadEngine.preload([67, 71], { signal: abortedController.signal });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.equal(preloadEngine.getPoolSize(), 2);
  });

  test('deve notificar listeners onPlay e onStop e remover amostra do pool em falha de play()', async () => {
    const playedEvents = [];
    let stopCount = 0;
    let shouldFail = true;

    const resilientEngine = createSoundEngine({
      audioFactory: (src) => ({
        src,
        currentTime: 0,
        pause() {},
        play() {
          if (shouldFail) {
            return Promise.reject(new Error('decode error'));
          }
          return Promise.resolve();
        }
      })
    });

    const unsubPlay = resilientEngine.onPlay((ids) => playedEvents.push(ids));
    const unsubStop = resilientEngine.onStop(() => { stopCount += 1; });

    await resilientEngine.playNote(60);
    assert.equal(resilientEngine.getPoolSize(), 0, 'Falha em play() deve remover instancia corrompida do pool');
    assert.equal(playedEvents.length, 1);
    assert.equal(stopCount, 1);

    shouldFail = false;
    await resilientEngine.triggerNote(64);
    await resilientEngine.playChord([60, 64, 67]);
    assert.equal(resilientEngine.getPoolSize(), 3);

    unsubPlay();
    unsubStop();
  });
});
