# ADR-012: Piano Virtual Polifônico, Multitouch em Landscape e Reconhecimento de Tríades no Domínio

- **Status:** Aceito
- **Data:** 2026-11-22
- **Decisora:** Juliana Chaves Palm (Software Engineer & Solution Designer)

## Contexto

A versão legada do projeto possuía uma página isolada de piano virtual que exigia instruções manuais extensas para alternar entre modo livre e modo de formação de acordes, não possuía suporte confiável a multitouch em dispositivos móveis e não se integrava ao Design System Editorial Suíço nem ao ciclo de vida SPA com `AbortController`.

Com a arquitetura DDD/SOLID consolidada, o Piano Virtual retorna como uma nova aba da SPA (`#/piano`) com foco em simplicidade imediata (zero manual), uso prioritário com o celular na horizontal (*landscape*) com multitouch nativo, acessibilidade plena por teclado e leitor de tela, e 100% de fidelidade aos arquivos acústicos `.mp3` gravados.

## Decisão

1. **Polifonia Aditiva com Amostras `.mp3` Reais (Zero Síntese):**
   - O `soundEngine` em `src/audio/soundEngine.js` mantém `playNote` e `playChord` com corte prévio (`stopAll`) para os capítulos de tríades e ganha `triggerNote(midi)` para disparo polifônico aditivo sem interromper outras notas já pressionadas.
   - Toda emissão sonora utiliza exclusivamente as 26 amostras gravadas em `public/tunes/28.mp3` a `53.mp3`, alimentando também o osciloscópio acústico de 1px no rodapé.

2. **Multitouch Nativo via Pointer Events e Responsividade WCAG 2.1 (Orientation):**
   - As teclas do piano escutam `pointerdown`, `pointerup`, `pointercancel` e `pointerleave` rastreados por `event.pointerId`, com `touch-action: none` exclusivamente no contêiner do teclado para permitir 3 ou mais dedos simultâneos sem rolagem ou zoom acidental.
   - No celular deitado (*landscape*), o teclado exibe as 2 oitavas completas (25 teclas, MIDI 60 a 84, cobrindo toda a extensão das amostras).
   - No celular em pé (*portrait*), o sistema exibe um aviso discreto sugerindo girar o aparelho na horizontal e mantém 1 oitava confortável utilizável (13 teclas, MIDI 60 a 72), cumprindo o critério WCAG 2.1 1.3.4 (*Orientation*) sem travar a tela.

3. **Interação Autoexplicativa (Zero Manual) e Modo Acessível `Fixar notas`:**
   - Por padrão, o piano opera em modo livre (toque/clique/teclado físico dispara o som imediatamente).
   - Um único controle booleano (`Fixar notas` com `aria-pressed`) permite marcar e desmarcar teclas em âmbar (`#FFB800`) para estudantes usando mouse, teclado ou leitor de tela, acompanhado apenas pelos botões `Tocar juntas` e `Limpar`.
   - No desktop, o teclado físico é mapeado para notas simultâneas (`keydown`/`keyup` ignorando `event.repeat` e teclas modificadoras), coexistindo com a navegação padrão por `Tab`/`Enter`/`Espaço`.

4. **Reconhecimento de Tríades no Domínio Puro (`src/domain/`):**
   - A função pura `identifyTriadFromMidis(midiNotes)` em `src/domain/musicTheory.js` compara um conjunto de notas MIDI pressionadas ou fixadas com o catálogo normativo `TRIAD_DEFINITIONS` (considerando classes de altura *pitch classes* módulo 12), retornando as tríades correspondentes sem duplicar regras musicais na UI.

## Consequências

### Prós
- Experiência imediata no primeiro toque, sem necessidade de manual de uso.
- Multitouch real no celular deitado e acessibilidade equivalente via `Fixar notas` e teclado físico no desktop.
- Zero dependências externas, zero som sintético e reaproveitamento integral do domínio musical, do pool de áudio (`ADR-011`) e do Design System (`ADR-008`).

### Contras e Mitigações
- O reconhecimento por *pitch class* pode encontrar equivalentes enarmônicos (ex.: `Dó♯ Maior` e `Ré♭ Maior`). Mitigação: retornar o acorde principal ou listar enarmonias de forma clara e concisa na barra de resultado.
- Em telas *landscape* muito baixas (altura < 430px), o espaço vertical é restrito. Mitigação: compactar os espaçamentos da aba do piano em `@media (orientation: landscape) and (max-height: 500px)` preservando a linha do osciloscópio no rodapé.
