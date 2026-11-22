# FEAT-005: Home Editorial — Livro Didático Contemporâneo e Estilo Suíço

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented |
| **Spec Owner** | Juliana Chaves Palm |
| **Prioridade** | P1 · Porta de Entrada Editorial |
| **Decisões Arquiteturais** | [ADR-001: Arquitetura Modular Enxuta](../../decisions/ADR-001-lean-modular-architecture.md), [ADR-002: CSS 4 Camadas e Estilo Suíço](../../decisions/ADR-002-css-layers.md), [ADR-004: Acessibilidade Universal ABNT](../../decisions/ADR-004-universal-accessibility-wai-aria.md) |
| **Aprovação** | 2026-11-15 |
| **Diretriz de Execução** | Estilo Editorial Suíço, Contraste WCAG 2.1 AAA e tipografia proporcional. |
| **Captura Vinculante** | `captures/home.jpg` |
| **Implementação** | `src/ui/homePage.js`, `src/styles/layout.css`, `src/styles/components.css` |
| **Verificação** | `tests/ui/home.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

A página inicial introduz o estudo das tríades com a estética de abertura de um livro didático contemporâneo de música: generoso respiro em branco, tipografia sem serifa geométrica límpida (`Inter`) e contraste máximo de tinta preta `#111111` sobre fundo papel `#FAFAFA` ($CR > 18.5:1$). A navegação superior destaca a página `Home` com `aria-current="page"` e o topo disponibiliza duplo skip-link para usuários de teclado.

### História de Usuário (User Story)

**Como** estudante de música ou leitor com baixa visão,  
**Eu quero** uma recepção editorial límpida, com alto contraste e leitura fluida sem poluição visual,  
**Para que** eu compreenda a proposta pedagógica do guia de tríades antes de explorar os acordes práticos.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Tipografia editorial com título `h1` "Acordes Básicos", subtítulos formais e 3 parágrafos fluidos (largura máxima 65ch) | Fidelidade absoluta à estética de livro didático | Banners publicitários ou caixas decorativas | Preserva a pureza do design suíço |
| Contraste preto #111111 sobre papel #FAFAFA ($CR > 18.5:1$) | Atende com folga ao critério de sucesso WCAG 2.1 AAA | Temas coloridos saturados ou gradientes | O foco é a legibilidade ergonômica máxima |
| Recepção textual límpida sem disparo automático de som | Garante silêncio cognitivo inicial para o estudante | Efeitos sonoros na página inicial | A página inicial é estritamente de introdução e leitura |
| Rodapé minimalista centralizado (`© 2024 Juliana Chaves Palm`) | Fechamento institucional sóbrio e sem poluição | Rodapés densos com múltiplas colunas de links | O projeto é um guia de estudo editorial |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Composição Tipográfica da Abertura):** The system SHALL renderizar na página Home:
  - `<h1>` com `"Acordes Básicos"`.
  - Subtítulo formal em caixa alta: `"ESTUDO DAS TRÍADES"` e `"MAIORES, MENORES, DIMINUTOS E AUMENTADOS"`.
  - Três parágrafos conceituais com largura máxima ergonômica de 65 caracteres (`max-width: 65ch`).
- **RN-02 (Indicação da Home Ativa):** The system SHALL identificar o link `Home` no cabeçalho com `aria-current="page"` quando a rota ativa for `#/`.
- **RN-03 (Duplo Skip-Link):** The system SHALL manter os dois links acessíveis de salto no topo do documento.
- **RN-04 (Rodapé Editorial Centralizado):** The system SHALL renderizar o rodapé centralizado com o crédito autoral `"© 2024 Juliana Chaves Palm"`.

---

## 5. Contrato Técnico e Semântica de Interface

- **Módulo:** `src/ui/homePage.js`
  - `renderHomePage(mountElement)`: monta a capa editorial dentro do elemento contêiner.
- **Estilos:** `src/styles/layout.css` e `src/styles/components.css`.

---

## 6. Critérios de Aceitação (BDD / EARS)

- **CA-05.1 (Estrutura Editorial):**  
  **Dado** o carregamento da Home,  
  **Quando** inspecionado o elemento `#app`,  
  **Então** o título `h1`, subtítulos e parágrafos devem existir com largura contida a 65ch.
- **CA-05.2 (Contraste Matemático WCAG AAA):**  
  **Dado** as cores `#111111` sobre `#FAFAFA`,  
  **Quando** auditada a luminância relativa,  
  **Então** a razão de contraste DEVE ser superior a 7:1 (alcançando conformidade AAA).
