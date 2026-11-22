# FEAT-003: Shell de Navegação, Design Suíço e Menu Responsivo Acessível

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · Estrutura e Navegação Editorial |
| **Decisões Arquiteturais** | [ADR-001: Arquitetura Modular Enxuta](../../decisions/ADR-001-lean-modular-architecture.md), [ADR-002: CSS 4 Camadas](../../decisions/ADR-002-css-layers.md), [ADR-004: Acessibilidade Universal ABNT](../../decisions/ADR-004-universal-accessibility-wai-aria.md), [ADR-008: Design System Editorial Suíço](../../decisions/ADR-008-design-system-tokens-editorial-swiss.md) |
| **Aprovação** | 2026-11-15 |
| **Diretriz de Execução** | Design Tipográfico Suíço, WCAG 2.1 AAA, navegação por teclado e leitor de tela sem barreiras. |
| **Implementação** | `src/ui/shell.js`, `src/styles/components.css`, `src/styles/layout.css` |
| **Verificação** | `tests/ui/shell.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

A navegação e a moldura global da aplicação seguem o Estilo Tipográfico Suíço: composição sóbria, espaço em branco intencional, tipografia geométrica precisa e sem ornamentos desnecessários. A acessibilidade universal é garantida por dois links de salto no topo (para o conteúdo principal e para o menu) e foco visível de alto contraste. Para acomodar telas estreitas e dispositivos móveis com fidelidade editorial, a navegação horizontal evolui de forma responsiva para um botão hambúrguer flutuante discreto com painel dropdown em overlay, preservando a lista semântica para leitores de tela.

### História de Usuário (User Story)

**Como** usuário navegando por teclado, celular ou leitor de tela,  
**Eu quero** uma barra de navegação fluida, links de salto imediatos e um menu responsivo que não bloqueie a leitura assistiva,  
**Para que** eu navegue confortavelmente entre as 5 seções do guia em qualquer tamanho de tela.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Navegação unificada com as 5 seções do guia (`Home`, `Acordes Maiores`, `Acordes Menores`, `Acordes Diminutos`, `Acordes Aumentados`) | Reflete a estrutura pedagógica essencial das 4 categorias de tríades | Seções adicionais ou aba de piano virtual | O guia é estritamente focado no estudo didático de tríades |
| Menu hambúrguer flutuante responsivo (`<= 960px`) com painel dropdown flutuante | Evita quebra feia de linha de texto em telas compactas | Menus complexos multiníveis com submenus aninhados | A hierarquia de páginas é horizontal e direta |
| Preservação da lista semântica `<nav>` e `<ul role="list">` na árvore de acessibilidade | Leitores de tela mantêm navegação linear ininterrupta | Bloqueio de foco ou modais intrusivos que escondem a árvore assistiva | Acessibilidade transparente de padrão ouro |
| Duplo skip-link no topo (`Ir para o conteúdo principal` e `Ir para o menu`) | Atende aos requisitos mais avançados da WCAG 2.1 AAA | Links de salto decorativos redundantes | Atalhos úteis e diretos para navegação por teclado |
| Destaque da página ativa via `aria-current="page"` | Semântica visual e auditiva unificada | Animações extravagantes de transição | Respeito estrito a `prefers-reduced-motion` |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Duplo Skip-Link):** The system SHALL fornecer no início do documento dois links acessíveis de salto:
  1. `"Ir para o conteúdo principal"` direcionando o foco para o container principal.
  2. `"Ir para o menu"` direcionando o foco para `#menu-principal`.
  - Ambos invisíveis na interface visual regular e destacados de forma acessível sob foco do teclado.
- **RN-02 (Barra de Navegação Centralizada com 5 Seções):** The system SHALL renderizar no `<header>` uma navegação `<nav id="menu-principal" aria-label="Navegação principal">` contendo exatamente os 5 links normativos sem quebras de linha (`white-space: nowrap`).
- **RN-03 (Indicador de Página Ativa Suíço):** The system SHALL marcar o link da página ativa exclusivamente com o atributo `aria-current="page"`.
- **RN-04 (Menu Responsivo em Telas Estreitas):** Em telas com largura menor ou igual a 960px, the system SHALL disponibilizar o botão hambúrguer flutuante (`#menu-toggle`), alternando os atributos `aria-expanded` entre `"true"` e `"false"` e fechando automaticamente ao acionar qualquer link, a tecla `Escape` ou clique externo.
- **RN-05 (Estilo de Foco de Alto Contraste):** Em todos os links e botões focáveis, the system SHALL aplicar contorno visual evidente sob `:focus-visible` em conformidade com as diretrizes de acessibilidade.

---

## 5. Contrato Técnico e Semântica de Interface

- **Módulo:** `src/ui/shell.js`
  - `initShell(optionsOrRoot)`: inicializa os controladores de menu, skip-links e sincronização de navegação.
  - `syncActiveNavigation(container, currentVal)`: atualiza `aria-current="page"` no link correspondente à rota.
  - `initMenuToggle(optionsOrRoot)`: gerencia abertura/fechamento do menu móvel com suporte a teclado.
  - `initSkipLinks(container)`: transfere foco suavemente para os destinos ao acionar os skip-links.

---

## 6. Critérios de Aceitação (BDD / EARS)

- **CA-03.1 (Acionamento de Skip-Link):**  
  **Dado** o foco no skip-link "Ir para o conteúdo principal",  
  **Quando** o usuário aciona a tecla Enter ou clique,  
  **Então** o sistema DEVE transferir o foco para o elemento de destino correspondente.
- **CA-03.2 (Marcação de Link Ativo):**  
  **Dado** uma rota correspondente (ex: `#/maiores`),  
  **Quando** o shell for sincronizado,  
  **Então** o link de Acordes Maiores DEVE possuir `aria-current="page"` e os demais links NÃO DEVEM possuir o atributo.
- **CA-03.3 (Interação do Menu Móvel):**  
  **Dado** o menu móvel aberto com `aria-expanded="true"`,  
  **Quando** o usuário pressiona a tecla `Escape` ou seleciona um link,  
  **Então** o sistema DEVE fechar o menu e redefinir `aria-expanded="false"`.
