import SFXManager from "../classes/SFXManager";
import EnglishGame from "./EnglishGame";


const X_MAX = 480
const X_CENTRE = X_MAX / 2
const Y_MAX = 640

const LEVEL_DY = 5
const DY = 30 - LEVEL_DY

const ANSWER_MOVE_TIME = 0.5
const ANSWER_POS = {x: X_CENTRE, y:500}

const FONT_MED = '24px Arial'
const FONT_BIG = '48px Arial'

const DATA_KEY = 'DATA-WordScramble'
const UI_KEY = 'UI-WordScramble'

const THIS_GAME = 'Word-Scramble'
const BOTTOM_Y = 540

export default class WordScrambleScene extends EnglishGame{

    log(obj){
        console.log(`${THIS_GAME}: ${obj}`)
    }

    constructor(){
        super(THIS_GAME, BOTTOM_Y)
    }

    preload(){
        super.preload()

        this.load.json(DATA_KEY, 'assets/WordScrambleTEST.json')
        this.load.image(UI_KEY, 'assets/Ui-4-section.png')
    }

    create(){
        super.create()
        this.log(`Create ${THIS_GAME} CLASS`)
        this.gameData = this.cache.json.get(DATA_KEY)

        let rect = this.add.rectangle(240, 640, 480, 100)
        rect.isFilled = true
        rect.fillColor = 0x000033
        rect.setOrigin(0.5, 1)

        this.quiz = {
            sentence: this.createQuizSentence(FONT_MED),
            currentText: "",
            correctAnswer: "",
            correctAnswerText: this.createCorrectAnswerText(FONT_MED),
            indicesInAnswer: [],
            isWordUsed: [],
            words: this.createWords()
        }

        let UI_Y = Y_MAX - 150 / 2 
        this.add.image(X_CENTRE, UI_Y, UI_KEY)

        this.createKeyboardInput()
        this.createTouchInput(this.quiz)

        this.timerEvents = []

        this.newQuiz()
    }

    doAnswer(){

    }

    doGame(){
        this.moveQuiz(this.quiz.sentence)
    }

    //#region Creator Methods
    createAnswerText() {
        let text = this.add.text(ANSWER_POS.x, ANSWER_POS.y, `Text`, {font: FONT_MED}).setOrigin(0.5)
        this.physics.world.enable(text, 0)
        // @ts-ignore
        text.body.setAllowGravity(false)
        text.setVisible(false)
        return text
    }
    createWords() {
        this.log('Create Words.')
        const numWords = 4
        let words = []
        for(let i=0;i<numWords;i++){
            let text = this.add.text(X_CENTRE, 400 + 40 * i, `${i}`, {font: FONT_MED}).setOrigin(0.5)
            this.physics.world.enable(text, 0)
            // @ts-ignore
            text.body.setAllowGravity(false)
            text.setVisible(false)
            words.push(text)
        }

        return words
    }
    createKeyboardInput() {
        this.input.keyboard.removeAllKeys()
        let keys = {}
        keys.esc = this.input.keyboard.addKey('ESC')
        keys.esc.on(
            'down',
            () => {
                this.log(`Escape Pressed.`)
                this.pause()
            }
        )
        keys.back = this.input.keyboard.addKey('BACKSPACE')
        keys.back.on(
            'down',
            () => {
                console.log("BACKSPACE pressed")
                this.removeWord()
            }
        )
        keys.one = this.input.keyboard.addKey('ONE')
        keys.one.on(
            'down',
            () => {
                console.log("ONE pressed")
                this.selectWord(0)
            }
        )
        keys.two = this.input.keyboard.addKey('TWO')
        keys.two.on(
            'down',
            () => {
                console.log("TWO pressed")
                this.selectWord(1)
            }
        )
        keys.three = this.input.keyboard.addKey('THREE')
        keys.three.on(
            'down',
            () => {
                console.log("THREE pressed")
                this.selectWord(2)
            }
        )
        keys.four = this.input.keyboard.addKey('FOUR')
        keys.four.on(
            'down',
            () => {
                console.log("FOUR pressed")
                this.selectWord(3)
            }
        )
        return keys
    }

    createTouchInput(quiz) {
        this.log('Create Touch Input.')
        for(let i=0; i < quiz.words.length; i++){
            quiz.words[i].setInteractive()
            quiz.words[i].on(
                'pointerdown',
                () => {
                    console.log(`Answer ${i} touched!`)
                    this.selectWord(i)
                }
            )
        }

        this.input.on(
            'pointerdown',
            (pointer) => {
                console.log("Pointer down")
                if(pointer.y < 500){
                    this.pause()
                }
            }
        )
    }

    //#endregion

    newQuiz() {
        let q = this.getQuestion()
        let data = this.getSentence(q)
        this.quiz.sentence.text = data.sentence
        this.quiz.correctAnswer = data.answer
        let words = data.clozeWords
        this.quiz.indicesInAnswer = []

        console.log(this.quiz.sentence.text)
        console.log(this.quiz.correctAnswer)
        console.log(words)

        for(let i=0; i<4; i++){
            this.quiz.isWordUsed[i] = false
            this.quiz.words[i].setVisible(true)
            this.quiz.words[i].text = (i+1) + ". " + words[i]
            // @ts-ignore
            this.quiz.words[i].body.setVelocity(0)
            // @ts-ignore
            this.quiz.words[i].body.setAllowGravity(false)
            
            let pos = this.getAnswerXY(i)
            this.quiz.words[i].setPosition(pos.x, pos.y)
        }

        this.quiz.sentence.setVisible(true)

        this.quiz.sentence.setPosition(X_CENTRE, -10)
        // @ts-ignore
        this.quiz.sentence.body.setAllowGravity(false)
        // @ts-ignore
        this.quiz.sentence.body.setVelocity(0, DY + this.level * LEVEL_DY)

        this.resetSway()
        this.lostLife = false

    }

    getAnswerXY(index){
        return {
            x: 120 + 240 * (index % 2), 
            y: 565 + 50 * (Math.floor(index/2) % 2)                
        }
    }


    getQuestion() {
        let index = this.randIndex(this.gameData.quizzes.length);
        return this.gameData.quizzes[index]
    }
    getSentence(q) {
        let text = this.processText(q.sentence)
        let words = text.split(' ')
        let shuffled = this.shuffle(words)
        let clozeWords = []
        let wordsToRemove = []

        console.log(`Shuffled Array...`)
        console.log(shuffled)
        console.log(`^^^^^^^^^^^^`)
        {
            let numPushed = 0;
            let i = 0;
            while(numPushed < 4){
                if(shuffled[i] !== '\n'){
                    console.log(`Pushing ${shuffled[i]} into clozed words.`)
                    clozeWords.push(shuffled[i])
                    numPushed++
                }
                i++;
            }
        }

        wordsToRemove = clozeWords.slice()

        for(let i=0; i< words.length; i++){
            console.log(`Checking ${words[i]}`)
            if(wordsToRemove.includes(words[i])){
                console.log(`It includes ${words[i]}!`)
                let index = wordsToRemove.findIndex(x => x === words[i])
                wordsToRemove.splice(index, 1)
                words[i] = this.BLANK
                
            }
        }

        let sentence = words.join(' ')

        return { sentence, clozeWords, answer: text }
    }

    selectWord(index) {
        // If used, don't use it again
        if(this.quiz.isWordUsed[index]){
            return
        }

        SFXManager.playBeep()

        this.quiz.indicesInAnswer.push(index)
        this.quiz.isWordUsed[index] = true

        //Move word toward sentence
        let velocity = this.calcVelocity(
            this.quiz.sentence,
            this.quiz.words[index],
            ANSWER_MOVE_TIME
        )
        console.log(velocity)
        // @ts-ignore
        this.quiz.words[index].body.setVelocity(velocity.x, velocity.y)

        //Slice the number off
        this.quiz.words[index].text = this.quiz.words[index].text.substring(3)

        this.timerEvents.push(this.time.delayedCall(
            ANSWER_MOVE_TIME * 1000, 
            this.addWordToSentence, 
            [this.quiz.words[index]],
            this
            )
        )
    }

    removeWord(){

        if(this.quiz.indicesInAnswer.length === 0) return

        SFXManager.playTone()

        //Pop the last word in flight, if it exists
        let e = this.timerEvents.pop()
        if(e) e.destroy()

        console.log('~~~~~~~~~~~~~~~~~~~')
        console.log('Timer events now are...')
        console.log(this.timerEvents)
        console.log('~~~~~~~~~~~~~~~~~~~')

        let lastIndex = this.quiz.indicesInAnswer.pop()
        this.quiz.isWordUsed[lastIndex] = false

        let lastWordObj = this.quiz.words[lastIndex]

        let sentence = this.quiz.sentence
        sentence.text = sentence.text.replace(lastWordObj.text, this.BLANK)

        lastWordObj.setVisible(true)
        lastWordObj.setPosition(sentence.x, sentence.y)

        lastWordObj.text = (lastIndex + 1) + '. ' + lastWordObj.text

        let pos = this.getAnswerXY(lastIndex)
        let velocity = this.calcVelocity(pos, lastWordObj, ANSWER_MOVE_TIME)

        this.quiz.words[lastIndex].body.setVelocity(velocity.x, velocity.y)

        this.time.delayedCall(
            ANSWER_MOVE_TIME * 1000, 
            () => {
                this.quiz.words[lastIndex].body.setVelocity(0)
                this.quiz.words[lastIndex].setPosition(pos.x, pos.y)
            }
        )

    }

    addWordToSentence(word){
        console.log(`Adding ${word} to Sentence!`)
        word.body.setVelocity(0)
        word.setVisible(false)

        this.shakeCamera(150, new Phaser.Math.Vector2 (0.01, 0.01))

        let currentStr = this.quiz.sentence.text

        currentStr = currentStr.replace(this.BLANK, word.text)

        this.quiz.sentence.text = currentStr

        if(this.isReadyToAnswer()){
            this.checkAnswer()
        }
    }

    isReadyToAnswer(){
        console.log('Is ready to Answer?')
        return !this.quiz.sentence.text.includes(this.BLANK)
    }

    checkAnswer(){
        if(this.quiz.sentence.text === this.quiz.correctAnswer){
            this.correctAnswer()
        } else {
            this.wrongAnswer(this.quiz.sentence)
        }
    }

    endQuestion(){
        this.quiz.sentence.setVisible(false)
    }

    
    /**
     * @param {string} text
     */
    processText(text){
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
            
            for(const partOfSpeech of this.gameData.partsOfSpeech){
                console.log(partOfSpeech.name);
                if(wildCard == partOfSpeech.keyword){
                    console.log("Found keyword "+partOfSpeech.keyword);
                    replacement = partOfSpeech.words[this.randIndex(partOfSpeech.words.length)];
                    break;
                }
            }
            
            finishedText = finishedText.replace("%"+wildCard+"%", replacement);
        }

        console.log("Finished sentence is: " + finishedText);
        return finishedText[0].toUpperCase() + finishedText.slice(1);
        
    }
}