import Phaser from 'phaser'
import MusicManager from '../classes/MusicManager'
import SFXManager from '../classes/SFXManager'

const SKY_KEY = 'sky'
const EXP_KEY = 'exp'
const UI_KEY = 'ui-cross'
const UI_SCORE_LIVES = 'ui-score-lives'

const WRONG_SOUND_KEY = 'wrongSound'
const SHOOT_ANSWER_KEY = 'shootAnswer'
const EXPLOSION_SOUND_KEY = 'explosionSound'

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

const NEXT_LEVEL_TARGET = 10

export default class EnglishGame extends Phaser.Scene{
    constructor(THIS_GAME, BOTTOM_Y){
        super(THIS_GAME)
        this.thisGame = THIS_GAME
        this.bottomY = BOTTOM_Y
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

        this.wrongSound = undefined
        this.explosionSound = undefined
        this.shootAnswerSound = undefined

        this.sway = {
            tick: 0,
            sinOffset: 0,
            freq: 0
        }
    }

    preload()
    {
        console.log("Preload ENGLISH GAME SUPER CLASS")
        this.load.image(SKY_KEY, 'assets/night-sky.png')
        this.load.image(UI_SCORE_LIVES, 'assets/UI-ScoreLives.png')
        this.load.spritesheet(EXP_KEY, 'assets/explosion.png', {frameWidth: 64, frameHeight: 64})
        this.load.audio(EXPLOSION_SOUND_KEY, 'assets/explosion-large.wav')
        this.load.audio(SHOOT_ANSWER_KEY, 'assets/laser-shot-correct.mp3')
        this.load.audio(WRONG_SOUND_KEY, 'assets/laser-shot-incorrect.wav')
    }

    init(data){
        this.level = data.level
        this.score = data.score
        this.lives = data.lives
    }

    create(){
        console.log("Create ENGLISH GAME SUPER CLASS")

        this.createBackground()
        // this.add.image(240, 590, UI_KEY)
        this.explosion = this.createExplosion()
        this.explosions = this.createExplosions(10)

        this.scoreText = this.createScoreText()
        this.livesText = this.createLivesText()
        this.lostLife = false
        this.createSounds()

    }

    update(){
        if(this.isAnswerSelected){
            this.doAnswer()
        }else{
            this.doGame()
        }
        if(this.quiz.sentence.y > this.bottomY && !this.lostLife){
            this.loseLife()
        }
    }
    //#region Create
    createBackground(){
        this.add.image(X_CENTRE, 160, SKY_KEY)
        this.add.image(X_CENTRE, 480, SKY_KEY)
        this.add.image(120, 50, UI_SCORE_LIVES)
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

    createExplosions(num){
        let exps = []
        for(let i=0; i<num;i++){
            exps.push(this.add.sprite(X_CENTRE,Y_CENTRE, EXP_KEY))
            exps[i].setScale(2)
            exps[i].setVisible(false)
        }
        
        return exps
    }

    createScoreText(){
        return this.add.text(20, 15, `Score: ${this.score}`, {font: FONT_MED, color: '#000'})
    }

    createLivesText(){
        return this.add.text(20, 45, this.getLivesString(this.lives), {font: FONT_MED, color: '#000'})
    }

    createSounds(){
        this.explosionSound = this.sound.add(EXPLOSION_SOUND_KEY, {loop : false})
        this.shootAnswerSound = this.sound.add(SHOOT_ANSWER_KEY, {loop: false})
        this.wrongSound = this.sound.add(WRONG_SOUND_KEY, {loop: false})
    }


    createKeyboardInput(){
        throw new Error('Abstract Method not implemented.')
    }

    createTouchInput(quizObj){
        throw new Error('Abstract Method not implemented.')
    }

    //#endregion

    doAnswer(){
        throw new Error('Abstract Method not implemented.')
    }

    doGame(){
        throw new Error('Abstract Method not implemented.')
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
        let shuffledArray = [...array]
        let currentIndex = shuffledArray.length, temp, randomIndex;
        while (0 !== currentIndex){
            randomIndex = this.randIndex(currentIndex);
            currentIndex -= 1;
    
            temp = shuffledArray[currentIndex];
            shuffledArray[currentIndex] = shuffledArray[randomIndex];
            shuffledArray[randomIndex] = temp;
        }
        return shuffledArray;
    }

    pause(){
        SFXManager.playReturn()
        SFXManager.stopAlert()
        MusicManager.pause()
        this.scene.pause(this.thisGame)
        this.scene.launch('Pause-Screen', { gameKey: this.thisGame })
    }

    /**
     * @param {number} duration
     * @param { Phaser.Math.Vector2} intensity
     */
    shakeCamera(duration, intensity){
        console.log("Shaking camera!")
        let goal = intensity.clone()
        goal.multiply(new Phaser.Math.Vector2(0.0, 0.0))
        
        let prototype = intensity.clone()

        this.cameras.main.shake(duration, intensity, true, 
            /**
            * @param {Phaser.Cameras.Scene2D.Camera} cam
            * @param { number } time
            */
            (cam, time)=>{
                let progress = time
                intensity = prototype.clone()

                cam.shakeEffect.intensity = intensity.lerp(goal, progress)
            })
    }

        /**
     * @param {number} x
     * @param {number} y
     * @param {number} scale
     */
    explode(x, y, scale){
        this.explosion.setPosition(x,y)
        this.explosion.setScale(scale)
        this.explosion.setVisible(true)
        this.explosion.anims.play('explode')
        this.explosionSound.play()
    }

    moveQuiz(quizObj){
        let amp = 50
        let x = X_CENTRE + amp*(Math.sin(this.sway.freq * this.sway.tick + this.sway.sinOffset))
        let y = quizObj.y
        quizObj.setPosition(x, y)
        this.sway.tick++
    }

    explodeGameOver(){
        console.log("Explode Game over Called!")
        for(let i = 0; i<this.explosions.length; i++){
            console.log("Explosion" + i)
            let x = Math.random() * X_MAX / 2 + X_MAX / 4
            let y = Math.random() * Y_MAX / 2 + Y_MAX / 3
            let scale = 2 + Math.random() * 4
            setTimeout(() => {
                this.explosions[i].setPosition(x,y)
                this.explosions[i].setScale(scale)
                this.explosions[i].setVisible(true)
                this.explosions[i].anims.play('explode')
                this.explosionSound.play()
                this.shakeCamera(500, new Phaser.Math.Vector2 (0.1, 0.1))
            }, i * 200)
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
                    this.scene.start('Next-Level-Screen', { gameKey: this.thisGame, score: this.score, level: this.level })
                }, null, this)
        }else{
            this.next()
        }
    }

    wrongAnswer(quiz, ans){
        let amp = 30
        // @ts-ignore
        quiz.body.setVelocity(Math.random()* amp - amp/2, -Math.random()* amp)
        // @ts-ignore
        quiz.body.setAllowGravity(true)
        // @ts-ignore
        ans.body.setVelocity(Math.random() * amp - amp/2, -Math.random()* amp)
        // @ts-ignore
        ans.body.setAllowGravity(true)

        this.wrongSound.play()

        this.shakeCamera(150, new Phaser.Math.Vector2 (0.01, 0.01))
    }

    loseLife(){
        this.explode(this.quiz.sentence.x, this.quiz.sentence.y, 4)
        this.shakeCamera(500, new Phaser.Math.Vector2(0.1, 0.1))
        this.lives--
        this.lostLife = true
        this.livesText.text = this.getLivesString(this.lives)

        if(this.lives === 0){
            SFXManager.playAlert()
        }else {
            SFXManager.stopAlert()
        }
        
        this.endQuestion()

        if(this.checkForGameOver()){
            this.explodeGameOver()
            
            this.time.delayedCall(2500, () => {
                SFXManager.stopAlert()
                this.scene.start('Game-Over-Screen', { gameKey: this.thisGame, level: this.level, score: this.score })
            }, null, this)
        }else{
            this.next()
        }

    }

    newQuiz(){
        throw new Error('Abstract Method not implemented.')
    }

    endQuestion() {
        throw new Error('Abstract Method not implemented.')
    }

    next() {
        this.time.delayedCall(250, this.newQuiz, null, this)
    }
    
    resetSway(){
        this.sway.sinOffset = Math.random() * 2 * Math.PI
        this.sway.freq = FREQ + this.level * SCORE_FREQ
    }

    checkForNextLevel(){
        return this.score % NEXT_LEVEL_TARGET == 0 // Hit a multiple level target
    }

    checkForGameOver(){
        console.log("Checking for game over")
        return this.lives < 0
    }

    isClose(obj1, obj2){
        let x = obj1.x - obj2.x
        let y = obj1.y - obj2.y
        let sqrDist = x * x + y * y
        return sqrDist < 0.1
    }
    
}