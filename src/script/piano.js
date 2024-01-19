document.addEventListener("DOMContentLoaded", function () {
  const pianoKeys = document.querySelectorAll(".piano__key");
  const startChordButton = document.getElementById("startChordButton");
  const playChordButton = document.getElementById("playChordButton");
  const clearChordButton = document.getElementById("clearChordButton");

  let audioContext;
  let audioBuffers = {};
  let chordNotes = [];
  let isChordFormationActive = false;

  async function loadAudioFiles() {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      for (let i = 28; i <= 52; i++) {
          const response = await fetch(`../tunes/${i}.mp3`);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          audioBuffers[i] = audioBuffer;
      }
  }

  function playNote(note) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffers[note];
      source.connect(audioContext.destination);
      source.start(0);
  }

  pianoKeys.forEach(key => {
      key.addEventListener("click", function () {
          const note = parseInt(this.getAttribute("data-key"));

          if (isChordFormationActive) {
              chordNotes.push(note);
          } else {
              playNote(note);
          }
      });
  });

  startChordButton.addEventListener("click", function () {
      chordNotes = [];
      isChordFormationActive = true;

      pianoKeys.forEach(key => {
          key.addEventListener("click", function () {
              const note = parseInt(this.getAttribute("data-key"));
              playNote(note);
          });
      });
  });

  playChordButton.addEventListener("click", function () {
      if (chordNotes.length > 0) {
          chordNotes.forEach(note => playNote(note));
      }
  });

  clearChordButton.addEventListener("click", function () {
      chordNotes = [];
      isChordFormationActive = false;
  });

  loadAudioFiles();
});
