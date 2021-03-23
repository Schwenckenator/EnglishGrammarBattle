import SFXManager from "../classes/SFXManager"
import VolumeManager from "../classes/VolumeManager"

const SKY_KEY = 'sky'
const MUSIC_KEY = 'music'

const FONT_BIG = '48px Arial'
const FONT_MED = '24px Arial'

const DATA_KEY = 'DATA-desc'

const SPACING = 60
const Y_TOP = 480

export default class GameDescriptionScene extends Phaser.Scene
{
    constructor()
	{
        super('Game-Description-Scene')

        this.titles = []
        this.menus = []
        this.keys = undefined
        this.selected = undefined
        this.selBox = undefined
        this.gameList = undefined
        this.selectedGame = undefined
        this.score = undefined
        this.level = undefined
    }

    preload(){
        console.log("Preload Game Description")
        this.load.image(SKY_KEY, 'assets/night-sky.png')
        this.load.json(DATA_KEY, 'assets/GameDescriptions.json')
    }

    init(data){
        this.selectedGame = data.selectedGame
    }

    create(){
        console.log("Create Game Select")

        this.gameData = this.cache.json.get(DATA_KEY)

        this.optionList = this.createOptionList()

        this.createBackground()
        this.titles = this.createTitles()
        this.menus = this.createMenuItems()
        this.keys = this.createKeyboardInput()

        this.selected = 0
        this.selBox = this.createBox()

        VolumeManager.addSlider(this)

        this.createTouchInput(this.menus)
    }

    createOptionList(){
        let list = [
            {
                name: 'Start Game', 
                font: FONT_BIG,
                func: () => {
                    this.scene.start(this.selectedGame, {level: 1, score: 0, lives: 3})
                }
            },
            {
                name: 'Return to Game select', 
                font: FONT_MED,
                func: () => {
                    this.scene.start('Game-Select')
                }
            }
        ]
        return list
    }

    createBox(){
        let box = this.add.rectangle(240, Y_TOP, 420, SPACING)
        box.isStroked = true
        box.strokeColor = 0xeeeeee
        box.lineWidth = 3
        box.setOrigin(0.5)
        return box
    }

    createMenuItems(){
        let menus = []
        for(let i=0; i<this.optionList.length; i++){
            menus.push(this.add.text(240, Y_TOP + SPACING * i, this.optionList[i].name, {font: this.optionList[i].font}).setOrigin(0.5))
        }
        return menus
    }

    createBackground(){
        this.add.image(240, 160, SKY_KEY)
        this.add.image(240, 480, SKY_KEY)
    }

    createTitles(){
        let titles = [
            this.add.text(240, 60, this.gameData[this.selectedGame].title, {font: FONT_BIG}).setOrigin(0.5, 0),
            this.add.text(240, 120, this.gameData[this.selectedGame].desc, {font: FONT_MED, backgroundColor: "#000936"}).setOrigin(0.5, 0)
        ]

        return titles
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
        this.selBox.setPosition(240, Y_TOP+SPACING*pos)
    }
}