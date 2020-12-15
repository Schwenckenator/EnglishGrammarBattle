import Phaser from 'phaser'

const SKY_KEY = 'sky';
const EXP_KEY = 'exp';

const FONT_BIG = '48px Arial'
const FONT_MED = '24px Arial'

const SPACING = 45

export default class GameOverScreen extends Phaser.Scene
{
	constructor()
	{
        super('Game-Over-Screen')

        this.titles = []
        this.menus = []
        this.keys = undefined
        this.selected = undefined
        this.selBox = undefined
        this.gameList = undefined
        this.lastGame = undefined
        this.score = undefined
        this.level = undefined
    }

	preload()
    {
        console.log("Preload Game Over Screen")
        this.load.image(SKY_KEY, 'assets/night-sky.png')
    }

    init(data){
        this.lastGame = data.gameKey
        this.score = data.score
        this.level = data.level
    }

    create()
    {
        console.log("Create Game Over Screen")
        this.optionList = this.createOptionList()

        this.createBackground()
        this.titles = this.createTitles()
        this.menus = this.createMenuItems()
        this.keys = this.createKeyboardInput()

        this.selected = 0
        this.selBox = this.createBox()

        this.createTouchInput(this.menus)
    }

    createOptionList(){
        let list = [
            {
                name: 'Play again', 
                func: () => {
                    this.scene.start(this.lastGame)
                }
            },
            {
                name: 'Exit Game', 
                func: () => {
                    this.scene.start('Title-Screen')
                }
            }
        ]
        return list
    }

    createBackground(){
        this.add.image(240, 160, SKY_KEY)
        this.add.image(240, 480, SKY_KEY)
    }

    createTitles(){
        let titles = [
            this.add.text(240, 140, 'GAME OVER', {font: FONT_BIG}).setOrigin(0.5),
            this.add.text(240, 180, `Level: ${this.level}`, {font: FONT_MED}).setOrigin(0.5),
            this.add.text(240, 220, `Score: ${this.score}`, {font: FONT_MED}).setOrigin(0.5)
        ]

        return titles
    }
    createMenuItems(){
        let menus = []
        menus.push(this.add.text(240, 275, 'Play again', {font: FONT_MED}).setOrigin(0.5))
        menus.push(this.add.text(240, 275 + SPACING, 'Exit Game', {font: FONT_MED}).setOrigin(0.5))
        return menus
    }

    createBox(){
        let box = this.add.rectangle(240, 275, 420, SPACING - 10)
        box.isStroked = true
        box.strokeColor = 0xeeeeee
        box.lineWidth = 3
        box.setOrigin(0.5)
        return box
    }

    createKeyboardInput(){
        this.input.keyboard.removeAllKeys()
        
        let keys = {}
        keys.enter = this.input.keyboard.addKey('ENTER')
        keys.enter.on(
            'down', 
            () => {
                console.log("PS Enter Pressed")
                this.select(this.selected)
            }
        )
        keys.esc = this.input.keyboard.addKey('ESC')
        keys.esc.on(
            'down', 
            () => {
                console.log("PS Escape Pressed")
                this.select(0)// Return to game
            }
        )
        keys.up = this.input.keyboard.addKey('UP')
        keys.up.on(
            'down',
            () => {
                console.log("PS Up Pressed")
                // Same as down because there's only 2 options
                this.selected += 1
                this.selected %= 2
                this.moveBox(this.selected)
            }
        )
        keys.down = this.input.keyboard.addKey('DOWN')
        keys.down.on(
            'down',
            () => {
                console.log("PS Down Pressed")
                this.selected += 1
                this.selected %= 2
                this.moveBox(this.selected)
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
                    this.select(i)
                }
            )
            menus[i].on(
                'pointerover',
                () => {
                    console.log(`Answer ${i} touched!`)
                    //this.selectAnswer(i)
                    this.selected = i
                    this.moveBox(i)
                }
            )
        }
    }

    select(index){
        this.optionList[index].func()
    }

    /**
     * @param {number} pos
     */
    moveBox(pos){
        this.selBox.setPosition(240, 275+SPACING*pos)
    }
}