# FEAT-006-Design-System-e-Tokens: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas do Design System e Tokens segundo o fluxo de Spec-Driven Development (SDD) e TDD estrito.

---

**Design**: [`.specs/features/FEAT-006-Design-System-e-Tokens/design.md`](design.md)  
**Status**: Implemented · Verified  
**Spec Owner**: Juliana Chaves Palm  
**Build**: `node scripts/validate-sdd.mjs`  
**Run unit**: `node --test tests/ui/designSystem.test.js`  

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| :--- | :--- | :--- | :--- | :--- |
| `src/styles/tokens.css` & `src/styles/base.css` | unit | Auditoria de tokens, cálculo de contraste WCAG AAA e validação de propriedades CSS | `tests/ui/` | `node --test tests/ui/designSystem.test.js` |

---

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| :--- | :--- | :--- |
| Quick | Após cada alteração de token | `node --test tests/ui/designSystem.test.js` |
| Full | Validação de design tokens completa | `node --test tests/ui/` |
| Build | Após conclusão das tarefas | `node scripts/validate-sdd.mjs && node --test tests/ui/designSystem.test.js` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Formalização dos Tokens e Testes Matemáticos

```
T1 -> T2
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Criação dos Testes Matemáticos de Contraste (TDD First)
* **O que**: Escrever os testes determinísticos calculando luminância relativa segundo fórmula W3C e validando proporção mínima de 7:1 (AAA).
* **Onde**: `tests/ui/designSystem.test.js`
* **Depende de**: Nenhum
* **Reutiliza**: Runner nativo `node --test` e asserções `node:assert/strict`
* **Requisito**: RN-01 a RN-04 / CA-06.1, CA-06.2
* **Concluído quando**:
  - [x] Testes de luminância estruturados
* **Testes**: unit
* **Gate**: quick

---

### T2: Definição dos Tokens no CSS (`tokens.css` e `base.css`)
* **O que**: Declarar as variáveis semânticas `--ds-*` de cor, tipografia e espaçamento, além do reset e estilos de foco acessível.
* **Onde**: `src/styles/tokens.css`, `src/styles/base.css`
* **Depende de**: T1
* **Reutiliza**: Padrões editoriais suíços
* **Requisito**: RN-01 a RN-04
* **Concluído quando**:
  - [x] Todos os tokens declarados e validados na suíte de testes
  - [x] Gate de build aprovado: `node scripts/validate-sdd.mjs && node --test tests/ui/designSystem.test.js`
* **Testes**: unit
* **Gate**: build

---

## Verificações (Checks)

**C1** - Presença e conformidade dos tokens semânticos no CSS  
Proof: run unit | ok 1 - src/styles/tokens.css deve definir todos os tokens de cores semânticas

**C2** - Contraste WCAG 2.1 AAA matematicamente auditado  
Proof: run unit | ok 5 - todas as combinacoes de cores devem atender aos criterios WCAG AAA (>= 7:1)

---

## Transição (Handoff)

**Resolvido durante o build:** Design System com fonte única da verdade e contraste matematicamente blindado.  
**Despachado:** Utilizado por todas as camadas CSS da aplicação.  
**Auditado:** 100% de testes unitários aprovados.
