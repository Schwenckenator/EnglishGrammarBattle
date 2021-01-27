import Phaser from 'phaser'

const SKY_KEY = 'sky';
const EXP_KEY = 'exp';

const FONT_BIG = '48px Arial'
const FONT_MED = '24px Arial'

const SPACING = 60

export default class NextLevelScreen extends Phaser.Scene
{
	constructor()
	{
        super('Next-Level-Screen')

        this.titles = []
        this.menus = []
        this.keys = undefined
        this.selected = undefined
        this.selBox = undefined
        this.gameList = undefined
        this.lastGame = undefined
        this.score = undefined
        this.lives = undefined
    }

	preload()
    {
        console.log("Preload Game Over Screen")
        this.load.image(SKY_KEY, 'assets/night-sky.png')
    }

    init(data){
        this.lastGame = data.gameKey
        this.score = data.score
        this.lives = data.lives
        this.lastLevel = data.level
    }

    create()
    {
        console.log("Create Next Level Screen")

        this.createBackground()
        this.titles = this.createTitles()
        // this.menus = this.createMenuItems()
        this.keys = this.createKeyboardInput()

        // this.selected = 0
        // this.selBox = this.createBox()
        this.time.delayedCall(3000, () => {
            this.scene.start(this.lastGame, { level: this.lastLevel + 1, score: this.score, lives: this.lives })
        }, null, this)

        this.time.delayedCall(500, () => {
            this.titles[2].text += '.'
        }, null, this)

        this.time.delayedCall(1000, () => {
            this.titles[2].text += '.'
        }, null, this)
        this.time.delayedCall(1500, () => {
            this.titles[2].text += '.'
        }, null, this)
        this.time.delayedCall(2000, () => {
            this.titles[2].text += '.'
        }, null, this)

    }

    createBackground(){
        this.add.image(240, 160, SKY_KEY)
        this.add.image(240, 480, SKY_KEY)
    }

    createTitles(){
        let titles = [
            this.add.text(240, 140, `Level ${this.lastLevel} Complete!`, {font: FONT_BIG}).setOrigin(0.5),
            this.add.text(240, 180, `Score: ${this.score}`, {font: FONT_MED}).setOrigin(0.5),
            this.add.text(240, 220, `Next Level: ${this.lastLevel + 1}.`, {font: FONT_MED}).setOrigin(0.5),
        ]

        return titles
    }

    createKeyboardInput(){
        this.input.keyboard.removeAllKeys()
        
        let keys = {}
        keys.enter = this.input.keyboard.addKey('ENTER')
        keys.enter.on(
            'down', 
            () => {
                console.log("PS Enter Pressed")
                //this.select(this.selected)
            }
        )
        keys.esc = this.input.keyboard.addKey('ESC')
        keys.esc.on(
            'down', 
            () => {
                console.log("PS Escape Pressed")
                //this.select(0)// Return to game
            }
        )
        keys.up = this.input.keyboard.addKey('UP')
        keys.up.on(
            'down',
            () => {
                console.log("PS Up Pressed")
                // Same as down because there's only 2 options
                // this.selected += 1
                // this.selected %= 2
                // this.moveBox(this.selected)
            }
        )
        keys.down = this.input.keyboard.addKey('DOWN')
        keys.down.on(
            'down',
            () => {
                console.log("PS Down Pressed")
                // this.selected += 1
                // this.selected %= 2
                // this.moveBox(this.selected)
            }
        )
        
        return keys
    }

    createTouchInput(menus){
        for(let i=0; i<menus.length; i++){
            menus[i].setInteractive()
            menus[i].on(
                'pointerdown',
                () => {
                    console.log(`Answer ${i} touched!`)
                    //this.selectAnswer(i)
                    // this.select(i)
                }
            )
            menus[i].on(
                'pointerover',
                () => {
                    console.log(`Answer ${i} touched!`)
                    //this.selectAnswer(i)
                    // this.selected = i
                    // this.moveBox(i)
                }
            )
        }
    }

    // select(index){
    //     this.optionList[index].func()
    // }

    /**
     * @param {number} pos
     */
    moveBox(pos){
        this.selBox.setPosition(240, 220+SPACING*pos)
    }
}