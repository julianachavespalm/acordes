# FEAT-010-Piano-Virtual: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar a aba **Piano Virtual (`#/piano`)** em tarefas atômicas seguindo TDD estrito, ADR-012 e o gate determinístico do projeto (`npm run gate`).

---

**Design**: [`.specs/features/FEAT-010-Piano-Virtual/design.md`](design.md)  
**Status**: Approved · In Implementation  
**Approved**: 2026-11-22 - user: "aprovado."  
**Spec Owner**: Juliana Chaves Palm (Software Engineer & Solution Designer)  
**Build**: `node scripts/gate.mjs`  
**Run unit**: `node --test tests/core/musicTheory.test.js tests/audio/soundEngine.test.js tests/ui/pianoPage.test.js tests/ui/shell.test.js tests/ui/main.test.js`  

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| :--- | :--- | :--- | :--- | :--- |
| `src/domain/musicTheory.js` | unit | Reconhecimento de tríades maiores, menores, diminutas, aumentadas e conjuntos inválidos | `tests/core/` | `node --test tests/core/musicTheory.test.js` |
| `src/audio/soundEngine.js` | unit | Polifonia aditiva com `triggerNote` sem cortar notas ativas, usando pool de `.mp3` reais | `tests/audio/` | `node --test tests/audio/soundEngine.test.js` |
| `src/ui/pianoPage.js` | unit / DOM | Renderização das 25 teclas, multitouch por `pointerId`, modo `Fixar notas`, atalhos físicos e `teardown` | `tests/ui/` | `node --test tests/ui/pianoPage.test.js` |
| `src/ui/shell.js` & `src/main.js` | unit / DOM | Novo item `Piano Virtual` no menu, rota `#/piano` e desmontagem limpa | `tests/ui/` | `node --test tests/ui/shell.test.js tests/ui/main.test.js` |
| `src/styles/*` | unit / tokens | `border-radius: 0`, `touch-action: none` apenas no teclado, regras landscape/portrait e tokens `--ds-*` | `tests/ui/` | `node scripts/validate-tokens.mjs` |

---

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| :--- | :--- | :--- |
| Quick | Após cada tarefa individual | `node --test tests/ui/pianoPage.test.js` |
| Full | Validação completa da suíte unitária | `node --test` |
| Build | Validação integrada (SDD + Tokens + Testes) | `node scripts/gate.mjs` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Domínio e Motor de Áudio Polifônico
```
T1 -> T2
```

### Fase 2: Componente Piano Virtual e Estilos Suíços
```
T3 -> T4
```

### Fase 3: Integração na SPA e Validação Completa
```
T5 -> T6
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Reconhecimento Puro de Tríades no Domínio (`identifyTriadFromMidis`)
* **O que**: Implementar `identifyTriadFromMidis(midiNotes)` em `src/domain/musicTheory.js` para identificar tríades normativas a partir de 3 notas MIDI distintas (módulo 12), priorizando a fundamental mais grave.
* **Onde**: `src/domain/musicTheory.js`, `tests/core/musicTheory.test.js`
* **Depende de**: Nenhum
* **Reutiliza**: `TRIAD_DEFINITIONS`
* **Requisito**: RN-07 / CA-10.1
* **Concluído quando**:
  - [ ] Testes cobrem reconhecimento de tríade maior, menor, diminuta, aumentada e retorno vazio para menos de 3 classes distintas
* **Testes**: unit
* **Gate**: quick

---

### T2: Disparo Polifônico Aditivo (`triggerNote`) no `soundEngine.js`
* **O que**: Adicionar `triggerNote(identifier)` em `src/audio/soundEngine.js` para tocar amostras `.mp3` reais simultaneamente sem invocar `stopAll()`, preservando o pool de até 26 instâncias e notificando `onPlay` para o osciloscópio.
* **Onde**: `src/audio/soundEngine.js`, `tests/audio/soundEngine.test.js`
* **Depende de**: T1
* **Reutiliza**: `sampleMapper.js`, `audioPool`
* **Requisito**: RN-02 / CA-10.2
* **Concluído quando**:
  - [ ] Teste unitário prova que chamadas sucessivas a `triggerNote(60)` e `triggerNote(64)` mantêm ambas as amostras tocando simultaneamente
* **Testes**: unit
* **Gate**: quick

---

### T3: Módulo de Interface `src/ui/pianoPage.js` (Multitouch, `Fixar notas` e Teclado Físico)
* **O que**: Criar `src/ui/pianoPage.js` com `PIANO_KEYS` (25 teclas, MIDI 60–84) e `renderPianoPage(soundEngine, mountElement)` suportando multitouch por `pointerId`, toggle `Fixar notas` (`Tocar juntas` / `Limpar`), atalhos de teclado físico no desktop, exibição automática de tríades reconhecidas e retorno de `teardown()` via `AbortController`.
* **Onde**: `src/ui/pianoPage.js`, `tests/ui/pianoPage.test.js`
* **Depende de**: T1, T2
* **Reutiliza**: `identifyTriadFromMidis`, `soundEngine.triggerNote`, `soundEngine.playChord`
* **Requisito**: RN-02, RN-03, RN-05, RN-06, RN-07 / CA-10.3, CA-10.4, CA-10.5
* **Concluído quando**:
  - [ ] Testes validam multitouch simultâneo com 3 `pointerId` distintos, modo `Fixar notas`, atalhos de teclado físico e cancelamento de listeners no `teardown()`
* **Testes**: unit
* **Gate**: quick

---

### T4: Estilos Editoriais Suíços do Piano e Responsividade Landscape/Portrait
* **O que**: Adicionar estilos do piano em `src/styles/components.css` e `src/styles/layout.css` usando estritamente tokens `--ds-*`, `border-radius: 0`, `touch-action: none` apenas no teclado, compactação vertical para mobile landscape e aviso discreto + 1 oitava visível em mobile portrait.
* **Onde**: `src/styles/components.css`, `src/styles/layout.css`, `tests/ui/pianoPage.test.js`
* **Depende de**: T3
* **Reutiliza**: `src/styles/tokens.css`
* **Requisito**: RN-04, RN-08 / CA-10.6
* **Concluído quando**:
  - [ ] `node scripts/validate-tokens.mjs` passa com 0 violações
  - [ ] Testes confirmam ausência de `border-radius` arredondado, presença de `touch-action: none` no teclado e regras de portrait/landscape
* **Testes**: unit / tokens
* **Gate**: quick

---

### T5: Integração da Rota `#/piano` e Item `Piano Virtual` no Shell e `index.html`
* **O que**: Registrar `Piano Virtual` (`#/piano`) em `NAV_ITEMS` (`src/ui/shell.js`), `index.html` e `ROUTES` (`src/main.js`), garantindo anúncio em `aria-live`, foco no título e execução de `teardown` na troca de rota.
* **Onde**: `index.html`, `src/ui/shell.js`, `src/main.js`, `tests/ui/shell.test.js`, `tests/ui/main.test.js`
* **Depende de**: T3, T4
* **Reutiliza**: `syncActiveNavigation`, `handleRouteChange`
* **Requisito**: RN-01 / CA-10.5
* **Concluído quando**:
  - [ ] Testes validam navegação para `#/piano`, `aria-current="page"` e limpeza ao retornar para `#/`
* **Testes**: unit
* **Gate**: full

---

### T6: Validação Integrada do Gate e Revisão Final
* **O que**: Executar `node scripts/gate.mjs` validando SDD, tokens CSS e toda a suíte unitária sem regressões.
* **Onde**: Projeto completo
* **Depende de**: T5
* **Reutiliza**: `scripts/gate.mjs`
* **Requisito**: Todos (RN-01 a RN-08)
* **Concluído quando**:
  - [ ] `npm run gate` retorna 3/3 etapas aprovadas
* **Testes**: full
* **Gate**: build

---

## Verificações (Checks)

- **CA-10.1**: `identifyTriadFromMidis` identifica tríades do domínio a partir de MIDIs puros.  
  Proof: run unit | deve identificar triades normativas a partir de notas MIDI
- **CA-10.2**: `soundEngine.triggerNote` executa polifonia aditiva com `.mp3` reais sem cortar notas ativas.  
  Proof: run unit | deve tocar notas simultaneas sem corte via triggerNote
- **CA-10.3**: Multitouch rastreia múltiplos `pointerId` simultaneamente e exibe tríade reconhecida.  
  Proof: run unit | deve suportar multitouch simultaneo por pointerId e reconhecer triade
- **CA-10.4**: Modo `Fixar notas` marca teclas, toca acorde junto e limpa seleção.  
  Proof: run unit | deve fixar notas, tocar acorde conjunto e limpar selecao
- **CA-10.5**: Teclado físico dispara notas e `teardown` cancela ouvintes ao trocar de rota.  
  Proof: run unit | deve mapear teclado fisico e cancelar listeners no teardown
- **CA-10.6**: Estilos do piano respeitam tokens `--ds-*`, `border-radius: 0` e regras de orientação.  
  Proof: run unit | deve estilizar piano com tokens suicos, touch-action e adaptacao de orientacao
