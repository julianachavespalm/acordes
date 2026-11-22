#!/usr/bin/env node
/**
 * @fileoverview Native Static HTTP Server (`scripts/serve.mjs`)
 * Serves local assets for manual testing and homologation.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { c, ui } from './lib/ui.mjs';

// ============================================================================
// 1. CONFIGURATION & CONSTANTS
// ============================================================================
const START_TIME = performance.now();
const APP_NAME = 'ACORDES';
const APP_VERSION = '2.0.0';
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || 'localhost';
const ROOT = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

// ============================================================================
// 2. HTTP SERVER ENGINE
// ============================================================================
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  let filePath = path.resolve(ROOT, `.${urlPath === '/' ? '/index.html' : urlPath}`);

  // Prevent Directory Traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // Resolve directory index
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Handle 404
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  // Stream asset
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  });
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  fs.createReadStream(filePath).pipe(res);
});

// ============================================================================
// 3. STARTUP & ERROR HANDLING
// ============================================================================
server.on('error', (err) => {
  ui.header(`${APP_NAME} v${APP_VERSION}`, 'FALHA NA INICIALIZAÇÃO', true);

  if (err.code === 'EADDRINUSE') {
    ui.kv('Causa', `A porta ${PORT} já está alocada por outro processo.`);
    ui.kv('Ação', `Encerre o processo ativo ou execute: ${c.cyan}PORT=${PORT + 1} npm start${c.reset}`);
  } else {
    ui.kv('Código', err.code || 'INTERNAL_ERROR');
    ui.kv('Detalhe', err.message);
  }

  ui.rule();
  console.log();
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const bootMs = (performance.now() - START_TIME).toFixed(0);
  const relativeRoot = path.basename(ROOT);

  ui.header(`${APP_NAME} v${APP_VERSION}`, 'SERVIDOR HTTP ESTÁTICO');
  ui.kv('Endereço', `${c.cyan}${c.bold}http://${HOST}:${PORT}/${c.reset}`);
  ui.kv('Diretório', `./${relativeRoot}`);
  ui.kv('Ambiente', 'Homologação');
  ui.kv('Startup', `${bootMs} ms`);
  ui.rule();
  console.log(`  ${c.dim}Pressione ${c.reset}Q${c.dim} ou ${c.reset}Ctrl+C${c.dim} para encerrar.${c.reset}`);
  console.log();
});

// ============================================================================
// 4. GRACEFUL SHUTDOWN
// ============================================================================
let isShuttingDown = false;
let isClosed = false;

const finalizeExit = () => {
  if (isClosed) return;
  isClosed = true;
  ui.ok(`Porta ${PORT} liberada. Processo finalizado.`);
  console.log();
  process.exit(0);
};

const shutdown = (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
    process.stdin.pause();
  }

  process.stdout.write('\r\x1b[K');
  ui.info(`Encerrando servidor (${signal})...`);

  server.close(finalizeExit);
  setTimeout(finalizeExit, 300).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (key) => {
    if (key === '\u0003') shutdown('Ctrl+C');
    if (key.toLowerCase() === 'q') shutdown('Tecla Q');
  });
}
