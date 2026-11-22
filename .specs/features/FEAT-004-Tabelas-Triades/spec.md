# FEAT-004: Falsa Tabela Estilo ABNT, Silêncio Auditivo e Diagramação Suíça

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented |
| **Spec Owner** | Juliana Chaves Palm |
| **Prioridade** | P1 · Interação Didática Central |
| **Decisões Arquiteturais** | [ADR-001: Arquitetura Modular Enxuta](../../decisions/ADR-001-lean-modular-architecture.md), [ADR-002: CSS 4 Camadas e Padrão ABNT](../../decisions/ADR-002-css-layers.md), [ADR-003: Orquestração Acústica](../../decisions/ADR-003-local-audio-orchestration.md), [ADR-004: Acessibilidade Universal ABNT](../../decisions/ADR-004-universal-accessibility-wai-aria.md) |
| **Aprovação** | 2026-11-15 |
| **Diretriz de Execução** | Acessibilidade Universal WCAG 2.1 AAA, Padrão Tabular ABNT e WAI-ARIA DPUB para notas de rodapé. |
| **Implementação** | `src/ui/chordList.js`, `src/ui/chapterPage.js`, `src/styles/layout.css`, `src/styles/components.css` |
| **Verificação** | `tests/ui/chordList.test.js`, `tests/ui/chapterPage.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

Pessoas cegas e com baixa visão que utilizam leitores de tela (NVDA, JAWS, VoiceOver) encontram fluidez muito superior ao ler texto corrido e listas semânticas lineares, enquanto tabelas tradicionais (`<table>`) provocam atrito com anúncios desnecessários de coordenadas (*"linha X, coluna Y"*). Esta especificação une o refinamento visual das normas tabulares da ABNT e do Estilo Tipográfico Suíço (falsa tabela com 3 linhas horizontais normativas) à acessibilidade absoluta de uma lista nativa `<ul class="acordes-lista">`, com gatilhos de áudio integrados ao próprio texto e respeito rigoroso ao **silêncio auditivo** durante a execução harmônica.

### História de Usuário (User Story)

**Como** pessoa cega navegando com leitor de tela ou pessoa com baixa visão,  
**Eu quero** percorrer os acordes de forma linear em uma lista semântica fluida, ouvindo os nomes e cifras descritos foneticamente e acionando o som de notas e tríades sem a sobreposição de vozes sintéticas,  
**Para que** eu estude harmonia musical com conforto cognitivo e pureza acústica total.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| **Falsa Tabela Estilo ABNT:** estruturação semântica com `<ul class="acordes-lista">` e itens `<li>`, com cabeçalho em `<div>` com `aria-hidden="true"` | Elimina ruídos de coordenadas de tabela para quem usa tecnologia assistiva | Tags `<table>`, `<tr>`, `<th>` ou `<td>` | Prejudicam a experiência linear do usuário cego |
| **Grid Assimétrico de Capítulo:** coluna lateral com título verticalizado, travessão vertical e fórmula na base | Assinatura visual de livro didático contemporâneo de alto padrão | Diagramações caóticas sem ancoragem editorial | A hierarquia visual transmite rigor de design suíço |
| **Bordas Normativas ABNT:** apenas 3 linhas horizontais na tabela inteira | Segue estritamente a norma tabular da ABNT (topo, abaixo do cabeçalho e fim da lista) | Linhas verticais ou linhas horizontais entre cada acorde | Poluem a leitura e violam o padrão tabular limpo |
| **Gatilhos Inline em Texto:** nome do acorde toca a tríade; cada nota toca o som individual | Mantém a tipografia limpa como texto editorial | Botões repetitivos com ícones de autofalante ou texto "Ouvir" | Poluem visualmente a diagramação do livro |
| **Camada Fonética `.sr-only`:** cifras por extenso e acidentes dobrados (*"dobrado bemol"*, *"dobrado sustenido"*) | Garante que o leitor de tela pronuncie os símbolos corretamente | Abreviações fonéticas dúbias | A audiodescrição deve ser clara e didática |
| **Silêncio Auditivo:** proibido o uso de `aria-live` falado durante a reprodução do áudio | Garante que a voz do sintetizador não encubra o som musical | Alertas vocais sobrepostos ao som | A harmonia musical deve ser apreciada de forma pura |
| **Feedback Visual de Foco e Execução:** destaque âmbar `#FFB800` em `:focus-visible` e `.playing` | Destaque imediato de alto contraste para pessoas com baixa visão | Efeitos sutis de baixa opacidade | O contraste atende a WCAG 2.1 AAA |
| **Notas de Rodapé Semânticas DPUB:** chamadas `role="doc-noteref"` e rodapé `role="doc-footnote"` com link de retorno `role="doc-backlink"` | Estrutura editorial semântica para notas bibliográficas (ex: triplo sustenido) | Caixas flutuantes ou modais | Navegação bidirecional acessível de rodapé |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Semântica de Falsa Tabela):** The system SHALL construir a visualização tabular utilizando exclusivamente lista semântica `<ul class="acordes-lista" role="list">` com cabeçalho `aria-hidden="true"` e zero tags `<table>`, `<tr>`, `<th>` ou `<td>`.
- **RN-02 (Hierarquia de Filetes ABNT e Ritmo Uniforme):** The system SHALL aplicar filetes horizontais sem bordas verticais segundo hierarquia ABNT/Editorial Suíço: `1.5px solid var(--ds-color-line)` no topo e na base do cabeçalho da tabela, `1px solid var(--ds-color-line-faint)` entre linhas internas de acordes em todas as telas, última linha aberta (`border-bottom: none`) e `1px solid var(--ds-color-line)` no topo de `.editorial-footnotes` quando houver nota de rodapé. Cabeçalho e linhas compartilham altura mínima uniforme (`48px` no desktop e `68px` em telas `<= 640px`), com coluna `Notas` alinhada à esquerda (*flush-left*) em todas as telas.
- **RN-03 (Grid de Capítulo Assimétrico e Quebra Responsiva `<= 640px`):** The system SHALL estruturar os capítulos em grid assimétrico no desktop com identificação vertical da tríade e área de leitura e tabela ancorada ao topo. Em telas estreitas (`<= 640px`), a tabela exibe visualmente 2 colunas (`minmax(0, 130px) minmax(0, 1fr)`, `column-gap: 12px`, `0.92rem`, `text-wrap: balance` nos acordes, alvo tátil vertical `36px` e `.note-unit` agrupando cada nota ao separador `·`), preservando a coluna `Cifra` acessível via `.sr-only` e exibindo `Cifra: <símbolo>` no indicador dinâmico do rodapé (`#footer-cifra`) ao acionar um acorde ou nota.
- **RN-04 (Gatilhos Inline de Áudio):** O nome do acorde DEVE disparar a tríade polifônica e cada nota individual DEVE disparar o som acústico isolado.
- **RN-05 (Camada Fonética `.sr-only`):** Símbolos de cifra e notas DEVEM possuir leitura fonética descritiva associada via `<span class="sr-only">`.
- **RN-06 (Silêncio Auditivo):** The system SHALL NÃO emitir anúncios vocais em `aria-live` concorrentes com o som da nota ou acorde.
- **RN-07 (Feedback Visual Âmbar):** Ao receber foco ou durante a reprodução (`.playing`), o elemento interativo DEVE exibir fundo âmbar `#FFB800`.
- **RN-08 (Notas de Rodapé DPUB):** No capítulo de acordes aumentados, notas com triplo sustenido DEVEM renderizar chamada `role="doc-noteref"` associada a rodapé `role="doc-footnote"` e retorno `role="doc-backlink"`.

---

## 5. Contrato Técnico e Semântica de Interface

- **Módulos:**
  - `src/ui/chordList.js`: Exporta `initChordList({ containerElement, categoryId, soundEngine })` e `renderChordMarkup(chord)`.
  - `src/ui/chapterPage.js`: Exporta `renderChapterPage(categoryId, soundEngine, mountElement)`, `CHAPTER_CONFIGS` e `setupFootnoteNavigation(root)`.

---

## 6. Critérios de Aceitação (BDD / EARS)

- **CA-04.1 (Ausência de Tags de Tabela):**  
  **Dado** a renderização de qualquer lista de acordes,  
  **Quando** o HTML gerado for inspecionado,  
  **Então** o sistema NÃO DEVE conter nenhuma tag `table`, `tr`, `th` ou `td`.
- **CA-04.2 (Gatilho de Tríade Polifônica):**  
  **Dado** o botão de uma tríade (ex: Dó Maior),  
  **Quando** o usuário aciona o botão,  
  **Então** o sistema DEVE delegar a reprodução dos identificadores de áudio correspondentes ao motor de som e aplicar a classe `.playing`.
- **CA-04.3 (Navegação Bidirecional de Notas de Rodapé):**  
  **Dado** uma chamada de nota de rodapé no capítulo de acordes aumentados,  
  **Quando** acionada,  
  **Então** o foco DEVE transitar para o elemento de rodapé `role="doc-footnote"`, e o acionamento do backlink DEVE retornar o foco para a chamada original.
