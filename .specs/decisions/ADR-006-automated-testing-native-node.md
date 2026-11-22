# ADR-006: Suíte de Testes Determinísticos via node --test e node:assert

- **Status:** Aceito
- **Data:** 2026-11-15
- **Decisora:** Juliana Chaves Palm

## Contexto
Garantir a integridade da teoria musical e a acessibilidade da interface exige testes automatizados que possam ser executados localmente e em pipelines de Continuous Integration (CI) com velocidade instantânea e sem atrito de instalação de dependências pesadas de terceiros (como Jest ou bibliotecas transitivas extensas).

## Decisão
Utilizar o test runner nativo do Node.js (`node --test`) associado ao módulo de asserções nativo (`node:assert` e `node:assert/strict`). As suítes devem ser organizadas em:
1. `tests/core/musicTheory.test.js`: Validação matemática e intervalar de todas as tríades das 4 categorias.
2. `tests/audio/soundPlayer.test.js`: Validação do mapeamento de arquivos e disparo polifônico de áudio.
3. `tests/ui/`: Validação da semântica de DOM, estrutura da tabela, renderização dos botões acessíveis e integração de acessibilidade.

## Consequências
* **Prós:** Execução instantânea (< 150ms para toda a suíte), dependência zero de pacotes npm externos em runtime e testes determinísticos compatíveis com qualquer ambiente Node.js LTS moderno.
* **Contras:** Asserções de DOM exigem objetos leves injetados ou utilitários simples de parsing nativo.

## Verificação
Executável via `npm test` disparando `node --test tests/**/*.test.js`.
