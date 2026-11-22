/**
 * @fileoverview Testes automatizados do Design System e Auditoria Matemática WCAG AAA (FEAT-006)
 * Valida os tokens de cor, tipografia e espaçamento, calculando a luminância relativa
 * conforme as normas do W3C.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const CSS_DIR = fs.existsSync(path.resolve(process.cwd(), 'src/styles'))
  ? path.resolve(process.cwd(), 'src/styles')
  : path.resolve(process.cwd(), 'src/css');
const TOKENS_PATH = path.join(CSS_DIR, 'tokens.css');
const BASE_PATH = path.join(CSS_DIR, 'base.css');

/**
 * Calcula a luminância relativa de uma cor hexadecimal segundo o padrão W3C.
 * @param {string} hex - Ex: '#111111' ou '#FAFAFA'
 * @returns {number} Valor entre 0 e 1
 */
function getRelativeLuminance(hex) {
  const cleanHex = hex.replace('#', '').trim();
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calcula a razão de contraste (Contrast Ratio) entre duas cores.
 * @param {string} hex1
 * @param {string} hex2
 * @returns {number} Razão (CR:1)
 */
function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

function extractTokenValue(cssContent, tokenName) {
  const regex = new RegExp(`${tokenName}\\s*:\\s*([^;]+);`);
  const match = cssContent.match(regex);
  return match ? match[1].trim() : null;
}

describe('FEAT-006: Design System e Auditoria de Acessibilidade WCAG AAA', () => {
  it('deve existir os arquivos tokens.css e base.css na camada CSS', () => {
    assert.ok(fs.existsSync(TOKENS_PATH), 'tokens.css deve existir');
    assert.ok(fs.existsSync(BASE_PATH), 'base.css deve existir');
  });

  it('deve conter todos os tokens obrigatórios no seletor :root em tokens.css', () => {
    const content = fs.readFileSync(TOKENS_PATH, 'utf8');
    const requiredTokens = [
      '--ds-color-paper',
      '--ds-color-surface',
      '--ds-color-ink',
      '--ds-color-ink-muted',
      '--ds-color-accent-amber',
      '--ds-color-line',
      '--ds-font-primary',
      '--ds-font-size-base',
      '--ds-line-height-base',
      '--ds-font-size-h1',
      '--ds-letter-spacing-spaced',
      '--ds-measure-reading',
      '--ds-grid-sidebar-width',
      '--ds-focus-outline',
      '--ds-focus-offset'
    ];

    for (const token of requiredTokens) {
      assert.ok(content.includes(token), `Token ${token} deve estar presente em tokens.css`);
    }
  });

  it('deve comprovar matematicamente a conformidade WCAG 2.1 AAA para texto sobre papel (CA-06.1)', () => {
    const content = fs.readFileSync(TOKENS_PATH, 'utf8');
    const paper = extractTokenValue(content, '--ds-color-paper');
    const ink = extractTokenValue(content, '--ds-color-ink');
    const inkMuted = extractTokenValue(content, '--ds-color-ink-muted');

    assert.ok(paper, 'Token --ds-color-paper deve ter valor');
    assert.ok(ink, 'Token --ds-color-ink deve ter valor');

    const contrastInk = getContrastRatio(paper, ink);
    assert.ok(contrastInk >= 15.0, `Contraste da tinta preta sobre papel (${contrastInk}:1) deve ser >= 15:1 (mínimo AAA: 7:1)`);

    const contrastMuted = getContrastRatio(paper, inkMuted);
    assert.ok(contrastMuted >= 7.0, `Contraste da tinta muted sobre papel (${contrastMuted}:1) deve ser >= 7:1 (cumpre AAA)`);
  });

  it('deve comprovar matematicamente a conformidade WCAG 2.1 AAA para texto sobre destaque âmbar (CA-06.2)', () => {
    const content = fs.readFileSync(TOKENS_PATH, 'utf8');
    const amber = extractTokenValue(content, '--ds-color-accent-amber');
    const ink = extractTokenValue(content, '--ds-color-ink');

    const contrastAmber = getContrastRatio(amber, ink);
    assert.ok(contrastAmber >= 9.0, `Contraste da tinta preta sobre o âmbar (${contrastAmber}:1) deve ser >= 9:1 (cumpre AAA)`);
  });

  it('deve configurar tipografia base de 18px e entrelinha de 1.6 para conforto visual (CA-06.3)', () => {
    const content = fs.readFileSync(TOKENS_PATH, 'utf8');
    const fontSizeBase = extractTokenValue(content, '--ds-font-size-base');
    const lineHeightBase = extractTokenValue(content, '--ds-line-height-base');

    assert.equal(fontSizeBase, '18px');
    assert.equal(lineHeightBase, '1.6');
  });

  it('deve conter as classes utilitárias acessíveis .sr-only e duplo skip-link em base.css', () => {
    const content = fs.readFileSync(BASE_PATH, 'utf8');
    assert.ok(content.includes('.sr-only'), 'Classe .sr-only deve existir');
    assert.ok(content.includes('.skip-link'), 'Classe .skip-link deve existir');
    assert.ok(content.includes(':focus-visible'), 'Regra de :focus-visible deve existir com destaque âmbar');
    assert.ok(content.includes('prefers-reduced-motion'), 'Regra de reduced-motion deve existir');
  });

  it('deve configurar selecao global de texto com destaque ambar e tinta escura WCAG AAA (ADR-008)', () => {
    const content = fs.readFileSync(BASE_PATH, 'utf8');
    assert.match(content, /::selection\s*{[^}]*background-color:\s*var\(--ds-color-accent-amber\)/s);
    assert.match(content, /::selection\s*{[^}]*color:\s*var\(--ds-color-ink\)/s);
  });

  it('deve garantir que containers de destino e :target nunca recebam fundo ambar ao focar', () => {
    const content = fs.readFileSync(BASE_PATH, 'utf8');
    assert.match(content, /:target[^{]*{[^}]*background-color:\s*transparent\s*!important/s);
    assert.match(content, /\[tabindex="-1"\]:focus[^{]*{[^}]*outline:\s*none\s*!important/s);
  });

  it('deve blindar absolutamente a camada .sr-only contra visibilidade visual sob :target ou :focus', () => {
    const content = fs.readFileSync(BASE_PATH, 'utf8');
    assert.match(content, /:target\s+\.sr-only[^{]*{[^}]*position:\s*absolute\s*!important/s);
    assert.match(content, /:focus\s+\.sr-only[^{]*{[^}]*clip:\s*rect\(0,\s*0,\s*0,\s*0\)\s*!important/s);
  });
});
