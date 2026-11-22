#!/usr/bin/env node
/**
 * @fileoverview Validador de Tokens do Design System (`scripts/validate-tokens.mjs`)
 * Impede que valores literais de cores ou medidas hardcoded existam fora de `tokens.css`.
 * Executado localmente e em pipelines de CI.
 */

import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { c, ui } from './lib/ui.mjs';

// ============================================================================
// 1. CONFIGURAÇÃO E CONSTANTES
// ============================================================================
const START_TIME = performance.now();
const ROOT = process.cwd();
const CSS_DIR = fs.existsSync(path.join(ROOT, 'src', 'styles'))
  ? path.join(ROOT, 'src', 'styles')
  : path.join(ROOT, 'src', 'css');
const RELATIVE_CSS_DIR = path.relative(ROOT, CSS_DIR).replace(/\\/g, '/');
const TOKENS_FILE = path.join(CSS_DIR, 'tokens.css');

const MANDATORY_TOKENS = [
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
  '--ds-focus-offset',
];

const groupedErrors = new Map();
const warnings = [];
let totalErrorsCount = 0;
let scannedFilesCount = 0;
let validatedTokensCount = 0;

function addError(scope, message) {
  if (!groupedErrors.has(scope)) {
    groupedErrors.set(scope, []);
  }
  groupedErrors.get(scope).push(message);
  totalErrorsCount++;
}

// ============================================================================
// 2. REGRAS DE VALIDAÇÃO
// ============================================================================
function validateTokensDefinition() {
  const scope = `${RELATIVE_CSS_DIR}/tokens.css`;

  if (!fs.existsSync(TOKENS_FILE)) {
    warnings.push(`Arquivo ${scope} ainda não foi criado (será implementado na FEAT-006).`);
    return;
  }

  const content = fs.readFileSync(TOKENS_FILE, 'utf8');
  for (const token of MANDATORY_TOKENS) {
    if (content.includes(token)) {
      validatedTokensCount++;
    } else {
      addError(scope, `Token obrigatório ausente: ${token}`);
    }
  }
}

function scanForHardcodedValues() {
  if (!fs.existsSync(CSS_DIR)) return;

  const cssFiles = fs.readdirSync(CSS_DIR)
    .filter((f) => f.endsWith('.css') && f !== 'tokens.css')
    .sort();

  scannedFilesCount = cssFiles.length;

  const hexColorRegex = /#([0-9a-fA-F]{3,8})\b/;
  const rgbColorRegex = /\b(rgb|rgba|hsl|hsla)\s*\(/;

  for (const file of cssFiles) {
    const filePath = path.join(CSS_DIR, file);
    const scope = `${RELATIVE_CSS_DIR}/${file}`;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const cleanLine = line.replace(/\/\*.*?\*\//g, '').trim();
      if (!cleanLine || cleanLine.startsWith('/*') || cleanLine.startsWith('*')) return;

      const lineNum = index + 1;

      if (hexColorRegex.test(cleanLine)) {
        addError(scope, `Linha ${lineNum}: Cor hexadecimal literal ("${cleanLine}"). Utilize var(--ds-*).`);
      }
      if (rgbColorRegex.test(cleanLine)) {
        addError(scope, `Linha ${lineNum}: Função de cor literal ("${cleanLine}"). Utilize var(--ds-*).`);
      }
    });
  }
}

// ============================================================================
// 3. MOTOR DE EXECUÇÃO
// ============================================================================
function runValidation() {
  validateTokensDefinition();
  scanForHardcodedValues();

  const durationMs = (performance.now() - START_TIME).toFixed(0);
  const passed = totalErrorsCount === 0;

  ui.header('DESIGN SYSTEM TOKENS GATE', passed ? 'APROVADO' : 'REPROVADO', !passed);
  ui.kv('Escopo', `${validatedTokensCount}/${MANDATORY_TOKENS.length} tokens base, ${scannedFilesCount} arquivo(s) CSS`);
  ui.kv('Duração', `${durationMs} ms`);
  ui.kv(
    'Violações',
    passed
      ? `${c.green}0 encontradas${c.reset}`
      : `${c.red}${totalErrorsCount} violação(ões) em ${groupedErrors.size} arquivo(s)${c.reset}`
  );
  ui.rule();

  ui.printWarnings(warnings);

  if (passed) {
    ui.ok('Nenhum valor literal hardcoded encontrado. Tokens CSS em conformidade.');
    console.log();
    process.exit(0);
  }

  ui.printGroupedErrors(groupedErrors);
  ui.rule();
  ui.err(`Gate bloqueado. Substitua os valores literais por tokens ${c.cyan}var(--ds-*)${c.reset}.`);
  console.log();
  process.exit(1);
}

runValidation();
