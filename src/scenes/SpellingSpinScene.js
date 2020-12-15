import Phaser from 'phaser'

const SKY_KEY = 'sky'
const EXP_KEY = 'exp'
const UI_KEY = 'ui'

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

const BOTTOM_Y = 500

const NEXT_LEVEL_TARGET = 10

const ALPHABET = [
    'A', 'B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
]

const THIS_GAME = 'Spelling-Spin'

export default class SpellingSpinScene extends Phaser.Scene
{
	constructor()
	{
        super(THIS_GAME)
        
        this.gameData = undefined
    
        this.explosion = undefined
        this.quiz = undefined
        this.score = undefined
        this.lives = undefined
        this.lostLife = undefined
        this.gameObjs = undefined
        this.selectedAnswer = undefined
        this.isAnswerSelected = undefined
        this.level = undefined
        
    }

	preload()
    {
        console.log("Preload Spelling Spin")
        this.load.json('J2Ewords', 'assets/J2Ewords.json')
        this.load.image(SKY_KEY, 'assets/night-sky.png')
        this.load.image(UI_KEY, 'assets/BottomMenu.png')
        this.load.spritesheet(EXP_KEY, 'assets/explosion.png', {frameWidth: 64, frameHeight: 64})
    }

    init(data){
        this.level = data.level
        this.score = data.score
        this.lives = 3
    }

    create()
    {
        console.log("Create Spelling Spin")
        this.gameData = this.cache.json.get('J2Ewords')
        this.createBackground()
        //this.add.image(240, 590, UI_KEY)
        this.explosion = this.createExplosion()
        this.quiz = {
            sentence: this.createQuizSentence(),
            answer: "",
            letters: this.createLetters(),
            tick: 0,
            sinOffset: 0,
            freq: 0
        }
        //this.score = 0
        this.scoreText = this.createScoreText()
        this.lives = 3
        this.livesText = this.createLivesText()
        this.lostLife = false
        this.keys = this.createKeyboardInput()
        this.newQuiz()
    }


    update(){
        // if(this.isAnswerSelected){
        //     let finished = this.moveAnswer()
        //     if(finished){
        //         this.checkAnswer(this.selectedAnswer)
        //     }
        // }else{
        //     this.moveSentence()
        // }
        this.moveSentence()
        if(this.quiz.sentence.y > BOTTOM_Y && !this.lostLife){
            this.loseLife()
            this.endQuestion()
            this.next()
        }
    }


    //#region Creator Methods

    createBackground(){
        this.add.image(X_CENTRE, 160, SKY_KEY)
        this.add.image(X_CENTRE, 480, SKY_KEY)
    }

    createExplosion(){
        let exp = this.add.sprite(X_CENTRE, Y_CENTRE, EXP_KEY)

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers(EXP_KEY, { start: 0, end: 15}),
            frameRate: 36,
            hideOnComplete: true
        })
        exp.setScale(2)
        exp.setVisible(false)

        return exp
    }

    createScoreText(){
        return this.add.text(20, 15, `Score: ${this.score}`, {font: FONT_MED})
    }

    createLivesText(){
        return this.add.text(20, 45, this.getLivesString(this.lives), {font: FONT_MED})
    }

    createQuizSentence(){
        let text = this.add.text(X_CENTRE, 240, 'BOO!', {font: FONT_BIG}).setOrigin(0.5)
        this.physics.world.enable(text, 0)
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
                this.pause()
            }
        )
        for(let letter in ALPHABET){
            this.keyboardAddLetter(letter)
        }
        
        return keys
    }

    keyboardAddLetter(letter){
        this.input.keyboard.addKey(letter).on('down',() => {this.checkLetter(letter)})
    }

    checkLetter(letter){
        if(this.quiz.answer.includes(letter)){
            
        }
    }

    selectLetter(){

    }

    pause() {
        this.scene.pause(THIS_GAME)
        this.scene.launch('Pause-Screen', { gameKey: THIS_GAME })
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
        this.quiz.answer = q.english
        let ls = this.getLetters(q)

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
            let centreY = 565
            
            // let radius = 50

            // let x = centreX + radius * Math.sin(arc * i)
            // let y = centreY + radius * Math.cos(arc * i)

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
        this.setAnswerDxDy(
            this.quiz.answers[index], 
            this.quiz.sentence, 
            ANSWER_MOVE_TIME)
        // @ts-ignore
        this.quiz.sentence.body.setVelocity(0)
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
        this.score++
        this.scoreText.text = `Score: ${this.score}`
        this.endQuestion()

        if(this.checkForNextLevel()){
            this.time.delayedCall(500, () => {
                    this.scene.start('Next-Level-Screen', { gameKey: 'Grammar-Falls', score: this.score, level: this.level })
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
    }

    loseLife(){
        this.explode(this.quiz.sentence.x, this.quiz.sentence.y, 4)
        this.lives--
        this.livesText.text = this.getLivesString(this.lives)
        this.checkForGameOver()
        this.lostLife = true
    }

    explode(x, y, scale){
        this.explosion.setPosition(x,y)
        this.explosion.setScale(scale)
        this.explosion.setVisible(true)
        this.explosion.anims.play('explode')
        //TODO: play sound
    }

    checkForGameOver(){
        console.log("Checking for game over")
        if(this.lives < 0){
            //GAME OVER
            this.time.delayedCall(500, () => {
                this.scene.start('Game-Over-Screen', { gameKey: 'Grammar-Falls', level: this.level, score: this.score })
            }, null, this)
        }
    }

    checkForNextLevel(){
        return this.score % NEXT_LEVEL_TARGET == 0 // Hit a multiple level target
    }

    next(){
        this.time.delayedCall(250, this.newQuiz, null, this)
    }

    endQuestion(){
        // if(this.selectedAnswer >= 0){
        //     // @ts-ignore
        //     this.quiz.answers[this.selectedAnswer].body.setVelocity(0)
        //     this.quiz.answers[this.selectedAnswer].setVisible(false)
        // }
        for(let i=0; i<this.quiz.letters.length; i++){
            this.quiz.letters[i].setVisible(false)
        }
        this.quiz.sentence.setVisible(false)
        this.isAnswerSelected = false
        this.selectedAnswer = -1
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

        return letters
    }

    getLivesString(livesLeft){
        let str = 'Lives: ';
        for(let i=0; i < livesLeft; i++){
            str += HEART;
        }
        return str;
    }
    
    randIndex(max){
        return Math.floor(Math.random() * max);
    }

    shuffle(array){
        let currentIndex = array.length, temp, randomIndex;
        while (0 !== currentIndex){
            randomIndex = this.randIndex(currentIndex);
            currentIndex -= 1;
    
            temp = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temp;
        }
        return array;
    }

    //#endregion
}
