//#region Globals

window.game = window.game || { };

const output = document.getElementById("output");

var data;

var sentenceStartY = -10;

var baseSentenceDx = 0; var baseSentenceDy = 0.25;
var wrongSentenceDdy = 0.05;
var gotWrongAnswer = false;

var freezeTicks = 15;
var freezeRemaining = 0;
var isFrozen = false;
var tick = 0;
var sinOffset = 0;
var baseFreq = 0.01;
var changeFreq = 0.001;
var freq = baseFreq;

var chosenAnswerIndex = 0;


var score = 0;
var lives = 3;


var answers = [
    new answer("", 0),
    new answer("", 1),
    new answer("", 2),
    new answer("", 3)
];

var correctAnswer;
var isMoveAnswer = false;
var answerMoveTime = 50; //ticks
var answerMoveTicksRemaining = 50;

var updateLoop;

var isGameOver = false;

var canAnswer = true;

var correctSound = new sound("laser_shot_correct.mp3");
var wrongSound = new sound("laser_shot_incorrect.wav");
var explosionSound = new sound("explosion_large_08.wav");
var music = new sound("edm-detection-mode-by-kevin-macleod-from-filmmusic-io.mp3");

var isPaused = false;
var isStart = true;
//#endregion

//#region Constructors

function sound(src) {
    
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.playFromStart = function () {
        this.sound.currentTime = 0;
        this.sound.play();
        console.log("Play sound from start" + this.sound.src);
    };
    this.play = function () {
        this.sound.play();
        console.log("Play sound " + this.sound.src);
    };
    this.stop = function () {
        this.sound.pause();
    };
    this.setVolume = function (volume) {
        this.sound.volume = volume;
    };
    
}

function answer(txt, pos){
    console.log("Answer function called");
    let ans = {
        text: txt,
        baseX: canvas.width * (0.125 + 0.25*pos),
        baseY: canvas.height - 30,
        x: canvas.width * (0.125 + 0.25*pos),
        y: canvas.height - 30,
        dx: 0,
        dy: 0
    }
    console.log(ans);
    return ans;
}

//#endregion

function StartGame(){
    if(isStart){
        //First time
        music.setVolume(0.4);
        correctSound.setVolume(0.3);
        wrongSound.setVolume(0.3);
        explosionSound.setVolume(0.3);

        music.play();
        music.sound.loop = true;
    }

    isStart = false;
    isGameOver = false;
    score = 0;
    lives = 3;
    canvas.setLivesString(lives);
    // livesStr = getLivesString(lives);
     
    sentence.x = canvas.width/2;
    sentence.y = sentenceStartY;
    sentence.dx = baseSentenceDx;
    sentence.dy = baseSentenceDy;
    freq = baseFreq;

    GetSentence();
}



//#region Game

function Game(){
    if(isStart || isGameOver || isPaused) return;
    if(isFrozen){
        if(freezeRemaining <= 0){
            NextSentence();
            isFrozen = false;
        }else{
            freezeRemaining--;
        }
        return;
    }
    if(isMoveAnswer){
        answers[chosenAnswerIndex].x += answers[chosenAnswerIndex].dx;
        answers[chosenAnswerIndex].y += answers[chosenAnswerIndex].dy;
        if(answerMoveTicksRemaining-- <= 0){
            CheckAnswer(chosenAnswerIndex);
            isMoveAnswer = false;
            answers[chosenAnswerIndex].dy = 0;
            answers[chosenAnswerIndex].dx = 0;
        }
        return;
    }
    

    if(gotWrongAnswer){
        sentence.dy += wrongSentenceDdy;
        answers[chosenAnswerIndex].dy += wrongSentenceDdy;
        answers[chosenAnswerIndex].y += answers[chosenAnswerIndex].dy;
    }else{
        let amp = 50;
        sentence.xOffset = amp*(Math.sin(freq*tick + sinOffset));
    }

    sentence.y += sentence.dy;
    
    if(canAnswer){
        GetKeys();
    }
    
    if(sentence.y > canvas.height - 60){
        lives -= 1;
        canvas.setLivesString(lives);
        CalculateDy();
        canAnswer = true;
        gotWrongAnswer = false;

        let x = sentence.x + sentence.xOffset + canvas.ctx.measureText(sentence.text).width/2;
        let y =  sentence.y - 50;
        explosion.StartExp(x,y, 5, 5);
        explosionSound.playFromStart();
       
        
        if(GameOverCheck()){
            GameOver();
        }else{
            NextSentence();
        }
    }
    tick++;
}

function GetKeys(){
    let hadInput = false;
    if(input.left()){
        console.log("Left pressed");
        
        leftWasPressed = true; 
        chosenAnswerIndex = 0;
        hadInput = true;
    }
    if(input.up()){
        console.log("Up pressed");
        upWasPressed = true;
        chosenAnswerIndex = 1;
        hadInput = true;
    }
    if(input.down()){
        console.log("Down pressed");
        downWasPressed = true;
        chosenAnswerIndex = 2;
        hadInput = true;
    }
    if(input.right()){
        console.log("Right pressed");
        rightWasPressed = true;
        chosenAnswerIndex = 3;
        hadInput = true;
    }

    if(!hadInput){
        return;
    }

    let senX = sentence.x + sentence.xOffset + canvas.ctx.measureText(sentence.text).width/2

    SetAnswerDxDy(answers[chosenAnswerIndex].x, answers[chosenAnswerIndex].y, senX, sentence.y, answerMoveTime);
    isMoveAnswer = true;

}

function CheckAnswer(ansIndex){
    if(answers[ansIndex].text === correctAnswer){
        let x = sentence.x + sentence.xOffset + canvas.ctx.measureText(sentence.text).width/2;
        let y = sentence.y;
        explosion.StartExp(x, y);
        Correct();
    }else{
        Incorrect();
    }
}

function Correct(){
    score += 1;
    isFrozen = true;
    freezeRemaining = freezeTicks;
    correctSound.playFromStart();
    sentence.y = sentenceStartY;
    answers[chosenAnswerIndex] = sentenceStartY;
    chosenAnswerIndex = -1;
}

function Incorrect(){
    canAnswer = false;
    gotWrongAnswer = true;
    sentence.dy = 0.5;
    wrongSound.playFromStart();
}

function NextSentence(){
    console.log("NextSentence");
    sentence.y = sentenceStartY;
    sentence.xOffset = 0;
    tick = 0;
    sinOffset = Math.random() * 2 * Math.PI;
    freq = baseFreq + score * changeFreq;
    CalculateDy();
    
    GetSentence();
}

function CalculateDy(){
    sentence.dy = 0.25 + score * 0.05;
}

function GameOverCheck(){
    return lives < 0;
}

function GameOver(){
    isGameOver = true;
    lives = 0;
    sentence.y = -30;
}

function GetSentence(){
    console.log("GetSentence");
    let index = RandIndex(data.sentences.length);
    let text = ProcessText(data.sentences[index].text);

    sentence.text = text[0].toUpperCase() + text.slice(1);

    correctAnswer = ProcessText(data.sentences[index].correctAnswer);

    //Randomly choose correct place
    let correctIndex = RandIndex(4);

    for(let i=0; i<4; i++){
        let ans;
        if(i===correctIndex){
            ans = correctAnswer;
        }else{
            ans = ProcessText(data.sentences[index].wrongAnswer);
        }

        answers[i] = new answer(ans, i);
        
    }
}

function SetAnswerDxDy(ansX, ansY, senX, senY, moveTime){
    answers[chosenAnswerIndex].dx = (senX - ansX) / moveTime;
    answers[chosenAnswerIndex].dy = (senY - ansY) / moveTime;
    answerMoveTicksRemaining = moveTime;
}


//#endregion

function TogglePause(){
    isPaused = !isPaused;
    if(isPaused){
        music.stop();
    }else{
        music.play();
    }
}

//#region Processing

function loadJSON(callback){
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'Sentences.json', true);
    xobj.onreadystatechange = function(){
        if(xobj.readyState == 4 && xobj.status == "200"){
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
/**
 * @param {String} text 
 */
function ProcessText(text){
    if(!text.includes("%")){
        return text;
    }

    // Text includes a % sign
    //debugger;
    let finishedText = text;
    console.log("New Sentence is: " + text);
    while(finishedText.includes("%")){
        console.log("Sentence is currently: " + finishedText);
        let str = finishedText;
        let wildCard = str.split("%")[1];
        let replacement = "";
        
        for(const partOfSpeech of data.partsOfSpeech){
            console.log(partOfSpeech.name);
            if(wildCard == partOfSpeech.keyword){
                console.log("Found keyword "+partOfSpeech.keyword);
                replacement = partOfSpeech.words[RandIndex(partOfSpeech.words.length)];
                break;
            }
        }
        
        finishedText = finishedText.replace("%"+wildCard+"%", replacement);
    }
    console.log("Finished sentence is: " + finishedText);
    return finishedText;
    
}

/**
 * @param {String} correct
 * @param {String} wrong 
 */ 
function IsAmbiguity(correct, wrong){
    
    for(const partOfSpeech of data.partsOfSpeech){
        if(correct)
        console.log(partOfSpeech.name);
        if(wildCard == partOfSpeech.keyword){
            console.log("Found keyword "+partOfSpeech.keyword);
            replacement = partOfSpeech.words[RandIndex(partOfSpeech.words.length)];
            break;
        }
    }
    
    return false;
}

function RandIndex(max){
    return Math.floor(Math.random() * max);
}

//#endregion