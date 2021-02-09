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

const DATA_KEY = 'DATA'
const UI_KEY = 'UI'

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

        this.load.json(DATA_KEY, 'assets/WordScrambleData.json')
        this.load.image(UI_KEY, 'assets/Ui-4-section.png')
    }

    create(){
        super.create()
        this.log(`Create ${THIS_GAME} CLASS`)
        this.gameData = this.cache.json.get(DATA_KEY)

        this.quiz = {
            sentence: this.createQuizSentence(),
            currentText: "",
            correctAnswer: "",
            wordsInAnswer: [],
            isWordUsed: [],
            words: this.createWords()
        }

        let UI_Y = Y_MAX - 150 / 2 
        this.add.image(X_CENTRE, UI_Y, UI_KEY)

        this.createKeyboardInput()
        this.createTouchInput(this.quiz)

        this.newQuiz()
    }

    doAnswer(){

    }

    doGame(){
        this.moveQuiz(this.quiz.sentence)
    }

    //#region Creator Methods

    createQuizSentence() {
        let text = this.add.text(X_CENTRE, 240, 'BOO!', {font: FONT_MED}).setOrigin(0.5)
        this.physics.world.enable(text, 0)
        // @ts-ignore
        text.body.setAllowGravity(false)
        return text
    }
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
            
            this.quiz.words[i].setPosition(
            /* x */ 120 + 240 * (i % 2), 
            /* y */ 565 + 50 * (Math.floor(i/2) % 2)                
            )
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


    getQuestion() {
        let index = this.randIndex(this.gameData.quizzes.length);
        return this.gameData.quizzes[index]
    }
    getSentence(q) {
        let words = q.sentence.split(' ')
        let shuffled = this.shuffle(words)
        let clozeWords = []

        console.log(`Shuffled Array...`)
        console.log(shuffled)
        console.log(`^^^^^^^^^^^^`)

        for(let i = 0; i < 4; i++){
            console.log(`Pushing ${shuffled[i]} into clozed words.`)
            clozeWords.push(shuffled[i])
        }
        for(let i=0; i< words.length; i++){
            console.log(`Checking ${words[i]}`)
            if(clozeWords.includes(words[i])){
                console.log(`It includes ${words[i]}!`)
                words[i] = '____'
            }
        }

        let sentence = words.join(' ')

        return { sentence, clozeWords, answer: q.sentence }
    }

    // getAnswers(q) {
    //     let indices = [0,1,2,3] // Add 4 indices

    //     indices = this.shuffle(indices)

    //     for(let i=0; i< indices.length; i++){

    //     }


    //     throw new Error("Method not implemented.");
    // }


    selectWord(index) {
        // If used, don't use it again
        if(this.quiz.isWordUsed[index]){
            return
        }

        this.quiz.wordsInAnswer.push(this.quiz.words[index])
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

        this.time.delayedCall(
            ANSWER_MOVE_TIME * 1000, 
            this.addWordToSentence, 
            [this.quiz.words[index]],
            this
            )
        //throw new Error("Method not implemented.");
    }

    removeWord(){

    }

    addWordToSentence(word){
        console.log(`Adding ${word} to Sentence!`)
        // console.log(word)
        word.body.setVelocity(0)
        word.setVisible(false)

        let currentStr = this.quiz.sentence.text

        currentStr = currentStr.replace('____', word.text)

        this.quiz.sentence.text = currentStr

        if(this.isReadyToAnswer()){
            this.checkAnswer()
        }
    }

    isReadyToAnswer(){
        console.log('Is ready to Answer?')
        for(let used of this.quiz.isWordUsed){
            console.log(used)
            if(!used){
                return false
            }
        }
        return true
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

    
    
}