# ADR-009: Escala Tipográfica Modular Minor Third e Governança Estática de Tokens

- **Status:** Aceito
- **Data:** 2026-11-17
- **Decisora:** Juliana Chaves Palm

## Contexto

A auditoria visual nas rotas da aplicação revelou que títulos (`h1`), subtítulos, tabelas e notas apresentavam tamanhos e pesos heterogêneos entre as páginas Home (`#/`) e os capítulos de tríades (`#/maiores`, `#/menores`, etc.). A ausência de tokens para passos intermediários levou desenvolvedores a inserirem medidas literais (`0.75rem`, `0.85rem`, `0.95rem`, `1.05rem`, `1.25rem`, `clamp` soltos) diretamente nas folhas `layout.css` e `components.css`. Além disso, o script `scripts/validate-tokens.mjs` fiscalizava apenas cores, permitindo que medidas tipográficas arbitrárias violassem o princípio de Single Source of Truth (`ADR-008`).

## Decisão

Adotar uma **Escala Tipográfica Modular Minor Third (razão 1.200)** baseada em `18px (1rem)`, centralizada estritamente em `src/styles/tokens.css` e fiscalizada por linter estático nativo em Node.js:

### 1. Escala Matemática Formal
* `--ds-font-size-xs: 0.694rem` (~12.5px): Notas de rodapé (`.editorial-noteref`), badges.
* `--ds-font-size-sm: 0.833rem` (~15.0px): Rodapés, notas descritivas, metadados de fórmula.
* `--ds-font-size-footer: 13px`: Rodapé institucional Stripe mantido e protegido.
* `--ds-font-size-base: 18px` (1.000rem): Corpo editorial principal e células de dados interativas.
* `--ds-font-size-md: 1.200rem` (~21.6px): Cifras musicais (`.cifra-col`) e subtítulos hero.
* `--ds-font-size-lg: 1.440rem` (~25.92px): Intervalos da fórmula e títulos secundários.
* `--ds-font-size-xl: 1.728rem` (~31.1px): Cabeçalhos intermediários (`h2`).
* `--ds-font-size-2xl: 2.074rem` (~37.32px): Título de capítulo vertical no desktop (`h1`).
* `--ds-font-size-display: clamp(2.074rem, 5vw, 4.2rem)`: Título principal fluido unificado entre Home e Capítulos responsivos.

### 2. Paridade Estrita Home vs Capítulos
O elemento `h1` em todas as rotas compartilha a mesma família tipográfica (`--ds-font-primary`), o mesmo peso (`700` / bold), a mesma entrelinha (`1.1`) e a mesma régua de escala fluida.

### 3. Governança Estática com AST/Regex Linter
O validador nativo `scripts/validate-tokens.mjs` é expandido para auditar declarações de `font-size` em `base.css`, `layout.css` e `components.css`. Qualquer medida literal que não consuma `var(--ds-font-size-*)` resulta em quebra imediata do Quality Gate (`exit 1`).

## Consequências

### Prós
- Coerência visual editorial suíça impecável em todas as rotas e dispositivos.
- Zero dependências de build mantido integralmente.
- Imunidade automatizada contra novos valores tipográficos hardcoded.

### Contras e Mitigações
- Exige uso disciplinado dos tokens semânticos em novos seletores CSS, garantido pelo comando `npm run verify` na esteira de CI.
