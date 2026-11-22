# FEAT-002-Audio-Player: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas do Audio Player de Piano Acústico segundo o fluxo de Spec-Driven Development (SDD) e TDD estrito.

---

**Design**: [`.specs/features/FEAT-002-Audio-Player/design.md`](design.md)  
**Status**: Implemented · Verified  
**Spec Owner**: Juliana Chaves Palm  
**Build**: `node scripts/validate-sdd.mjs`  
**Run unit**: `node --test tests/audio/soundEngine.test.js`  

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| :--- | :--- | :--- | :--- | :--- |
| `src/audio/soundEngine.js` | unit | Reprodução monofônica, polifonia sincronizada de 3 notas, interrupção via stopAll e tratamento defensivo | `tests/audio/` | `node --test tests/audio/soundEngine.test.js` |

---

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| :--- | :--- | :--- |
| Quick | Após cada método do engine | `node --test tests/audio/soundEngine.test.js` |
| Full | Validação de áudio completa | `node --test tests/audio/` |
| Build | Após conclusão das tarefas de áudio | `node scripts/validate-sdd.mjs && node --test tests/audio/soundEngine.test.js` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Implementação e Verificação do Áudio

```
T1 -> T2
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Criação da Suíte de Testes do Sound Engine (TDD First)
* **O que**: Escrever a suíte de testes com injeção controlada de fábrica `audioFactory`, validando reprodução de amostra acústica monofônica, polifonia sincronizada de tríade, interrupção e reset limpo com `stopAll` e proteção contra chamadas vazias.
* **Onde**: `tests/audio/soundEngine.test.js`
* **Depende de**: Nenhum
* **Reutiliza**: Runner nativo `node --test` e asserções `node:assert/strict`
* **Requisito**: RN-01, RN-02, RN-03, RN-04, RN-05 / CA-02.1, CA-02.2, CA-02.3
* **Concluído quando**:
  - [x] Testes estruturados e validando contratos de reprodução com `MockAudio`
* **Testes**: unit
* **Gate**: quick

---

### T2: Implementação do Módulo Sound Engine (`soundEngine.js`)
* **O que**: Implementar o motor de execução sonora com suporte a reprodução de arquivos `.mp3` em `public/tunes/`, caminhos relativos e método `stopAll()`.
* **Onde**: `src/audio/soundEngine.js`
* **Depende de**: T1
* **Reutiliza**: Amostras gravadas em `public/tunes/`
* **Requisito**: RN-01 a RN-05 / EC-02.1
* **Concluído quando**:
  - [x] Todos os testes unitários passando em verde
  - [x] Gate de build aprovado: `node scripts/validate-sdd.mjs && node --test tests/audio/soundEngine.test.js`
* **Testes**: unit
* **Gate**: build

---

## Verificações (Checks)

**C1** - Reprodução de nota isolada com amostra real de piano  
Proof: run unit | ok 1 - deve tocar nota isolada com a amostra real de piano em public/tunes (RN-02 / CA-02.1)

**C2** - Reprodução polifônica simultânea de 3 notas de piano  
Proof: run unit | ok 2 - deve tocar tríade polifônica com 3 amostras simultâneas de piano (RN-03 / CA-02.2)

**C3** - Interrupção e reset de amostras anteriores via stopAll  
Proof: run unit | ok 3 - deve interromper e resetar amostras anteriores ao acionar stopAll (RN-04, RN-05 / CA-02.3)

**C4** - Tratamento defensivo contra listas vazias ou nulas  
Proof: run unit | ok 4 - deve ignorar com segurança chamadas com listas vazias ou nulas (EC-02.1)

---

## Transição (Handoff)

**Resolvido durante o build:** Motor de áudio de piano acústico desacoplado, sem artefatos sintéticos e com latência imperceptível.  
**Despachado:** Integrado aos controladores de interface e pronto para execução no GitHub Pages.  
**Auditado:** 100% de aprovação nos testes determinísticos do Node.js.
