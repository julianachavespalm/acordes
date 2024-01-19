const selectedNotes = [];

const audioElements = {};


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

function selectNote(note) {
  const index = selectedNotes.indexOf(note);

  if (index === -1) {
    selectedNotes.push(note);
  } else {
    selectedNotes.splice(index, 1);
  }

  const pianoKey = document.querySelector(`[data-note="${note}"]`);
  pianoKey.classList.toggle("selected");
}

function startChordFormation() {
  selectedNotes.length = 0;

  keys.forEach((key) => {
    key.classList.remove("selected");
  });
}

function playSelectedChord() {
  tocarAcorde(selectedNotes);
}

keys.forEach((key) => {
  const note = key.dataset.note;

  key.addEventListener("click", () => {
    selectNote(note);
    key.classList.add("active");
    setTimeout(() => {
      key.classList.remove("active");
    }, 150);
  });
});

const startChordButton = document.getElementById("startChordButton");
startChordButton.addEventListener("click", startChordFormation);

const playChordButton = document.getElementById("playChordButton");
playChordButton.addEventListener("click", playSelectedChord);
