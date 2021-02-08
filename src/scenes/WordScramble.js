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
        for(let i=0; i < quiz.words.length; i++){
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
        let data = this.getSentence(q)
        this.quiz.sentence.text = data.sentence
        let ans = data.clozeWords

        console.log(this.quiz.sentence.text)
        console.log(ans)

        for(let i=0; i<4; i++){
            this.quiz.words[i].text = 
            this.quiz.words[i].setVisible(true)
            this.quiz.words[i].text = (i+1) + ". " + ans[i]
            // @ts-ignore
            this.quiz.words[i].body.setVelocity(0)
            // @ts-ignore
            this.quiz.words[i].body.setAllowGravity(false)
            
            this.quiz.words[i].setPosition(
            /* x */ 120 + 240 * (i % 2), 
            /* y */ 565 + 50 * (Math.floor(i/2) % 2)                
            )
        }

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

        return { sentence, clozeWords }
    }

    getAnswers(q) {
        let indices = [0,1,2,3] // Add 4 indices

        indices = this.shuffle(indices)

        for(let i=0; i< indices.length; i++){

        }


        throw new Error("Method not implemented.");
    }


    selectAnswer(index) {
        throw new Error("Method not implemented.");
    }
    
}