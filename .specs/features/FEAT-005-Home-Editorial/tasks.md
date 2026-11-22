# FEAT-005-Home-Editorial: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas da Home Editorial segundo o fluxo de Spec-Driven Development (SDD) e TDD estrito.

---

**Design**: [`.specs/features/FEAT-005-Home-Editorial/design.md`](design.md)  
**Status**: Implemented · Verified  
**Spec Owner**: Juliana Chaves Palm  
**Build**: `node scripts/validate-sdd.mjs`  
**Run unit**: `node --test tests/ui/home.test.js`  

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| :--- | :--- | :--- | :--- | :--- |
| `src/ui/homePage.js` | unit | Renderização da capa editorial, estrutura de títulos e parágrafos contidos a 65ch | `tests/ui/` | `node --test tests/ui/home.test.js` |

---

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| :--- | :--- | :--- |
| Quick | Após renderização da Home | `node --test tests/ui/home.test.js` |
| Full | Validação de interface completa | `node --test tests/ui/` |
| Build | Após conclusão das tarefas da Home | `node scripts/validate-sdd.mjs && node --test tests/ui/home.test.js` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Implementação da Capa Editorial

```
T1 -> T2
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Criação dos Testes da Home Editorial (TDD First)
* **O que**: Escrever os testes cobrindo a renderização do título `h1`, subtítulos hero e parágrafos explicativos.
* **Onde**: `tests/ui/home.test.js`
* **Depende de**: Nenhum
* **Reutiliza**: Runner nativo `node --test` e asserções `node:assert/strict`
* **Requisito**: RN-01 a RN-04 / CA-05.1, CA-05.2
* **Concluído quando**:
  - [x] Testes validando a estrutura de abertura da Home
* **Testes**: unit
* **Gate**: quick

---

### T2: Implementação do Renderizador da Home (`homePage.js`)
* **O que**: Implementar `renderHomePage`, montando a estrutura visual com respiro suíço, créditos de rodapé e classes de acessibilidade.
* **Onde**: `src/ui/homePage.js`
* **Depende de**: T1
* **Reutiliza**: Layout semântico
* **Requisito**: RN-01, RN-04
* **Concluído quando**:
  - [x] Home renderizada e aprovada na suíte de testes
  - [x] Gate de build aprovado: `node scripts/validate-sdd.mjs && node --test tests/ui/home.test.js`
* **Testes**: unit
* **Gate**: build

---

## Verificações (Checks)

**C1** - Renderização da capa editorial da Home com títulos e subtítulos  
Proof: run unit | ok 1 - deve renderizar a capa editorial da Home com estrutura semântica correta

**C2** - Presença dos 3 parágrafos explicativos na Home  
Proof: run unit | ok 2 - deve conter os 3 parágrafos conceituais com texto editorial correto

---

## Transição (Handoff)

**Resolvido durante o build:** Porta de entrada editorial com alto contraste visual e clareza pedagógica imediata.  
**Despachado:** Integrado ao roteador principal para a rota base `#/`.  
**Auditado:** Testes unitários 100% verdes.
