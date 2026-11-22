# ADR-002: Arquitetura CSS em 4 Camadas, Design Editorial Suíço e Padrão Tabular ABNT

- **Status:** Aceito
- **Data:** 2026-11-15
- **Decisora:** Juliana Chaves Palm

## Contexto
O projeto adota uma direção visual de livro didático contemporâneo minimalista, inspirada no Estilo Tipográfico Suíço e nas normas tabulares da ABNT. A diagramação editorial exige espaços em branco generosos, grid assimétrico de capítulo com títulos verticalizados e contraste rigoroso WCAG 2.1 AAA, sem frameworks de terceiros.

## Decisão
Organizar os estilos em 4 camadas modulares com escopos estritamente delimitados em `src/css/`:

1. `tokens.css`:
   * Fundo papel `#FAFAFA` ou `#FFFFFF` e tinta preta `#111111` (razão de contraste $CR > 19:1$).
   * Destaque âmbar de alto contraste `#FFB800` para estados ativos e de foco.
   * Tipografia sem serifa geométrica neutra (`Inter` ou `Plus Jakarta Sans`), escala base 18px e entrelinha de 1.6.

2. `base.css`:
   * Reset moderno e tipografia editorial.
   * Duplo skip-link acessível (`Ir para a lista de acordes` e `Ir para o menu`), visíveis ao receber foco via `Tab`.
   * Estilo de foco acessível unificado: fundo âmbar `#FFB800`, texto `#111111` e contorno externo nítido (`outline: 3px solid #111111; outline-offset: 2px`).
   * Classe utilitária `.sr-only` para audiodescrição e desativação de transições sob `@media (prefers-reduced-motion: reduce)`.

3. `layout.css`:
   * **Grid Assimétrico de Capítulo (Desktop):** `grid-template-columns: 180px 1fr` com gap generoso.
     * **Coluna Esquerda (Âncora do Capítulo):** Título `<h1>` rotacionado verticalmente (`writing-mode: vertical-rl; transform: rotate(180deg)`), acompanhado de linha vertical fina (`1.5px solid #111111`) e fórmula estrutural da tríade na base (ex.: `Tríade 1 · b3 · b5`).
     * **Coluna Direita (Conteúdo de Leitura):** Parágrafos fluidos com largura máxima de 65 caracteres (`max-width: 65ch`) e container da falsa tabela ABNT.
   * **Responsividade Mobile/Tablet:** Em larguras $\le 768px$, o `<h1>` reverte para orientação horizontal padrão no topo da seção.

4. `components.css`:
   * **Barra de Navegação Superior:** Centralizada e limpa (`Home`, `Acordes Maiores`, `Acordes Menores`, `Acordes Diminutos`, `Acordes Aumentados`, `Piano Virtual`). A página ativa é indicada exclusivamente pelo peso tipográfico semibold (`font-weight: 600`), sem caixas, bordas ou pílulas.
   * **Falsa Tabela Estilo ABNT:** Formatação visual em 3 colunas via CSS Grid (`grid-template-columns: 2fr 1.2fr 2fr`), contendo exclusivamente as 3 linhas horizontais normativas da ABNT (`1.5px solid #111111` acima do cabeçalho, abaixo do cabeçalho e após o último item), sem bordas verticais ou intermediárias.
   * **Gatilhos Inline em Texto:** Botões de acorde e notas estilizados como texto limpo (`background: none; border: none; font-weight: 600; cursor: pointer`).
   * **Rodapé Minimalista:** Centralizado com menção `"© 2024 Juliana Chaves Palm"`.

## Consequências
* **Prós:** Rigor visual editorial, ausência total de poluição gráfica, conformidade matemática WCAG AAA e fidelidade às normas ABNT.
* **Contras:** Exige suporte a `writing-mode` (plenamente suportado por todos os navegadores modernos).

## Verificação
Validado na auditoria automatizada de DOM e estilos em `tests/ui/shell.test.js`.
