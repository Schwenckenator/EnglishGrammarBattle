import EnglishGame from "./EnglishGame";


const X_MAX = 480
const X_CENTRE = X_MAX / 2
const Y_MAX = 640

const DATA_KEY = 'DATA'
const UI_KEY = 'UI'

const THIS_GAME = 'Word-Scramble'

export default class WordScrambleScene extends EnglishGame{

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
        this.gameData = this.cache.json.get(DATA_KEY)

        let UI_Y = Y_MAX - 150 / 2 
        this.add.image(X_CENTRE, UI_Y, UI_KEY)
        this.quiz = {
            sentence: this.createQuizSentence(),
            answerText: this.createAnswerText(),
            correctAnswer: "",
            answerIndices: [],
            playerAnswer: "",
            words: this.createWords()
        }

        this.keys = this.createKeyboardInput()
        this.touch = this.createTouchInput(this.quiz)

        this.newQuiz()
    }
}