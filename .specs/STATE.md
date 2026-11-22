# STATE

## Decisions

### AD-001
- **Decision**: Arquitetura Modular Enxuta em ES6 Nativo com Zero Runtime Dependencies (Pure Domain Logic separada de DOM).
- **Reason**: Aplicação educacional estática para GitHub Pages não necessita de frameworks pesados nem backend; funções puras facilitam TDD.
- **Trade-off**: Sem reatividade mágica de frameworks SPA; manipulação de DOM explícita e controlada por injeção de dependências.
- **Scope**: Todo o projeto JavaScript em `src/js/`.
- **Date**: 2026-11-15
- **Status**: active

### AD-002
- **Decision**: Arquitetura CSS em 4 camadas (`tokens.css`, `base.css`, `layout.css`, `components.css`), Design Editorial Suíço e Padrão Tabular ABNT (apenas 3 linhas horizontais, sem bordas verticais, grid assimétrico de capítulo com h1 verticalizado 180px e fórmula na base).
- **Reason**: Proporciona estética de livro didático contemporâneo de alto nível, contraste WCAG 2.1 AAA (tinta preta #111111 sobre papel #FAFAFA/#FFFFFF) e total fidelidade às normas ABNT.
- **Trade-off**: Requer disciplina na cascata e no uso de `writing-mode`.
- **Scope**: Todos os estilos em `src/css/`.
- **Date**: 2026-11-15
- **Status**: active

### AD-003
- **Decision**: Síntese sonora polifônica em tempo real via Web Audio API com frequências fundamentais exatas em Hertz (Hz).
- **Reason**: Garante latência ultrabaixa (< 10ms), suporte completo às 21 tríades por categoria (com enarmonias complexas), zero dependências externas e execução 100% no navegador sem arquivos de áudio pesados.
- **Trade-off**: Timbre procedural calibrado com envelope ADSR para evitar cliques e estalos acústicos.
- **Scope**: Camada de áudio em `src/js/audio/soundEngine.js`.
- **Date**: 2026-11-15
- **Status**: active

### AD-004
- **Decision**: Acessibilidade universal de ponta a ponta com Falsa Tabela Estilo ABNT (lista semântica `<ul>`/`<li>`, cabeçalho `aria-hidden="true"`, sem tags `<table>`), Camada Fonética descritiva `.sr-only`, Silêncio Auditivo (sem `aria-live` sobre o som), Feedback Âmbar `#FFB800` e Duplo Skip-Link.
- **Reason**: Pessoas cegas leem texto corrido e listas de forma muito mais fluida do que tabelas tradicionais (que geram ruído de coordenadas); o silêncio auditivo evita que a voz do leitor de tela concorra com o som das notas.
- **Trade-off**: Exige estruturação manual de transcrições fonéticas para as 84 tríades e sincronização de classes visuais `.playing`.
- **Scope**: Toda a marcação HTML, componentes e acessibilidade assistiva.
- **Date**: 2026-11-15
- **Status**: active

### AD-005
- **Decision**: Padrão estrito de código em inglês e comentários autoexplicativos em português se, e somente se, forem estritamente necessários.
- **Reason**: Código expressivo e autoexplicativo (Clean Code) com terminologia internacional de engenharia e música, reservando comentários objetivos em português apenas para exceções e rationale de domínio.
- **Trade-off**: Requer nomenclatura altamente descritiva em inglês para entidades harmônicas e de áudio.
- **Scope**: Todo o código-fonte (`src/js/`, `src/css/`, `tests/` e identificadores).
- **Date**: 2026-11-15
- **Status**: active

### AD-006
- **Decision**: Suíte de testes determinísticos utilizando o test runner nativo `node --test` e asserções nativas `node:assert`.
- **Reason**: Execução ultrarrápida, zero dependências pesadas de terceiros e integração fluida em CI com Node.js nativo.
- **Trade-off**: Ausência de matchers visuais externos, compensada por assertividade pura e determinística.
- **Scope**: Todas as suítes de teste em `tests/`.
- **Date**: 2026-11-15
- **Status**: active

### AD-007
- **Decision**: Testes Automatizados BDD com Gherkin (`.feature`) e Playwright (`playwright-bdd`), integrados a pipeline CI/CD no GitHub Actions com execução diária agendada (cron) e validação em Pull Requests.
- **Reason**: Transforma os critérios de aceitação do SDD em documentação viva (*living documentation*) em Gherkin e garante auditoria contínua da experiência real no navegador (reprodução de áudio, navegação por teclado, foco visível e anúncios aria-live) tanto a cada PR quanto em checagem preventiva diária.
- **Trade-off**: Introduz ferramental BDD e Playwright como dependências de desenvolvimento (devDependencies no package.json) e consumo de minutos de CI.
- **Scope**: Cenários Gherkin em `tests/features/`, steps em `tests/steps/` e workflow `.github/workflows/ci.yml`.
- **Date**: 2026-11-15
- **Status**: active

### AD-008
- **Decision**: Design System Editorial Suíço formalizado em tokens CSS nativos (`tokens.css`), governando cores de alto contraste (tinta #111111 sobre papel #FAFAFA, destaque âmbar #FFB800), tipografia neutra ('Inter'/'Plus Jakarta Sans', base 18px, entrelinha 1.6), grid de capítulo assimétrico (180px 1fr) e medida de leitura de 65ch, com auditoria matemática de contraste WCAG 2.1 AAA.
- **Reason**: Estabelece fonte única da verdade (Single Source of Truth) para o design visual e garante conformidade de acessibilidade comprovada por cálculo de luminância em suíte de testes automatizados.
- **Trade-off**: Exige uso estrito das variáveis `--ds-*` em todas as camadas CSS.
- **Scope**: Todas as folhas de estilo em `src/css/` e testes visuais em `tests/ui/designSystem.test.js`.
- **Date**: 2026-11-15
- **Status**: active

### AD-009
- **Decision**: Escala Tipográfica Modular Minor Third (razão 1.200) com base 18px e governança estática contra valores literais de font-size via AST/Regex em `validate-tokens.mjs`.
- **Reason**: Unifica rigorosamente a hierarquia visual suíça entre a Home e os quatro capítulos de tríades, eliminando tamanhos díspares e valores hardcoded em CSS.
- **Trade-off**: Requer que todo novo seletor CSS consuma estritamente variáveis `--ds-font-size-*`.
- **Scope**: Todas as folhas de estilo em `src/styles/` e validação em `scripts/validate-tokens.mjs`.
- **Date**: 2026-11-17
- **Status**: active

### AD-010
- **Decision**: Seleção e cópia de texto liberadas: remoção de `user-select: none`, dos interceptores `copy`/`cut`/`selectstart` e de `preventTextSelectionAndCopy`.
- **Reason**: Decisão de evolução de usabilidade didática da autora: permitir que estudantes e pesquisadores copiem livremente cifras, nomes e notas para seus cadernos de estudo.
- **Trade-off**: O texto editorial pode ser copiado por terceiros.
- **Scope**: `src/styles/`, `src/ui/shell.js`, `src/ui/chordList.js` e seus testes.
- **Date**: 2026-11-18
- **Status**: active

### AD-011
- **Decision**: Pool de áudio por amostra (no máximo 26 instâncias) com `preload` ocioso do capítulo, e contrato de desmontagem de rotas com `AbortController` nativo.
- **Reason**: Evolução de arquitetura de runtime para otimizar o consumo de dados e memória em dispositivos móveis e formalizar o ciclo de vida de desmontagem de rotas no SPA.
- **Trade-off**: Cada página nova precisa devolver `teardown`; um teste de contrato percorre `ROUTES`.
- **Scope**: `src/audio/soundEngine.js`, `src/main.js`, `src/ui/chapterPage.js`, `src/ui/chordList.js`, `src/domain/musicTheory.js` e seus testes.
- **Date**: 2026-11-18
- **Status**: active

## Handoff

- **Feature**: FEAT-009-Otimizacao-de-Runtime-e-Usabilidade
- **Phase / Task**: Phase 3 (Tasks) - Especificação, design e tarefas reescritos sob a ótica de evolução de produto e escopo
- **Completed**: FEAT-001 a FEAT-008 (especificações e tarefas revisadas), AD-001 a AD-011 ativos
- **In-progress**: FEAT-009 (pronta para execução)
- **Next step**: Criar branch dedicada a partir da main e iniciar execução atômica
- **Blockers**: none
- **Uncommitted files**: .specs/
- **Branch**: main
