#!/usr/bin/env node
/**
 * @fileoverview Orquestrador de Quality Gates (`scripts/gate.mjs`)
 * Executa todas as verificações determinísticas do projeto em sequência
 * e consolida o resultado operacional para ambiente local e CI.
 */

import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { c, ui } from './lib/ui.mjs';

// ============================================================================
// 1. DEFINIÇÃO DO PIPELINE
// ============================================================================
const START_TIME = performance.now();

const PIPELINE = [
  {
    id: 'sdd',
    name: 'Conformidade SDD (ADRs, STATE & Specs)',
    cmd: process.execPath,
    args: ['scripts/validate-sdd.mjs']
  },
  {
    id: 'tokens',
    name: 'Design System & Tokens CSS',
    cmd: process.execPath,
    args: ['scripts/validate-tokens.mjs']
  },
  {
    id: 'tests',
    name: 'Suíte de Testes Unitários',
    cmd: process.execPath,
    args: ['--test']
  }
];

// ============================================================================
// 2. MOTOR DE ORQUESTRAÇÃO
// ============================================================================
function runPipeline() {
  const results = [];
  let failedCount = 0;

  for (const step of PIPELINE) {
    const stepStart = performance.now();

    const proc = spawnSync(step.cmd, step.args, {
      encoding: 'utf8',
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    const durationMs = (performance.now() - stepStart).toFixed(0);
    const passed = proc.status === 0;

    if (!passed) failedCount++;

    results.push({
      ...step,
      passed,
      durationMs,
      output: [proc.stdout, proc.stderr].filter(Boolean).join('\n').trim()
    });
  }

  const totalDurationMs = (performance.now() - START_TIME).toFixed(0);
  const allPassed = failedCount === 0;

  // ==========================================================================
  // 3. RELATÓRIO CONSOLIDADO
  // ==========================================================================
  ui.header('ACORDES QUALITY GATE', allPassed ? 'APROVADO' : 'BLOQUEADO', !allPassed);
  ui.kv('Etapas', `${PIPELINE.length - failedCount}/${PIPELINE.length} aprovadas`);
  ui.kv('Duração', `${totalDurationMs} ms total`);
  ui.rule();
  console.log();

  for (const res of results) {
    const icon = res.passed ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`;
    const label = res.name.padEnd(42);
    const time = `${c.gray}${res.durationMs.padStart(5)} ms${c.reset}`;
    const badge = res.passed
      ? `${c.green}PASS${c.reset}`
      : `${c.red}${c.bold}FAIL${c.reset}`;

    console.log(`  ${icon}  ${label} ${time}   ${badge}`);
  }

  console.log();
  ui.rule();

  if (allPassed) {
    ui.ok('Pipeline concluído. Código apto para commit ou merge.');
    console.log();
    process.exit(0);
  }

  // Exibe os detalhes apenas das etapas que falharam
  const failedSteps = results.filter((r) => !r.passed);
  for (const failed of failedSteps) {
    console.log();
    console.log(`  ${c.bold}${c.red}DIAGNÓSTICO: ${failed.name.toUpperCase()}${c.reset}`);
    if (failed.output) {
      console.log(failed.output);
    }
  }

  ui.rule();
  ui.err(`${failedCount} etapa(s) falharam. Resolva as pendências acima.`);
  console.log();
  process.exit(1);
}

runPipeline();
