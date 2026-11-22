# Design Técnico: FEAT-007 Arquitetura SPA e Refatoração Modular

## 1. Visão Geral da Arquitetura

A aplicação passa a operar como uma **Single Page Application (SPA) pura em Vanilla ES6**, eliminando completamente o acoplamento de páginas estáticas duplicadas.

```
                  ┌───────────────────────────────┐
                  │          index.html           │
                  │   Shell Único & #app Mount    │
                  └──────────────┬────────────────┘
                                 │
                         ┌───────▼───────┐
                         │  src/main.js  │
                         │ Hash Router   │
                         └───────┬───────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼────────┐      ┌────────▼────────┐      ┌────────▼────────┐
│   src/domain/  │      │    src/audio/   │      │     src/ui/     │
│  - triadsData  │      │  - soundEngine  │      │  - shell        │
│  - phonetics   │      │  (public/tunes) │      │  - chapterPage  │
│  - tuning      │      └─────────────────┘      │  - chordList    │
└────────────────┘                               └────────┬────────┘
                                                          │
                                                 ┌────────▼────────┐
                                                 │   src/styles/   │
                                                 │  - tokens.css   │
                                                 │  - base.css     │
                                                 │  - layout.css   │
                                                 │  - components   │
                                                 └─────────────────┘
```

---

## 2. Contratos de Módulos

### 2.1. `src/domain/` (Domínio Puro)
- **`triadsData.js`:**
  - Exporta `getTriadChords(categoryId)`.
  - Retorna a lista imutável (`Object.freeze`) das 21 tríades por categoria (`major`, `minor`, `diminished`, `augmented`), totalizando os 84 acordes normativos segundo Oswaldo Lacerda.
  - Zero dependências de DOM (`window`, `document`).
- **`phonetics.js`:**
  - Exporta funções de normalização fonética e conversão textual estrita de enarmonias e acidentes (`♯♯♯` → triplo sustenido, etc.).
- **`tuning.js`:**
  - Exporta a tabela de frequências Hz calculadas a partir de A4 = 440 Hz e o mapeamento dos 26 arquivos de áudio (`28` a `53`).

### 2.2. `src/audio/` (Motor de Áudio)
- **`soundEngine.js`:**
  - `createSoundEngine({ basePath = './public/tunes/' })`: fábrica da instância de áudio.
  - Métodos:
    - `playNote(tune)`: carrega e reproduz amostra isolada.
    - `playChord(tunes)`: reproduz 3 amostras simultâneas polifônicas.
    - `stopAll()`: interrompe reprodução imediatamente.
  - Respeita o **silêncio auditivo**: zero anúncios vocais durante reprodução sonora.

### 2.3. `src/ui/` (Interface & Acessibilidade)
- **`shell.js`:**
  - `renderShellMarkup()`: gera a casca do site com skip-links, `<header>` com botão hambúrguer mobile e lista de links com `href="#/"`, `href="#/maiores"`, `href="#/menores"`, `href="#/diminutos"`, `href="#/aumentados"`.
  - `updateActiveNav(activeHash)`: atualiza `aria-current="page"` dinamicamente.
- **`chapterPage.js`:**
  - `renderChapter(categoryId, soundEngine)`: monta o layout editorial assimétrico do capítulo, título vertical, fórmula estrutural e a falsa tabela ABNT via `chordList.js`.
  - Configura as notas de rodapé DPUB (`.editorial-noteref` e `.editorial-backlink`) quando `categoryId === 'augmented'`.
- **`chordList.js`:**
  - `renderChordMarkup(chord)`: gera a linha `<li>` com a tríade, `.cifra-col` com camada fonética `.sr-only` e botões de áudio com `aria-label="${chord.name}"` e `aria-label="${n.phonetic}"`.

### 2.4. `src/main.js` (Roteamento e Inicialização)
- Registra escuta no evento `hashchange` e `DOMContentLoaded`.
- Mapa de rotas:
  ```javascript
  const ROUTES = {
    '#/': { title: 'Home', render: renderHome },
    '#/maiores': { title: 'Acordes Maiores', categoryId: 'major', render: renderChapter },
    '#/menores': { title: 'Acordes Menores', categoryId: 'minor', render: renderChapter },
    '#/diminutos': { title: 'Acordes Diminutos', categoryId: 'diminished', render: renderChapter },
    '#/aumentados': { title: 'Acordes Aumentados', categoryId: 'augmented', render: renderChapter }
  };
  ```
- Gerencia a transição acessível:
  1. Limpa e injeta novo conteúdo no `#app`.
  2. Atualiza `document.title`.
  3. Dispara anúncio em `#route-announcer`.
  4. Move o foco para o `h1` (`focus()`).
