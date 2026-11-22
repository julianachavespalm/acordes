/**
 * @fileoverview Utilitários de interface de linha de comando (`scripts/lib/ui.mjs`)
 * Padroniza tipografia, cores ANSI, cabeçalhos e relatórios de auditoria.
 */

export const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const LINE_WIDTH = 64;

export const ui = {
  rule: () => console.log(`${c.gray}${'─'.repeat(LINE_WIDTH)}${c.reset}`),

  header: (title, statusText, isError = false) => {
    const badgeColor = isError ? c.red : c.green;
    console.log();
    console.log(`  ${c.bold}${title}${c.reset}  ${c.dim}│${c.reset}  ${badgeColor}${c.bold}${statusText}${c.reset}`);
    ui.rule();
  },

  kv: (key, val) => console.log(`  ${c.gray}${key.padEnd(11)}${c.reset} ${val}`),

  ok: (msg) => console.log(`  ${c.green}✓${c.reset} ${msg}`),
  err: (msg) => console.error(`  ${c.red}✗${c.reset} ${msg}`),
  warn: (msg) => console.warn(`  ${c.yellow}!${c.reset} ${msg}`),
  info: (msg) => console.log(`  ${c.cyan}●${c.reset} ${msg}`),

  printGroupedErrors: (groupedMap) => {
    console.log();
    for (const [scope, messages] of groupedMap.entries()) {
      console.log(`  ${c.bold}${c.cyan}${scope}${c.reset}`);
      for (const msg of messages) {
        console.log(`    ${c.red}•${c.reset} ${msg}`);
      }
      console.log();
    }
  },

  printWarnings: (warnings) => {
    if (!warnings || warnings.length === 0) return;
    console.log();
    for (const msg of warnings) {
      ui.warn(`${c.yellow}${msg}${c.reset}`);
    }
  }
};
