const alphabet = {
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    "a": ".-", "b": "-...", "c": "-.-.", "d": "-..", "e": ".",
    "f": "..-.", "g": "--.", "h": "....", "i": "..", "j": ".---",
    "k": "-.-", "l": ".-..", "m": "--", "n": "-.", "o": "---",
    "p": ".--.", "q": "--.-", "r": ".-.", "s": "...", "t": "-",
    "u": "..-", "v": "...-", "w": ".--", "x": "-..-", "y": "-.--",
    "z": "--..", ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--",
    "-": "-....-", "/": "-..-.", "@": ".--.-.", "(": "-.--.", ")": "-.--.-",
    " ": " "
};
const words = {
                "punctuation": [".", ",", "?", "!", "-", "/", "@", "(", ")"],
                "numbers": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
                1: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w","x", "y", "z"],
                2: ["as", "at", "be", "by", "do", "go", "he", "if", "in", "it", "no", "of", "on", "or", "so", "to", "up", "we"],
                3: ['fan', 'bow', 'red', 'fix', 'dot', 'ice', 'sew', 'few', 'boy', 'bay', 'rid', 'paw', 'god', 'lid', 'ray', 'nut', 'lie', 'eye', 'all', 'saw'],
                4: ['like', 'fire', 'with', 'seat', 'idea', 'bold', 'pump', 'feed', 'wine', 'verb', 'tide', 'mean', 'pipe', 'soil', 'meet', 'till', 'rock', 'fair', 'fate', 'tray'],
                5: ['chalk', 'alone', 'climb', 'clean', 'cloud', 'cheer', 'brain', 'catch', 'angry', 'broad', 'blame', 'bring', 'being', 'cheat', 'brave', 'close', 'begin', 'above', 'about', 'bleed']
}
 

var speed = 1;
var sentence = "";
numberLetters = 3;
var startButton = document.querySelector("#startButton");
var guess = document.querySelector("#guess");
var relisten = document.querySelector("#relisten");
var nLetters = document.querySelector("#nLetters");
var speedInput = document.querySelector("#speed");
var showAnswer = document.querySelector("#showAnswer");
var answerDisplay = document.querySelector("#answer");
answerDisplay.style.display = "none";
var morseAnswer = document.querySelector("#morseAnswer");
morseAnswer.style.display= "none";


startButton.addEventListener("click", function(){
    answerDisplay.style.display = "none";
    init();

});

showAnswer.addEventListener("click", function(){
    if (answerDisplay.style.display === "none") {
        answerDisplay.style.display = "block";
        morseAnswer.style.display = "block";
        showAnswer.textContent = "Hide Answer";
      } else {
        answerDisplay.style.display = "none";
        showAnswer.textContent = "Show Answer";
        morseAnswer.style.display = "none";
      }
    });

nLetters.addEventListener("change", function(){
    numberLetters = this.value;
    console.log(numberLetters);
    relisten.disabled=true;
});

speedInput.addEventListener("change", function(){
    speed = this.value;
    
    console.log(speed);
});

relisten.addEventListener("click", function(){
    playTimes(morseSentence);
});

guess.addEventListener("keyup", function(){
    guessed=this.value;
    console.log(guessed);
    if(sentence.length==this.value.length){
        if(this.value.toLowerCase() == sentence){
            guess.classList.add("correct");
            guess.classList.remove("incorrect");
            
        } else{
            guess.classList.remove("correct");
            guess.classList.add("incorrect");
        }
    } else{
        guess.classList.remove("correct");
        guess.classList.remove("incorrect");
    }
});

function pickWord(wordLength){
    console.log(wordLength)
    var word = words[wordLength][Math.floor(Math.random()* words[wordLength].length+1)];
    return word
}

function init(){
    sentence = pickWord(numberLetters);
    answerDisplay.textContent = sentence;
    guess.classList.remove("correct");
    guess.classList.remove("incorrect");
    morseSentence = sentenceToMorse(sentence);
    morseAnswer.textContent = morseSentence.toString().replace(/,/g, "").replace(/\+/g, " ").replace(/\./g, "·");
        //playSentence(morseSentence, playTimesList);
    guess.value = "";
    playTimes(morseSentence);

}

function sentenceToMorse(sentence){
    //converts the input sentence to a list of each element, ".", "-" or " "
    //converting each letter is handled by letterToMorse, this only calls it for each letter and concats received list
    var morseSentence = [];

    for(var i = 0; i < sentence.length; i++){
        morseSentence = morseSentence.concat(letterToMorse(sentence[i]));
    }
    return morseSentence;
}

function letterToMorse(letter){
    //helper to sentenceToMorse, for each letter that gets passed creates and array of dots and dashes
    var letter = letter.toLowerCase();
    var letterCode = alphabet[letter];
    letterCodeList = [];
    for(var i = 0; i < letterCode.length; i++){
        letterCodeList.push(letterCode[i]);
    }
    letterCodeList.push("+");
    return letterCodeList;
}

function playTimes(morseSentence){
    relisten.disabled=false;
    showAnswer.textContent = "Show Answer";
    startButton.textContent = "New";
    // one context per document
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new window.AudioContext;
    var gain = context.createGain();
    gain.connect(context.destination);
    var osc = context.createOscillator(); // instantiate an oscillator
    osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
    osc.frequency.value = 440; // Hz
    osc.connect(gain);
    osc.start();
    var t = 0
    console.log(morseSentence);
    var basetime = 60*speed;
    console.log(speed);
    
    for(var i = 0; i<morseSentence.length; i++){
        switch(morseSentence[i]){
            case ".":
                gain.gain.setValueAtTime(1.0, t/1000);
                t += basetime;
                gain.gain.setValueAtTime(0.0, t/1000);
                break;
            case "-":
                gain.gain.setValueAtTime(1.0, t/1000);
                t += 3*basetime;
                gain.gain.setValueAtTime(0.0, t/1000);
                break;
            case "+":
                
                t += 3*basetime;
                break
            case " ":
                
                t += 7*basetime;
                break
                
        }
        t += basetime;
    }
}
