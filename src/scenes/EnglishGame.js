import Phaser from 'phaser'
import MusicManager from '../MusicManager'

const SKY_KEY = 'sky'
const EXP_KEY = 'exp'
const UI_KEY = 'ui-cross'

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
    constructor(THIS_GAME){
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

        this.wrongSound = undefined
        this.explosionSound = undefined
        this.shootAnswerSound = undefined
    }

    preload()
    {
        console.log("Preload ENGLISH GAME SUPER CLASS")
        // this.load.json('sentences', 'assets/Sentences.json')
        this.load.image(SKY_KEY, 'assets/night-sky.png')
        this.load.image(UI_KEY, 'assets/BottomMenu.png')
        this.load.spritesheet(EXP_KEY, 'assets/explosion.png', {frameWidth: 64, frameHeight: 64})
        this.load.audio(EXPLOSION_SOUND_KEY, 'assets/explosion-large.wav')
        this.load.audio(SHOOT_ANSWER_KEY, 'assets/laser-shot-correct.mp3')
        this.load.audio(WRONG_SOUND_KEY, 'assets/laser-shot-incorrect.wav')
    }

    init(data){
        this.level = data.level
        this.score = data.score
        this.lives = 3
    }

    create(){
        console.log("Create ENGLISH GAME SUPER CLASS")

        this.createBackground()
        this.add.image(240, 590, UI_KEY)
        this.explosion = this.createExplosion()
        this.explosions = this.createExplosions(10)

        this.scoreText = this.createScoreText()
        this.lives = 3
        this.livesText = this.createLivesText()
        this.lostLife = false
    }

    update(){

    }

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
        return this.add.text(20, 15, `Score: ${this.score}`, {font: FONT_MED})
    }

    createLivesText(){
        return this.add.text(20, 45, this.getLivesString(this.lives), {font: FONT_MED})
    }

    createSounds(){
        this.explosionSound = this.sound.add(EXPLOSION_SOUND_KEY, {loop : false})
        this.shootAnswerSound = this.sound.add(SHOOT_ANSWER_KEY, {loop: false})
        this.wrongSound = this.sound.add(WRONG_SOUND_KEY, {loop: false})
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

    /**
     * @param {string} THIS_GAME
     */
    pause(THIS_GAME){
        MusicManager.pause()
        this.scene.pause(THIS_GAME)
        this.scene.launch('Pause-Screen', { gameKey: THIS_GAME })
    }


    
}