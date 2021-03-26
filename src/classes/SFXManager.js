import VolumeManager from "./VolumeManager"

const SFX_HOVER_KEY = 'sfxHover'
const SFX_SELECT_KEY = 'sfxSelect'
const SFX_RETURN_KEY = 'sfxReturn'
const SFX_BEEP = 'sfxBeep'
const SFX_TONE = 'sfxTone'
const SFX_ALERT = 'sfxAlert'

const HOVER_PATH = 'assets/SFX/Quick_Medium_Beep.mp3'
const SELECT_PATH = 'assets/SFX/Quick_High_Beep_2.mp3'
const RETURN_PATH = 'assets/SFX/Desending_Beeps_2.mp3';
const BEEP_PATH = 'assets/SFX/Quick_High_Beep.mp3';
const TONE_PATH = 'assets/SFX/Falling_Beep.mp3'
const ALERT_PATH = 'assets/SFX/Alert_Long.mp3'

class SFXManager {
    constructor() {
        this.UI_hover = undefined
        this.UI_select = undefined
        this.UI_return = undefined
        this.GAME_beep = undefined
        this.GAME_tone = undefined
    }

    //TODO change to context (this)
    // So I can load everything in here and just pass a phaser scene
    loadSFX(context){
        context.load.audio(SFX_HOVER_KEY, HOVER_PATH)
        context.load.audio(SFX_SELECT_KEY, SELECT_PATH)
        context.load.audio(SFX_RETURN_KEY, RETURN_PATH)
        context.load.audio(SFX_BEEP, BEEP_PATH)
        context.load.audio(SFX_TONE, TONE_PATH)
        context.load.audio(SFX_ALERT, ALERT_PATH)
    }

    createSFX(context){
        if(this.isLoaded()) return

        this.UI_hover = context.sound.add(SFX_HOVER_KEY)
        this.UI_select = context.sound.add(SFX_SELECT_KEY)
        this.UI_return = context.sound.add(SFX_RETURN_KEY)
        this.GAME_beep = context.sound.add(SFX_BEEP)
        this.GAME_tone = context.sound.add(SFX_TONE)
        this.GAME_alert = context.sound.add(SFX_ALERT, {loop: true})
    }

    isLoaded(){
        return this.UI_hover && this.UI_return && this.UI_select && this.GAME_beep
    }

    playHover(){
        this.UI_hover.play()
    }
    playSelect(){
        this.UI_select.play()
    }
    playReturn(){
        this.UI_return.play()
    }
    playBeep(){
        this.GAME_beep.play()
    }
    playTone(){
        this.GAME_tone.play()
    }
    playAlert(){
        this.GAME_alert.play()
    }
    stopAlert(){
        this.GAME_alert.stop()
    }
}

export default new SFXManager();