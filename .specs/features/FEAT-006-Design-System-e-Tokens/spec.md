# FEAT-006: Design System Editorial, Tokens e Auditoria Matemática WCAG 2.1 AAA

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · Fundação Visual e Acessibilidade de Cores |
| **Decisões Arquiteturais** | [ADR-002: CSS em 4 Camadas](../../decisions/ADR-002-css-layers.md), [ADR-004: Acessibilidade Universal ABNT](../../decisions/ADR-004-universal-accessibility-wai-aria.md), [ADR-008: Design System Editorial Suíço](../../decisions/ADR-008-design-system-tokens-editorial-swiss.md) |
| **Aprovação** | 2026-11-15 |
| **Diretriz de Execução** | Tokens CSS nativos em `src/styles/tokens.css`, contraste WCAG 2.1 AAA matematicamente auditado. |
| **Implementação** | `src/styles/tokens.css`, `src/styles/base.css` |
| **Verificação** | `tests/ui/designSystem.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

O projeto adota uma estética minimalista de livro didático contemporâneo inspirada no Estilo Tipográfico Suíço e nas normas tabulares da ABNT. Esta especificação formaliza o Design System do projeto, unificando a paleta de cores (papel `#FAFAFA`, tinta `#111111` e destaque âmbar `#FFB800`), a tipografia sem serifa geométrica neutra (`Inter`) e as regras de espaçamento em variáveis CSS semânticas padronizadas com prefixo `--ds-*`, com comprovação matemática automatizada das razões de contraste exigidas pela WCAG 2.1 no nível AAA.

### História de Usuário (User Story)

**Como** designer de solução e desenvolvedora com foco em acessibilidade e qualidade visual,  
**Eu quero** uma base centralizada de tokens de design com contraste matematicamente comprovado pela W3C,  
**Para que** toda a aplicação mantenha harmonia visual suíça, legibilidade ergonômica para pessoas com baixa visão e imunidade contra regressões de estilo.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Definição normativa de tokens de cor, tipografia e espaçamento em `src/styles/tokens.css` | Fonte única da verdade (*Single Source of Truth*) para todo o ecossistema CSS | Ferramentas de compilação pesadas (Sass, PostCSS, Tailwind) | O projeto opera em modo nativo modular sem etapas de build |
| Auditoria matemática de contraste de luminância relativa W3C na suíte de testes | Garante que nenhuma cor viole WCAG AAA ($CR \ge 7:1$) de forma determinística | Temas coloridos ou modo escuro com baixa legibilidade | A proposta é intencionalmente a estética de livro didático preto e branco com âmbar |
| Reset tipográfico e estilos de foco acessível em `src/styles/base.css` | Garante coerência visual entre elementos nativos do navegador | Animações extravagantes de transição de cor em hover | Respeita o princípio de sobriedade editorial e `prefers-reduced-motion` |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Tokens de Cores e Contraste AAA):** The system SHALL definir e aplicar os seguintes pares cromáticos mínimos:
  - Fundo principal: `--ds-color-paper: #FAFAFA` (ou `#FFFFFF`).
  - Tinta de texto: `--ds-color-ink: #111111`. Razão de contraste mínima $CR \ge 18.5:1$ (exigência AAA: 7:1).
  - Tinta secundária: `--ds-color-ink-muted: #444444`. Razão $CR \ge 9.5:1$ (exigência AAA: 7:1).
  - Acento âmbar: `--ds-color-accent-amber: #FFB800` com texto `--ds-color-ink: #111111`, garantindo razão $CR \ge 12:1$.
  - Linha normativa ABNT: `--ds-color-line: #111111` com espessura de `1.5px`.
- **RN-02 (Tokens Tipográficos Suíços):** The system SHALL estabelecer:
  - Família tipográfica: `--ds-font-primary: 'Inter', -apple-system, sans-serif`.
  - Tamanho base ergonômico: `--ds-font-size-base: 18px` com `--ds-line-height-base: 1.6`.
  - Escala fluida para títulos: `--ds-font-size-h1: clamp(2.074rem, 5vw, 4.2rem)`.
  - Espaçamento de caracteres em subtítulos caixa alta: `--ds-letter-spacing-spaced: 0.25em`.
- **RN-03 (Tokens de Espaçamento e Medida de Leitura):** The system SHALL definir:
  - Medida de leitura de conforto ergonômico: `--ds-measure-reading: 65ch`.
  - Largura da coluna esquerda de capítulo: `--ds-grid-sidebar-width: 180px`.
  - Escala modular de espaçamentos com prefixo `--ds-space-*`.
- **RN-04 (Estilo de Foco Unificado):** The system SHALL aplicar sob `:focus-visible`:
  - `outline: 3px solid var(--ds-color-ink)`.
  - `outline-offset: 2px`.
  - `background-color: var(--ds-color-accent-amber)`.

---

## 5. Contrato Técnico e Semântica de Interface

- **Folhas de Estilo:** `src/styles/tokens.css` e `src/styles/base.css`.
- **Governança:** Variáveis obrigatoriamente prefixadas com `--ds-*`.

---

## 6. Critérios de Aceitação (BDD / EARS)

- **CA-06.1 (Presença dos Tokens Obrigatórios):**  
  **Dado** a leitura de `src/styles/tokens.css`,  
  **Quando** inspecionadas as variáveis no bloco `:root`,  
  **Então** os tokens essenciais de cor, tipografia e espaçamento DEVEM estar definidos.
- **CA-06.2 (Comprovação Matemática de Luminância AAA):**  
  **Dado** os valores hexadecimais dos tokens de cor,  
  **Quando** calculada a luminância relativa conforme fórmula da W3C,  
  **Então** a razão entre papel e tinta DEVE ser superior a 7:1.
