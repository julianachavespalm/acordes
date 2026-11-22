# ADR-010: Política de Seleção e Cópia de Texto Aberta

- **Status:** Aceito
- **Data:** 2026-11-18
- **Decisora:** Juliana Chaves Palm

## Contexto

O projeto Acordes Básicos é um material didático livre e acessível para o ensino de harmonia musical e formação de tríades. Estudantes, pessoas cegas utilizando tecnologia assistiva e pesquisadores necessitam selecionar e copiar cifras, nomes de acordes, notas e textos analíticos para compor seus cadernos de estudo e resumos pedagógicos.

## Decisão

Adotar como regra normativa a **livre seleção e cópia de texto** em toda a aplicação:

1. Nenhuma folha de estilo em `src/styles/` deve conter propriedades de restrição de seleção (`user-select: none` ou seus prefixos proprietários).
2. Nenhum manipulador de eventos na camada de interface (`src/ui/`) deve interceptar ou cancelar eventos de cópia (`copy`), recorte (`cut`) ou seleção (`selectstart`).
3. O texto e os botões interativos permanecem fluidos para seleção, mantendo a camada fonética descritiva `.sr-only` intacta para leitores de tela.

## Consequências

### Prós
- Estudantes e usuários de leitores de tela copiam cifras, notas e conteúdos livremente.
- Menor complexidade de código na camada de apresentação e ausência de ouvintes desnecessários de eventos.
- Pleno alinhamento com os princípios de liberdade, usabilidade e universalidade da web aberta.

### Contras e Mitigações
- Conteúdo textual aberto para cópia por terceiros, em consonância com a licença de código aberto MIT do repositório e com a devida preservação do crédito autoral institucional no rodapé.
