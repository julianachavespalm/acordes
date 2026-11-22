# FEAT-003-Shell-Navegacao: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas do Shell de Navegação e Menu Responsivo segundo o fluxo de Spec-Driven Development (SDD) e TDD estrito.

---

**Design**: [`.specs/features/FEAT-003-Shell-Navegacao/design.md`](design.md)  
**Status**: Implemented · Verified  
**Spec Owner**: Juliana Chaves Palm  
**Build**: `node scripts/validate-sdd.mjs`  
**Run unit**: `node --test tests/ui/shell.test.js`  

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| :--- | :--- | :--- | :--- | :--- |
| `src/ui/shell.js` | unit | Skip-links acessíveis, indicador aria-current de rota, controle de menu hambúrguer e atalhos de teclado | `tests/ui/` | `node --test tests/ui/shell.test.js` |

---

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| :--- | :--- | :--- |
| Quick | Após cada função de navegação | `node --test tests/ui/shell.test.js` |
| Full | Validação de interface completa | `node --test tests/ui/` |
| Build | Após conclusão das tarefas do Shell | `node scripts/validate-sdd.mjs && node --test tests/ui/shell.test.js` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Implementação do Shell e Responsividade

```
T1 -> T2 -> T3
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Criação dos Testes do Shell e Menu (TDD First)
* **O que**: Escrever os testes cobrindo duplo skip-link, marcação de página ativa com `aria-current="page"`, abertura/fechamento do menu móvel com Escape e clique em links.
* **Onde**: `tests/ui/shell.test.js`
* **Depende de**: Nenhum
* **Reutiliza**: Runner nativo `node --test` e asserções `node:assert/strict`
* **Requisito**: RN-01 a RN-05 / CA-03.1, CA-03.2, CA-03.3
* **Concluído quando**:
  - [x] Testes definidos e validando os comportamentos esperados
* **Testes**: unit
* **Gate**: quick

---

### T2: Implementação do Módulo Shell (`shell.js`)
* **O que**: Implementar `initShell`, `syncActiveNavigation`, `initMenuToggle` e `initSkipLinks`.
* **Onde**: `src/ui/shell.js`
* **Depende de**: T1
* **Reutiliza**: Lista `NAV_ITEMS`
* **Requisito**: RN-01 a RN-04
* **Concluído quando**:
  - [x] Métodos de sincronização e alternância implementados
* **Testes**: unit
* **Gate**: quick

---

### T3: Estilização do Menu Responsivo e Layout Editorial
* **O que**: Aplicar regras CSS em `components.css` e `layout.css` para menu hambúrguer flutuante sem quebra de texto (`white-space: nowrap`) e painel dropdown em telas estreitas (`<= 960px`).
* **Onde**: `src/styles/components.css`, `src/styles/layout.css`
* **Depende de**: T2
* **Reutiliza**: Tokens semânticos do Design System
* **Requisito**: RN-02, RN-04, RN-05
* **Concluído quando**:
  - [x] Todos os testes de layout e interação aprovados
  - [x] Gate de build aprovado: `node scripts/validate-sdd.mjs && node --test tests/ui/shell.test.js`
* **Testes**: unit
* **Gate**: build

---

## Verificações (Checks)

**C1** - Marcação correta de aria-current na página ativa correspondente  
Proof: run unit | ok 3 - deve marcar com aria-current="page" exclusivamente a página ativa correspondente (RN-03 / CA-03.2)

**C2** - Alternância do menu móvel e atualização de estados ARIA  
Proof: run unit | ok 4 - deve alternar o menu móvel e atualizar estados ARIA ao clicar no botão hambúrguer

**C3** - Fechamento do menu ao clicar em links de navegação  
Proof: run unit | ok 5 - deve fechar o menu móvel ao clicar em qualquer link de navegação

**C4** - Fechamento do menu ao pressionar Escape  
Proof: run unit | ok 6 - deve fechar o menu móvel ao pressionar a tecla Escape

---

## Transição (Handoff)

**Resolvido durante o build:** Cabeçalho unificado com navegação rápida, menu responsivo de alta usabilidade e conformidade com leitores de tela.  
**Despachado:** Integrado ao bootstrap da aplicação no `main.js`.  
**Auditado:** 100% de testes unitários verdes.
