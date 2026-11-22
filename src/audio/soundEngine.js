/**
 * @fileoverview Piano Sound Engine utilizing recorded acoustic samples in public/tunes/ (28.mp3 - 53.mp3).
 * Delivers clean, authentic piano audio with zero synthetic oscillator artifacts.
 * Implements bounded sample pooling (ADR-011) and strict relative paths for GitHub Pages.
 */

import {
  DEFAULT_TUNES_BASE_PATH,
  resolveSampleId,
  resolveSamplePath
} from './sampleMapper.js';

const MAX_POOL_SIZE = 26;

function isConstrainedConnection() {
  if (typeof navigator === 'undefined' || !navigator.connection) return false;
  const { saveData, effectiveType } = navigator.connection;
  return Boolean(saveData || effectiveType === 'slow-2g' || effectiveType === '2g');
}

export function createSoundEngine(options = {}) {
  const audioFactory = options.audioFactory || ((src) => {
    if (typeof Audio !== 'undefined') {
      return new Audio(src);
    }
    return null;
  });

  const basePath = options.basePath || DEFAULT_TUNES_BASE_PATH;
  const audioPool = new Map();
  let activeAudios = [];
  const playListeners = new Set();
  const stopListeners = new Set();

  function getOrCreateAudio(sampleId) {
    if (audioPool.has(sampleId)) {
      return audioPool.get(sampleId);
    }

    const src = resolveSamplePath(sampleId, basePath);
    if (!src) return null;

    const audio = audioFactory(src);
    if (!audio) return null;

    if (audioPool.size < MAX_POOL_SIZE) {
      audioPool.set(sampleId, audio);
    }
    return audio;
  }

  function stopAll() {
    for (const audio of activeAudios) {
      try {
        if (typeof audio.pause === 'function') {
          audio.pause();
          audio.currentTime = 0;
        }
      } catch {
        // Defensive cleanup
      }
    }
    activeAudios = [];
    for (const fn of stopListeners) {
      try { fn(); } catch {}
    }
  }

  async function playSample(identifier) {
    const sampleId = resolveSampleId(identifier);
    if (sampleId === null) return;

    const audio = getOrCreateAudio(sampleId);
    if (!audio) return;

    try {
      if (typeof audio.pause === 'function') {
        audio.pause();
      }
      audio.currentTime = 0;
      if (!activeAudios.includes(audio)) {
        activeAudios.push(audio);
      }

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        await playPromise.catch(() => {
          audioPool.delete(sampleId);
        });
      }
    } catch {
      audioPool.delete(sampleId);
    }
  }

  async function playNote(identifier) {
    const sampleId = resolveSampleId(identifier);
    if (sampleId === null) return;

    stopAll();
    for (const fn of playListeners) {
      try { fn([sampleId]); } catch {}
    }
    await playSample(sampleId);
  }

  async function triggerNote(identifier) {
    const sampleId = resolveSampleId(identifier);
    if (sampleId === null) return;

    for (const fn of playListeners) {
      try { fn([sampleId]); } catch {}
    }
    await playSample(sampleId);
  }

  async function playChord(identifiers) {
    if (!Array.isArray(identifiers) || identifiers.length === 0) return;

    const resolvedIds = identifiers
      .map(resolveSampleId)
      .filter((id) => id !== null);

    if (resolvedIds.length === 0) return;

    stopAll();
    for (const fn of playListeners) {
      try { fn(resolvedIds); } catch {}
    }
    await Promise.all(resolvedIds.map((id) => playSample(id)));
  }

  function preload(identifiers, { signal } = {}) {
    if (!Array.isArray(identifiers) || identifiers.length === 0) return;
    if (signal?.aborted || isConstrainedConnection()) return;

    const uniqueIds = Array.from(
      new Set(identifiers.map(resolveSampleId).filter((id) => id !== null))
    );

    const scheduleIdle = typeof requestIdleCallback === 'function'
      ? (cb) => requestIdleCallback(cb)
      : (cb) => setTimeout(cb, 0);

    let index = 0;
    function loadNext() {
      if (signal?.aborted || index >= uniqueIds.length) return;
      const sampleId = uniqueIds[index++];
      if (!audioPool.has(sampleId)) {
        const audio = getOrCreateAudio(sampleId);
        if (audio && typeof audio.load === 'function') {
          try { audio.load(); } catch {}
        }
      }
      if (index < uniqueIds.length && !signal?.aborted) {
        scheduleIdle(loadNext);
      }
    }

    scheduleIdle(loadNext);
  }

  return {
    playNote,
    triggerNote,
    playChord,
    stopAll,
    preload,
    getActiveAudios: () => activeAudios,
    getPoolSize: () => audioPool.size,
    onPlay: (fn) => { playListeners.add(fn); return () => playListeners.delete(fn); },
    onStop: (fn) => { stopListeners.add(fn); return () => stopListeners.delete(fn); },
  };
}
