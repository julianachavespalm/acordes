/**
 * @fileoverview Visualização SVG do Osciloscópio Acústico no Rodapé (SRP / DIP)
 * Responsável exclusivamente pela renderização da linha de 1px no DOM a partir
 * dos dados físicos fornecidos pelo analisador acústico em src/audio/oscilloscope.js.
 */

export const BASELINE_Y = 20;
export const STRAIGHT_PATH = 'M 0 20 L 1000 20';

/**
 * Converte um snapshot do domínio do tempo em um caminho SVG suavizado nas bordas.
 * Função pura e determinística para facilitar testes unitários.
 * @param {{ timeData: Float32Array|number[], triggerOffset: number } | null} snapshot
 * @returns {string}
 */
export function buildWaveformPath(snapshot) {
  if (!snapshot || !snapshot.timeData || snapshot.timeData.length === 0) {
    return STRAIGHT_PATH;
  }

  const { timeData, triggerOffset = 0 } = snapshot;
  const numPoints = 200;
  const step = 1000 / numPoints;
  const availableSamples = Math.max(1, timeData.length - triggerOffset - 1);
  let d = `M 0 ${BASELINE_Y}`;

  for (let i = 1; i <= numPoints; i++) {
    const x = i * step;

    let taper = 1.0;
    if (x < 40) {
      taper = 0.5 * (1 - Math.cos((Math.PI * x) / 40));
    } else if (x > 960) {
      taper = 0.5 * (1 - Math.cos((Math.PI * (1000 - x)) / 40));
    }

    const sampleProgress = (i - 1) / (numPoints - 1);
    const sampleIdx = triggerOffset + Math.floor(sampleProgress * availableSamples);
    const rawSample = timeData[sampleIdx] || 0;

    const displacement = rawSample * 18.0 * taper;
    const y = BASELINE_Y - displacement;

    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }

  return d;
}

/**
 * Conecta o analisador acústico ao elemento SVG #footer-separator-line.
 * @param {object} params
 * @param {Document|HTMLElement} [params.root]
 * @param {object|null} [params.soundEngine]
 * @param {object|null} [params.analyzer]
 * @param {Function} [params.raf]
 * @param {Function} [params.cancelRaf]
 */
export function initOscilloscopeView({
  root = typeof document !== 'undefined' ? document : null,
  soundEngine = null,
  analyzer = null,
  raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null,
  cancelRaf = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : null
} = {}) {
  if (!root || !analyzer) return null;

  const lineElement = root.getElementById
    ? root.getElementById('footer-separator-line')
    : root.querySelector?.('#footer-separator-line');

  if (!lineElement) return null;

  let animationId = null;
  let silenceFrameCount = 0;
  let hasDetectedSignal = false;

  const WARMUP_SILENCE_LIMIT = 30;
  const DECAY_SILENCE_LIMIT = 10;

  function resetLine() {
    if (animationId && cancelRaf) {
      cancelRaf(animationId);
    }
    animationId = null;
    silenceFrameCount = 0;
    hasDetectedSignal = false;
    lineElement.setAttribute('d', STRAIGHT_PATH);
  }

  function renderFrame() {
    const snapshot = analyzer.getWaveformSnapshot();
    if (!snapshot) {
      resetLine();
      return;
    }

    if (snapshot.rms < 0.0006) {
      silenceFrameCount += 1;
      const silenceLimit = hasDetectedSignal ? DECAY_SILENCE_LIMIT : WARMUP_SILENCE_LIMIT;
      if (silenceFrameCount > silenceLimit) {
        resetLine();
        return;
      }
    } else {
      hasDetectedSignal = true;
      silenceFrameCount = 0;
    }

    lineElement.setAttribute('d', buildWaveformPath(snapshot));

    if (raf) {
      animationId = raf(renderFrame);
    }
  }

  function start() {
    silenceFrameCount = 0;
    hasDetectedSignal = false;
    if (animationId || !raf) return;
    animationId = raf(renderFrame);
  }

  function stop() {
    analyzer.stop();
    resetLine();
  }

  let unsubPlay = null;
  let unsubStop = null;

  if (soundEngine && typeof soundEngine.onPlay === 'function') {
    unsubPlay = soundEngine.onPlay(async (sampleIds) => {
      const started = await analyzer.analyzeSamples(sampleIds);
      if (started) {
        start();
      }
    });
  }

  if (soundEngine && typeof soundEngine.onStop === 'function') {
    unsubStop = soundEngine.onStop(() => {
      stop();
    });
  }

  function teardown() {
    unsubPlay?.();
    unsubStop?.();
    stop();
  }

  return { start, stop, teardown };
}
