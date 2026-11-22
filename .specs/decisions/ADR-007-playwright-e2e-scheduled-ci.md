# ADR-007: Testes Automatizados BDD com Gherkin, Playwright e Pipeline CI Agendada / PR

- **Status:** Aceito
- **Data:** 2026-11-15
- **Decisora:** Juliana Chaves Palm (Software Engineer & Solution Designer)

## Contexto
Embora os testes unitários via `node --test` validem com precisão as regras teóricas e a integridade de DOM isolado, a interação real do usuário no navegador envolve reprodução de áudio, navegação por teclado (`Tab`, `Enter`, `Space`), foco visível, contraste e atualização de regiões acessíveis (`aria-live`). Além disso, para assegurar rastreabilidade de negócio e transformar os critérios de aceitação do SDD em documentação viva (*living documentation*), é essencial que os cenários de teste sejam expressos em linguagem humana e executáveis diretamente no navegador.

## Decisão
Adotar o **Gherkin com `playwright-bdd`** como padrão oficial de testes End-to-End (E2E) e auditoria de acessibilidade, integrado a um workflow no **GitHub Actions**:

1. **Cenários em Gherkin (`tests/features/*.feature`):**
   * Especificação declarativa em português no formato `Funcionalidade`, `Cenário`, `Dado`, `Quando`, `Então` e `E`.
   * Mapeamento 1:1 com os Critérios de Aceitação BDD definidos nas especificações do SDD (`.specs/features/`).

2. **Step Definitions em Playwright (`tests/steps/*.js`):**
   * Implementação em JavaScript limpo e moderno, seguindo a diretriz de código 100% em inglês (`ADR-005`).
   * Validação de interações de teclado, foco, eventos de áudio e conteúdo de `#a11y-announcer`.

3. **Gatilhos da Esteira no GitHub Actions (`.github/workflows/ci.yml`):**
   * **Pull Requests (PR):** Execução obrigatória a cada abertura ou atualização de PR contra a branch `main` (bloqueando merges caso haja falha).
   * **Execução Agendada Diária (Scheduled Cron):** Execução automática diária (ex.: diariamente às 06:00 UTC) para monitoramento preventivo contra regressões em navegadores atualizados.
   * **Push na `main` e disparo manual (`workflow_dispatch`).**

4. **Isolamento de Dependências:** O ferramental BDD/Playwright reside estritamente em `devDependencies` no `package.json`, preservando a entrega final no navegador com *zero runtime dependencies*.

## Consequências
* **Prós:** Documentação viva legível por qualquer stakeholder, rastreabilidade completa entre especificação SDD e automação, cobertura E2E nos navegadores Chromium, Firefox e WebKit, e auditoria contínua de acessibilidade em CI.
* **Contras:** Requer a configuração de etapa de build dos testes BDD pelo `playwright-bdd` e download de browsers headless no ambiente de CI.

## Verificação
Coberto pelas suítes em `tests/features/`, `tests/steps/` e pelo workflow `.github/workflows/ci.yml`.
