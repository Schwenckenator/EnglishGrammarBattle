import Phaser from 'phaser'
import MusicManager from '../MusicManager'

const SKY_KEY = 'sky';
const EXP_KEY = 'exp';
const MUSIC_KEY = 'music'

const FONT_BIG = '48px Arial'
const FONT_MED = '24px Arial'


export default class MainTitleScreen extends Phaser.Scene
{
	constructor()
	{
        super('Title-Screen')

        this.titles = []
        this.keys = undefined
        
    }

	preload()
    {
        console.log("Preload Main Title")
        this.load.image(SKY_KEY, 'assets/night-sky.png')
    }

    create()
    {
        console.log("Create Main Title")
        this.createBackground()
        this.titles = this.createTitleScreen()
        
        this.keys = this.createInput()
        this.loadMusic()
    }




    createBackground(){
        this.add.image(240, 160, SKY_KEY)
        this.add.image(240, 480, SKY_KEY)
    }

    createTitleScreen(){
        let titles = []
        titles.push(this.add.text(240, 160, 'ENGLISH BATTLE', {font: FONT_BIG}).setOrigin(0.5))
        titles.push(this.add.text(240, 220, 'ARENA', {font: FONT_BIG}).setOrigin(0.5))
        titles.push(this.add.text(240, 280, 'Press Enter to Start', {font: FONT_MED}).setOrigin(0.5))

        return titles
    }

    createInput(){
        this.input.keyboard.removeAllKeys()
        let enter = this.input.keyboard.addKey('ENTER')
        enter.on(
            'down', 
            () => {
                this.select()
            }
        )

        this.input.on(
            'pointerdown',
            () => {
                this.select()
            }
        )
    }

    select(){
        this.scene.start('Game-Select')
    }

    loadMusic(){
        
        if(MusicManager.hasMusic()) return

        let musicLoader = this.load.audio(MUSIC_KEY, 'assets/edm-detection-mode-by-kevin-macleod-from-filmmusic-io.mp3')
        console.log("Loading music...")
        musicLoader.on('filecomplete', 
        () => {
            MusicManager.music = this.sound.add(MUSIC_KEY, {loop: true})
            console.log("Music Loaded!")
            MusicManager.onMusicLoad()
        })
        musicLoader.start()
    }
}
