# FEAT-007-Arquitetura-SPA-e-Refatoracao: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar a Arquitetura SPA Consolidada com Roteamento por Hash, Eliminação de Legado e Isolamento de Domínio segundo o fluxo de Spec-Driven Development (SDD).

---

**Design**: [`.specs/features/FEAT-007-Arquitetura-SPA-e-Refatoracao/design.md`](design.md)  
**Status**: **Approved**: 2026-11-16 - user: "perfeito, quero refatorar o código para implementar essa nova arquitetura. Importante, as alterações que fizemos está na raiz do projeto, não em pastas. então, cuidado."  
**Spec Owner**: Juliana Chaves Palm (Software Engineer & Solution Designer)  
**Build**: `node scripts/validate-sdd.mjs`  
**Run unit**: `node --test tests/ui/main.test.js`  

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| :--- | :--- | :--- | :--- | :--- |
| `src/main.js` | unit / DOM | Roteador por hash, fallback para #/, anunciador aria-live, sincronização de aria-current e foco | `tests/ui/` | `node --test tests/ui/main.test.js` |
| `src/domain/*` | unit puro | 84 tríades normativas, cálculo de frequências Hz e fonética sem DOM | `tests/core/` | `node --test tests/core/musicTheory.test.js` |
| `src/ui/*` | unit / DOM | Falsa tabela ABNT, notas DPUB bidirecionais e shell de navegação | `tests/ui/` | `node --test tests/ui/` |
| `src/styles/*` | tokens / a11y | 4 camadas CSS sem valores hardcoded e conformidade WCAG AAA | `tests/ui/` | `node scripts/validate-tokens.mjs` |

---

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| :--- | :--- | :--- |
| Quick | Após alterações no roteador | `node --test tests/ui/main.test.js` |
| Full | Validação de toda a suíte de testes | `node --test` |
| Build | Validação integrada de governança e código | `node scripts/validate-sdd.mjs && node scripts/validate-tokens.mjs && node --test` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Domínio e Áudio Isolados
```
T1 -> T2 -> T3
```

### Fase 2: Design System e Componentes UI
```
T4 -> T5
```

### Fase 3: Roteador SPA e Casca Única
```
T6 -> T7 -> T8
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Migração dos Assets de Áudio Exatos para `public/tunes/`
* **O que**: Copiar estritamente as 26 amostras existentes (`28.mp3` a `53.mp3`) para `public/tunes/`.
* **Onde**: `public/tunes/`
* **Concluído quando**:
  - [x] Diretório `public/tunes/` contém exatamente 26 arquivos MP3
* **Gate**: `node -e "assert(fs.readdirSync('public/tunes').length === 26)"`

### T2: Implementar Camada de Domínio Puro (`src/domain/`)
* **O que**: Criar `triadsData.js`, `phonetics.js` e `tuning.js` sem dependências de DOM.
* **Onde**: `src/domain/`
* **Concluído quando**:
  - [x] Módulos de domínio puros exportados com `Object.freeze`
* **Gate**: `node --test tests/core/musicTheory.test.js`

### T3: Atualizar Motor de Áudio (`src/audio/soundEngine.js`)
* **O que**: Atualizar caminho base para `./public/tunes/` e garantir silêncio auditivo.
* **Onde**: `src/audio/soundEngine.js`
* **Concluído quando**:
  - [x] Testes de áudio aprovados
* **Gate**: `node --test tests/audio/soundEngine.test.js`

### T4: Consolidar Design System em `src/styles/`
* **O que**: Consolidar `tokens.css`, `base.css`, `layout.css` e `components.css`.
* **Onde**: `src/styles/`
* **Concluído quando**:
  - [x] 4 camadas CSS normativas aprovadas pelo validador de tokens
* **Gate**: `node scripts/validate-tokens.mjs`

### T5: Implementar Componentes de UI e Acessibilidade (`src/ui/`)
* **O que**: Atualizar `shell.js`, `chordList.js` e `chapterPage.js` com suporte a hash e notas DPUB.
* **Onde**: `src/ui/`
* **Concluído quando**:
  - [x] Suítes de UI passando com foco e WCAG 2.1 AAA
* **Gate**: `node --test tests/ui/chordList.test.js tests/ui/chapterPage.test.js`

### T6: Implementar Bootstrap e Hash Router (`src/main.js`)
* **O que**: Criar `src/main.js` com roteamento SPA por hash e `#route-announcer`.
* **Onde**: `src/main.js`
* **Concluído quando**:
  - [x] Roteador SPA por hash testado e validado
* **Gate**: `node --test tests/ui/main.test.js`

### T7: Consolidar `index.html` como Casca Única SPA
* **O que**: Estruturar `index.html` com container `#app` e import de `src/main.js`.
* **Onde**: `index.html`
* **Concluído quando**:
  - [x] Shell único pré-renderizado e funcional
* **Gate**: `node --test tests/ui/home.test.js`

### T8: Remoção Completa de Código Legado Morto
* **O que**: Excluir páginas duplicadas na raiz e pastas legadas mortas.
* **Onde**: Raiz do projeto
* **Concluído quando**:
  - [x] `piano-virtual.html` e HTMLs duplicados excluídos
* **Gate**: `node scripts/validate-sdd.mjs`

---

## Verificações (Checks)

**C1** - Roteador SPA por Hash normaliza rotas e anuncia mudanças de tela  
Proof: run unit | ✔ FEAT-007: handleRouteChange deve renderizar a Home para rota #/ e anunciar em aria-live

**C2** - Sincronização dinâmica de aria-current conforme o capítulo ativo  
Proof: run unit | ✔ FEAT-007: handleRouteChange deve renderizar o capitulo de acordes para rota #/maiores

**C3** - Preservação das notas de rodapé DPUB no capítulo de acordes aumentados  
Proof: run unit | ✔ FEAT-007: handleRouteChange deve renderizar notas de rodape DPUB no capitulo #/aumentados

---

## Transição (Handoff)

**Resolvido durante o build:** Transição completa para SPA única com roteamento por hash imune a 404 no GitHub Pages, anunciador de acessibilidade aria-live, domínio puro desacoplado de DOM e eliminação total de arquivos legados mortos.  
**Despachado:** Pronto para homologação em produção.  
**Auditado:** Validado deterministamente via `npm run verify`.
