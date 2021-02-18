class VolumeManager {
    volume = 0.5

    setVolume(newVolume){
        this.volume = newVolume
    }
    

    /**
     * @param { Phaser.Scene } context
     */
    preloadSlider(context){
        
    }
    /**
     * @param { Phaser.Scene } context
     */
    addSlider(context){
        console.log("Adding slider!")
        let xMax = 480
        let x = xMax - 20
        let y = 60

        let line = context.add.rectangle(x, y, 6, 100)
        line.isFilled = true
        line.fillColor = 0xdddddd
        line.setOrigin(0.5)
        
        let circle = context.add.circle(x, y, 10)
        circle.isFilled = true
        circle.fillColor =0xeeeeee
        circle.setOrigin(0.5)

        return {line, circle}
    }
}

export default new VolumeManager();