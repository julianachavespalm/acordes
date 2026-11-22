# ADR-001: Arquitetura Modular Enxuta em ES6 Nativo (Zero Runtime Dependencies)

- **Status:** Aceito
- **Data:** 2026-11-15
- **Decisora:** Juliana Chaves Palm

## Contexto
O projeto `acordes` é uma aplicação web educacional estática e acessível cujo propósito é o ensino de tríades musicais para pessoas com deficiência visual. Frameworks pesados de Single Page Application (como React, Angular ou Vue) ou um backend dedicado introduziriam sobrecarga de build, consumo desnecessário de recursos de rede e complexidade operacional dispensável para uma aplicação puramente de cliente hospedável via GitHub Pages.

## Decisão
Estruturar o sistema em módulos ECMAScript 2015 (ES6) nativos em `src/js/`, desacoplando rigorosamente a camada de **Domínio Puro** (teoria musical e catálogo de tríades) da camada de **Apresentação e DOM** (controlador de tabelas, shell e acessibilidade) e da camada de **Infraestrutura/Áudio** (player de som). Toda injeção de dependências de ambiente (`window`, `document`, elementos) é feita explicitamente via parâmetros, viabilizando execução de testes unitários sem emulação pesada.

## Consequências
* **Prós:** Zero dependências de tempo de execução (*zero runtime dependencies*), carregamento instantâneo no navegador, manutenibilidade exemplar e testabilidade unitária de 100% da lógica harmônica.
* **Contras:** A reatividade e sincronização do DOM com os dados do acorde devem ser gerenciadas explicitamente via manipuladores de eventos limpos.

## Verificação
Coberto pelas suítes de teste de teoria musical e integração de DOM em `tests/`.
