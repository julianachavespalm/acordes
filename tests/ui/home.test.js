import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('FEAT-005: Home Editorial — Livro Didático Contemporâneo e Estilo Suíço', () => {
  const indexPath = path.join(process.cwd(), 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');

  test('index.html deve conter título h1 "Acordes Básicos" e subtítulos em caixa alta (RN-01 / CA-05.1)', () => {
    assert.match(html, /<h1[^>]*>Acordes Básicos<\/h1>/i);
    assert.match(html, /ESTUDO DAS TRÍADES/);
    assert.match(html, /MAIORES, MENORES, DIMINUTOS E AUMENTADOS/);
  });

  test('index.html deve renderizar os parágrafos conceituais e a referência bibliográfica de Oswaldo Lacerda (1961)', () => {
    assert.match(html, /Este material apresenta os principais tipos de tríades, acordes formados por três notas\./);
    assert.match(html, /O conteúdo aborda os acordes maiores, menores, diminutos e aumentados, destacando sua estrutura, formação e sonoridade\./);
    assert.match(html, /Compêndio de Teoria Elementar da Música<\/cite>, de Oswaldo Lacerda \(1961\)/);
    assert.match(html, /Selecione uma categoria no menu para explorar os acordes, compreender sua construção e ouvir cada tríade individualmente\./);
  });

  test('index.html deve conter os links acessíveis de salto (skip links) (RN-03)', () => {
    assert.match(html, /href="#conteudo-principal"/);
    assert.match(html, /href="#menu-principal"/);
    assert.match(html, /class="skip-link"/);
  });

  test('index.html deve conter o rodapé centralizado institucional com link autoral (RN-04)', () => {
    assert.match(html, /Por <a href="https:\/\/github\.com\/julianachavespalm"[^>]*>Juliana Chaves Palm<\/a>/);
  });

  test('index.html deve importar as 4 camadas CSS sem scripts externos ou fontes locais pesadas', () => {
    assert.match(html, /href="(\.\/)?src\/(styles|css)\/tokens\.css"/);
    assert.match(html, /href="(\.\/)?src\/(styles|css)\/base\.css"/);
    assert.match(html, /href="(\.\/)?src\/(styles|css)\/layout\.css"/);
    assert.match(html, /href="(\.\/)?src\/(styles|css)\/components\.css"/);
    assert.equal(html.includes('fontawesome'), false);
  });

  test('index.html e layout.css devem aplicar ritmo vertical compacto sem excesso de espacamento (ADR-008)', () => {
    const layoutPath = fs.existsSync(path.join(process.cwd(), 'src', 'styles', 'layout.css'))
      ? path.join(process.cwd(), 'src', 'styles', 'layout.css')
      : path.join(process.cwd(), 'src', 'css', 'layout.css');
    const layoutCss = fs.readFileSync(layoutPath, 'utf8');

    assert.match(html, /class="[^"]*home-cover[^"]*"/);
    assert.match(layoutCss, /\.home-cover\s*{[^}]*justify-content:\s*flex-start/s);
    assert.match(layoutCss, /\.home-cover\s*{[^}]*padding-top:\s*var\(--ds-space-lg\)/s);
    assert.match(layoutCss, /\.home-title\s*{[^}]*margin-top:\s*0/s);
    assert.match(layoutCss, /\.home-title\s*{[^}]*margin-bottom:\s*var\(--ds-space-sm\)/s);
    assert.match(layoutCss, /\.home-subtitle-sub\s*{[^}]*margin-bottom:\s*var\(--ds-space-lg\)/s);
    assert.match(layoutCss, /\.home-editorial-text\s+p\s*{[^}]*margin-bottom:\s*var\(--ds-space-md\)/s);
  });
});
