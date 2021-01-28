class SFXManager {
    constructor() {
        this.UI_hover = undefined
        this.UI_select = undefined
        this.UI_return = undefined

        this.UI_hoverPath = 'assets/SFX/Quick Medium Beep.mp3'
        this.UI_selectPath = 'assets/SFX/Quick High Beep 2.mp3'
        this.UI_returnPath = 'assets/SFX/Desending Beeps 2.mp3'
    }

    init(hoverSFX, selectSFX, returnSFX){
        this.UI_hover = hoverSFX
        this.UI_select = selectSFX
        this.UI_return = returnSFX
    }

    isLoaded(){
        return this.UI_hover && this.UI_return && this.UI_select
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
}

export default new SFXManager();