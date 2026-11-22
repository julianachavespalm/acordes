# Guia de Estilo e Padrões de Código (Style Guide)

Este documento define as regras de codificação, nomenclatura e arquitetura adotadas no projeto `acordes` para garantir uniformidade, legibilidade e conformidade com os princípios de *Clean Code*.

---

## 1. Regra de Ouro: Separação Bilíngue (`ADR-005`)

1. **Código 100% em Inglês:**
   * Nomes de arquivos: `camelCase.js` para módulos (`musicTheory.js`, `soundPlayer.js`, `chordTable.js`).
   * Nomes de classes e entidades: `PascalCase` (`TriadChord`, `MusicTheory`).
   * Funções e métodos: `camelCase` com verbos de ação explícitos (`getChordById`, `playNote`, `playChord`, `initShell`).
   * Variáveis e constantes: `camelCase` para instâncias (`activeAudioMap`, `chordList`); `SCREAMING_SNAKE_CASE` para constantes de configuração (`TRIAD_DEFINITIONS`).
   * Seletores CSS e IDs HTML: `kebab-case` (`.chord-table`, `.note-button`, `#a11y-announcer`, `#main-content`).

2. **Comentários Estritamente Necessários e em Português:**
   * O código deve ser autoexplicativo através de sua semântica limpa.
   * Não escreva comentários óbvios que apenas repitam o que a linha de código faz.
   * Quando uma decisão técnica sutil ou peculiaridade musical precisar de justificativa, o comentário deve ser conciso e redigido em português do Brasil.

---

## 2. Padrões CSS (4 Camadas)

* **Tokens:** Sempre utilize variáveis semânticas de `src/css/tokens.css` (ex.: `var(--color-bg)`, `var(--color-text)`, `var(--space-md)`).
* **Especificidade:** Proibido o uso de `!important`. A especificidade deve ser resolvida pela cascata e ordem correta das 4 camadas.
* **Acessibilidade:**
  * Estados `:focus-visible` devem sempre possuir contorno evidente (`outline: 2px solid var(--color-focus)`).
  * Animações devem ser desativadas sob a media query `@media (prefers-reduced-motion: reduce)`.

---

## 3. Padrões de Teste e BDD

* **Arquivos de Teste Unitário:** Localizados em `tests/` com extensão `.test.js`, executados via `node --test`.
* **Cenários BDD (Gherkin):** Localizados em `tests/features/` com extensão `.feature` e cabeçalho `# language: pt`.
* **Steps Definitions:** Localizados em `tests/steps/` com extensão `.js`.
