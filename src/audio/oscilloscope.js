/**
 * @fileoverview Analisador Acústico em Tempo Real (Web Audio API AnalyserNode)
 * Camada pura de áudio (sem DOM ou SVG): decodifica amostras reais .mp3 em buffer
 * e extrai o sinal físico no domínio do tempo com estabilização por zero-crossing.
 */

import { DEFAULT_TUNES_BASE_PATH, resolveSampleId, resolveSamplePath } from './sampleMapper.js';

/**
 * Cria uma instância isolada de analisador acústico com injeção de dependências (DIP).
 * @param {object} [options]
 * @param {Function} [options.audioContextFactory]
 * @param {Function} [options.fetchImpl]
 * @param {string} [options.basePath]
 * @param {Function} [options.samplePathResolver]
 */
export function createAcousticAnalyzer(options = {}) {
  const basePath = options.basePath || DEFAULT_TUNES_BASE_PATH;
  const samplePathResolver = options.samplePathResolver || ((id) => resolveSamplePath(id, basePath));
  const fetchImpl = options.fetchImpl || (typeof fetch === 'function' ? fetch.bind(globalThis) : null);
  const audioContextFactory = options.audioContextFactory || (() => {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    return AudioContextClass ? new AudioContextClass() : null;
  });

  let audioCtx = null;
  let analyser = null;
  let activeSources = [];
  let activeRequestToken = 0;
  const audioBufferCache = new Map();

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = audioContextFactory();
      if (audioCtx) {
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.15;

        // Roteia por ganho zero para alimentar o AnalyserNode sem duplicar o áudio audível do soundEngine
        if (typeof audioCtx.createGain === 'function') {
          const silentGain = audioCtx.createGain();
          silentGain.gain.value = 0;
          analyser.connect(silentGain);
          silentGain.connect(audioCtx.destination);
        } else {
          analyser.connect(audioCtx.destination);
        }
      }
    }
    return audioCtx;
  }

  async function ensureRunningContext() {
    const ctx = getAudioContext();
    if (!ctx) return null;
    if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
      try {
        await ctx.resume();
      } catch {
        // Ignora falha de autoplay se disparado fora de gesto do usuário
      }
    }
    return ctx;
  }

  async function loadAudioBuffer(identifier) {
    const sampleId = resolveSampleId(identifier);
    if (sampleId === null || !fetchImpl) return null;

    const cacheKey = String(sampleId);
    if (audioBufferCache.has(cacheKey)) {
      return audioBufferCache.get(cacheKey);
    }

    const ctx = getAudioContext();
    if (!ctx) return null;

    const src = samplePathResolver(sampleId);
    if (!src) return null;

    try {
      const response = await fetchImpl(src);
      if (!response || !response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioBufferCache.set(cacheKey, audioBuffer);
      return audioBuffer;
    } catch {
      return null;
    }
  }

  function stop() {
    activeRequestToken += 1;
    for (const src of activeSources) {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // Defensive cleanup
      }
    }
    activeSources = [];
  }

  async function analyzeSamples(identifiers) {
    if (!Array.isArray(identifiers) || identifiers.length === 0) return false;

    // Cria/ativa o AudioContext ainda dentro do gesto do usuário e aguarda sair de 'suspended'
    const ctx = getAudioContext();
    if (!ctx || !analyser) return false;

    stop();
    const requestToken = activeRequestToken;

    const [, buffers] = await Promise.all([
      ensureRunningContext(),
      Promise.all(identifiers.map((id) => loadAudioBuffer(id)))
    ]);

    if (requestToken !== activeRequestToken) return false;

    const validBuffers = buffers.filter(Boolean);
    if (validBuffers.length === 0) return false;

    for (const buffer of validBuffers) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(analyser);
      source.start(0);
      activeSources.push(source);
    }
    return true;
  }

  function getWaveformSnapshot() {
    if (!analyser) return null;

    const timeData = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(timeData);

    let sumSquares = 0;
    for (let i = 0; i < timeData.length; i++) {
      const val = timeData[i];
      sumSquares += val * val;
    }
    const rms = Math.sqrt(sumSquares / timeData.length);

    let triggerOffset = 0;
    const searchLimit = Math.floor(timeData.length / 2);
    for (let i = 0; i < searchLimit; i++) {
      if (timeData[i] < 0 && timeData[i + 1] >= 0) {
        triggerOffset = i;
        break;
      }
    }

    return { rms, timeData, triggerOffset };
  }

  return {
    getAudioContext,
    loadAudioBuffer,
    analyzeSamples,
    getWaveformSnapshot,
    stop
  };
}
