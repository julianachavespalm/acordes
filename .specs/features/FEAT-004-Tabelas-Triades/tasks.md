# FEAT-004-Tabelas-Triades: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas da Falsa Tabela Estilo ABNT, Silêncio Auditivo e Notas DPUB segundo o fluxo de Spec-Driven Development (SDD) e TDD estrito.

---

**Design**: [`.specs/features/FEAT-004-Tabelas-Triades/design.md`](design.md)  
**Status**: Implemented · Verified  
**Spec Owner**: Juliana Chaves Palm  
**Build**: `node scripts/validate-sdd.mjs`  
**Run unit**: `node --test tests/ui/chordList.test.js tests/ui/chapterPage.test.js`  

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| :--- | :--- | :--- | :--- | :--- |
| `src/ui/chordList.js` & `src/ui/chapterPage.js` | unit | Falsa tabela sem tags table, camada fonética, silêncio auditivo, trânsito DPUB de notas de rodapé | `tests/ui/` | `node --test tests/ui/chordList.test.js tests/ui/chapterPage.test.js` |

---

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| :--- | :--- | :--- |
| Quick | Após cada método de renderização | `node --test tests/ui/chordList.test.js` |
| Full | Validação completa de tabela e capítulo | `node --test tests/ui/` |
| Build | Após conclusão das tarefas | `node scripts/validate-sdd.mjs && node --test tests/ui/chordList.test.js tests/ui/chapterPage.test.js` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Implementação da Lista de Acordes e Notas de Rodapé

```
T1 -> T2 -> T3
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Criação dos Testes da Falsa Tabela e Acessibilidade (TDD First)
* **O que**: Escrever os testes validando ausência de tags `table`, presença de camada fonética `.sr-only`, silêncio auditivo (sem aria-live ao tocar) e suporte a notas DPUB.
* **Onde**: `tests/ui/chordList.test.js`, `tests/ui/chapterPage.test.js`
* **Depende de**: Nenhum
* **Reutiliza**: Runner nativo `node --test` e asserções `node:assert/strict`
* **Requisito**: RN-01 a RN-08 / CA-04.1 a CA-04.3
* **Concluído quando**:
  - [x] Testes cobrindo semântica e interações sonoras
* **Testes**: unit
* **Gate**: quick

---

### T2: Implementação do Controlador da Lista (`chordList.js`)
* **O que**: Implementar `renderChordMarkup` e `initChordList`, gerando lista semântica acessível com botões de disparo de áudio monofônico e polifônico.
* **Onde**: `src/ui/chordList.js`
* **Depende de**: T1
* **Reutiliza**: `musicTheory.js`
* **Requisito**: RN-01, RN-02, RN-04 a RN-07
* **Concluído quando**:
  - [x] Lista renderizada e botões de áudio configurados
* **Testes**: unit
* **Gate**: quick

---

### T3: Implementação da Página de Capítulo e Notas de Rodapé (`chapterPage.js`)
* **O que**: Implementar `renderChapterPage` e `setupFootnoteNavigation`, estruturando o grid assimétrico e o trânsito bidirecional de foco para doc-noteref e doc-backlink.
* **Onde**: `src/ui/chapterPage.js`
* **Depende de**: T2
* **Reutiliza**: `chordList.js`
* **Requisito**: RN-03, RN-08
* **Concluído quando**:
  - [x] Todos os testes de renderização de capítulo e notas DPUB aprovados
  - [x] Gate de build aprovado: `node scripts/validate-sdd.mjs && node --test tests/ui/chordList.test.js tests/ui/chapterPage.test.js`
* **Testes**: unit
* **Gate**: build

---

## Verificações (Checks)

**C1** - Ausência rigorosa de tags de tabela (table, tr, td, th)  
Proof: run unit | ok 1 - renderChordMarkup não deve conter nenhuma tag de tabela (table, tr, td, th) (RN-01 / CA-04.1)

**C2** - Camada fonética descritiva e ausência de ruído vocálico  
Proof: run unit | ok 2 - renderChordMarkup deve conter camada fonética e aria-label direto sem expressões Tocar nota (RN-05 / CA-04.3)

**C3** - Renderização e navegação bidirecional de notas de rodapé DPUB  
Proof: run unit | ok 2 - setupFootnoteNavigation deve gerenciar trânsito bidirecional de foco entre noteref e doc-backlink

---

## Transição (Handoff)

**Resolvido durante o build:** Falsa tabela ABNT perfeitamente acessível, sem ruído de tabela para pessoas cegas e com audiodescrição precisa.  
**Despachado:** Integrado ao roteador SPA para renderização de todos os 4 capítulos.  
**Auditado:** Suíte de testes passando com 100% de sucesso.
