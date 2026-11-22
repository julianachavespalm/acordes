# FEAT-007: Arquitetura SPA Consolidada, Eliminação de Legado e Roteamento por Hash

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented |
| **Spec Owner** | Juliana Chaves Palm |
| **Prioridade** | P1 · Reestruturação Arquitetural e Higienização |
| **Decisões Arquiteturais** | [ADR-001: Arquitetura Modular Enxuta](../../decisions/ADR-001-lean-modular-architecture.md), [ADR-002: CSS 4 Camadas e Padrão ABNT](../../decisions/ADR-002-css-layers.md), [ADR-004: Acessibilidade Universal ABNT](../../decisions/ADR-004-universal-accessibility-wai-aria.md), [ADR-008: Design System Editorial Suíço](../../decisions/ADR-008-design-system-tokens-editorial-swiss.md) |
| **Aprovação** | **Approved**: 2026-11-16 - user: "perfeito, quero refatorar o código para implementar essa nova arquitetura. Importante, as alterações que fizemos está na raiz do projeto, não em pastas. então, cuidado." |
| **Diretriz de Execução** | Implementação via skill /tlc-spec-driven com Zero Runtime Dependencies, WCAG 2.1 AAA e compatibilidade nativa com GitHub Pages. |
| **Implementação** | `index.html`, `src/main.js`, `src/domain/*`, `src/audio/*`, `src/ui/*`, `src/styles/*`, `public/tunes/*` |
| **Verificação** | `tests/ui/main.test.js`, `tests/ui/chordList.test.js`, `tests/ui/chapterPage.test.js` |

---

## 2. Contexto e Declaração de Valor

O projeto Acordes Básicos evoluiu para consolidar suas telas em uma Arquitetura SPA (Single Page Application) com Casca Única (`index.html`) e Roteamento por Hash (`#/maiores`, `#/menores`, `#/diminutos`, `#/aumentados`). Essa evolução técnica entrega carregamento instantâneo, compatibilidade nativa com hospedagem estática no GitHub Pages sem risco de erro 404, anúncio dinâmico para tecnologia assistiva (`aria-live="polite"`), foco programático no título principal e estrito isolamento da camada de domínio musical puro.

### História de Usuário (User Stories)

**Como** pessoa cega navegando com leitor de tela ou estudante de música utilizando o GitHub Pages,  
**Eu quero** alternar entre os capítulos de acordes e a home de forma instantânea sem recarregamento de página e ouvindo o anúncio claro de cada tela carregada,  
**Para que** eu navegue pelo guia com foco preservado, fluidez total e sem riscos de links quebrados ou telas 404.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| **Único Shell HTML (`index.html`):** casca semântica única montando Home ou Capítulos via `src/main.js` | Elimina duplicação de cabeçalho, menu e rodapé | Múltiplos arquivos HTML redundantes | DRY absoluto |
| **Roteamento por Hash (`#/maiores`, etc.):** escuta do evento `hashchange` com fallback para Home (`#/`) | Roteamento 100% compatível com GitHub Pages sem erros 404 no reload | Roteamento por History API sem servidor | Causaria 404 em reload no GitHub Pages |
| **Acessibilidade de Rota (WCAG 2.1 AAA):** região `aria-live="polite"` anunciando o capítulo e foco no `h1` | Leitores de tela são imediatamente notificados da mudança de tela | Transições silenciosas de rota | Usuários cegos ficariam desorientados |
| **Domínio Musical Puro (`src/domain/`):** separação de `triadsData.js`, `phonetics.js` e `tuning.js` sem DOM | Permite testes unitários ultrarrápidos e determinísticos | Dados misturados com controladores de interface | Clean Architecture |
| **Amostras Exatas (`public/tunes/`):** estritamente as 26 amostras acústicas existentes (`28.mp3` a `53.mp3`) | Carrega apenas os arquivos utilizados pelas 84 tríades | Conjunto completo de 88 notas de piano | Economia de banda e zero arquivos órfãos |
| **Remoção de Código Morto:** consolidação de arquivos órfãos de versões anteriores | Higienização completa da base de código | Piano visual ou teclado interativo | O foco pedagógico é o estudo de tríades |
| **Design System Centralizado (`src/styles/`):** `tokens.css`, `base.css`, `layout.css`, `components.css` | Estrutura limpa de 4 camadas semânticas | CSS inline ou frameworks de terceiros | Manutenção da pureza do Design Suíço |

---

## 4. Especificação Funcional e Regras de Negócio

- **RN-01 (Shell Único e Roteamento):** The system SHALL renderizar o conteúdo dentro do container principal `<main id="app">`:
  - `#/` ou vazio: Capa Editorial da Home.
  - `#/maiores`: Capítulo de Acordes Maiores.
  - `#/menores`: Capítulo de Acordes Menores.
  - `#/diminutos`: Capítulo de Acordes Diminutos.
  - `#/aumentados`: Capítulo de Acordes Aumentados (com notas de rodapé DPUB).
  - Qualquer outro hash: redireciona para `#/`.
- **RN-02 (Acessibilidade de Transição de Rota):** The system SHALL:
  1. Atualizar o `document.title` com o padrão `"[Nome da Página] · Acordes Básicos"`.
  2. Atualizar o atributo `aria-current="page"` exclusivamente no link de navegação ativo.
  3. Emitir anúncio na região viva `<div id="route-announcer" class="sr-only" aria-live="polite" aria-atomic="true">` informando `"[Nome da Página] carregada"`.
  4. Mover o foco do teclado para o título principal (`h1`) com `tabindex="-1"`.
- **RN-03 (Domínio Puro sem Dependência de DOM):** The system SHALL manter os 84 acordes normativos, as frequências de afinação (A4 = 440 Hz) e as regras de fonética em módulos ES6 puros sob `src/domain/`, sem referências a `window` ou `document`.
- **RN-04 (Isolamento de Áudio e Caminhos Relativos):** The system SHALL reproduzir os acordes e notas utilizando as 26 amostras localizadas em `./public/tunes/`, utilizando caminhos estritamente relativos para garantir funcionamento no GitHub Pages em qualquer subdiretório.

---

## 5. Contrato Técnico e Semântica de Interface

- Ponto de entrada: `index.html` com container `<main class="site-main" id="app" tabindex="-1">`.
- Links de navegação: `<a href="#/" class="nav-link">Home</a>`, `<a href="#/maiores" class="nav-link">Acordes Maiores</a>`, etc.
- Anunciador acessível: `<div id="route-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>`.
- Motor de rotas: `src/main.js` exportando `ROUTES`, `normalizeHash`, `handleRouteChange`, `initApp`.

---

## 6. Critérios de Aceitação

- **CA-01 (Navegação SPA por Hash):**
  - Given que o usuário está na aplicação,
  - When ele clica no link "Acordes Menores",
  - Then a URL altera para `#/menores`,
  - And o título da página torna-se "Acordes Menores · Acordes Básicos",
  - And a lista das 21 tríades menores é exibida na falsa tabela ABNT,
  - And o foco é transferido para o título do capítulo.
- **CA-02 (Atualização de aria-current):**
  - Given que o hash ativo é `#/aumentados`,
  - When o menu de navegação é inspecionado,
  - Then o link correspondente possui `aria-current="page"` e os demais links não possuem esse atributo.
- **CA-03 (Anúncio Acessível de Rota):**
  - Given uma alteração de rota para `#/diminutos`,
  - When o container `#app` for renderizado,
  - Then o elemento `#route-announcer` deve conter o texto "Capítulo de Acordes Diminutos carregado".
- **CA-04 (Persistência das Funcionalidades Musicais e DPUB):**
  - Given a navegação para `#/aumentados`,
  - When as notas com triplo sustenido forem renderizadas,
  - Then as chamadas `1` (`.editorial-noteref`) e a nota de rodapé com retorno (`.editorial-backlink`) devem funcionar com trânsito bidirecional de foco,
  - And os gatilhos `.chord-trigger` devem conter `aria-label="${chord.name}"`.
- **CA-05 (Execução dos Validadores de Governança):**
  - Given a conclusão da reestruturação,
  - When for executado `npm run verify`,
  - Then todos os testes devem passar (100% verdes), sem valores hardcoded e em conformidade com as regras SDD.
