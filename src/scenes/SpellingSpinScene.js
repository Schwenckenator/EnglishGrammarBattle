import Phaser from 'phaser'
import EnglishGame from './EnglishGame'

// const SKY_KEY = 'sky'
// const EXP_KEY = 'exp'
const UI_KEY = 'ui-line'

const FONT_MED = '24px Arial'
const FONT_BIG = '48px Arial'
const HEART = "\u200D\u2764\uFE0F\u200D"

const LEVEL_DY = 5
const DY = 30 - LEVEL_DY

const FREQ = 0.01
const SCORE_FREQ = 0.001

const X_CENTRE = 240
const Y_CENTRE = 320
const X_MAX = 480
const Y_MAX = 640

const ANSWER_MOVE_TIME = 0.5
const ANSWER_POS = {x: X_CENTRE, y:500}

const BOTTOM_Y = 500

const NEXT_LEVEL_TARGET = 10

const ALPHABET = [
    'A', 'B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
]

const THIS_GAME = 'Spelling-Spin'

export default class SpellingSpinScene extends EnglishGame
{
	constructor()
	{
        super(THIS_GAME)
        
    }

	preload()
    {
        super.preload()
        console.log("Preload Spelling Spin")
        this.load.json('J2Ewords', 'assets/J2Ewords.json')
        this.load.image(UI_KEY, 'assets/HorizontalLine.png')
    }


    create()
    {
        super.create()
        console.log("Create Spelling Spin")
        this.gameData = this.cache.json.get('J2Ewords')
        this.add.image(240, 530, UI_KEY)
        this.quiz = {
            sentence: this.createQuizSentence(),
            answerText: this.createAnswerText(),
            answer: "",
            playerAnswer: "",
            indices: [],
            letters: this.createLetters(),
            tick: 0,
            sinOffset: 0,
            freq: 0
        }
        this.keys = this.createKeyboardInput()
        this.newQuiz()
    }


    update(){
        if(this.isAnswerSelected){
            if(this.isClose(this.quiz.answerText, this.quiz.sentence)){
                this.checkAnswer()
            }
        }else{
            this.moveSentence()
        }
        if(this.quiz.sentence.y > BOTTOM_Y && !this.lostLife){
            this.loseLife()
            this.endQuestion()
            if(this.lives >= 0){
                this.next()
            }
        }
    }


    //#region Creator Methods

    createQuizSentence(){
        let text = this.add.text(X_CENTRE, 240, 'BOO!', {font: FONT_BIG}).setOrigin(0.5)
        this.physics.world.enable(text, 0)
        return text
    }
    createAnswerText(){
        let text = this.add.text(ANSWER_POS.x, ANSWER_POS.y, `Text`, {font: FONT_BIG}).setOrigin(0.5)
        this.physics.world.enable(text, 0)
        // @ts-ignore
        text.body.setAllowGravity(false)
        text.setVisible(false)
        return text
    }
    createLetters() {
        const numLetters = 10
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
                console.log("GF Enter pressed")
            }
        )
        keys.esc = this.input.keyboard.addKey('ESC')
        keys.esc.on(
            'down', 
            () => {
                console.log("GF Escape pressed")
                this.pause(THIS_GAME)
            }
        )
        for(let letter of ALPHABET){
            console.log(letter)
            this.keyboardAddLetter(letter)
        }
        
        return keys
    }

    
    /**
     * @param {string} letter
     */
    keyboardAddLetter(letter){
        this.input.keyboard.addKey(letter).on('down',() => {this.checkLetter(letter); console.log(`${letter} down.`)})
    }

    /**
     * @param {Phaser.GameObjects.Text[]} letters
     */
    createTouchInput(letters){
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

        
        this.input.on(
            'pointerdown',
            (pointer) => {
                console.log("Pointer down")
                if(pointer.y < 500){
                    this.pause(THIS_GAME)
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
        this.quiz.answer = q.english
        let obj = this.getLetters(q)
        let ls = obj.letters
        this.quiz.indices = obj.indices

        console.log(
            `
            Answer: ${q.english}
            Letters: ${ls}
            Indices: ${obj.indices}
            `
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
            
            // let radius = 50

            // let x = centreX + radius * Math.sin(arc * i)
            // let y = centreY + radius * Math.cos(arc * i)

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

        this.quiz.sinOffset = Math.random() * 2 * Math.PI
        this.quiz.freq = FREQ + this.level * SCORE_FREQ
        this.lostLife = false
    }

    checkLetter(letter){
        

        if(this.quiz.answer.includes(letter) && 
        !this.quiz.playerAnswer.includes(letter)){
            
            this.quiz.playerAnswer += letter
            let ans = this.quiz.answer
            let ansIndex = ans.indexOf(letter)
            let index = this.quiz.indices.indexOf(ansIndex)
            console.log(
                `
                Letter '${letter}' is in answer!
                It is index ${ansIndex} in the answer.
                Selecting answer ${index}...
                `
            )

            this.selectLetter(index)
        }
    }

    selectLetter(i){
        
        let prepZone = {x: 240, y:500}
        let moveTime = .25
        //Move letter to prep zone
        // @ts-ignore
        this.quiz.letters[i].body.setVelocity(
            (prepZone.x - this.quiz.letters[i].x) / moveTime,
            (prepZone.y - this.quiz.letters[i].y) / moveTime
        )

        this.time.delayedCall(moveTime * 1000, this.checkReadyToAnswer, [this.quiz.letters[i]], this)
    }

    checkReadyToAnswer(letter){
        //If all letters are in prep zone, fire word!
        letter.body.setVelocity(0)
        letter.setVisible(false)
        this.quiz.answerText.setVisible(true)
        this.quiz.answerText.text += letter.text

        if(this.quiz.playerAnswer.length === this.quiz.answer.length){
            //Shoot answer
            this.isAnswerSelected = true
            // @ts-ignore
            this.quiz.sentence.body.setVelocity(0)
            this.fireAnswer(this.quiz.answerText, this.quiz.sentence, ANSWER_MOVE_TIME)
            this.shootAnswerSound.play()
        }
    }
    
    moveSentence() {
        let amp = 50
        let x = X_CENTRE + amp*(Math.sin(this.quiz.freq*this.quiz.tick + this.quiz.sinOffset))
        let y = this.quiz.sentence.y
        this.quiz.sentence.setPosition(x, y)
        this.quiz.tick++
    }

    fireAnswer(ansObj, quizObj, moveTime){
        ansObj.body.setVelocity(
            (quizObj.x - ansObj.x) / moveTime,
            (quizObj.y - ansObj.y) / moveTime
        )
    }

    isClose(obj1, obj2){
        let x = obj1.x - obj2.x
        let y = obj1.y - obj2.y
        let sqrDist = x * x + y * y
        return sqrDist < 0.1
    }

    checkAnswer(){
        if(this.quiz.playerAnswer === this.quiz.answer){
            this.correctAnswer()
        }else{
            this.wrongAnswer()
        }
    }

    correctAnswer(){
        this.explode(this.quiz.sentence.x, this.quiz.sentence.y, 2)
        this.shakeCamera(250, new Phaser.Math.Vector2 (0.02, 0.02))
        this.score++
        this.scoreText.text = `Score: ${this.score}`
        this.endQuestion()

        if(this.checkForNextLevel()){
            this.time.delayedCall(500, () => {
                    this.scene.start('Next-Level-Screen', { gameKey: THIS_GAME, score: this.score, level: this.level })
                }, null, this)
        }else{
            this.next()
        }
    }


    wrongAnswer(){
        let amp = 30
        // @ts-ignore
        this.quiz.sentence.body.setVelocity(Math.random()* amp - amp/2, -Math.random()* amp)
        // @ts-ignore
        this.quiz.sentence.body.setAllowGravity(true)
        // @ts-ignore
        this.quiz.answerText.body.setVelocity(Math.random() * amp - amp/2, -Math.random()* amp)
        // @ts-ignore
        this.quiz.answerText.body.setAllowGravity(true)

        this.wrongSound.play()

        this.shakeCamera(150, new Phaser.Math.Vector2 (0.01, 0.01))
    }

    loseLife(){
        this.explode(this.quiz.sentence.x, this.quiz.sentence.y, 4)
        // this.shakeCamera(500, new Phaser.Math.Vector2 (0.1, 0.1))
        // this.quiz.answerText.setVisible(false)
        // this.lives--
        // this.livesText.text = this.getLivesString(this.lives)
        // this.checkForGameOver()
        // this.lostLife = true

        this.shakeCamera(500, new Phaser.Math.Vector2 (0.1, 0.1))
        this.lives--
        this.lostLife = true
        this.livesText.text = this.getLivesString(this.lives)
        this.endQuestion()

        if(this.checkForGameOver()){
            this.explodeGameOver()
            //GAME OVER
            this.time.delayedCall(2500, () => {
                this.scene.start('Game-Over-Screen', { gameKey: THIS_GAME, level: this.level, score: this.score })
            }, null, this)
        }else{
            this.next()
        }
    }

    checkForNextLevel(){
        return this.score % NEXT_LEVEL_TARGET == 0 // Hit a multiple level target
    }

    next(){
        this.time.delayedCall(250, this.newQuiz, null, this)
    }

    endQuestion(){
        // @ts-ignore
        this.quiz.answerText.body.setVelocity(0)
        // @ts-ignore
        this.quiz.answerText.body.setAllowGravity(false)
        this.quiz.answerText.setVisible(false)
        
        for(let i=0; i<this.quiz.letters.length; i++){
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
            letters.push(q.english[indices[i]])
        }

        return {letters, indices}
    }

    //#endregion
}
