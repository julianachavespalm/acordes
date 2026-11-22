# FEAT-001: Core Harmônico, 21 Tríades por Categoria e Camada Fonética

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented |
| **Spec Owner** | Juliana Chaves Palm |
| **Prioridade** | P1 · Fundação Teórica de Domínio Musical |
| **Decisões Arquiteturais** | [ADR-001: Arquitetura Modular Enxuta](../../decisions/ADR-001-lean-modular-architecture.md), [ADR-004: Acessibilidade Universal ABNT](../../decisions/ADR-004-universal-accessibility-wai-aria.md), [ADR-005: Código em Inglês](../../decisions/ADR-005-coding-standards-bilingual-separation.md), [ADR-006: Testes Nativos](../../decisions/ADR-006-automated-testing-native-node.md) |
| **Aprovação** | 2026-11-15 |
| **Diretriz de Execução** | Clean Architecture, Zero Runtime Dependencies, TDD determinístico nativo com `node --test`. |
| **Implementação** | `src/domain/musicTheory.js`, `src/domain/triadsData.js`, `src/domain/phonetics.js`, `src/domain/tuning.js` |
| **Verificação** | `tests/core/musicTheory.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

O Core Harmônico do sistema modela com rigor musicológico a totalidade das **21 tríades teóricas** de cada uma das 4 categorias (*Maiores, Menores, Diminutas e Aumentadas*, totalizando 84 tríades normativas). Ele abrange todas as tônicas da escala cromática temperada (naturais, sustenidos e bemóis), associando a cada nota seu identificador de amostra sonora em `public/tunes/`, sua frequência fundamental teórica em Hertz (afinação A4 = 440 Hz) e sua respectiva transcrição fonética por extenso em português para leitores de tela.

### História de Usuário (User Story)

**Como** estudante de teoria musical ou pessoa com deficiência visual,  
**Eu quero** acessar as 21 tríades completas de cada categoria com suas frequências em Hz e pronúncias fonéticas acessíveis,  
**Para que** eu aprenda a formação precisa dos acordes e seus acidentes sem distorções enarmônicas.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Catálogo determinístico completo de **21 tríades por categoria** (84 no total) | Garante exaustividade teórica para todas as tônicas possíveis | Tétrades, acordes invertidos ou acordes de 4+ sons | O escopo do projeto é estrito ao estudo das tríades fundamentais |
| Cálculo de frequência em Hertz (Hz) para cada nota das tríades | Afinação temperada precisa (A4 = 69 = 440 Hz) | Dependência de bibliotecas de música de terceiros | Domínio puro, imutável e autossuficiente |
| Transcrições fonéticas completas para `.sr-only` (cifras por extenso e acidentes dobrados) | Garante leitura natural por sintetizadores de voz sem abreviações dúbias | Dicionário poético ou sinônimos informais de acordes | A terminologia adota o padrão normativo da teoria musical brasileira |
| Mapeamento de cada nota para a amostra acústica correspondente (`tune`) | Alimenta diretamente o motor de áudio de piano | Síntese de timbres orquestrais complexos | Foco pedagógico limpo no timbre do piano acústico |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Catálogo de 21 Tríades por Categoria):** The system SHALL fornecer exatamente 21 tríades para cada uma das 4 categorias normativas:
  - Tônicas naturais: Dó, Ré, Mi, Fá, Sol, Lá, Si (7).
  - Tônicas com sustenido: Dó♯, Ré♯, Mi♯, Fá♯, Sol♯, Lá♯, Si♯ (7).
  - Tônicas com bemol: Dó♭, Ré♭, Mi♭, Fá♭, Sol♭, Lá♭, Si♭ (7).
- **RN-02 (Cálculo Frequencial e Intervalar):** The system SHALL calcular as frequências de cada nota da tríade com base na afinação temperada A4 = 440 Hz através da fórmula $f = 440 \times 2^{(n - 69) / 12}$ Hz, onde $n$ é o índice MIDI.
- **RN-03 (Camada Fonética Acessível):** Para cada tríade e nota, the system SHALL gerar transcrição fonética por extenso para leitores de tela, incluindo acidentes sustenidos, bemóis e dobrados sustenidos/bemóis.
- **RN-04 (Imutabilidade do Catálogo):** The system SHALL exportar o catálogo imutável e congelado via `Object.freeze()`.

---

## 5. Contrato Técnico e Semântica de Interface

- **Módulos:**
  - `src/domain/triadsData.js`: Catálogo congelado `TRIAD_CATEGORIES` e `TRIAD_DEFINITIONS`.
  - `src/domain/musicTheory.js`: Métodos puros `getTriadCategory(id)`, `getTriadChords(id)`, `getChordById(id)`, `calculateNoteFrequency(midiNote)` e `getPhoneticChordDescription(chord)`.
- **Regra de Design:** Código 100% em inglês; comentários em português somente se estritamente necessários (`ADR-005`). Zero dependências de DOM.

---

## 6. Critérios de Aceitação (BDD / EARS)

- **CA-01.1 (Exaustividade das Categorias):**  
  **Dado** o catálogo `TRIAD_DEFINITIONS`,  
  **Quando** consultada qualquer uma das 4 categorias (`major`, `minor`, `diminished`, `augmented`),  
  **Então** o sistema DEVE retornar exatamente 21 tríades válidas com 3 notas cada.
- **CA-01.2 (Preservação de Enarmonias Rigorosas):**  
  **Dado** tríades com acidentes complexos (ex: Dó bemol maior ou Fá sustenido menor),  
  **Quando** os dados forem consultados,  
  **Então** o sistema DEVE preservar os nomes corretos das notas sem conversão simplista.
- **CA-01.3 (Afinação A4 = 440 Hz):**  
  **Dado** uma nota MIDI (ex: 69 para Lá 4),  
  **Quando** invocada a função `calculateNoteFrequency(69)`,  
  **Então** o sistema DEVE retornar exatamente 440 Hz.

### Casos de Borda (Edge Cases)

- **EC-01.1:** IF uma categoria ou id de acorde inexistente for solicitado, THEN the system SHALL retornar `null` ou `undefined` de forma segura sem lançar exceção.
