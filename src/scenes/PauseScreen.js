import Phaser from 'phaser'
import Game from '../main'
import MusicManager from '../classes/MusicManager';
import SFXManager from '../classes/SFXManager';
import VolumeManager from '../classes/VolumeManager';
import GameTimer from '../classes/GameTimer';

const SKY_KEY = 'sky';
const EXP_KEY = 'exp';

const FONT_BIG = '48px Arial'
const FONT_MED = '24px Arial'

const SPACING = 60

export default class PauseScreen extends Phaser.Scene
{
	constructor()
	{
        super('Pause-Screen')

        this.titles = []
        this.menus = []
        this.keys = undefined
        this.selected = undefined
        this.selBox = undefined
        this.gameList = undefined
        this.currentGame = undefined
    }

	preload()
    {
        console.log("Preload Pause Screen")
        this.load.image(SKY_KEY, 'assets/night-sky.png')
    }

    init(data){
        this.currentGame = data.gameKey
    }

    create()
    {
        console.log("Create Pause Screen")
        this.optionList = this.createOptionList()

        this.createBackground()
        this.titles = this.createTitles()
        this.menus = this.createMenuItems()
        this.keys = this.createInput()

        this.selected = 0
        this.selBox = this.createBox()

        VolumeManager.addSlider(this)

        this.createTouchInput(this.menus)
    }

    createOptionList(){
        let list = [
            {
                name: 'Return to Game', 
                func: () => {
                    MusicManager.play()
                    this.scene.stop('Pause-Screen')
                    this.scene.run(this.currentGame)
                }
            },
            {
                name: 'Exit Game', 
                func: () => {
                    this.scene.stop(this.currentGame)
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
            this.add.text(240, 140, 'PAUSED', {font: FONT_BIG}).setOrigin(0.5)
        ]

        return titles
    }
    createMenuItems(){
        let menus = []
        menus.push(this.add.text(240, 200, 'Return to Game', {font: FONT_MED}).setOrigin(0.5))
        menus.push(this.add.text(240, 200 + SPACING, 'Exit Game', {font: FONT_MED}).setOrigin(0.5))
        return menus
    }

    createBox(){
        let box = this.add.rectangle(240, 200, 420, SPACING - 20)
        box.isStroked = true
        box.strokeColor = 0xeeeeee
        box.lineWidth = 3
        box.setOrigin(0.5)
        return box
    }

    createInput(){
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
                this.select(0) // Return to game
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
            let w = 440
            let h = 60
            //let x = menus[i].x - w / 2
            //let y = menus[i].y - h / 2
            //let x2 = x + w
            //let y2 = y + h

            let rect = new Phaser.Geom.Rectangle(-w/3, -h/3, w, h)
            rect = Phaser.Geom.Rectangle.FromXY(-220, -30, 220, 30)
            
            //Phaser.Geom.Rectangle.FromXY(x, y, x2, y2)

            //console.log(`x: ${x}, y: ${y}, w: ${w}, h: ${h}`)
            //console.log(`x: ${x}, y: ${y}, x2: ${x2}, y2: ${y2}`)
            
            menus[i].setInteractive(rect, Phaser.Geom.Rectangle.Contains)
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
                (pointer) => {
                    console.log(`pointer x:${pointer.x}, y:${pointer.y}`)
                    //this.selectAnswer(i)
                    this.selected = i
                    this.moveBox(i)
                }
            )
        }
    }

    select(index){
        if(index === 1){
            SFXManager.playReturn()
        }else{
            SFXManager.playSelect()
        }
        this.optionList[index].func()
    }

    /**
     * @param {number} pos
     */
    moveBox(pos){
        SFXManager.playHover()
        this.selBox.setPosition(240, 200+SPACING*pos)
    }
}