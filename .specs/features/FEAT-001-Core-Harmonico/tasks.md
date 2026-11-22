# FEAT-001-Core-Harmonico: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas do Core Harmônico segundo o fluxo de Spec-Driven Development (SDD) e TDD estrito.

---

**Design**: [`.specs/features/FEAT-001-Core-Harmonico/design.md`](design.md)  
**Status**: Implemented · Verified  
**Spec Owner**: Juliana Chaves Palm  
**Build**: `node scripts/validate-sdd.mjs`  
**Run unit**: `node --test tests/core/musicTheory.test.js`  

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| :--- | :--- | :--- | :--- | :--- |
| `src/domain/triadsData.js` & `musicTheory.js` | unit | 100% dos ramos de cálculo intervalar, enarmonias das 4 categorias de tríades e casos de borda | `tests/core/` | `node --test tests/core/musicTheory.test.js` |

---

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| :--- | :--- | :--- |
| Quick | Após cada função de cálculo intervalar | `node --test tests/core/musicTheory.test.js` |
| Full | Após conclusão dos testes de enarmonia | `node --test tests/core/` |
| Build | Após conclusão das tarefas do Core Harmônico | `node scripts/validate-sdd.mjs && node --test tests/core/musicTheory.test.js` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Fundação de Domínio e Testes Unitários

```
T1 -> T2 -> T3
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Criação da Suíte de Testes Unitários de Harmonia (TDD First)
* **O que**: Escrever a suíte de testes unitários cobrindo as 4 categorias de tríades, cálculo de semitons, notas ordenadas e enarmonia estrita.
* **Onde**: `tests/core/musicTheory.test.js`
* **Depende de**: Nenhum
* **Reutiliza**: Runner nativo `node --test` e asserções `node:assert/strict`
* **Requisito**: RN-01, RN-02, RN-03, RN-04 / CA-01.1, CA-01.2, CA-01.3
* **Concluído quando**:
  - [x] Testes unitários escritos e falhando de forma limpa antes da implementação (Red)
* **Testes**: unit
* **Gate**: quick

---

### T2: Implementação do Dicionário Normativo de Tríades (`triadsData.js`)
* **O que**: Definir o catálogo imutável congelado (`Object.freeze`) contendo as 21 tríades para cada uma das 4 categorias (*Maiores, Menores, Diminutas, Aumentadas*) com enarmonia precisa e mapeamento para as amostras de áudio.
* **Onde**: `src/domain/triadsData.js`
* **Depende de**: T1
* **Reutiliza**: Nomes e cifras consolidados da pesquisa musical
* **Requisito**: RN-01, RN-03, RN-04
* **Concluído quando**:
  - [x] Objeto `TRIAD_DEFINITIONS` exportado e congelado com 84 tríades
* **Testes**: unit
* **Gate**: quick

---

### T3: Implementação dos Métodos de Consulta e Validação (`musicTheory.js`)
* **O que**: Implementar as funções puras `getTriadCategory()`, `getTriadChords()`, `getChordById()` e `calculateNoteFrequency()`, garantindo passagem em 100% dos testes.
* **Onde**: `src/domain/musicTheory.js`
* **Depende de**: T2
* **Reutiliza**: `triadsData.js`
* **Requisito**: RN-02, RN-03 / EC-01.1
* **Concluído quando**:
  - [x] Todos os testes unitários passando em verde (Green)
  - [x] Gate de build executando com sucesso: `node scripts/validate-sdd.mjs && node --test tests/core/musicTheory.test.js`
* **Testes**: unit
* **Gate**: build

---

## Verificações (Checks)

**C1** - Consulta correta das 4 categorias de tríades e fórmulas intervalares normativas  
Proof: run unit | ok 1 - deve conter as 4 categorias normativas de tríades

**C2** - Preservação estrita de enarmonias para tríades com bemol e sustenido  
Proof: run unit | ok 4 - deve preservar enarmonias rigorosas para tríades com bemol e sustenido (CA-01.2)

**C3** - Resiliência e tratamento defensivo para categorias ou IDs inexistentes  
Proof: run unit | ok 6 - deve tratar categorias ou identificadores inválidos com segurança (EC-01.1)

---

## Transição (Handoff)

**Resolvido durante o build:** Core de harmonia musical modularizado em ES6 nativo com cobertura 100% de testes unitários.  
**Despachado:** Pronto para consumo pelo Audio Player e pelos Controladores de Interface.  
**Auditado:** Verificado deterministamente via `node --test`.
