#!/usr/bin/env node
/**
 * @fileoverview Validador determinístico do gate SDD (`scripts/validate-sdd.mjs`)
 * Aplica as regras de conformidade do Spec-Driven Development (SDD)
 * em Node.js nativo para execução local e ambientes de CI.
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
const SPECS_DIR = path.join(ROOT, '.specs');
const FEATURES_DIR = path.join(SPECS_DIR, 'features');
const DECISIONS_DIR = path.join(SPECS_DIR, 'decisions');

const BASE_ADRS = [
  'ADR-001-lean-modular-architecture.md',
  'ADR-002-css-layers.md',
  'ADR-003-local-audio-orchestration.md',
  'ADR-004-universal-accessibility-wai-aria.md',
  'ADR-005-coding-standards-bilingual-separation.md',
  'ADR-006-automated-testing-native-node.md',
  'ADR-007-playwright-e2e-scheduled-ci.md',
  'ADR-008-design-system-tokens-editorial-swiss.md',
];

const BASE_FEATURES = [
  'FEAT-001-Core-Harmonico',
  'FEAT-002-Audio-Player',
  'FEAT-003-Shell-Navegacao',
  'FEAT-004-Tabelas-Triades',
  'FEAT-005-Home-Editorial',
  'FEAT-006-Design-System-e-Tokens',
];

const REQUIRED_SPEC_SECTIONS = [
  { label: 'Governança SDD', pattern: /(Governança SDD|Tabela de Governança)/i },
  { label: 'Contexto e Declaração de Valor', pattern: /(Contexto e Declaração de Valor|História[s]? de Usuário|User Stories)/i },
  { label: 'Escopo e Fronteiras do Sistema', pattern: /(Escopo e Fronteiras do Sistema|Out of Scope|Fora de Escopo)/i },
  { label: 'Especificação Funcional e Regras de Negócio', pattern: /(Especificação Funcional e Regras de Negócio|Regras de Negócio)/i },
  { label: 'Contrato Técnico e Semântica de Interface', pattern: /(Contrato Técnico e Semântica de Interface|Contrato Técnico)/i },
  { label: 'Critérios de Aceitação', pattern: /(Critérios de Aceitação|Acceptance Criteria|Matriz de Rastreabilidade)/i },
];

const REQUIRED_TASKS_SECTIONS = [
  { label: 'Test Coverage Matrix', pattern: /(Test Coverage Matrix|Matriz de Cobertura de Testes)/i },
  { label: 'Gate Check Commands', pattern: /(Gate Check Commands|Comandos de Verificação do Gate)/i },
  { label: 'Execution Plan', pattern: /(Execution Plan|Plano de Execução)/i },
  { label: 'Task Breakdown', pattern: /(Task Breakdown|Detalhamento de Tarefas)/i },
  { label: 'Checks', pattern: /(Checks|Verificações)/i },
];

const groupedErrors = new Map();
const warnings = [];
let totalErrorsCount = 0;
let totalAdrs = 0;
let totalFeatures = 0;

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
function checkDecisionsDir() {
  const scope = '.specs/decisions/';
  if (!fs.existsSync(DECISIONS_DIR)) {
    addError(scope, 'Diretório ausente.');
    return;
  }

  const adrFiles = fs.readdirSync(DECISIONS_DIR)
    .filter((f) => /^ADR-\d{3}-.+\.md$/.test(f))
    .sort();

  totalAdrs = adrFiles.length;

  const missingBase = BASE_ADRS.filter((f) => !adrFiles.includes(f));
  if (missingBase.length > 0) {
    addError(scope, `ADRs estruturais ausentes: ${missingBase.join(', ')}.`);
  }

  adrFiles.forEach((file, idx) => {
    const expectedPrefix = `ADR-${String(idx + 1).padStart(3, '0')}-`;
    if (!file.startsWith(expectedPrefix)) {
      addError(scope, `Quebra de sequência em '${file}' (esperado prefixo ${expectedPrefix}).`);
    }
  });
}

function checkStateFile() {
  const scope = '.specs/STATE.md';
  const statePath = path.join(SPECS_DIR, 'STATE.md');
  if (!fs.existsSync(statePath)) {
    addError(scope, 'Arquivo STATE.md ausente.');
    return;
  }

  const content = fs.readFileSync(statePath, 'utf8');
  if (!/(## Decisions|## Decisões)/i.test(content)) {
    addError(scope, "Seção '## Decisions' (ou '## Decisões') ausente.");
  }
  if (!/(## Handoff|## Transição)/i.test(content)) {
    addError(scope, "Seção '## Handoff' (ou '## Transição') ausente.");
  }

  const adMatches = content.match(/### AD-\d{3}/g) || [];
  if (adMatches.length !== totalAdrs) {
    addError(scope, `Divergência entre ADRs em disco (${totalAdrs}) e decisões registradas (${adMatches.length}).`);
  }
}

function validateFeatureSpec(featureName, featureDir) {
  const scope = `.specs/features/${featureName}/spec.md`;
  const specPath = path.join(featureDir, 'spec.md');

  if (!fs.existsSync(specPath)) {
    addError(scope, 'Arquivo spec.md ausente.');
    return;
  }

  const text = fs.readFileSync(specPath, 'utf8');

  if (!/Juliana Chaves Palm/i.test(text)) {
    addError(scope, 'Autoria de Juliana Chaves Palm ausente.');
  }

  for (const { label, pattern } of REQUIRED_SPEC_SECTIONS) {
    const rx = new RegExp(`^#{1,3}\\s+.*${pattern.source}.*$`, 'm');
    if (!rx.test(text)) {
      addError(scope, `Seção obrigatória ausente: "${label}"`);
    }
  }

  if (!/\*\*Como\*\*/.test(text) || !/\*\*Eu quero\*\*/.test(text) || !/\*\*Para que\*\*/.test(text)) {
    addError(scope, 'História de usuário fora do padrão (**Como**, **Eu quero**, **Para que**).');
  }

  if (!/SHALL|DEVE/.test(text)) {
    addError(scope, 'Ausência de critérios normativos restritos (SHALL / DEVE).');
  }
}

function validateFeatureTasks(featureName, featureDir) {
  const scope = `.specs/features/${featureName}/tasks.md`;
  const tasksPath = path.join(featureDir, 'tasks.md');

  if (!fs.existsSync(tasksPath)) {
    addError(scope, 'Arquivo tasks.md ausente.');
    return;
  }

  const text = fs.readFileSync(tasksPath, 'utf8');

  for (const { label, pattern } of REQUIRED_TASKS_SECTIONS) {
    const rx = new RegExp(`^#{1,3}\\s+.*${pattern.source}.*$`, 'm');
    if (!rx.test(text)) {
      addError(scope, `Seção obrigatória ausente: "${label}"`);
    }
  }

  if (!/Proof:\s*run/i.test(text)) {
    addError(scope, "Verificações (Checks) devem conter instruções executáveis 'Proof: run'.");
  }
}

function validateAllFeatures() {
  const scope = '.specs/features/';
  if (!fs.existsSync(FEATURES_DIR)) {
    addError(scope, 'Diretório .specs/features ausente.');
    return;
  }

  const featureDirs = fs.readdirSync(FEATURES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^FEAT-\d{3}-.+/.test(d.name))
    .map((d) => d.name)
    .sort();

  totalFeatures = featureDirs.length;

  const missingBase = BASE_FEATURES.filter((f) => !featureDirs.includes(f));
  if (missingBase.length > 0) {
    addError(scope, `Features estruturais ausentes: ${missingBase.join(', ')}.`);
  }

  for (const dirName of featureDirs) {
    const featurePath = path.join(FEATURES_DIR, dirName);
    validateFeatureSpec(dirName, featurePath);
    validateFeatureTasks(dirName, featurePath);
  }
}

// ============================================================================
// 3. MOTOR DE EXECUÇÃO
// ============================================================================
function runValidation() {
  checkDecisionsDir();
  checkStateFile();
  validateAllFeatures();

  const durationMs = (performance.now() - START_TIME).toFixed(0);
  const passed = totalErrorsCount === 0;

  ui.header('SDD QUALITY GATE', passed ? 'APROVADO' : 'REPROVADO', !passed);
  ui.kv('Escopo', `${totalAdrs} ADRs, ${totalFeatures} Features, STATE.md`);
  ui.kv('Duração', `${durationMs} ms`);
  ui.kv(
    'Violações',
    passed
      ? `${c.green}0 encontradas${c.reset}`
      : `${c.red}${totalErrorsCount} pendência(s) em ${groupedErrors.size} arquivo(s)${c.reset}`
  );
  ui.rule();

  ui.printWarnings(warnings);

  if (passed) {
    ui.ok('Todos os artefatos estão em conformidade com os padrões SDD.');
    console.log();
    process.exit(0);
  }

  ui.printGroupedErrors(groupedErrors);
  ui.rule();
  ui.err(`Corrija as pendências acima e execute: ${c.cyan}node scripts/validate-sdd.mjs${c.reset}`);
  console.log();
  process.exit(1);
}

runValidation();
