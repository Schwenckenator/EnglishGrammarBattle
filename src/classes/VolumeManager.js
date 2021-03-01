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
        let y = 65
        let h = 100

        let minY = y - h/2
        let maxY = y + h/2

        let circleY = maxY - 100 * this.volume

        let line = context.add.rectangle(x, y, 6, h)
        line.isFilled = true
        line.fillColor = 0xdddddd
        line.setOrigin(0.5)
        
        let circle = context.add.circle(x, circleY, 10)
        circle.isFilled = true
        circle.fillColor =0xeeeeee
        circle.setOrigin(0.5)
        circle.setInteractive()

        

        
        // @ts-ignore
        context.input.setDraggable(circle)
        circle.on('drag', (pointer, dragX, dragY) => {
            let newY = dragY
            if(dragY > maxY){
                newY = maxY
            }else if(dragY < minY){
                newY = minY
            }

            circle.y = newY
            let vol = (maxY - circle.y) / 100
            context.sound.volume = vol
            this.volume = vol
        })


        return {line, circle}
    }
}

export default new VolumeManager();