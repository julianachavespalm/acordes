# Atributos de Qualidade do Sistema (Quality Attributes)

Os atributos de qualidade do `acordes` norteiam as decisões técnicas de Solution Design e arquitetura, garantindo que os requisitos não-funcionais sejam medidos e auditados objetivamente.

---

## 1. Acessibilidade (Accessibility — WCAG 2.2 AAA)
* **Requisito:** A aplicação deve ser 100% utilizável por pessoas cegas ou com baixa visão utilizando tecnologias assistivas (NVDA, JAWS, VoiceOver, TalkBack) ou navegação exclusivamente via teclado.
* **Métrica:**
  * Razão de contraste mínima de texto e fundo: $CR \ge 7:1$ (nível AAA estrito). A paleta monocromática do projeto atinge $CR \ge 19:1$.
  * Sem armadilhas de teclado (*no keyboard traps*): percurso linear sequencial com `:focus-visible` destacado.
  * Presença obrigatória de skip link acessível como primeiro elemento focável.
  * Região dinâmica `aria-live="polite"` para audiodescrição de cada ação sonora disparada.

---

## 2. Desempenho e Latência (Performance & Latency)
* **Requisito:** O tempo de resposta perceptual ao acionar um acorde ou nota deve ser imediato (< 50ms).
* **Métrica:**
  * Tamanho total do pacote inicial de código: < 30 KB transferidos (HTML, CSS modular e JS puro).
  * Latência de áudio: pré-carregamento sob demanda das amostras de piano em `src/tunes/`, eliminando delays perceptíveis no clique.
  * Execução da suíte completa de testes unitários: < 200ms via `node --test`.

---

## 3. Testabilidade e Determinismo (Testability)
* **Requisito:** Todas as regras teóricas de música, formação de acordes, cálculos enarmônicos e contratos de áudio devem ser verificáveis de forma determinística sem intervenção manual.
* **Métrica:**
  * 100% de cobertura nos testes de domínio da teoria musical (`musicTheory.test.js`).
  * Automação BDD com Playwright executando cenários Gherkin em navegadores headless nos Pull Requests e diariamente via cron no GitHub Actions.

---

## 4. Sustentabilidade e Portabilidade (Maintainability & Zero-Ops)
* **Requisito:** A solução deve rodar sem custo de infraestrutura ou servidores dinâmicos, com ciclo de vida perene no GitHub Pages.
* **Métrica:**
  * Zero dependências de tempo de execução (*zero runtime dependencies*).
  * Código modular em ES6 nativo suportado por 100% dos navegadores modernos (Evergreen Browsers).
