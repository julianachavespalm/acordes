import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createAcousticAnalyzer } from '../../src/audio/oscilloscope.js';
import {
  STRAIGHT_PATH,
  buildWaveformPath,
  initOscilloscopeView
} from '../../src/ui/oscilloscopeView.js';

describe('Osciloscópio Acústico Desacoplado (SRP / DIP)', () => {
  test('createAcousticAnalyzer deve funcionar sem DOM usando dependências injetadas e ganho zero para evitar áudio duplicado', async () => {
    const fetchedUrls = [];
    const connectedNodes = [];
    let gainValue = 1;
    let startedSources = 0;

    const fakeAnalyser = {
      fftSize: 0,
      smoothingTimeConstant: 0,
      connect: (target) => connectedNodes.push(target),
      getFloatTimeDomainData: (arr) => {
        arr[0] = -0.2;
        arr[1] = 0.4;
        arr[2] = 0.5;
      }
    };

    const fakeGain = {
      gain: {
        get value() { return gainValue; },
        set value(v) { gainValue = v; }
      },
      connect: (target) => connectedNodes.push(target)
    };

    const fakeCtx = {
      state: 'running',
      destination: { kind: 'destination' },
      createAnalyser: () => fakeAnalyser,
      createGain: () => fakeGain,
      decodeAudioData: async () => ({ duration: 1.0 }),
      createBufferSource: () => ({
        buffer: null,
        connect: () => {},
        start: () => { startedSources += 1; },
        stop: () => {},
        disconnect: () => {}
      })
    };

    const analyzer = createAcousticAnalyzer({
      audioContextFactory: () => fakeCtx,
      fetchImpl: async (url) => {
        fetchedUrls.push(url);
        return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
      }
    });

    const ok = await analyzer.analyzeSamples([60, 64, 67]);
    assert.equal(ok, true);
    assert.equal(gainValue, 0, 'Deve rotear por ganho zero para não duplicar o áudio do soundEngine');
    assert.equal(startedSources, 3);
    assert.deepEqual(fetchedUrls, [
      './public/tunes/28.mp3',
      './public/tunes/32.mp3',
      './public/tunes/35.mp3'
    ]);

    const snapshot = analyzer.getWaveformSnapshot();
    assert.ok(snapshot);
    assert.ok(snapshot.rms > 0);
    assert.equal(snapshot.triggerOffset, 0);

    analyzer.stop();
  });

  test('buildWaveformPath deve retornar linha reta quando não há snapshot e curva SVG válida com dados reais', () => {
    assert.equal(buildWaveformPath(null), STRAIGHT_PATH);

    const timeData = new Float32Array(256).fill(0.5);
    const path = buildWaveformPath({ timeData, triggerOffset: 0 });
    assert.match(path, /^M 0 20\.5 L /);
    assert.notEqual(path, STRAIGHT_PATH);
  });

  test('initOscilloscopeView deve atualizar o SVG no DOM e encerrar inscrições no teardown', async () => {
    const attrs = { d: STRAIGHT_PATH };
    const lineElement = {
      setAttribute: (k, v) => { attrs[k] = v; }
    };
    const root = {
      getElementById: (id) => (id === 'footer-separator-line' ? lineElement : null)
    };

    let playCb = null;
    let stopCb = null;
    let unsubCount = 0;

    const fakeSoundEngine = {
      onPlay: (fn) => { playCb = fn; return () => { unsubCount += 1; }; },
      onStop: (fn) => { stopCb = fn; return () => { unsubCount += 1; }; }
    };

    let stopCalls = 0;
    const fakeAnalyzer = {
      analyzeSamples: async () => true,
      getWaveformSnapshot: () => ({ rms: 0.25, timeData: new Float32Array(256).fill(0.3), triggerOffset: 0 }),
      stop: () => { stopCalls += 1; }
    };

    let rafQueue = [];
    const view = initOscilloscopeView({
      root,
      soundEngine: fakeSoundEngine,
      analyzer: fakeAnalyzer,
      raf: (fn) => { rafQueue.push(fn); return rafQueue.length; },
      cancelRaf: () => {}
    });

    assert.ok(view);
    await playCb([28]);
    assert.equal(rafQueue.length, 1);

    // Renderiza 1 frame
    rafQueue.shift()();
    assert.notEqual(attrs.d, STRAIGHT_PATH);

    // Stop restaura linha reta
    stopCb();
    assert.equal(attrs.d, STRAIGHT_PATH);
    assert.ok(stopCalls >= 1);

    // Teardown cancela inscrições
    view.teardown();
    assert.equal(unsubCount, 2);
  });

  test('deve aguardar AudioContext.resume() e tolerar silêncio inicial no primeiro toque da página', async () => {
    const events = [];
    const fakeCtx = {
      state: 'suspended',
      destination: { kind: 'destination' },
      resume: async () => {
        events.push('resume');
        fakeCtx.state = 'running';
      },
      createAnalyser: () => ({
        fftSize: 0,
        smoothingTimeConstant: 0,
        connect: () => {},
        getFloatTimeDomainData: () => {}
      }),
      createGain: () => ({ gain: { value: 1 }, connect: () => {} }),
      decodeAudioData: async () => ({ duration: 1.0 }),
      createBufferSource: () => ({
        buffer: null,
        connect: () => {},
        start: () => { events.push('start'); },
        stop: () => {},
        disconnect: () => {}
      })
    };

    const analyzer = createAcousticAnalyzer({
      audioContextFactory: () => fakeCtx,
      fetchImpl: async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) })
    });

    await analyzer.analyzeSamples([60]);
    assert.deepEqual(events, ['resume', 'start'], 'Deve concluir resume() antes de iniciar o BufferSource');

    // Simula 10 frames iniciais de silêncio (padding do MP3) seguidos por sinal real no frame 11
    let frame = 0;
    const attrs = { d: STRAIGHT_PATH };
    const root = { getElementById: () => ({ setAttribute: (k, v) => { attrs[k] = v; } }) };
    const rafQueue = [];

    const view = initOscilloscopeView({
      root,
      analyzer: {
        analyzeSamples: async () => true,
        stop: () => {},
        getWaveformSnapshot: () => {
          frame += 1;
          if (frame <= 10) {
            return { rms: 0, timeData: new Float32Array(256), triggerOffset: 0 };
          }
          return { rms: 0.3, timeData: new Float32Array(256).fill(0.4), triggerOffset: 0 };
        }
      },
      raf: (fn) => { rafQueue.push(fn); return rafQueue.length; },
      cancelRaf: () => {}
    });

    view.start();
    for (let i = 0; i < 11; i++) {
      assert.ok(rafQueue.length > 0, `Animação não deve ser abortada no frame inicial ${i + 1}`);
      rafQueue.shift()();
    }
    assert.notEqual(attrs.d, STRAIGHT_PATH, 'Linha deve vibrar assim que o ataque real do MP3 chegar');
  });
});
