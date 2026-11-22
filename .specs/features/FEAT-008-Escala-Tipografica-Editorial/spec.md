# FEAT-008: Unificação da Escala Tipográfica Editorial e Governança de Tokens

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Ready for Implementation |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · Qualidade Visual & Arquitetura Editorial |
| **Decisões Arquiteturais** | [ADR-002: CSS em 4 Camadas](../../decisions/ADR-002-css-layers.md), [ADR-008: Design System Editorial Suíço](../../decisions/ADR-008-design-system-tokens-editorial-swiss.md), [ADR-009: Escala Tipográfica Minor Third](../../decisions/ADR-009-modular-typographic-scale-editorial-governance.md) |
| **Aprovação** | 2026-11-17 |
| **Diretriz de Execução** | TLC Spec-Driven Development (TLC SDD) com validação determinística via Node.js nativo. |
| **Implementação** | `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/layout.css`, `src/styles/components.css`, `scripts/validate-tokens.mjs` |
| **Verificação** | `tests/ui/typography.test.js`, `scripts/validate-sdd.mjs`, `scripts/validate-tokens.mjs` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

O projeto acordes demanda rigor editorial suíço e harmonia geométrica. Esta especificação formaliza a Escala Tipográfica Modular Minor Third (1.200) com base de 18px, erradicando valores literais arbitrários e restabelecendo a equivalência hierárquica entre a Home e os capítulos de acordes maiores, menores, diminutos e aumentados.

### História de Usuário (User Story)

**Como** Juliana Chaves Palm, engenheira de software e designer de solução do projeto,  
**Eu quero** uma escala tipográfica modular unificada e auditada estaticamente por software,  
**Para que** todas as abas da aplicação compartilhem a mesma hierarquia perceptual suíça, sem discrepâncias de tamanho de fonte e com total proteção contra regressões de CSS.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Escala Minor Third (razão 1.200) em `tokens.css` | Fonte única da verdade para proporções tipográficas | Introdução de pré-processadores ou dependências npm pesadas | Preserva Clean Architecture nativa e Zero-Build |
| Refatoração exaustiva de `base.css`, `layout.css` e `components.css` | Substituição de 100% dos valores literais por `var(--ds-font-size-*)` | Mudanças estruturais na síntese sonora ou lógica harmônica | Escopo estritamente delimitado à camada de apresentação |
| Linter de medidas tipográficas em `validate-tokens.mjs` | Gate automatizado que impede regressões no pipeline | Modificações no roteador SPA ou nas rotas existentes | O roteamento e títulos de aba já estão consolidados |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Escala Minor Third):** The system SHALL definir os tokens tipográficos em `src/styles/tokens.css` com a razão matemática $1.200$:
  - `--ds-font-size-xs: 0.694rem`
  - `--ds-font-size-sm: 0.833rem`
  - `--ds-font-size-base: 18px`
  - `--ds-font-size-md: 1.200rem`
  - `--ds-font-size-lg: 1.440rem`
  - `--ds-font-size-xl: 1.728rem`
  - `--ds-font-size-2xl: 2.074rem`
  - `--ds-font-size-display: clamp(2.074rem, 5vw, 4.2rem)`
- **RN-02 (Paridade Visual Unificada):** The system SHALL aplicar peso `700` (bold) e escala fluida `--ds-font-size-display` tanto para `.home-title` quanto para `.chapter-title-vertical`.
- **RN-03 (Consistência de Apoio e Metadados):** The system SHALL utilizar `--ds-font-size-sm` para `.home-subtitle-sub`, `.formula-label` e `.editorial-footnotes`.
- **RN-04 (Consistência Tabular):** The system SHALL utilizar `--ds-font-size-md` para `.cifra-col` e `--ds-font-size-base` para botões interativos de notas e acordes.
- **RN-05 (Bloqueio de Valores Literais):** The system SHALL falhar o script `validate-tokens.mjs` caso qualquer arquivo CSS fora de `tokens.css` contenha `font-size` com medidas explícitas em `px`, `rem`, `em` ou `clamp()`.

---

## 5. Contrato Técnico e Semântica de Interface

- **CSS Tokens:** `src/styles/tokens.css`
- **Camada de Layout:** `src/styles/layout.css`
- **Camada de Componentes:** `src/styles/components.css`
- **Validador Estático:** `scripts/validate-tokens.mjs`
- **Suíte de Testes:** `tests/ui/typography.test.js`

---

## 6. Critérios de Aceitação (BDD) + Casos de Borda + Matriz de Rastreabilidade

### Critérios de Aceitação (BDD / EARS)

- **CA-08.1 (Existência e Validade da Escala):**  
  **Dado** o arquivo `src/styles/tokens.css`,  
  **Quando** inspecionado,  
  **Então** DEVE conter todos os tokens da escala Minor Third (`--ds-font-size-xs` até `--ds-font-size-display`).
- **CA-08.2 (Zero Hardcoded Typography):**  
  **Dado** os arquivos CSS em `src/styles/`,  
  **Quando** executado `node scripts/validate-tokens.mjs`,  
  **Então** o processo DEVE encerrar com código `0` e zero violações de tipografia.
- **CA-08.3 (Conformidade WCAG 2.1 AAA):**  
  **Dado** os textos renderizados com as novas escalas,  
  **Quando** auditados contra suas superfícies de fundo,  
  **Então** NENHUM texto DEVE apresentar contraste inferior a `7:1`.

### Casos de Borda (Edge Cases)

- **EC-08.1:** IF o viewport for reduzido a larguras móveis ($\le 640px$), THEN the system SHALL manter legibilidade das células sem truncamento aplicando `--ds-font-size-xs` aos cabeçalhos e `--ds-font-size-sm` aos triggers.

### Matriz de Rastreabilidade

| Requisito / Critério | Módulo de Implementação | Caso de Teste Automatizado |
| :--- | :--- | :--- |
| RN-01 / CA-08.1 | `src/styles/tokens.css` | `tests/ui/typography.test.js` -> `deve exportar a escala minor third completa` |
| RN-02, RN-03, RN-04 | `src/styles/layout.css`, `components.css` | `tests/ui/typography.test.js` -> `deve comprovar paridade entre home e capitulos` |
| RN-05 / CA-08.2 | `scripts/validate-tokens.mjs` | `node scripts/validate-tokens.mjs` |
