# ADR-005: Padrão de Engenharia de Software — Código em Inglês e Comentários em Português

- **Status:** Aceito
- **Data:** 2026-11-15
- **Decisora:** Juliana Chaves Palm

## Contexto

A manutenção, evolução e revisão de software exigem uma padronização consistente da linguagem utilizada no código-fonte e na documentação técnica.

O inglês é o idioma predominante no ecossistema de desenvolvimento de software, sendo adotado por linguagens de programação, frameworks, bibliotecas, APIs e documentação técnica. A utilização de identificadores em inglês promove consistência, legibilidade e alinhamento com as convenções amplamente aceitas pela indústria.

Em conformidade com os princípios de *Clean Code*, comentários devem ser utilizados com parcimônia. Código bem escrito deve ser suficientemente expressivo para comunicar a sua intenção, reduzindo a necessidade de explicações redundantes.

## Decisão

Estabelecer as seguintes regras de engenharia para todo o projeto:

1. **Código 100% em Inglês**
   - Todos os identificadores devem ser escritos em inglês.
   - Isso inclui classes, funções, métodos, variáveis, constantes, módulos, arquivos, atributos HTML, seletores CSS e propriedades JSON.

   **Exemplos:**
   - `musicTheory.js`
   - `soundPlayer.js`
   - `playChord()`
   - `triadCategory`
   - `.chord-table`
   - `#a11y-announcer`

2. **Comentários Estritamente Necessários**
   - Comentários devem existir apenas quando forem necessários para explicar o motivo de uma decisão técnica, uma regra de negócio complexa ou um comportamento cuja justificativa não seja evidente pela leitura do código.
   - Comentários não devem explicar o que o código faz, mas sim por que ele existe daquela forma.

3. **Comentários em Português**
   - Quando necessários, comentários e blocos JSDoc devem ser escritos em português do Brasil.
   - A redação deve ser objetiva, clara e concisa.

## Consequências

### Prós

- Alinhamento com os padrões internacionais de desenvolvimento de software.
- Consistência da nomenclatura técnica em todo o projeto.
- Maior facilidade de manutenção e revisão de código.
- Redução de comentários redundantes e poluição visual.
- Separação clara entre implementação técnica e documentação explicativa.

### Contras

- Exige disciplina na definição e manutenção da nomenclatura em inglês.
- Requer atenção contínua durante revisões de código para garantir conformidade com o padrão.

## Verificação

A conformidade com esta ADR deve ser validada durante revisões de código e por ferramentas automatizadas de análise estática, quando aplicável.