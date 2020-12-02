import Phaser from 'phaser'

const SKY_KEY = 'sky';
const EXP_KEY = 'exp';

export default class GrammarFallsScene extends Phaser.Scene
{
	constructor()
	{
        super('Grammar-Falls')
        
        this.explosion = undefined
    }
    
    initialize(){
        console.log("Initialise Grammar Falls")
        Phaser.Scene.call(this, {'key': 'GrammarFalls'})
    }

	preload()
    {
        console.log("Preload Grammar Falls")
        this.load.image(SKY_KEY, 'assets/night-sky.png')
        this.load.spritesheet(EXP_KEY, 'assets/explosion.png', {frameWidth: 64, frameHeight: 64})
    }

    create()
    {
        console.log("Create Grammar Falls")
        this.createBackground()
        this.createExplosion()
        this.createQuizSentence()
    }

    update(){

    }

    createBackground(){
        this.add.image(240, 160, SKY_KEY)
        this.add.image(240, 480, SKY_KEY)
    }

    createExplosion(){
        this.explosion = this.add.sprite(240, 320, EXP_KEY)

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers(EXP_KEY, { start: 0, end: 15}),
            frameRate: 36
        })
    }

    createQuizSentence(){
        let text = this.add.text(240, 240, 'BOO!', {font: '48px Arial'}).setOrigin(0.5)
    }
}
