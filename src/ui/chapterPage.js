/**
 * @fileoverview Renderizador de Capítulos e Notas de Rodapé DPUB (FEAT-003, FEAT-004 / ADR-004, ADR-008, ADR-011)
 * Consome metadados diretamente do domínio (TRIAD_DEFINITIONS), monta o layout editorial
 * e gerencia foco bidirecional entre doc-noteref e doc-backlink com desmontagem via AbortController.
 */

import { getTriadCategory, AUGMENTED_FOOTNOTE } from '../domain/musicTheory.js';
import { initChordList } from './chordList.js';

export { AUGMENTED_FOOTNOTE };

/**
 * Gera a marcação HTML de notas de rodapé DPUB orientada aos metadados do domínio.
 * @param {string} categoryId
 * @returns {string}
 */
export function renderChapterFootnotesMarkup(categoryId) {
  const category = getTriadCategory(categoryId);
  const footnote = category?.footnote;
  if (!footnote) return '';

  return `
    <aside class="editorial-footnotes" aria-label="Notas do capítulo">
      <div id="${footnote.id}" role="doc-footnote" class="editorial-footnote" tabindex="-1">
        <p>
          <strong>${footnote.number}.</strong> ${footnote.text}
          <a href="#${footnote.defaultRefId}" role="doc-backlink" class="editorial-backlink" aria-label="Voltar para a ocorrência no texto">↩</a>
        </p>
      </div>
    </aside>
  `.trim();
}

/**
 * Configura a navegação bidirecional de foco entre doc-noteref e doc-backlink
 * utilizando um único listener delegado no elemento montado e estado encapsulado (ADR-011).
 * @param {HTMLElement|Document} [root]
 * @param {object} [options]
 * @param {AbortSignal} [options.signal]
 */
export function setupFootnoteNavigation(root = document, { signal } = {}) {
  if (!root || typeof root.addEventListener !== 'function') return;

  let lastClickedRef = null;
  const listenerOptions = signal ? { signal } : undefined;

  root.addEventListener('click', (event) => {
    const noteref = event.target?.closest?.('.editorial-noteref')
      || (event.target?.className?.includes('editorial-noteref') ? event.target : null);

    if (noteref) {
      event.preventDefault?.();
      lastClickedRef = noteref;

      const refId = noteref.id || noteref.getAttribute?.('id');
      const backlink = root.querySelector ? root.querySelector('.editorial-backlink') : null;
      if (backlink && refId) {
        backlink.setAttribute('href', `#${refId}`);
      }

      const targetHref = noteref.getAttribute?.('href');
      const footnoteId = targetHref ? targetHref.replace(/^#/, '') : 'nota-triplo-sustenido';
      const footnoteTarget = root.getElementById
        ? root.getElementById(footnoteId)
        : (root.querySelector ? root.querySelector(`#${footnoteId}`) : null);

      if (footnoteTarget) {
        footnoteTarget.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        footnoteTarget.focus?.();
      }
      return;
    }

    const backlink = event.target?.closest?.('.editorial-backlink')
      || (event.target?.className?.includes('editorial-backlink') ? event.target : null);

    if (backlink) {
      event.preventDefault?.();
      const href = backlink.getAttribute?.('href');
      const targetElement = lastClickedRef || (href
        ? (root.querySelector ? root.querySelector(href) : root.getElementById?.(href.replace(/^#/, '')))
        : null);

      if (targetElement) {
        targetElement.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        targetElement.focus?.();
      }
    }
  }, listenerOptions);
}

/**
 * Inicializa notas de rodapé em uma página de capítulo já montada.
 * @param {object} params
 * @param {string} params.categoryId
 * @param {HTMLElement|Document} [params.root]
 * @param {AbortSignal} [params.signal]
 */
export function initChapterPage({ categoryId, root = document, signal }) {
  const category = getTriadCategory(categoryId);
  if (!category?.footnote) return;

  const tableContainer = root.getElementById
    ? root.getElementById('tabela-container')
    : root.querySelector?.('#tabela-container');

  const footnotesSection = root.querySelector ? root.querySelector('.editorial-footnotes') : null;

  if (!footnotesSection && tableContainer && typeof tableContainer.insertAdjacentHTML === 'function') {
    tableContainer.insertAdjacentHTML('afterend', renderChapterFootnotesMarkup(categoryId));
  }

  setupFootnoteNavigation(root, { signal });
}

/**
 * Renderiza o capítulo completo de uma categoria de tríades e devolve a função de desmontagem (ADR-011).
 * @param {string} categoryId
 * @param {object} soundEngine
 * @param {HTMLElement} mountElement
 * @returns {Function} Função teardown para cancelar listeners e pré-carregamentos da rota.
 */
export function renderChapterPage(categoryId, soundEngine, mountElement) {
  const category = getTriadCategory(categoryId);
  if (!category || !mountElement) return () => {};

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const signal = controller?.signal;

  const [titleLine1 = category.title, titleLine2 = ''] = category.titleLines || [];
  const leadsHtml = (category.leads || [])
    .map((text) => `<p class="editorial-lead">${text}</p>`)
    .join('\n        ');
  const footnoteHtml = renderChapterFootnotesMarkup(categoryId);

  mountElement.innerHTML = `
    <div class="chapter-layout triad-chapter-grid">
      <aside class="chapter-sidebar" aria-label="Identificação do capítulo">
        <h1 class="chapter-title-vertical" id="titulo-capitulo" tabindex="-1">
          <span class="chapter-title-line">${titleLine1}</span>
          <span class="chapter-title-line">${titleLine2}</span>
        </h1>
        <span class="chapter-dash" aria-hidden="true"></span>
        <div class="chapter-formula" aria-label="Fórmula estrutural da tríade">
          <span class="formula-label">Tríade</span>
          <span class="formula-intervals">${category.formulaIntervals || category.formula}</span>
        </div>
      </aside>

      <section class="chapter-content">
        <div class="chapter-scroll-area">
          ${leadsHtml}
          <div id="tabela-container"></div>
          ${footnoteHtml}
        </div>
      </section>
    </div>
  `.trim();

  const tableContainer = mountElement.querySelector('#tabela-container');
  initChordList({
    containerElement: tableContainer,
    categoryId,
    soundEngine,
    signal
  });

  if (category.footnote) {
    setupFootnoteNavigation(mountElement, { signal });
  }

  return function teardown() {
    controller?.abort();
  };
}
