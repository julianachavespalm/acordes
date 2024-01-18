const chordButtons = document.querySelectorAll('.chordButton');

const notes = {
    do: "../audio/do__02.wav",
    re: "../audio/re__02.wav",
    mi: "../audio/mi__02.wav",
    fa: "../audio/fa__02.wav",
    sol: "../audio/sol__02.wav",
    la: "../audio/la__02.wav",
    si: "../audio/si__02.wav",
    doSharp: "../audio/doSharp__02.wav",
    reSharp: "../audio/reSharp__02.wav",
    miSharp: "../audio/miSharp__02.wav",
    faSharp: "../audio/faSharp__02.wav",
    solSharp: "../audio/solSharp__02.wav",
    laSharp: "../audio/laSharp__02.wav",
    siSharp: "../audio/siSharp__02.wav",
    doFlat: "../audio/doFlat__02.wav",
    reFlat: "../audio/reFlat__02.wav",
    miFlat: "../audio/miFlat__02.wav",
    faFlat: "../audio/faFlat__02.wav",
    solFlat: "../audio/solFlat__02.wav",
    laFlat: "../audio/laFlat__02.wav",
    siFlat: "../audio/siFlat__02.wav",
    doDoubleSharp: "../audio/re__02.wav",
    reDoubleSharp: "../audio/mi__02.wav",
    miDoubleSharp: "../audio/faSharp__02.wav",
    faDoubleSharp: "../audio/sol__02.wav",
    solDoubleSharp: "../audio/la__02.wav",
    laDoubleSharp: "../audio/si__02.wav",
    siDoubleSharp: "../audio/doSharp__02.wav",
    doDoubleFlat: "../audio/siFlat__02.wav",
    reDoubleFlat: "../audio/do__02.wav",
    miDoubleFlat: "../audio/re__02.wav",
    faDoubleFlat: "../audio/miFlat__02.wav",
    solDoubleFlat: "../audio/fa__02.wav",
    laDoubleFlat: "../audio/sol__02.wav",
    siDoubleFlat: "../audio/la__02.wav",
};

const chords = [
    {
        name: "Dó Maior",
        audioElements: [notes.do, notes.mi, notes.sol]
    },
    {
        name: "Dó# Maior",
        audioElements: [notes.doSharp, notes.miSharp, notes.solSharp]
    },
    {
        name: "Ré♭ Maior",
        audioElements: [notes.reFlat, notes.fa, notes.laFlat]
    },
    {
        name: "Ré Maior",
        audioElements: [notes.re, notes.faSharp, notes.la]
    },
    {
        name: "Ré# Maior",
        audioElements: [notes.reSharp, notes.faDoubleSharp, notes.laSharp]
    },
    {
        name: "Mi♭ Maior",
        audioElements: [notes.miFlat, notes.sol, notes.siFlat]
    },
    {
        name: "Mi Maior",
        audioElements: [notes.mi, notes.solSharp, notes.si]
    },
    {
        name: "Mi# Maior",
        audioElements: [notes.miSharp, notes.solDoubleSharp, notes.siSharp],
    },
    {
        name: "Fá♭ Maior",
        audioElements: [notes.faFlat, notes.laFlat, notes.doFlat]
    },
    {
        name: "Fá Maior",
        audioElements: [notes.fa, notes.la, notes.do]
    },
    {
        name: "Fá# Maior",
        audioElements: [notes.faSharp, notes.laSharp, notes.doSharp]
    },
    {
        name: "Sol♭ Maior",
        audioElements: [notes.solFlat, notes.siFlat, notes.reFlat]
    },
    {
        name: "Sol Maior",
        audioElements: [notes.sol, notes.si, notes.re]
    },
    {
        name: "Sol# Maior",
        audioElements: [notes.solSharp, notes.siSharp, notes.reSharp]
    },
    {
        name: "Lá♭ Maior",
        audioElements: [notes.laFlat, notes.do, notes.miFlat]
    },
    {
        name: "Lá Maior",
        audioElements: [notes.la, notes.doSharp, notes.mi]
    },
    {
        name: "Lá# Maior",
        audioElements: [notes.laSharp, notes.doDoubleSharp, notes.miSharp]
    },
    {
        name: "Si♭ Maior",
        audioElements: [notes.siFlat, notes.re, notes.fa]
    },
    {
        name: "Si Maior",
        audioElements: [notes.si, notes.reSharp, notes.faSharp]
    },
    {
        id: 19,
        name: "Si# Maior",
        audioElements: [notes.siSharp, notes.reDoubleSharp, notes.faDoubleSharp]
    },
    {
        name: "Dó♭ Maior",
        audioElements: [notes.doFlat, notes.miFlat, notes.solFlat]
    },
    {
        name: "Dó Menor",
        audioElements:[notes.do, notes.miFlat, notes.sol]
    },
    {
        name: "Dó# Menor",
        audioElements:[notes.doSharp, notes.mi, notes.solSharp]
    },
    {
        name: "Ré♭ Menor",
        audioElements:[notes.reFlat, notes.faFlat, notes.laFlat]
    },
    {
        name: "Ré Menor",
        audioElements:[notes.re, notes.fa, notes.la]
    },
    {
        name: "Ré# Menor",
        audioElements:[notes.reSharp, notes.faSharp, notes.laSharp]
    },
    {
        name: "Mi♭ Menor",
        audioElements:[notes.miFlat, notes.solFlat, notes.siFlat]
    },
    {
        name: "Mi Menor",
        audioElements:[notes.mi, notes.sol, notes.si]
    },
    {
        name: "Mi# Menor",
        audioElements:[notes.miSharp, notes.solSharp, notes.siSharp]
    },
    {
        name: "Fá♭ Menor",
        audioElements:[notes.faFlat, notes.laDoubleFlat, notes.doFlat]
    },
    {
        name: "Fá Menor",
        audioElements:[notes.fa, notes.laFlat, notes.do]
    },
    {
        name: "Fá# Menor",
        audioElements:[notes.faSharp, notes.la, notes.doSharp]
    },
    {
        name: "Sol♭ Menor",
        audioElements:[notes.solFlat, notes.siDoubleFlat, notes.reFlat]
    },
    {
        name: "Sol Menor",
        audioElements:[notes.sol, notes.siFlat, notes.re]
    },
    {
        name: "Sol# Menor",
        audioElements:[notes.solSharp, notes.si, notes.reSharp]
    },
    {
        name: "Lá♭ Menor",
        audioElements:[notes.laFlat, notes.doFlat, notes.miFlat]
    },
    {
        name: "Lá Menor",
        audioElements:[notes.la, notes.do, notes.mi]
    },
    {
        name: "Lá# Menor",
        audioElements:[notes.laSharp, notes.doSharp, notes.miSharp]
    },
    {
        name: "Si♭ Menor",
        audioElements:[notes.siFlat, notes.reFlat, notes.fa]
    },
    {
        name: "Si Menor",
        audioElements:[notes.si, notes.re, notes.faSharp]
    },
    {
        name: "Si# Menor",
        audioElements:[notes.siSharp, notes.reSharp, notes.faDoubleSharp]
    },
    {
        name: "Dó♭ Menor",
        audioElements:[notes.doFlat, notes.miDoubleFlat, notes.solFlat]
    },
    {
        name: "Dó Menor",
        audioElements:[notes.do, notes.miFlat, notes.sol]
    },
    {
        name: "Dó# Menor",
        audioElements:[notes.doSharp, notes.mi, notes.solSharp]
    },
    {
        name: "Ré♭ Menor",
        audioElements:[notes.reFlat, notes.faFlat, notes.laFlat]
    },
    {
        name: "Ré Menor",
        audioElements:[notes.re, notes.fa, notes.la]
    },
    {
        name: "Ré# Menor",
        audioElements:[notes.reSharp, notes.faSharp, notes.laSharp]
    },
    {
        name: "Mi♭ Menor",
        audioElements:[notes.miFlat, notes.solFlat, notes.siFlat]
    },
    {
        name: "Mi Menor",
        audioElements:[notes.mi, notes.sol, notes.si]
    },
    {

        name: "Mi# Menor",
        audioElements:[notes.miSharp, notes.solSharp, notes.siSharp]
    },
    {
        name: "Fá♭ Menor",
        audioElements:[notes.faFlat, notes.laDoubleFlat, notes.doFlat]
    },
    {
        name: "Fá Menor",
        audioElements:[notes.fa, notes.laFlat, notes.do]
    },
    {
        name: "Fá# Menor",
        audioElements:[notes.faSharp, notes.la, notes.doSharp]
    },
    {
        name: "Sol♭ Menor",
        audioElements:[notes.solFlat, notes.siDoubleFlat, notes.reFlat]
    },
    {
        name: "Sol Menor",
        audioElements:[notes.sol, notes.siFlat, notes.re]
    },
    {
        name: "Sol# Menor",
        audioElements:[notes.solSharp, notes.si, notes.reSharp]
    },
    {
        name: "Lá♭ Menor",
        audioElements:[notes.laFlat, notes.doFlat, notes.miFlat]
    },
    {
        name: "Lá Menor",
        audioElements:[notes.la, notes.do, notes.mi]
    },
    {
        name: "Lá# Menor",
        audioElements:[notes.laSharp, notes.doSharp, notes.miSharp]
    },
    {
        name: "Si♭ Menor",
        audioElements:[notes.siFlat, notes.reFlat, notes.fa]
    },
    {
        name: "Si Menor",
        audioElements:[notes.si, notes.re, notes.faSharp]
    },
    {
        name: "Si# Menor",
        audioElements:[notes.siSharp, notes.reSharp, notes.faDoubleSharp]
    },
    {
        name: "Dó♭ Menor",
        audioElements:[notes.doFlat, notes.miDoubleFlat, notes.solFlat]
    },
    {
        name: "Dó Maior Aumentado",
        audioElements: [notes.do, notes.mi, notes.solSharp]
    },
    {
        name: "Dó# Aumentado",
        audioElements: [notes.doSharp, notes.miSharp, notes.solDoubleSharp]
    },
    {
        name: "Ré♭ Aumentado",
        audioElements: [notes.reFlat, notes.fa, notes.la]
    },
    { 
        name: "Ré Aumentado",
        audioElements: [notes.re, notes.faSharp, notes.laSharp]
    },
    { 
        name: "Ré# Aumentado",
        audioElements: [notes.reSharp, notes.faDoubleSharp, notes.laDoubleSharp]
    },
    { 
        name: "Mi♭ Aumentado",
        audioElements: [notes.miFlat, notes.sol, notes.si]
    },
    { 
        name: "Mi Aumentado",
        audioElements: [notes.mi, notes.solSharp, notes.siSharp]
    },
    { 
        name: "Mi Aumentado",
        audioElements: [notes.miSharp, notes.solDoubleSharp, notes.siDoubleSharp]
    },
    { 
        name: "Fá♭ Aumentado",
        audioElements: [notes.faFlat, notes.laFlat, notes.do]
    },
    { 
        name: "Fá Aumentado",
        audioElements: [notes.fa, notes.la, notes.doSharp]
    },
    { 
        name: "Fá# Aumentado",
        audioElements: [notes.faSharp, notes.laSharp, notes.doDoubleSharp]
    },
    { 
        name: "Sol♭ Aumentado",
        audioElements: [notes.solFlat, notes.siFlat, notes.re]
    },
    { 
        name: "Sol Aumentado",
        audioElements: [notes.sol, notes.si, notes.reSharp]
    },
    { 
        name: "Sol# Aumentado",
        audioElements: [notes.solSharp, notes.siSharp, notes.reDoubleSharp]
    },
    { 
        name: "Lá♭ Aumentado",
        audioElements: [notes.laFlat, notes.do, notes.mi]
    },
    { 
        name: "Lá Aumentado",
        audioElements: [notes.la, notes.doSharp, notes.miSharp]
    },
    { 
        name: "Lá# Aumentado",
        audioElements: [notes.laSharp, notes.doDoubleSharp, notes.miDoubleSharp]
    },
    { 
        name: "Si♭ Aumentado",
        audioElements: [notes.siFlat, notes.re, notes.faSharp]
    },
    { 
        name: "Si Aumentado",
        audioElements: [notes.si, notes.reSharp, notes.faDoubleSharp]
    },
    { 
        name: "Si# Aumentado",
        audioElements: [notes.siSharp, notes.reDoubleSharp, notes.laFlat]
    },
    { 
        name: "Dó♭ Aumentado",
        audioElements: [notes.doFlat, notes.miFlat, notes.sol]
    }

]

function playChordNotes(notes) {
    notes.forEach(audio => {
        const audioElement = new Audio(audio);
        audioElement.play();
    });
}

function init() {
    const chordButtons = document.querySelectorAll('.chordButton');

    chordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const chordName = button.dataset.chord;
            const chordToPlay = chords.find(chord => chord.name === chordName);
            playChordNotes(chordToPlay.audioElements);
        });
    });
}

window.addEventListener('load', init);
