import Phaser from 'phaser'
import GameTimer from '../classes/GameTimer'
import MusicManager from '../classes/MusicManager'
import SFXManager from '../classes/SFXManager'
import VolumeManager from '../classes/VolumeManager'

const SKY_KEY = 'sky'
const EXP_KEY = 'exp'
const MUSIC_KEY = 'music'

const FONT_BIG = '48px Arial'
const FONT_MED = '24px Arial'

const SPACING = 60

export default class GameSelectScreen extends Phaser.Scene
{
	constructor()
	{
        super('Game-Select')

        this.titles = []
        this.menus = []
        this.keys = undefined
        this.selected = undefined
        this.selBox = undefined
        this.gameList = undefined
    }

	preload()
    {
        console.log("Preload Game Select")
        this.load.image(SKY_KEY, 'assets/night-sky.png')
        
    }

    create()
    {
        console.log("Create Game Select")

        this.gameList = this.createGameList()
        this.optionList = this.createOptionList()

        this.createBackground()
        this.titles = this.createTitles()
        this.menus = this.createMenuItems()
        this.keys = this.createKeyboardInput()

        MusicManager.play()

        this.selected = 0
        this.selBox = this.createBox()

        VolumeManager.addSlider(this)
        GameTimer.startTimer(this)

        this.createTouchInput(this.menus)
    }
    createGameList(){
        let gameData = {level: 1, score: 0, lives: 3}
        let list = [
            { 
                name: 'Grammar Falls', 
                func: () => {
                    this.scene.start('Grammar-Falls', gameData)
                }
            },
            {
                name: 'Spelling Spin', 
                func: () => {
                    this.scene.start('Spelling-Spin', gameData)
                }
            },
            {
                name: 'Word Scramble', 
                func: () => {
                    this.scene.start('Word-Scramble', gameData)
                }
            },
        ]
        return list
    }

    createOptionList(){
        let list = this.createGameList()
        list.push({
            name: 'Return to Title', 
            func: () => {
                this.scene.start('Title-Screen')
            }
        })
        return list
    }

    createBackground(){
        this.add.image(240, 160, SKY_KEY)
        this.add.image(240, 480, SKY_KEY)
    }

    createTitles(){
        let titles = [
            this.add.text(240, 140, 'Choose Game', {font: FONT_MED}).setOrigin(0.5)
        ]

        return titles
    }
    createMenuItems(){
        let menus = []
        for(let i=0; i<this.gameList.length; i++){
            menus.push(this.add.text(240, 200 + SPACING * i, this.gameList[i].name, {font: FONT_BIG}).setOrigin(0.5))
        }
        menus.push(this.add.text(240, 200 + SPACING * this.gameList.length, 'Return to title', {font: FONT_MED}).setOrigin(0.5))
        return menus
    }

    createBox(){
        let box = this.add.rectangle(240, 200, 420, SPACING)
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
                //WTF is this?
                this.select(this.selected);
                //this.scene.start('Grammar-Falls')
            }
        )
        keys.esc = this.input.keyboard.addKey('ESC')
        keys.esc.on(
            'down', 
            () => {
                console.log("Escape PRessed")
                this.returnToTitle();
            }
        )
        keys.up = this.input.keyboard.addKey('UP')
        keys.up.on(
            'down',
            () => {
                this.selected += this.gameList.length // +1 - 1
                this.selected %= this.gameList.length + 1
                this.moveBox(this.selected)
            }
        )
        keys.down = this.input.keyboard.addKey('DOWN')
        keys.down.on(
            'down',
            () => {
                this.selected += 1
                this.selected %= this.gameList.length + 1
                this.moveBox(this.selected)
            }
        )
        
        return keys
    }

    select(index) {
        if(index === this.optionList.length - 1){ // Last option is return
            SFXManager.playReturn()
        }else{
            SFXManager.playSelect()
        }
        this.optionList[index].func()
    }

    returnToTitle() {
        SFXManager.playReturn()
        this.scene.stop('Game-Select')
        this.scene.start('Title-Screen')
    }

    createTouchInput(menus){
        for(let i=0; i<menus.length; i++){
            menus[i].setInteractive()
            menus[i].on(
                'pointerdown',
                () => {
                    console.log(`Answer ${i} selected!`)
                    this.select(i)
                }
            )
            menus[i].on(
                'pointerover',
                () => {
                    console.log(`Answer ${i} touched!`)
                    this.selected = i
                    this.moveBox(i)
                }
            )
        }
    }

    /**
     * @param {number} pos
     */
    moveBox(pos){
        SFXManager.playHover()
        this.selBox.setPosition(240, 200+SPACING*pos)
    }
}
