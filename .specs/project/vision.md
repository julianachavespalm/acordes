# Visão do Produto e Declaração Executiva (Product Vision)

## 1. O Projeto e seu Propósito Social

O projeto **`acordes`** nasceu originalmente como o Trabalho de Conclusão de Curso (TCC) de **Juliana Chaves Palm**, concebido para preencher uma lacuna histórica na educação musical: a carência de materiais pedagógicos acessíveis sobre formação de acordes projetados especificamente para pessoas com deficiência visual.

---

## 2. A Evolução Técnica: De Aprendiz a Especialista

Com a maturidade profissional e a consolidação da carreira de Juliana como **Engenheira de Software especialista em Solution Design, SDD e Backend de Alta Escala**, o repositório foi integralmente redesenhado para refletir esse calibre de engenharia:

* **Da simplicidade ingênua ao rigor de arquitetura:** Substituição de scripts procedurais duplicados por uma **Clean Architecture modular em ES6 nativo**, com separação nítida de Core de Domínio, Adaptadores de Áudio e Apresentação Acessível.
* **Da interface visual tradicional à Acessibilidade Universal (WCAG 2.2 AAA):** Implementação de audiodescrição em tempo real via `aria-live`, navegação 100% assistida por teclado e contraste matemático rigoroso.
* **Da ausência de testes à Engenharia de Qualidade Automatizada:** Adoção de **TDD** para o domínio da teoria musical e **BDD com Gherkin e Playwright** integrado a esteira de CI/CD com execução diária agendada e em Pull Requests.

---

## 3. Os Três Pilares da Solução

1. **Acessibilidade como Cidadã de Primeira Classe:** A experiência auditiva e para tecnologias assistivas não é um adendo posterior, mas o eixo central que dita o desenho de cada componente.
2. **Soberania e Independência (Zero Runtime Dependencies):** Aplicação 100% autocontida, com assets acústicos de piano locais e execução offline no navegador.
3. **Rastreabilidade e Governança SDD:** Cada linha de código do projeto tem rastreabilidade direta com os requisitos e decisões registradas no `.specs/`.
