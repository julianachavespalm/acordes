# FEAT-010: Piano Virtual Interativo, Multitouch e Reconhecimento de Tríades

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Implemented · Verified |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · Expansão Pedagógica e Prática Musical |
| **Decisões Arquiteturais** | [ADR-001: Arquitetura Modular Enxuta](../../decisions/ADR-001-lean-modular-architecture.md), [ADR-004: Acessibilidade Universal WAI-ARIA](../../decisions/ADR-004-universal-accessibility-wai-aria.md), [ADR-008: Design System Editorial Suíço](../../decisions/ADR-008-design-system-tokens-editorial-swiss.md), [ADR-010: Política de Seleção Aberta](../../decisions/ADR-010-open-text-selection-policy.md), [ADR-011: Audio Pool e Ciclo de Vida de Rotas](../../decisions/ADR-011-audio-pool-and-route-teardown.md), [ADR-012: Piano Virtual Polifônico e Multitouch](../../decisions/ADR-012-virtual-piano-polyphony-multitouch-and-chord-recognition.md) |
| **Aprovação** | **Approved**: 2026-11-22 - user: "aprovado." |
| **Diretriz de Execução** | Experiência musical prática sem manual, 100% amostras `.mp3` reais, multitouch em celular deitado (landscape), modo acessível `Fixar notas`, atalhos de teclado físico no desktop e reconhecimento de tríades no domínio puro. |
| **Implementação** | `src/domain/musicTheory.js`, `src/audio/soundEngine.js`, `src/ui/pianoPage.js`, `src/ui/shell.js`, `src/main.js`, `src/styles/components.css`, `src/styles/layout.css`, `index.html` |
| **Verificação** | `tests/core/musicTheory.test.js`, `tests/audio/soundEngine.test.js`, `tests/ui/pianoPage.test.js`, `tests/ui/shell.test.js`, `tests/ui/main.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

O guia **Acordes Básicos** permite consultar e ouvir as 84 tríades organizadas nos quatro capítulos. Para completar o ciclo didático, a aba **Piano Virtual (`#/piano`)** devolve ao estudante a possibilidade de experimentar notas livremente e testar a formação de acordes na prática — porém de forma radicalmente mais simples do que a versão legada, eliminando manuais extensos e modos confusos.

### Histórias de Usuário (User Stories)

**Como** estudante de música utilizando o celular na horizontal (*landscape*),  
**Eu quero** tocar 3 ou mais teclas ao mesmo tempo com multitouch e ver imediatamente qual tríade formei,  
**Para que** eu pratique harmonia de forma intuitiva e sem precisar ler um manual.

**Como** pessoa cega, com baixa visão ou usuário de mouse/teclado no computador,  
**Eu quero** ativar um único botão `Fixar notas` (ou usar as teclas do teclado físico) para montar um acorde, ouvi-lo junto e receber a identificação da tríade,  
**Para que** eu tenha a mesma autonomia de experimentação harmônica que quem usa multitouch.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| **Rota SPA `#/piano` + item `Piano Virtual` no menu:** integrado ao shell suíço, sem cantos arredondados e com osciloscópio no rodapé | Consistência total de navegação, acessibilidade e ciclo de vida (`ADR-011`) | Página HTML legada isolada (`src/pages/piano-virtual.html`) | Evita duplicação de layout e manutenção paralela |
| **Disparo polifônico aditivo de `.mp3` reais (`triggerNote`):** toca múltiplas teclas simultaneamente sem cortar as anteriores | Essencial para multitouch e teclado físico, mantendo 100% amostras reais de piano | Síntese artificial com osciladores Web Audio | Diretriz inviolável: a fonte sonora é exclusivamente `.mp3` real |
| **Multitouch por `Pointer Events` em landscape (2 oitavas) + fallback em portrait (aviso discreto + 1 oitava):** | Ergonomia para 3+ dedos no celular deitado sem violar WCAG 2.1 (Critério 1.3.4 Orientation) | Travamento forçado de orientação de tela | Bloquear rotação prejudica acessibilidade e dispositivos com suporte fixo |
| **Toggle único `Fixar notas` + `Tocar juntas` + `Limpar`:** | Elimina o fluxo complexo de 4 passos da versão legada | Manual textual longo explicando modos de operação | Interface autoexplicativa com feedback imediato |
| **Atalhos no teclado físico (desktop):** mapeamento de teclas do computador para tocar notas e acordes simultâneos | Permite tocar acordes polifônicos no computador sem mouse | Suporte a dispositivos Web MIDI externos | Complexidade fora do escopo atual do guia |
| **Reconhecimento automático de tríades no domínio (`identifyTriadFromMidis`):** identifica tríades maiores, menores, diminutas e aumentadas do catálogo | Reaproveita a fonte única da verdade em `src/domain/triadsData.js` | Reconhecimento de tétrades, inversões com baixo cifrado ou acordes alterados | Foco didático exclusivo em tríades básicas |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Navegação e Rota SPA):** The system SHALL expor o item `Piano Virtual` no menu principal apontando para `#/piano`, respeitando o estado ativo em negrito não clicável (`aria-current="page"`, `aria-label="Piano Virtual, aba atual"`) e executando `teardown` na saída da rota.
- **RN-02 (Amostras `.mp3` Reais e Polifonia Aditiva):** WHEN o usuário acionar uma tecla no piano (por toque, clique ou teclado físico), THEN the system SHALL disparar o arquivo `.mp3` real correspondente via `soundEngine.triggerNote(midi)` sem interromper outras teclas tocadas simultaneamente, e SHALL acionar o osciloscópio acústico no rodapé.
- **RN-03 (Multitouch via Pointer Events):** WHEN múltiplos dedos pressionarem teclas simultaneamente em dispositivos touch, THEN the system SHALL rastrear cada toque de forma independente por `pointerId` com `touch-action: none` na área do teclado, destacando visualmente todas as teclas pressionadas em âmbar (`--ds-color-accent-amber`).
- **RN-04 (Orientação Mobile Landscape e Portrait):** WHEN a aba `#/piano` for exibida em celular deitado (*landscape*), THEN the system SHALL apresentar as 2 oitavas completas (25 teclas, MIDI 60 a 84) com layout vertical compacto; WHEN exibida em celular em pé (*portrait*), THEN the system SHALL exibir um aviso discreto sugerindo girar o aparelho na horizontal e manter 1 oitava confortável utilizável (13 teclas, MIDI 60 a 72).
- **RN-05 (Modo Acessível `Fixar notas`):** WHEN o controle `Fixar notas` (`aria-pressed="true"`) estiver ativo, THEN clicar ou ativar uma tecla SHALL tocar sua nota `.mp3` e alternar seu estado fixado (`aria-pressed` na tecla e destaque âmbar). WHEN houver 2 ou mais notas fixadas, THEN o botão `Tocar juntas` SHALL executar `soundEngine.playChord(midisFixados)`; o botão `Limpar` SHALL desmarcar todas as teclas fixadas.
- **RN-06 (Atalhos de Teclado Físico no Desktop):** WHEN o usuário pressionar teclas mapeadas do teclado físico na aba `#/piano` (sem modificadores `Ctrl`/`Alt`/`Meta` e ignorando `event.repeat`), THEN the system SHALL disparar a nota correspondente com suporte a múltiplas teclas simultâneas.
- **RN-07 (Reconhecimento Automático de Tríades):** WHEN exatamente 3 notas distintas (por *pitch class*) estiverem simultaneamente pressionadas ou fixadas e corresponderem a uma tríade do catálogo normativo em `src/domain/triadsData.js`, THEN the system SHALL exibir automaticamente o nome e a cifra da tríade na barra de resultado (ex.: `Dó Maior · C`) com atualização acessível (`aria-live="polite"` apenas para o texto do acorde reconhecido, sem interferir no silêncio auditivo de notas isoladas).
- **RN-08 (Fidelidade ao Design System Suíço):** The system SHALL renderizar o piano com `border-radius: 0`, contraste WCAG 2.1 AAA (teclas brancas `--ds-color-surface`, teclas pretas `--ds-color-ink`, destaque ativo `--ds-color-accent-amber`) e exclusivamente tokens `--ds-*`.

---

## 5. Contrato Técnico e Semântica de Interface

- **`src/domain/musicTheory.js`:**
  - `identifyTriadFromMidis(midiNotes)`: função pura que recebe um array de números MIDI, normaliza classes de altura (`midi % 12`) e retorna as tríades correspondentes em `TRIAD_DEFINITIONS` (priorizando a tônica mais grave quando aplicável, ou `[]` se não houver correspondência exata de 3 classes distintas).
- **`src/audio/soundEngine.js`:**
  - `triggerNote(identifier)`: dispara uma nota `.mp3` real do pool sem chamar `stopAll()`, permitindo polifonia aditiva real para multitouch e teclado físico. Mantém `onPlay` notificando os identificadores ativos para o osciloscópio.
- **`src/ui/pianoPage.js`:**
  - `PIANO_KEYS`: lista congelada das 25 teclas (MIDI 60 = Dó4 até MIDI 84 = Dó6) com `{ midi, pitch, phonetic, isSharp, shortcut }`.
  - `renderPianoPage(soundEngine, mountElement)`: monta o cabeçalho compacto do piano, aviso discreto para portrait, barra de controles (`Fixar notas`, `Tocar juntas`, `Limpar`, visor de notas/acorde reconhecido) e teclado semântico (`role="group"` com `<button type="button">` por tecla), conecta listeners com `AbortController` e retorna `teardown()`.
- **`src/ui/shell.js` e `src/main.js`:**
  - Adiciona `{ hash: '#/piano', label: 'Piano Virtual' }` em `NAV_ITEMS`, `index.html` e `ROUTES['#/piano']`.

---

## 6. Critérios de Aceitação (BDD / EARS)

- **CA-10.1 (Reconhecimento Puro de Tríades no Domínio):**  
  **Dado** o array de notas MIDI `[60, 64, 67]` (Dó, Mi, Sol),  
  **Quando** `identifyTriadFromMidis([60, 64, 67])` for invocado,  
  **Então** o domínio DEVE retornar a tríade `Dó Maior` (`id: 'c-major'`, `symbol: 'C'`).
- **CA-10.2 (Polifonia Aditiva sem Corte no `soundEngine`):**  
  **Dado** duas chamadas consecutivas a `soundEngine.triggerNote(60)` e `soundEngine.triggerNote(64)`,  
  **Quando** inspecionadas as amostras ativas,  
  **Então** ambas as instâncias `.mp3` (`28.mp3` e `32.mp3`) DEVEM permanecer tocando simultaneamente sem pausa prévia.
- **CA-10.3 (Multitouch Independente por `pointerId`):**  
  **Dado** a aba `#/piano` montada,  
  **Quando** três eventos `pointerdown` com `pointerId` distintos forem disparados nas teclas MIDI `60`, `64` e `67`,  
  **Então** todas as 3 teclas DEVEM receber o estado visual ativo simultaneamente, disparar suas amostras `.mp3` e exibir `Dó Maior` no visor.
- **CA-10.4 (Modo Acessível `Fixar notas`):**  
  **Dado** o botão `Fixar notas` ativado (`aria-pressed="true"`),  
  **Quando** o usuário clicar nas teclas `60`, `63` e `67` e acionar `Tocar juntas`,  
  **Então** o sistema DEVE manter as 3 teclas marcadas, exibir `Dó Menor` e chamar `soundEngine.playChord([60, 63, 67])`; ao clicar em `Limpar`, todas as marcas DEVEM ser removidas.
- **CA-10.5 (Atalhos de Teclado Físico e Desmontagem de Rota):**  
  **Dado** a aba `#/piano` ativa,  
  **Quando** o usuário pressionar a tecla física mapeada para Dó4 (`a`),  
  **Então** o sistema DEVE disparar `triggerNote(60)`; após navegar para `#/` (acionando `teardown`), pressionar `a` NÃO DEVE mais disparar áudio.
- **CA-10.6 (Conformidade de Layout, Acessibilidade e Tokens):**  
  **Dado** as folhas de estilo em `src/styles/`,  
  **Quando** auditadas pelo gate de tokens e testes de UI,  
  **Então** o piano DEVE usar `border-radius: 0`, `touch-action: none` apenas no teclado, aviso de orientação em portrait e 100% variáveis `--ds-*`.
