import EnglishGame from "./EnglishGame";


const X_MAX = 480
const X_CENTRE = X_MAX / 2
const Y_MAX = 640

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
        super(THIS_GAME)
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
            answerText: this.createAnswerText(),
            correctAnswer: "",
            answerIndices: [],
            playerAnswer: "",
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

    createQuizSentence() {
        let text = this.add.text(X_CENTRE, 240, 'BOO!', {font: FONT_MED}).setOrigin(0.5)
        this.physics.world.enable(text, 0)
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
                this.selectAnswer(0)
            }
        )
        keys.two = this.input.keyboard.addKey('TWO')
        keys.two.on(
            'down',
            () => {
                console.log("TWO pressed")
                this.selectAnswer(1)
            }
        )
        keys.three = this.input.keyboard.addKey('THREE')
        keys.three.on(
            'down',
            () => {
                console.log("THREE pressed")
                this.selectAnswer(2)
            }
        )
        keys.four = this.input.keyboard.addKey('FOUR')
        keys.four.on(
            'down',
            () => {
                console.log("FOUR pressed")
                this.selectAnswer(3)
            }
        )
        return keys
    }

    createTouchInput(quiz) {
        this.log('Create Touch Input.')
        console.log(quiz)
        console.log(quiz.words)
        console.log(quiz.words.length)
        for(let i=0; quiz.words.length; i++){
            quiz.words[i].setInteractive()
            quiz.words[i].on(
                'pointerdown',
                () => {
                    console.log(`Answer ${i} touched!`)
                    this.selectAnswer(i)
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
    newQuiz() {
        let q = this.getQuestion()
        this.quiz.sentence = this.getSentence(q)
        let ans = this.getAnswers(q)

    }


    getQuestion() {
        let index = this.randIndex(this.gameData.quizzes.length);
        return this.gameData.quizzes[index]
    }
    getSentence(q) {
        return q.sentence
    }

    getAnswers(q) {
        throw new Error("Method not implemented.");
    }


    selectAnswer(index) {
        throw new Error("Method not implemented.");
    }
    
}