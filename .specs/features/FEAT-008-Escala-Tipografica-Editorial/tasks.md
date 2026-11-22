# FEAT-008-Escala-Tipografica-Editorial: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas de escala tipográfica modular, refatoração de CSS e linter determinístico de tokens conforme o protocolo TLC SDD.

---

**Status**: In Progress  
**Spec Owner**: Juliana Chaves Palm  
**Gate**: `npm run verify`

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| :--- | :--- | :--- | :--- | :--- |
| `src/styles/` | unit / linter / AST | Validação de ausência de medidas literais e cálculo da escala matemática Minor Third | `scripts/`, `tests/ui/` | `npm run verify` |

---

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| :--- | :--- | :--- |
| Quick | Após ajustes em tokens ou seletores CSS | `node scripts/validate-tokens.mjs` |
| Unit | Após implementação da suíte de testes | `node --test tests/ui/typography.test.js` |
| Full / Build | Validação completa do pipeline | `npm run verify` |

---

## Plano de Execução (Execution Plan)

```
TSK-008-01 -> TSK-008-02 -> TSK-008-03 -> TSK-008-04 -> TSK-008-05 -> TSK-008-06
```

---

## Detalhamento de Tarefas (Task Breakdown)

### TSK-008-01: Governança SDD e Atualização de Estado
* **O que**: Criar `ADR-009`, `spec.md`, `tasks.md` e atualizar `.specs/STATE.md`.
* **Onde**: `.specs/`
* **Testes**: `node scripts/validate-sdd.mjs`
* **Gate**: build

### TSK-008-02: Expansão dos Tokens em `tokens.css`
* **O que**: Adicionar escala Minor Third (`--ds-font-size-xs` a `--ds-font-size-display`) preservando tokens obrigatórios.
* **Onde**: `src/styles/tokens.css`
* **Testes**: `node scripts/validate-tokens.mjs`
* **Gate**: quick

### TSK-008-03: Refatoração CSS nas Camadas de Layout e Componentes
* **O que**: Substituir 100% dos valores literais de `font-size` em `layout.css`, `components.css` e `base.css` por tokens.
* **Onde**: `src/styles/`
* **Testes**: `node scripts/validate-tokens.mjs`
* **Gate**: quick

### TSK-008-04: Expansão do Linter em `scripts/validate-tokens.mjs`
* **O que**: Implementar detecção e bloqueio de medidas tipográficas literais em arquivos CSS.
* **Onde**: `scripts/validate-tokens.mjs`
* **Testes**: `node scripts/validate-tokens.mjs`
* **Gate**: build

### TSK-008-05: Criação da Suíte `tests/ui/typography.test.js`
* **O que**: Implementar testes unitários para verificação dos tokens e proporções da escala.
* **Onde**: `tests/ui/typography.test.js`
* **Testes**: `node --test tests/ui/typography.test.js`
* **Gate**: unit

### TSK-008-06: Verificação Integral do Quality Gate
* **O que**: Executar pipeline completo `npm run verify` (SDD + Tokens + Testes).
* **Onde**: Raiz do projeto
* **Testes**: `npm run verify`
* **Gate**: full

---

## Verificações (Checks)

**C1** - Validação SDD de especificações e decisões  
Proof: run node scripts/validate-sdd.mjs | ✔ SDD QUALITY GATE: APROVADO

**C2** - Auditoria estática de ausência de valores literais de tipografia  
Proof: run node scripts/validate-tokens.mjs | ✔ DESIGN SYSTEM TOKENS GATE: APROVADO

**C3** - Suíte de testes unitários de tipografia e design system  
Proof: run node --test tests/ui/typography.test.js | ✔ FEAT-008: escala tipografica e paridade aprovadas
