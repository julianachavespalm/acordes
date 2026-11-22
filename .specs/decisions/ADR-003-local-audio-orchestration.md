# ADR-003: Síntese Sonora Polifônica em Tempo Real via Web Audio API

- **Status:** Aceito
- **Data:** 2026-11-15
- **Decisora:** Juliana Chaves Palm (Software Engineer & Solution Designer)

## Contexto
O projeto requer a reprodução auditiva instantânea tanto de notas isoladas quanto da tríade completa (3 notas simultâneas). Para suportar a totalidade das 21 tríades por categoria (incluindo acidentes dobrados e extensões enarmônicas) com zero dependências externas e sem depender de dezenas de arquivos pesados de áudio que possam sofrer latência de rede ou restrições de cache, é necessário um mecanismo de áudio nativo determinístico e de latência zero.

## Decisão
Adotar a **Web Audio API nativa do W3C** para síntese sonora procedural polifônica em tempo real:
1. **Frequências Exatas em Hertz (Hz):** Cada nota musical é mapeada para sua frequência fundamental precisa (ex.: A4 = 440.00 Hz, C4 = 261.63 Hz) com afinação padrão temperada de 12 semitons.
2. **Síntese Polifônica Limpa:** Disparo concorrente de 3 osciladores (`OscillatorNode` com onda senoidal/triangular suave) combinados a nós de ganho (`GainNode`) com envelope ADSR (ataque suave de 15ms e release gradual) para eliminar qualquer clique, estalo ou distorção acústica.
3. **Gestão de Ciclo de Vida do AudioContext:** Instanciação preguiçosa (*lazy initialization*) associada ao primeiro gesto do usuário (`click`/`keydown`), respeitando a política de autoplay do navegador e desconectando nós ao final da duração para evitar vazamentos de memória.

## Consequências
* **Prós:** Zero dependências de rede, latência ultrabaixa (< 10ms), suporte ilimitado a qualquer nota ou microtonalidade da escala cromática e código 100% autocontido no navegador.
* **Contras:** O timbre é sintetizado de forma pura, necessitando de envelope ADSR calibrado para soabilidade harmônica suave.

## Verificação
Coberto pelos testes de cálculo de frequências e disparos de oscilador em `tests/audio/soundEngine.test.js`.
