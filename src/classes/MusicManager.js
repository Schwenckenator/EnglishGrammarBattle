import VolumeManager from "./VolumeManager"

class MusicManager {
    constructor() {
        this.music = undefined
        this.isReady = false
        //this.isPlaying = false
        this.playWhenReady = false
        this.hasStarted = false
    }

    hasMusic(){
        return this.music != undefined
    }

    play(){
        if(!this.isReady) {
            this.playWhenReady = true
            return 
        }

        if(!this.hasStarted){
            this.hasStarted = true
            this.music.play({volume: VolumeManager.volume})
        }else{
            this.music.resume()
        }
    }

    pause(){
        if(this.isReady){
            this.music.pause()
        }else{
            this.playWhenReady = false
        }
    }

    onMusicLoad(){
        this.isReady = true
        if(this.playWhenReady){
            this.play()
        }
    }

    isPlaying(){
        return this.isReady && this.music.isPlaying
    }
}
export default new MusicManager();