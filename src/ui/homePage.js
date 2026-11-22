/**
 * @fileoverview Renderizador da Capa Editorial da Home (FEAT-005 / ADR-008)
 * Apresenta a capa editorial suíça com hierarquia tipográfica precisa.
 */

export function renderHomePage(mountElement) {
  if (!mountElement) return;

  mountElement.innerHTML = `
    <div class="home-cover" id="conteudo-principal" tabindex="-1">
      <div class="home-scroll-area">
        <div class="home-layout">
          <header class="home-hero-header">
            <h1 class="home-title" id="titulo-home" tabindex="-1">Acordes Básicos</h1>
            <p class="home-subtitle-main">ESTUDO DAS TRÍADES</p>
            <p class="home-subtitle-sub">MAIORES, MENORES, DIMINUTOS E AUMENTADOS</p>
          </header>

          <div class="home-editorial-text">
            <p>Este material apresenta os principais tipos de tríades, acordes formados por três notas.</p>
            <p>O conteúdo aborda os acordes maiores, menores, diminutos e aumentados, destacando sua estrutura, formação e sonoridade.</p>
            <p>Este guia é baseado nos estudos do livro <cite>Compêndio de Teoria Elementar da Música</cite>, de Oswaldo Lacerda (1961).</p>
            <p>Selecione uma categoria no menu para explorar os acordes, compreender sua construção e ouvir cada tríade individualmente.</p>
          </div>
        </div>
      </div>
    </div>
  `.trim();
}
