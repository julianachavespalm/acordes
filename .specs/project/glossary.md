# Glossário Ubíquo do Domínio (Harmonia e Engenharia)

Este glossário estabelece a linguagem ubíqua (*Ubiquitous Language*) compartilhada entre os conceitos de harmonia musical e as estruturas de código-fonte de engenharia de software do projeto `acordes`.

---

## 1. Termos de Teoria Musical

| Termo em Português | Termo em Inglês (Código) | Definição Harmônica |
| :--- | :--- | :--- |
| **Nota Fundamental / Tônica** | `rootNote` / `root` | A nota base sobre a qual o acorde é construído (grau 1). |
| **Terça** | `third` | A segunda nota da tríade, que define o modo do acorde (terça maior: +4 semitons; terça menor: +3 semitons). |
| **Quinta** | `fifth` | A terceira nota da tríade (quinta justa: +7 semitons; quinta diminuta: +6 semitons; quinta aumentada: +8 semitons). |
| **Tríade** | `triad` | Acorde de três notas distintas sobrepostas em intervalos de terças. |
| **Tríade Maior** | `majorTriad` | Formada por Tônica + 3ª Maior + 5ª Justa (`1 · 3 · 5`). |
| **Tríade Menor** | `minorTriad` | Formada por Tônica + 3ª Menor + 5ª Justa (`1 · ♭3 · 5`). |
| **Tríade Diminuta** | `diminishedTriad` | Formada por Tônica + 3ª Menor + 5ª Diminuta (`1 · ♭3 · ♭5`). |
| **Tríade Aumentada** | `augmentedTriad` | Formada por Tônica + 3ª Maior + 5ª Aumentada (`1 · 3 · ♯5`). |
| **Enarmonia** | `enharmonics` | Fenômeno pelo qual duas notas com grafias diferentes possuem a mesma frequência e altura sonora (ex.: Ré♭ e Dó♯; Fá♭ e Mi). |
| **Cifra** | `symbol` / `chordSymbol` | Notação alfanumérica universal para representar o acorde (ex.: `C`, `Dm`, `Cm(b5)` ou `C+`). |

---

## 2. Termos de Engenharia de Software e Acessibilidade

| Termo | Definição Técnica no Projeto |
| :--- | :--- |
| **SDD (Spec-Driven Development)** | Metodologia onde a especificação técnica formal (EARS, user stories, contratos e ADRs) precede e orienta todo o ciclo de desenvolvimento e verificação. |
| **BDD (Behavior-Driven Development)** | Prática de desenvolvimento orientado a comportamento utilizando sintaxe Gherkin (`Dado / Quando / Então`) para automação de testes com Playwright. |
| **Living Documentation** | Cenários de teste executáveis que servem simultaneamente como documentação oficial e prova de conformidade do software. |
| **ARIA Live Region (`#a11y-announcer`)** | Elemento do DOM com `aria-live="polite"` que permite injetar mensagens audiodescritas para leitores de tela sem interromper a navegação do usuário. |
| **Skip Link** | Link acessível colocado no topo do DOM para permitir que usuários de teclado saltem blocos repetidos de navegação diretamente para `#main-content`. |
| **Polifonia** | Capacidade do módulo de áudio de reproduzir múltiplas notas acústicas em simultaneidade exata no mesmo instante temporal. |
