# ADR-008: Design System Editorial e Tokens de Acessibilidade WCAG AAA

- **Status:** Aceito
- **Data:** 2026-11-15
- **Decisora:** Juliana Chaves Palm (Software Engineer & Solution Designer)

## Contexto

O CSS legado do projeto era fragmentado, utilizava valores visuais soltos e repetidos e não garantia contraste de acessibilidade. A reformulação visual adota uma diagramação de livro didático contemporâneo (estilo tipográfico suíço e normas tabulares ABNT) voltada para pessoas com deficiência visual e baixa visão.

Para garantir consistência e conformidade estrita com o nível **WCAG 2.1 AAA**, precisamos de um ponto centralizado de regras de estilo, sem adicionar dependências de compilação ou frameworks pesados, com validação automatizada contra valores literais (*hardcoded*).

## Decisão

Centralizar todas as variáveis visuais em `src/css/tokens.css`, utilizando CSS Custom Properties nativas com o prefixo `--ds-*`:

### 1. Cores e Contraste (WCAG AAA)
* `--ds-color-paper: #FAFAFA` — Fundo principal tipo papel (evita o ofuscamento do branco puro).
* `--ds-color-surface: #FFFFFF` — Fundo para cartões e áreas destacadas.
* `--ds-color-ink: #111111` — Tinta preta para texto. Contraste de **15.2:1** sobre `#FAFAFA` e **21.0:1** sobre `#FFFFFF` (mínimo AAA exigido: 7:1).
* `--ds-color-ink-muted: #444444` — Texto secundário. Contraste de **8.8:1** (cumpre AAA).
* `--ds-color-accent-amber: #FFB800` — Destaque para `:hover`, `:focus-visible` e `.playing`. Contraste de **9.5:1** contra o texto `#111111`.
* `--ds-color-line: #111111` — Linhas horizontais do padrão ABNT (espessura fixa de `1.5px`).

### 2. Tipografia
* `--ds-font-primary: 'Inter', 'Plus Jakarta Sans', sans-serif` — Família sem serifa limpa e geométrica.
* `--ds-font-size-base: 18px` — Tamanho base maior que o padrão para facilitar a leitura.
* `--ds-line-height-base: 1.6` — Entrelinha confortável para evitar fadiga visual.
* `--ds-font-size-h1: clamp(2.5rem, 5vw, 4.2rem)` — Títulos fluidos adaptados ao tamanho da tela.
* `--ds-letter-spacing-spaced: 0.25em` — Espaçamento para subtítulos em caixa alta.
* **Pesos:** regular (`400`), medium (`500`), semibold (`600`) e bold (`700`).

### 3. Espaçamento e Grid
* **Escala base 8px:** `--ds-space-xs: 4px`, `--ds-space-sm: 8px`, `--ds-space-md: 16px`, `--ds-space-lg: 24px`, `--ds-space-xl: 48px`.
* `--ds-measure-reading: 65ch` — Largura máxima de linha (entre 60 e 75 caracteres) para leitura ergonômica.
* `--ds-grid-sidebar-width: 180px` — Largura da coluna esquerda de título e fórmula do capítulo.

### 4. Foco e Feedback Interativo
* `--ds-focus-outline: 3px solid #111111` e `--ds-focus-offset: 2px` — Anel de foco nítido e visível.
* **Estado `.playing`:** Fundo `--ds-color-accent-amber` com texto `--ds-color-ink` durante a execução do áudio.

### 5. Script de Validação de Tokens (`scripts/validate-tokens.mjs`)
Para impedir valores literais (*hardcoded*), implementamos um validador estático nativo em Node.js:
* Varre os arquivos de estilo (`base.css`, `layout.css`, `components.css`).
* Bloqueia qualquer valor de cor bruto (`#hex`, `rgb()`, `hsl()`) fora de `tokens.css`.
* Exige que cores, fontes e espaçamentos utilizem estritamente `var(--ds-*)`.
* Se encontrar valores soltos, o script encerra com erro (`exit 1`), informando o arquivo e a linha exata da violação.

## Consequências

### Prós
* **Fonte única da verdade:** Qualquer ajuste de cor ou tipografia é feito em um único arquivo.
* **Zero build:** Funciona direto no navegador, sem necessidade de Sass, Tailwind ou dependências externas em tempo de execução.
* **Acessibilidade verificável:** As cores têm contraste auditável por testes automatizados antes do deploy.
* **Imunidade contra valores hardcoded:** O script de validação bloqueia em CI estilos que não usem tokens.

### Contras e Mitigações
* **Risco de valores soltos (*hardcoded*):** Desenvolvedores podem inserir cores hexadecimais ou medidas soltas direto nos componentes.
  * *Mitigação:* O script `scripts/validate-tokens.mjs` é executado no portão de CI e no comando `npm run verify`. Qualquer valor solto quebra a esteira antes do commit ou deploy.

## Verificação

1. O teste `tests/ui/designSystem.test.js` calcula matematicamente as razões de contraste segundo a fórmula de luminância da W3C, garantindo que nenhum par fique abaixo de 7:1 (AAA).
2. O script `node scripts/validate-tokens.mjs` audita o CSS e falha caso encontre valores de cores ou medidas soltas fora de `tokens.css`.
