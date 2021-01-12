class MusicManager {
    constructor() {
        this.music = undefined
        this.isReady = false
        //this.isPlaying = false
        this.playWhenReady = false
    }

    hasMusic(){
        return this.music != undefined
    }

    play(){
        if(!this.isReady) { return }
        
        if(!this.isPlaying()){
            this.music.play()
        }else{
            this.music.resume()
        }
    }

    pause(){
        if(this.isReady){
            this.music.pause()
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