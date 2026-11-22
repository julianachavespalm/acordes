# FEAT-002: Motor de Execução de Áudio de Piano Acústico

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · Infraestrutura de Áudio Nativa |
| **Decisões Arquiteturais** | [ADR-001: Arquitetura Modular Enxuta](../../decisions/ADR-001-lean-modular-architecture.md), [ADR-003: Orquestração Acústica](../../decisions/ADR-003-local-audio-orchestration.md), [ADR-005: Código em Inglês](../../decisions/ADR-005-coding-standards-bilingual-separation.md) |
| **Aprovação** | 2026-11-15 |
| **Diretriz de Execução** | Execução de amostras de piano acústico de alta fidelidade em `public/tunes/`, caminhos estritamente relativos para GitHub Pages e zero dependências externas. |
| **Implementação** | `src/audio/soundEngine.js`, `public/tunes/*.mp3` |
| **Verificação** | `tests/audio/soundEngine.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

A execução de áudio precisa ser instantânea e autêntica, proporcionando uma experiência pedagógica calorosa e musicalmente fiel. O motor de áudio utiliza amostras reais gravadas de piano acústico (`28.mp3` a `53.mp3` em `public/tunes/`), orquestrando reproduções monofônicas (notas isoladas) e polifônicas simultâneas (tríades completas com 3 notas sincronizadas), com gestão defensiva de interrupção e caminhos estritamente relativos.

### História de Usuário (User Story)

**Como** estudante de música com deficiência visual ou apreciador de harmonia,  
**Eu quero** ouvir o som autêntico de piano acústico de cada nota e das tríades tocadas simultaneamente sem atrasos perceptíveis,  
**Para que** eu desenvolva minha percepção harmônica com clareza tímbrica real e agradável.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Orquestração polifônica de 3 amostras simultâneas de piano | Permite a audição harmônica das 3 notas formadoras da tríade | Efeitos de estúdio complexos (reverb convolutivo, phaser) | O som pedagógico deve ser puro e limpo para clareza dos intervalos |
| Execução monofônica de nota isolada com interrupção limpa | Permite a análise melódica individual de cada grau | Teclado visual com botões de síntese sonora | Interface minimalista focada no estudo editorial |
| Gestão defensiva com fábrica injetável (`audioFactory`) | Permite testes unitários determinísticos sem depender de navegador | Dependência de CDNs de áudio externas | Todas as amostras residem localmente em `public/tunes/` |
| Caminhos relativos (`./public/tunes/`) | Garante execução em qualquer subdiretório do GitHub Pages | Caminhos absolutos ancorados na raiz `/` | Portabilidade estática universal |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Fábrica Injetável de Áudio):** The system SHALL permitir a injeção de uma fábrica `audioFactory` personalizada em `createSoundEngine(options)`, utilizando por padrão o construtor nativo `new Audio(src)`.
- **RN-02 (Execução Monofônica):** WHEN `playNote(tuneIdentifier)` for invocado, THEN the system SHALL interromper reproduções anteriores e executar a amostra acústica correspondente em `public/tunes/{tune}.mp3`.
- **RN-03 (Execução Polifônica Sincronizada):** WHEN `playChord(tuneIdentifiers)` for invocado com uma lista de identificadores de amostras, THEN the system SHALL disparar simultaneamente todas as amostras correspondentes.
- **RN-04 (Interrupção e Reset Acústico):** WHEN `stopAll()` for invocado ou um novo som for disparado, the system SHALL pausar e resetar (`currentTime = 0`) as amostras ativas anteriores.
- **RN-05 (Defesa contra Entradas Vazias):** IF uma lista vazia ou identificador nulo for fornecido, THEN the system SHALL ignorar a chamada sem lançar exceções.

---

## 5. Contrato Técnico e Semântica de Interface

- **Módulo:** `src/audio/soundEngine.js`
  - `createSoundEngine({ audioFactory, basePath })`: retorna objeto motor.
  - `playNote(tuneIdentifier)`: toca nota isolada.
  - `playChord(tuneIdentifiers)`: toca acorde polifônico simultâneo.
  - `stopAll()`: interrompe sons em execução.
  - `getActiveAudios()`: expõe lista de instâncias ativas para inspeção e testes.

---

## 6. Critérios de Aceitação (BDD / EARS)

- **CA-02.1 (Reprodução de Nota Isolada):**  
  **Dado** o identificador de nota `28` (Dó),  
  **Quando** `playNote(28)` for invocado,  
  **Então** o sistema DEVE carregar `./public/tunes/28.mp3` e disparar sua reprodução.
- **CA-02.2 (Reprodução de Tríade Polifônica):**  
  **Dado** os identificadores de Dó Maior `[28, 32, 35]`,  
  **Quando** `playChord([28, 32, 35])` for invocado,  
  **Então** o sistema DEVE disparar simultaneamente as 3 amostras correspondentes.
- **CA-02.3 (Interrupção Limpa):**  
  **Dado** amostras em reprodução,  
  **Quando** `stopAll()` for acionado,  
  **Então** todas as instâncias ativas DEVEM ser pausadas e resetadas para o início (`currentTime = 0`).

### Casos de Borda (Edge Cases)

- **EC-02.1:** IF uma lista vazia ou valor nulo for enviado, THEN the system SHALL ignorar a chamada de forma segura sem lançar exceção.
