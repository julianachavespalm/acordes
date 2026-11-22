# ADR-004: Acessibilidade Universal — Falsa Tabela ABNT, Camada Fonética e Silêncio Auditivo

- **Status:** Aceito
- **Data:** 2026-11-15
- **Decisora:** Juliana Chaves Palm

## Contexto
O projeto é um guia de acordes acessível para pessoas cegas e com baixa visão. Usuários de tecnologias assistivas (leitores de tela como NVDA, JAWS e VoiceOver) frequentemente enfrentam sobrecarga cognitiva severa com elementos `<table>` tradicionais, pois o leitor é forçado a anunciar coordenadas de matriz (*"linha 5, coluna 3"*), interrompendo o fluxo natural de leitura. Além disso, símbolos musicais visuais como bemóis (`♭`), sustenidos (`♯`), dobrados bemóis (`♭♭`) e cifras complexas como `D♭m(b5)` são frequentemente pronunciados de forma confusa pelos sintetizadores de voz. Por fim, vocalizações dinâmicas de voz concorrendo simultaneamente com o áudio musical degradam a percepção auditiva da harmonia.

## Decisão
Implementar um modelo inovador de engenharia assistiva com conformidade estrita WCAG 2.1 AAA:

1. **Falsa Tabela Estilo ABNT (Zero Tags de Tabela):**
   * **NÃO** utilizar tags `<table>`, `<tr>`, `<th>` ou `<td>`.
   * Estruturar o conteúdo visual tabular como uma lista semântica desordenada nativa (`<ul class="acordes-lista">`) com itens `<li>`.
   * O cabeçalho visual de colunas (`Acorde | Cifra | Notas`) é uma `<div>` com atributo `aria-hidden="true"`, garantindo que não seja vocalizado repetidamente.
   * O alinhamento visual em 3 colunas é realizado via CSS Grid (`grid-template-columns: 2fr 1.2fr 2fr`).

2. **Camada Fonética Dedicada para Leitores de Tela (`.sr-only`):**
   * Todo símbolo musical visual recebe `aria-hidden="true"` e é acompanhado por uma transcrição fonética descritiva oculta com a classe utilitária `.sr-only`:
     * Cifras: `<span aria-hidden="true">D♭m(b5)</span><span class="sr-only">Cifra: Ré bemol menor com quinta diminuta.</span>`
     * Acidentes dobrados: `Lá♭♭` lido textualmente como *"Lá dobrado bemol"*; `Fá♯♯` como *"Fá dobrado sustenido"*.
     * Separadores visuais entre notas (` · `) recebem `aria-hidden="true"`.

3. **Silêncio Auditivo na Execução Musical:**
   * **PROIBIDO** emitir anúncios falados via `aria-live` durante a reprodução da tríade ou da nota. A voz sintética do leitor de tela não deve sobrepor nem encobrir a síntese harmônica da Web Audio API. O leitor lê o texto ao focar o botão; ao pressionar a tecla ou clicar, o som ecoa com pureza acústica.

4. **Feedback Visual de Foco e Execução:**
   * Estados `:hover`, `:focus-visible` e a classe temporária `.playing` (aplicada durante a execução sonora) recebem fundo âmbar de alto contraste (`#FFB800`), texto `#111111` e contorno nítido (`outline: 3px solid #111111; outline-offset: 2px`).

5. **Skip Links Duplos:**
   * Dois links de salto no topo acessíveis via teclado: `"Ir para a lista de acordes"` (apontando para `#lista-acordes`) e `"Ir para o menu"` (apontando para `#menu-principal`).

6. **Padrão de Publicação Digital Acessível (WAI-ARIA DPUB — Notas de Rodapé):**
   * Emprego dos papéis semânticos da especificação WAI-ARIA Digital Publishing (DPUB):
     * Chamada de nota: `role="doc-noteref"` com `id` unívoco (`ref-triplo-sustenido-[indice]`), apontando para a nota correspondente.
     * Bloco da nota: `role="doc-footnote"` com `tabindex="-1"`, permitindo transferência programática de foco para que o leitor de tela leia a explicação imediatamente.
     * Link de retorno: `role="doc-backlink"` atualizado dinamicamente para o ID da chamada de origem, restaurando o foco no local exato do texto/tabela ao ser acionado.

## Consequências
* **Prós:** Experiência auditiva e de leitura perfeita para usuários de leitores de tela, leitura linear sem ruído de tabela, pronúncia fonética perfeita de termos musicais, notas de rodapé com navegação bidirecional acessível DPUB e destaque visual nítido para baixa visão.
* **Contras:** Demanda mapeamento manual cuidadoso da string fonética de cada uma das 84 tríades do catálogo.

## Verificação
Auditado nos testes de semântica de DOM e atributos de acessibilidade em `tests/ui/chordList.test.js` e `tests/ui/chapterPage.test.js`.
