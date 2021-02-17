import Phaser from 'phaser'
import SFXManager from '../classes/SFXManager'
import EnglishGame from './EnglishGame'

// const SKY_KEY = 'sky'
// const EXP_KEY = 'exp'
const UI_KEY = 'ui-line'

const FONT_MED = '24px Arial'
const FONT_BIG = '48px Arial'

const LEVEL_DY = 5
const DY = 30 - LEVEL_DY

const X_CENTRE = 240
const Y_CENTRE = 320
const X_MAX = 480
const Y_MAX = 640

const ANSWER_MOVE_TIME = 0.5
const ANSWER_POS = {x: X_CENTRE, y:500}

const BOTTOM_Y = 500

const ALPHABET = [
    'A', 'B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
]

const LETTER_USED_CHAR = '*'
const SPACE_REPLACEMENT = '_'
const KEY_PAIRS = [
    {name: 'SPACE', code: 'SPACE', char: SPACE_REPLACEMENT},
    {name: 'MINUS', code: 'MINUS', char: '-'},
    {name: 'MINUS', code: 173,     char: '-'}
]


const THIS_GAME = 'Spelling-Spin'

export default class SpellingSpinScene extends EnglishGame
{
	constructor()
	{
        super(THIS_GAME, BOTTOM_Y)
    }

	preload()
    {
        super.preload()
        console.log("Preload Spelling Spin")
        this.load.json('J2Ewords', 'assets/SpellingSpinData.json')
        // this.load.json('J2Ewords', 'assets/J2EwordsTEST.json')
        this.load.image(UI_KEY, 'assets/UI-OpenBottom.png')
    }


    create()
    {
        super.create()
        console.log("Create Spelling Spin")
        this.gameData = this.cache.json.get('J2Ewords')


        this.quiz = {
            sentence: this.createQuizSentence(FONT_BIG),
            answerText: this.createAnswerText(),
            correctAnswer: "",
            correctAnswerText: this.createCorrectAnswerText(FONT_BIG),
            remainingLetters: "",
            answerIndices: [],
            playerAnswer: "",
            indices: [],
            letters: this.createLetters(),
        }

        let uiY = Y_MAX - 100 - 60 / 2 
        this.add.image(240, uiY, UI_KEY)

        this.createKeyboardInput()
        this.createTouchInput(this.quiz)
        this.newQuiz()
    }

    doAnswer(){
        if(this.isClose(this.quiz.answerText, this.quiz.sentence)){
            this.checkAnswer()
        }
    }

    doGame(){
        this.moveQuiz(this.quiz.sentence)
    }


    //#region Creator Methods
    createAnswerText(){
        let text = this.add.text(ANSWER_POS.x, ANSWER_POS.y, `Text`, {font: FONT_BIG}).setOrigin(0.5)
        this.physics.world.enable(text, 0)
        // @ts-ignore
        text.body.setAllowGravity(false)
        text.setVisible(false)
        return text
    }
    createLetters() {
        const numLetters = 20
        let letters = []
        for(let i=0;i<numLetters;i++){
            let text = this.add.text(X_CENTRE, 400 + 40 * i, `${i}`, {font: FONT_BIG}).setOrigin(0.5)
            this.physics.world.enable(text, 0)
            // @ts-ignore
            text.body.setAllowGravity(false)
            text.setVisible(false)
            letters.push(text)
        }

        return letters
    }

    createKeyboardInput(){
        this.input.keyboard.removeAllKeys()
        let keys = {}
        keys.enter = this.input.keyboard.addKey('ENTER')
        keys.enter.on(
            'down', 
            () => {
                console.log("Spelling Spin: Enter pressed")
            }
        )
        keys.esc = this.input.keyboard.addKey('ESC')
        keys.esc.on(
            'down', 
            () => {
                console.log("Spelling Spin: Escape pressed")
                this.pause()
            }
        )
        keys.back = this.input.keyboard.addKey('BACKSPACE')
        keys.back.on(
            'down', 
            () => {
                console.log("Spelling Spin: BACKSPACE pressed")
                this.removeLetter()
            }
        )

        for(let k of KEY_PAIRS){
            this.keyboardAddPair(k.code, k.name, k.char)
        }
        for(let letter of ALPHABET){
            this.keyboardAddLetter(letter)
        }
        
        return keys
    }

    
    /**
     * @param {string} letter
     */
    keyboardAddLetter(letter){
        this.keyboardAddPair(letter, letter, letter)
    }

    keyboardAddPair(code, name, char){
        console.log(`Spelling Spin: Adding Character '${name}', code '${code}'. Char '${char}'`)
        this.input.keyboard.addKey(code).on('down',() => {console.log(`Spelling Spin: ${name} down.`); this.checkLetter(char)})
    }

    createTouchInput(quiz){
        let letters = quiz.letters
        for(let i=0; i<letters.length; i++){
            let w = 200
            let h = 60
            let x = letters[i].x - w /2
            let y = letters[i].y - h / 2
            console.log(`Touch input answer ${i}`)
            letters[i].setInteractive()
            letters[i].on(
                'pointerdown',
                () => {
                    console.log(`Answer ${i} touched!`)
                    this.selectLetter(i)
                }
            )
        }
        quiz.answerText.setInteractive()
        quiz.answerText.on(
            'pointerdown',
            () => {
                console.log(`Answer Text Touched.`)
                this.removeLetter()
            }
        )
        
        this.input.on(
            'pointerdown',
            (pointer) => {
                console.log("Pointer down")
                if(pointer.y < 400){
                    this.pause()
                }
            }
        )

    }

    //#endregion

    newQuiz(){
        let q = this.getQuestion()
        this.quiz.sentence.text = this.getSentence(q)
        this.quiz.answerText.text = ""
        this.quiz.answerText.setVisible(false)
        this.quiz.answerText.setPosition(ANSWER_POS.x, ANSWER_POS.y)
        this.quiz.correctAnswer = q.english
        this.quiz.answerIndices = []
        let obj = this.getLetters(q)
        let ls = obj.letters
        this.quiz.remainingLetters = ls.join('')
        this.quiz.indices = obj.indices

        console.log(
            `Spelling Spin:\nAnswer: ${q.english}\nLetters: ${ls}\nIndices: ${obj.indices}`
        )

        let arc = 2 * Math.PI / ls.length
        let width = 400
        let segment = width / ls.length
        
        for(let i=0; i<ls.length; i++){
            this.quiz.letters[i].setVisible(true)
            this.quiz.letters[i].text = ls[i]
            // @ts-ignore
            this.quiz.letters[i].body.setVelocity(0)
            // @ts-ignore
            this.quiz.letters[i].body.setAllowGravity(false)
            
            let centreX = 240
            let centreY = 580
            
            //Why do I need the .5? No idea.
            let x = centreX + segment * (i + .5) - width / 2 
            let y = centreY

            this.quiz.letters[i].setPosition(x, y)

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

    calculateLetterPosition(index, length){
        let width = 400
        let segment = width / length

        let centreX = 240
        let centreY = 580

        let x = centreX + segment * (index + .5) - width / 2 
        let y = centreY

        return {x: x, y: y}
    }

    checkLetter(letter){
        console.log(`Spelling Spin: Checking '${letter}'`)

        if(this.quiz.remainingLetters.includes(letter)){
            
            
            let letters = this.quiz.remainingLetters
            let letterIndex = letters.indexOf(letter)
            // let index = this.quiz.indices.indexOf(letterIndex)
            console.log(
                `Spelling Spin:\nLetter '${letter}' is in answer!\nIt is index ${letterIndex} in the answer.\nSelecting answer ${letterIndex}...\n`
            )

            this.selectLetter(letterIndex)
        }
    }

    selectLetter(i){
        this.quiz.remainingLetters = this.quiz.remainingLetters.replace(this.quiz.letters[i].text, LETTER_USED_CHAR)

        console.log(`Spelling Spin: SELECTED LETTER TEXT IS '${this.quiz.letters[i].text}'.`)
        console.log(`Spelling Spin: Remaining letters are '${this.quiz.remainingLetters}'.`)
        console.log(`Spelling Spin: Pushing '${i}' to indices in answer list.`)

        let prepZone = {x: 240, y:500}
        let moveTime = .25
        //Move letter to prep zone
        // @ts-ignore
        this.quiz.letters[i].body.setVelocity(
            (prepZone.x - this.quiz.letters[i].x) / moveTime,
            (prepZone.y - this.quiz.letters[i].y) / moveTime
        )

        SFXManager.playBeep()

        this.time.delayedCall(moveTime * 1000, this.checkReadyToAnswer, [this.quiz.letters[i], i], this)
    }

    removeLetter(){
        if(this.quiz.playerAnswer.length === 0) return

        let deletedChar = this.quiz.playerAnswer.charAt(this.quiz.playerAnswer.length - 1)
        // Take last letter from the player answer
        this.quiz.playerAnswer = this.quiz.playerAnswer.slice(0, -1)

        this.quiz.answerText.text = this.quiz.playerAnswer
        
        // Add the deleted letter back to the remaining letters.
        
        // work out what index it was
        let index = this.quiz.answerIndices.pop()
        console.log(`Spelling Spin: Index of '${deletedChar}' is '${index}'.`)

        this.quiz.remainingLetters = this.replaceAt(this.quiz.remainingLetters, index, deletedChar)
        console.log(`Spelling Spin: Remaining letters are ${this.quiz.remainingLetters}'.`)

        // put the answer back below the line, and make it selectable again.
        let moveTime = .25

        let newPos = this.calculateLetterPosition(index, this.quiz.correctAnswer.length)

        // Make letter object visible
        this.quiz.letters[index].setVisible(true)

        this.quiz.letters[index].body.setVelocity(
            (newPos.x - this.quiz.letters[index].x) / moveTime,
            (newPos.y - this.quiz.letters[index].y) / moveTime
        )

        SFXManager.playTone()

        // Add delayed call to stop movement and perfectly position Letter object
        this.time.delayedCall(moveTime * 1000, ()=>{
            this.quiz.letters[index].body.setVelocity(0)
            this.quiz.letters[index].setPosition(newPos.x, newPos.y)
        })
    }

    checkReadyToAnswer(letter, i){
        this.quiz.playerAnswer += letter.text
        
        this.quiz.answerIndices.push(i)
        console.log(`Checking if ready to Answer!\nPlayer answer has '${this.quiz.playerAnswer.length}', answer has '${this.quiz.correctAnswer.length}'.`)
        //If all letters are in prep zone, fire word!
        letter.body.setVelocity(0)
        letter.setVisible(false)
        this.quiz.answerText.setVisible(true)
        this.quiz.answerText.text += letter.text

        if(this.quiz.playerAnswer.length === this.quiz.correctAnswer.length){
            //Shoot answer
            this.isAnswerSelected = true
            // @ts-ignore
            this.quiz.sentence.body.setVelocity(0)
            this.fireAnswer(this.quiz.answerText, this.quiz.sentence, ANSWER_MOVE_TIME)
            this.shootAnswerSound.play()
        }
    }

    fireAnswer(ansObj, quizObj, moveTime){
        ansObj.body.setVelocity(
            (quizObj.x - ansObj.x) / moveTime,
            (quizObj.y - ansObj.y) / moveTime
        )
    }

    checkAnswer(){
        let answer = this.quiz.correctAnswer
        let playerAnswer = this.quiz.playerAnswer.replace(/_/g, ' ')

        console.log(`Answer = '${answer}'\nPlayers answer = '${playerAnswer}'.\nCorrect? ${playerAnswer === answer}`)
        if(answer === playerAnswer){
            this.correctAnswer()
        }else{
            this.wrongAnswer(this.quiz.sentence, this.quiz.answerText)
        }
    }

    // ABSTRACT IMPLEMENTATION 
    endQuestion(){
        // @ts-ignore
        this.quiz.answerText.body.setVelocity(0)
        // @ts-ignore
        this.quiz.answerText.body.setAllowGravity(false)
        this.quiz.answerText.setVisible(false)
        
        for(let i=0; i<this.quiz.letters.length; i++){
            console.log(`Spelling Spin: Hiding letter ${i}`)
            this.quiz.letters[i].setVisible(false)
        }
        this.quiz.sentence.setVisible(false)
        this.quiz.playerAnswer = ""
        this.isAnswerSelected = false
    }

    //#region Quiz Generators

    getQuestion(){
        let index = this.randIndex(this.gameData.quiz.length);
        return this.gameData.quiz[index]
    }


    getSentence(q){
        console.log("GetSentence")
        return q.japanese
    }

    getLetters(q){
        let indices = []
        for(let i=0; i<q.english.length; i++){
            indices.push(i)
        }
        indices = this.shuffle(indices)
        let letters = []
        for(let i=0; i<indices.length; i++){
            if(q.english[indices[i]] === ' '){
                letters.push(SPACE_REPLACEMENT)
                continue
            }
            letters.push(q.english[indices[i]])
        }

        return {letters, indices}
    }

    //#endregion
}
