# FEAT-009: Otimização de Performance, Ciclo de Vida e Usabilidade Didática

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Ready for Implementation |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · Refinamento de Runtime e Expansão de Usabilidade |
| **Decisões Arquiteturais** | [ADR-001: Arquitetura Modular Enxuta](../../decisions/ADR-001-lean-modular-architecture.md), [ADR-002: CSS 4 Camadas](../../decisions/ADR-002-css-layers.md), [ADR-008: Design System Editorial Suíço](../../decisions/ADR-008-design-system-tokens-editorial-swiss.md), [ADR-010: Política de Seleção e Cópia Aberta](../../decisions/ADR-010-open-text-selection-policy.md), [ADR-011: Audio Pool e Ciclo de Vida de Rotas](../../decisions/ADR-011-audio-pool-and-route-teardown.md) |
| **Aprovação** | 2026-11-18 |
| **Diretriz de Execução** | Otimização de recursos móveis, contrato de ciclo de vida com AbortController nativo, usabilidade didática aberta e fonte única de estilos. |
| **Implementação** | `src/audio/soundEngine.js`, `src/domain/musicTheory.js`, `src/main.js`, `src/ui/chapterPage.js`, `src/ui/chordList.js`, `src/ui/shell.js`, `src/styles/*` |
| **Verificação** | `tests/audio/soundEngine.test.js`, `tests/ui/main.test.js`, `tests/ui/chapterPage.test.js`, `tests/ui/chordList.test.js`, `tests/ui/shell.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

Com a arquitetura SPA consolidada e o design visual unificado, esta especificação formaliza uma evolução deliberada de escopo em quatro frentes de refinamento:
1. **Otimização de Performance e Recursos Móveis:** Introdução de um Audio Pool limitando a criação a no máximo 26 instâncias reaproveitáveis de áudio, acompanhado de pré-carregamento adaptativo das amostras do capítulo aberto durante momentos ociosos do navegador (`requestIdleCallback`), sem consumir dados quando a usuária estiver em modo `Save-Data` ou redes móveis 2G.
2. **Ciclo de Vida do Roteador SPA:** Estabelecimento de um contrato formal de desmontagem (`teardown`) executado na transição de rotas, utilizando `AbortController` nativo para cancelar pré-carregamentos pendentes e gerenciar ouvintes de interface.
3. **Expansão da Usabilidade Didática:** Liberação irrestrita de seleção e cópia de texto, permitindo que estudantes e pesquisadores copiem cifras, intervalos e notas diretamente para seus cadernos de anotação.
4. **Consolidação Estrutural de Estilos:** Unificação definitiva dos arquivos CSS em `src/styles/` como fonte única da verdade, eliminando a pasta espelho `src/css/`.

### Histórias de Usuário (User Stories)

**Como** estudante de música utilizando o guia em celular ou conexões móveis,  
**Eu quero** que as amostras de piano soem sem atraso no toque e com consumo consciente de memória e dados,  
**Para que** eu estude confortavelmente por longos períodos em qualquer dispositivo.

**Como** estudante que anota conteúdos de harmonia,  
**Eu quero** selecionar e copiar livremente os nomes dos acordes e suas notas,  
**Para que** eu monte meus próprios resumos pedagógicos e cadernos de estudo.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| **Audio Pool com até 26 instâncias:** reuso fixo de instâncias de áudio mapeadas por identificador de amostra | Reduz consumo de memória e pressão sobre o Garbage Collector do navegador | Download indiscriminado de amostras que o capítulo não utiliza | Economia deliberada de banda para quem usa celular |
| **Pré-carregamento adaptativo ocioso:** carrega amostras do capítulo aberto em segundo plano; sob demanda em `Save-Data` ou 2G | Latência imperceptível no toque sem onerar usuários de planos de dados restritos | Pré-carregamento imediato bloqueante da thread principal | A renderização visual e a acessibilidade têm prioridade |
| **Contrato de Desmontagem (`teardown`):** `main.js` executa limpeza da rota anterior com `AbortController` | Garante transições de rota limpas e cancelamento de tarefas pendentes | Frameworks externos de gerenciamento de estado | Preserva Vanilla ES6 nativo com Zero Runtime Dependencies |
| **Seleção e Cópia Abertas:** remoção de `user-select: none` e interceptores de eventos de cópia | Empodera o estudante para registrar e anotar o material de estudo | Mecanismos de DRM ou bloqueio de inspeção | O projeto é um material didático livre e aberto |
| **Consolidação em `src/styles/`:** exclusão definitiva de `src/css/` e atualização de referências | Elimina risco de divergência entre arquivos duplicados | Modificações no Design System já aprovado | Mantém as 4 camadas consolidadas |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Audio Pool por Amostra):** The system SHALL criar no máximo uma instância de `Audio` por identificador de amostra sonora em `public/tunes/`, reaproveitando essa mesma instância em todas as execuções subsequentes.
- **RN-02 (Pré-carregamento Adaptativo de Capítulo):** WHEN uma rota de capítulo for renderizada, THEN the system SHALL pré-carregar em momentos ociosos (`requestIdleCallback`) exclusivamente as amostras pertencentes àquele capítulo.
- **RN-03 (Respeito a Economia de Dados Móveis):** IF o navegador indicar `Save-Data: on` ou tipo de conexão efetiva `slow-2g` / `2g`, THEN the system SHALL NÃO efetuar pré-carregamento, carregando cada amostra apenas sob demanda no primeiro toque.
- **RN-04 (Home sem Pré-carregamento):** WHEN a rota Home (`#/`) for carregada, THEN the system SHALL NÃO pré-carregar nenhuma amostra sonora.
- **RN-05 (Contrato de Desmontagem de Rota):** WHEN ocorrer transição de rota no roteador SPA, THEN the system SHALL executar a função `teardown` da rota anterior antes de renderizar a nova tela, abortando pré-carregamentos pendentes via `AbortController`.
- **RN-06 (Navegação de Rodapé Unificada):** The system SHALL gerenciar as notas de rodapé DPUB via ouvinte delegado único no contêiner montado, com cancelamento associado ao ciclo de vida da tela.
- **RN-07 (Seleção e Cópia Livres):** The system SHALL permitir a livre seleção e cópia de qualquer texto em todas as rotas da aplicação, sem interceptação de eventos `copy`, `cut` ou `selectstart`.
- **RN-08 (Fonte Única de Estilos):** The system SHALL manter `src/styles/` como o único diretório de folhas de estilo da aplicação.

---

## 5. Contrato Técnico e Semântica de Interface

- **`src/audio/soundEngine.js`:**
  - `createSoundEngine(options)`: gerencia pool interno `Map<string, HTMLAudioElement>`.
  - `preload(tuneIds, { signal })`: pré-carrega amostras em lote respeitando sinal de cancelamento e estado de conexão.
  - Mantém assinaturas de `playNote`, `playChord`, `stopAll` e `getActiveAudios`.
- **`src/domain/musicTheory.js`:**
  - `getChapterTunes(categoryId)`: função pura que retorna a lista única e ordenada de identificadores de amostras de um capítulo.
- **`src/main.js`:**
  - `handleRouteChange`: invoca a `teardown` da rota ativa antes da renderização da próxima rota.
- **`src/ui/chapterPage.js`:**
  - `renderChapterPage`: instancia `AbortController`, dispara pré-carregamento adaptativo e retorna função `teardown`.

---

## 6. Critérios de Aceitação (BDD / EARS)

- **CA-09.1 (Reaproveitamento de Instâncias no Pool):**  
  **Dado** uma tríade qualquer acionada 20 vezes consecutivas,  
  **Quando** inspecionado o número de instâncias de áudio criadas,  
  **Então** o sistema DEVE conter no máximo 3 instâncias alocadas na memória.
- **CA-09.2 (Pré-carregamento Ocioso com Cancelamento):**  
  **Dado** o carregamento de um capítulo de acordes,  
  **Quando** o usuário navega para outra rota antes do término do pré-carregamento,  
  **Então** as requisições ociosas pendentes DEVEM ser imediatamente abortadas.
- **CA-09.3 (Comportamento sob Conexão Restrita):**  
  **Dado** um ambiente com `navigator.connection.saveData === true`,  
  **Quando** um capítulo for aberto,  
  **Então** nenhuma amostra de áudio DEVE ser baixada antes do primeiro clique do usuário.
- **CA-09.4 (Livre Seleção de Texto):**  
  **Dado** qualquer texto editorial, cifra ou nota na interface,  
  **Quando** o usuário seleciona e copia o texto,  
  **Então** o evento de cópia NÃO DEVE ser cancelado por `preventDefault()`.
