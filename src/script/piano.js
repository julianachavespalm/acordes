const keys = document.querySelectorAll(".piano__key");

const audioElements = {};

const audioPaths = {
    "1c": "../tunes/28.mp3",
    "1cis": "../tunes/29.mp3",
    "1d": "../tunes/30.mp3",
    "1dis": "../tunes/31.mp3",
    "1e": "../tunes/32.mp3",
    "1f": "../tunes/33.mp3",
    "1fis": "../tunes/34.mp3",
    "1g": "../tunes/35.mp3",
    "1gis": "../tunes/36.mp3",
    "2a": "../tunes/37.mp3",
    "2ais": "../tunes/38.mp3",
    "2b": "../tunes/39.mp3",
    "2c": "../tunes/40.mp3",
    "2cis": "../tunes/41.mp3",
    "2d": "../tunes/42.mp3",
    "2dis": "../tunes/43.mp3",
    "2e": "../tunes/44.mp3",
    "2f": "../tunes/45.mp3",
    "2fis": "../tunes/46.mp3",
    "2g": "../tunes/47.mp3",
    "2gis": "../tunes/48.mp3",
    "3a": "../tunes/49.mp3",
    "3ais": "../tunes/50.mp3",
    "3b": "../tunes/51.mp3",
    "3c": "../tunes/52.mp3",
    "3cis": "../tunes/53.mp3",
};

const acordes = {
  doMaior: ["1c", "1e", "1g"],
  doSustenidoMaior: ["1cis", "1f", "1gis"],
  reMaior: ["1d", "1fis", "2a"],
  reBemolMaior: ["1cis", "1f", "1gis"],
  reMaior: ["1d", "1fis", "2a"],
  reSustenidoMaior: ["2dis", "2g", "3ais"],
  miBemolMaior: ["2dis", "2g", "3ais"],
  miMaior: ["2e", "2gis", "3b"],
  miSustenidoMaior: ["2f", "3a", "3c"],
  faBemolMaior: ["1e", "1gis", "2b"],
  faMaior: ["1f", "2a", "2c"],
  faSustenidoMaior: ["1fis", "2ais", "2cis"],
  solBemolMaior: ["1fis", "2ais", "2cis"],
  solMaior: ["1g", "2b", "2d"],
  solSustenidoMaior: ["1gis", "2c", "2dis"],
  laBemolMaior: ["1gis", "2c", "2dis"],
  laMaior: ["2a", "2cis", "2e"],
  laSustenidoMaior: ["2ais", "2d", "2f"],
  siBemolMaior: ["2ais", "2d", "2f"],
  siMaior: ["2b", "2dis", "3a"],
  siSustenidoMaior: ["2c", "2e", "2g"],
  doBemolMaior: ["2b", "2dis", "2fis"],

  doMenor: ["1c", "1dis", "1g"],
  doSustenidoMenor: ["1cis", "1e", "1gis"],
  reBemolMenor: ["1cis", "1f", "1gis"],
  reMenor: ["1d", "1f", "2a"],
  reSustenidoMenor: ["1dis", "1fis", "2ais"],
  miBemolMenor: ["1dis", "1fis", "2ais"],
  miMenor: ["1e", "1g", "2b"],
  miSustenidoMenor: ["2f", "3a", "3c"],
  faBemolMenor: ["1e", "1gis", "2b"],
  faMenor: ["1f", "1gis", "2c"],
  faSustenidoMenor: ["1fis", "2a", "2cis"],
  solBemolMenor: ["1fis", "2a", "2cis"],
  solMenor: ["1g", "2ais", "2d"],
  solSustenidoMenor: ["1gis", "2b", "2dis"],
  laBemolMenor: ["1gis", "2b", "2dis"],
  laMenor: ["2a", "2c", "2e"],
  laSustenidoMenor: ["2ais", "2cis", "2f"],
  siBemolMenor: ["2ais", "2cis", "2f"],
  siMenor: ["2b", "2d", "2fis"],
  siSustenidoMenor: ["2c", "2dis", "2g"],
  doBemolMenor: ["2b", "2d", "2fis"],

  doDiminuto: ["1c", "1dis", "1fis"],
  doSustenidoDiminuto: ["1cis", "1e", "1g"],
  reBemolDiminuto: ["1cis", "1e", "1g"],
  reDiminuto: ["1d", "1f", "1gis"],
  reSustenidoDiminuto: ["1dis", "1fis", "2a"],
  miBemolDiminuto: ["1dis", "1fis", "2a"],
  miDiminuto: ["1e", "1g", "2ais"],
  miSustenidoDiminuto: ["2f", "2gis", "3b"],
  faBemolDiminuto: ["1f", "1g", "2ais"],
  faDiminuto: ["1f", "1gis", "2b"],
  faSustenidoDiminuto: ["1fis", "2a", "2c"],
  solBemolDiminuto: ["1fis", "2a", "2c"],
  solDiminuto: ["1g", "2ais", "2cis"],
  solSustenidoDiminuto: ["1gis", "2b", "2d"],
  laBemolDiminuto: ["1gis", "2b", "2d"],
  laDiminuto: ["2a", "2c", "2dis"],
  laSustenidoDiminuto: ["2ais", "2cis", "2e"],
  siBemolDiminuto: ["2ais", "2cis", "2e"],
  siDiminuto: ["2b", "2d", "2f"],
  

};

function gerarAcorde(acordeNome) {
  const acordeNotas = acordes[acordeNome];
  tocarAcorde(acordeNotas);
}

function tocarNota(nota) {
  const audio = audioElements[nota];
  if (audio) {
      audio.currentTime = 0;
      audio.play();
  }
}


keys.forEach((key) => {
  const note = key.dataset.note;
  const audio = new Audio(audioPaths[note]);
  audioElements[note] = audio;

  key.addEventListener("click", () => {
      playAudio(note);
      key.classList.add("active");
      setTimeout(() => {
        key.classList.remove("active");
      }, 150);
  });
});

function adicionarAcorde(acordeDisplay) {
  const log = document.createElement('p');
  log.textContent = acordeDisplay;
  document.body.appendChild(log);
}

function tocarAcorde(acorde) {
  acorde.forEach(nota => {
      const audio = new Audio(audioPaths[nota]);
      audio.play();
  });
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  const isKeyFound = Array.from(keys).some((el) => el.dataset.key === key);

  if (isKeyFound) {
      const note = document.querySelector(`[data-key="${key}"]`).dataset.note;
      const audio = audioElements[note];
    
      if (audio) {
        audio.currentTime = 0;
        audio.play();
        const clickedKey = document.querySelector(`[data-note="${note}"]`);
        clickedKey.classList.add("active");
        setTimeout(() => {
          clickedKey.classList.remove("active");
        }, 150);
      }
    }
}); 


function playAudio(note) {
    const audio = audioElements[note];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }

