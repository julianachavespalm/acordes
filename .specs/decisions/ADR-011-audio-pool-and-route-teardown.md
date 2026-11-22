# ADR-011: Pool de Áudio por Amostra e Contrato de Desmontagem de Rotas

- **Status:** Aceito
- **Data:** 2026-11-18
- **Decisora:** Juliana Chaves Palm (Software Engineer & Solution Designer)

## Contexto

O parecer do ARB de 2026-11-18 apontou dois riscos HIGH no runtime. O `soundEngine.js` cria um `new Audio(src)` a cada clique. O `chapterPage.js` registra listeners no `#app` a cada visita ao capítulo de aumentados, e o `main.js` não oferece nenhum contrato de desmontagem entre rotas. A pergunta de design foi "qual abordagem usar para o ciclo de vida das rotas?", com três opções de mesmo escopo: contrato explícito de desmontagem, delegação única de eventos e recriação do `#app` a cada rota.

## Decisão

Escolha da mantenedora: contrato explícito de desmontagem com `AbortController` nativo.

### 1. Pool de áudio
- O `createSoundEngine` guarda um `Map` de id da amostra para `HTMLAudioElement`, com no máximo 26 entradas.
- `playNote` e `playChord` reutilizam a entrada do pool; só criam uma instância na primeira vez que a amostra é pedida.
- A API existente (`playNote`, `playChord`, `stopAll`, `getActiveAudios`) não muda. A engine ganha `preload(tuneIds, { signal })`.
- O pré-carregamento acontece em momento ocioso, uma amostra por callback, e não ocorre com `Save-Data` ligado ou conexão `slow-2g`/`2g`.
- Uma amostra que falha sai do pool, e o próximo clique tenta de novo.

### 2. Contrato de desmontagem
- Toda função de rota em `ROUTES` pode devolver uma função `teardown`. Devolver nada equivale a uma desmontagem vazia.
- O `handleRouteChange` guarda a `teardown` da rota atual e a executa antes de montar a próxima.
- As páginas criam um `AbortController` por montagem. O `signal` vai para os listeners e para `preload`. A `teardown` chama `abort()`.
- As notas de rodapé passam a ter um único listener delegado no elemento montado, nunca um por elemento somado a um delegado.

## Consequências

### Prós
- No máximo 26 instâncias de `Audio` e nenhum acúmulo de listeners, mesmo depois de muitas trocas de rota.
- O ciclo de vida fica visível no código e é testável com objetos falsos, sem navegador.
- Zero dependências de runtime.

### Contras e Mitigações
- Cada página nova precisa lembrar de devolver `teardown`. Mitigação: um teste de contrato percorre `ROUTES` e confere que `handleRouteChange` executa a `teardown` devolvida.
- Instâncias de `Audio` ficam na memória até a aba fechar (no máximo 26, cerca de 0,7 MB em arquivos). Mitigação: é o objetivo do pool.
