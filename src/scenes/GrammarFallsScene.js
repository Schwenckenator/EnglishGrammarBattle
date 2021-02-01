import Phaser from 'phaser'
import EnglishGame from './EnglishGame'

const FONT_MED = '24px Arial'
const FONT_BIG = '48px Arial'

const UI_KEY = 'ui-cross'

const LEVEL_DY = 5
const DY = 30 - LEVEL_DY

const FREQ = 0.01
const SCORE_FREQ = 0.001

const X_CENTRE = 240
const Y_CENTRE = 320
const X_MAX = 480
const Y_MAX = 640

const ANSWER_MOVE_TIME = 0.5

const BOTTOM_Y = 540

const NEXT_LEVEL_TARGET = 10

const THIS_GAME = 'Grammar-Falls'

export default class GrammarFallsScene extends EnglishGame
{
	constructor()
	{
        super(THIS_GAME)
        
    }

	preload()
    {
        super.preload()
        console.log("Preload Grammar Falls")
        this.load.json('sentences', 'assets/Sentences.json')
        this.load.image(UI_KEY, 'assets/BottomMenu.png')
    }

    create()
    {
        super.create()
        console.log("Create Grammar Falls")
        this.gameData = this.cache.json.get('sentences')
        this.add.image(240, 590, UI_KEY)
        this.quiz = {
            sentence: this.createQuizSentence(),
            answers: this.createAnswers(),
            correctIndex: -1, // Don't know yet
            tick: 0,
            sinOffset: 0,
            freq: 0
        }

        this.createKeyboardInput()
        this.selectedAnswer = -1
        this.isAnswerSelected = false
        this.createTouchInput(this.quiz.answers)

        this.newQuiz()
    }


    update(){
        if(this.isAnswerSelected){
            let finished = this.moveAnswer()
            if(finished){
                this.checkAnswer(this.selectedAnswer)
            }
        }else{
            this.moveSentence()
        }
        if(this.quiz.sentence.y > BOTTOM_Y && !this.lostLife){
            this.loseLife()
        }
    }


    //#region Creator Methods

    createQuizSentence(){
        let text = this.add.text(X_CENTRE, 240, 'BOO!', {font: FONT_MED}).setOrigin(0.5)
        this.physics.world.enable(text, 0)
        return text
    }
    createAnswers() {
        const numAnswers = 4
        let answers = []
        for(let i=0;i<numAnswers;i++){
            let text = this.add.text(X_CENTRE, 400 + 40 * i, `Ans ${i}`, {font: FONT_MED}).setOrigin(0.5)
            this.physics.world.enable(text, 0)
            // @ts-ignore
            text.body.setAllowGravity(false)
            answers.push(text)
        }

        return answers
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

    /**
     * @param {Phaser.GameObjects.Text[]} answers
     */
    createTouchInput(answers){
        for(let i=0; i<answers.length; i++){
            let w = 200
            let h = 60
            let x = answers[i].x - w /2
            let y = answers[i].y - h / 2
            console.log(`Touch input answer ${i}`)
            answers[i].setInteractive()
            answers[i].on(
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

    //#endregion

    newQuiz(){
        let q = this.getQuestion()
        this.quiz.sentence.text = this.getSentence(q)
        let ans = this.getAnswers(q)
        
        this.quiz.correctIndex = ans.correctIndex
        
        for(let i=0; i<4; i++){
            this.quiz.answers[i].setVisible(true)
            this.quiz.answers[i].text = (i+1) + ". " + ans.answers[i]
            // @ts-ignore
            this.quiz.answers[i].body.setVelocity(0)
            // @ts-ignore
            this.quiz.answers[i].body.setAllowGravity(false)
            
            this.quiz.answers[i].setPosition(
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

        this.quiz.sinOffset = Math.random() * 2 * Math.PI
        this.quiz.freq = FREQ + this.level * SCORE_FREQ
        this.lostLife = false
    }
    
    moveSentence() {
        let amp = 50
        let x = X_CENTRE + amp*(Math.sin(this.quiz.freq*this.quiz.tick + this.quiz.sinOffset))
        let y = this.quiz.sentence.y
        this.quiz.sentence.setPosition(x, y)
        this.quiz.tick++
    }

    moveAnswer(){
        let xDiff = this.quiz.sentence.x - this.quiz.answers[this.selectedAnswer].x
        let yDiff = this.quiz.sentence.y - this.quiz.answers[this.selectedAnswer].y
        
        let sqrDist = xDiff * xDiff + yDiff * yDiff
        return sqrDist < 0.1
    }

    selectAnswer(index){
        this.selectedAnswer = index
        this.isAnswerSelected = true

        // Delete the '#. ' at the start of the answer string
        this.quiz.answers[this.selectedAnswer].text = this.quiz.answers[this.selectedAnswer].text.substring(3)

        this.setAnswerDxDy(
            this.quiz.answers[index], 
            this.quiz.sentence, 
            ANSWER_MOVE_TIME)
        // @ts-ignore
        this.quiz.sentence.body.setVelocity(0)
        this.shootAnswerSound.play()
    }
    
    /**
     * @param {Phaser.GameObjects.Text} ansObj
     * @param {Phaser.GameObjects.Text} senObj
     * @param {number} moveTime
     */
    setAnswerDxDy(ansObj, senObj, moveTime){
        // @ts-ignore
        ansObj.body.setVelocity(
            (senObj.x - ansObj.x) / moveTime,
            (senObj.y - ansObj.y) / moveTime
        )
    }

    checkAnswer(index){
        if(index === this.quiz.correctIndex){
            this.correctAnswer()
            
        }else{
            this.wrongAnswer(index)
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

    /**
     * @param {number} i
     */
    wrongAnswer(i){
        let amp = 30
        // @ts-ignore
        this.quiz.sentence.body.setVelocity(Math.random()* amp - amp/2, -Math.random()* amp)
        // @ts-ignore
        this.quiz.sentence.body.setAllowGravity(true)
        // @ts-ignore
        this.quiz.answers[i].body.setVelocity(Math.random() * amp - amp/2, -Math.random()* amp)
        // @ts-ignore
        this.quiz.answers[i].body.setAllowGravity(true)

        this.wrongSound.play()

        this.shakeCamera(150, new Phaser.Math.Vector2 (0.01, 0.01))
    }

    loseLife(){
        this.explode(this.quiz.sentence.x, this.quiz.sentence.y, 4)
        super.loseLife()
    }


    checkForNextLevel(){
        return this.score % NEXT_LEVEL_TARGET == 0 // Hit a multiple level target
    }

    next(){
        this.time.delayedCall(250, this.newQuiz, null, this)
    }

    endQuestion(){
        if(this.selectedAnswer >= 0){
            // @ts-ignore
            this.quiz.answers[this.selectedAnswer].body.setVelocity(0)
            this.quiz.answers[this.selectedAnswer].setVisible(false)
        }
        this.quiz.sentence.setVisible(false)
        this.isAnswerSelected = false
        this.selectedAnswer = -1
    }

    //#region Quiz Generators

    getQuestion(){
        let index = this.randIndex(this.gameData.sentences.length);
        return this.gameData.sentences[index]
    }

    /**
     * @param {{ text: string; }} q
     */
    getSentence(q){
        console.log("GetSentence")
        let text = this.processText(q.text)
    
        return text[0].toUpperCase() + text.slice(1)

    }

    getAnswers(q){
        let correctIndex = -1
        let indices = ['c', 0, 1, 2]
        indices = this.shuffle(indices)
        let answers = []
        for(let i=0; i<4;i++){
            let ans
            if(indices[i] === 'c'){
                ans = this.processText(q.correctAnswer)
                correctIndex = i
            }else{
                ans = this.processText(q.wrongAnswer[indices[i]])
            }
            answers.push(ans)
        }

        return { answers, correctIndex }
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
        return finishedText;
        
    }

    //#endregion
}
