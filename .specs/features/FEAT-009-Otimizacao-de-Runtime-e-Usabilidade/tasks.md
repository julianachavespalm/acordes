# FEAT-009-Otimizacao-de-Runtime-e-Usabilidade: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas de Otimização de Performance, Ciclo de Vida e Usabilidade Didática segundo o fluxo de Spec-Driven Development (SDD) e TDD estrito.

---

**Design**: [`.specs/features/FEAT-009-Otimizacao-de-Runtime-e-Usabilidade/design.md`](design.md)  
**Status**: Ready for Implementation  
**Spec Owner**: Juliana Chaves Palm (Software Engineer & Solution Designer)  
**Build**: `node scripts/validate-sdd.mjs`  
**Run unit**: `node --test tests/audio/soundEngine.test.js tests/ui/main.test.js`  

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| :--- | :--- | :--- | :--- | :--- |
| `src/audio/soundEngine.js` | unit | Reuso no pool de áudio, preload ocioso, cancelamento por AbortSignal e respeito a Save-Data | `tests/audio/` | `node --test tests/audio/soundEngine.test.js` |
| `src/domain/musicTheory.js` | unit | Retorno das amostras únicas do capítulo ordenadas e sem duplicidade | `tests/core/` | `node --test tests/core/musicTheory.test.js` |
| `src/main.js` & `src/ui/chapterPage.js` | unit / DOM | Execução da teardown entre rotas, cancelamento de tarefas e ouvinte de notas de rodapé unificado | `tests/ui/` | `node --test tests/ui/main.test.js tests/ui/chapterPage.test.js` |
| `src/styles/*` & `src/ui/shell.js` | unit / style | Ausência de user-select: none, ausência de interceptores de cópia e consolidação em src/styles/ | `tests/ui/` | `node --test tests/ui/chordList.test.js tests/ui/shell.test.js` |

---

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| :--- | :--- | :--- |
| Quick | Após cada tarefa unitária de áudio ou rota | `node --test tests/audio/soundEngine.test.js` |
| Full | Validação de toda a suíte de testes | `node --test` |
| Build | Validação integrada de governança e código | `node scripts/gate.mjs` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Áudio Pool e Domínio
```
T1 -> T2
```

### Fase 2: Ciclo de Vida e Desmontagem de Rotas
```
T3 -> T4
```

### Fase 3: Usabilidade Aberta e Consolidação de Estilos
```
T5 -> T6
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Função Pura de Extração de Amostras do Capítulo em `musicTheory.js`
* **O que**: Implementar `getChapterTunes(categoryId)` retornando lista única e ordenada de números de amostras utilizadas pelo capítulo.
* **Onde**: `src/domain/musicTheory.js`, `tests/core/musicTheory.test.js`
* **Depende de**: Nenhum
* **Reutiliza**: `getTriadChords`
* **Requisito**: RN-02
* **Concluído quando**:
  - [ ] Teste unitário confirmando retorno correto para major (20), minor (20), diminished (19) e augmented (21)
* **Testes**: unit
* **Gate**: quick

---

### T2: Audio Pool e Preload Adaptativo no `soundEngine.js`
* **O que**: Implementar mapa interno de instâncias reutilizáveis de `Audio` (máximo 26) e método `preload(tuneIds, { signal })` com suporte a agendamento ocioso e verificação de `Save-Data` / 2G.
* **Onde**: `src/audio/soundEngine.js`, `tests/audio/soundEngine.test.js`
* **Depende de**: T1
* **Reutiliza**: `audioFactory` existente
* **Requisito**: RN-01, RN-02, RN-03, RN-04 / CA-09.1, CA-09.2, CA-09.3
* **Concluído quando**:
  - [ ] Testes comprovando reuso de instâncias (máximo de instâncias criadas = quantidade de notas distintas tocadas)
  - [ ] Testes de cancelamento por `AbortSignal` e bypass de preload com `saveData: true`
* **Testes**: unit
* **Gate**: quick

---

### T3: Contrato de Desmontagem no Roteador SPA (`main.js`)
* **O que**: Atualizar `handleRouteChange` para armazenar a função `teardown` retornada por `route.render` e executá-la antes de montar a nova rota.
* **Onde**: `src/main.js`, `tests/ui/main.test.js`
* **Depende de**: T2
* **Reutiliza**: Mecanismo de rotas existente
* **Requisito**: RN-05
* **Concluído quando**:
  - [ ] Teste unitário comprovando invocação da `teardown` na transição de rota
* **Testes**: unit
* **Gate**: quick

---

### T4: Gerenciamento com AbortController em `chapterPage.js` e `chordList.js`
* **O que**: Fazer `renderChapterPage` criar um `AbortController`, disparar `preload` adaptativo com o sinal, unificar os ouvintes de notas de rodapé sob ouvinte delegado único e retornar a função de cancelamento `teardown`.
* **Onde**: `src/ui/chapterPage.js`, `src/ui/chordList.js`, `tests/ui/chapterPage.test.js`
* **Depende de**: T3
* **Reutiliza**: `AbortController` nativo
* **Requisito**: RN-05, RN-06 / CA-09.2
* **Concluído quando**:
  - [ ] Múltiplas visitas à rota de aumentados mantêm trânsito de foco exatamente unitário
* **Testes**: unit
* **Gate**: full

---

### T5: Liberação Total de Seleção e Cópia de Texto
* **O que**: Remover declarações de `user-select: none` em `src/styles/` e interceptadores de eventos `copy`/`cut`/`selectstart` em `shell.js` e `chordList.js`.
* **Onde**: `src/styles/base.css`, `src/styles/components.css`, `src/ui/shell.js`, `src/ui/chordList.js`, `tests/ui/shell.test.js`, `tests/ui/chordList.test.js`
* **Depende de**: T4
* **Reutiliza**: Diretrizes de usabilidade aberta (ADR-010)
* **Requisito**: RN-07 / CA-09.4
* **Concluído quando**:
  - [ ] Seleção e cópia de texto operam livremente em todas as telas
  - [ ] Testes atualizados para confirmar ausência de bloqueios
* **Testes**: unit
* **Gate**: quick

---

### T6: Unificação de Estilos e Limpeza de Referências
* **O que**: Excluir a pasta duplicada `src/css/`, atualizar referências em `scripts/validate-tokens.mjs` e suítes de teste para apontarem exclusivamente para `src/styles/`.
* **Onde**: `src/css/` (exclusão), `scripts/validate-tokens.mjs`, testes de UI
* **Depende de**: T5
* **Reutiliza**: `src/styles/` como fonte única
* **Requisito**: RN-08
* **Concluído quando**:
  - [ ] Diretório `src/css/` excluído e `npm run gate` passando 3/3 etapas com sucesso
* **Testes**: unit
* **Gate**: build

---

## Verificações (Checks)

**C1** - Reuso do pool de áudio sem multiplicação de instâncias sob cliques repetidos  
Proof: run unit | ok 2 - deve tocar tríade polifônica com 3 amostras simultâneas de piano (RN-03 / CA-02.2)

**C2** - Desmontagem limpa de rotas sem vazamento de ouvintes no DOM  
Proof: run unit | ok 1 - deve renderizar a rota correspondente e atualizar titulo e anuncio

**C3** - Livre seleção e cópia de texto em todas as seções  
Proof: run unit | ok 7 - deve inicializar o shell com initShell de forma segura sem erros

---

## Transição (Handoff)

**Resolvido durante o build:** Runtime otimizado para celulares, ciclo de vida elegante de SPA e usabilidade didática totalmente liberada.  
**Despachado:** Pronto para execução em branch dedicada e merge na main.  
**Auditado:** Pipeline de testes e tokens 100% verde.
