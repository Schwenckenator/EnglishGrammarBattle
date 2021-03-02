import { Time } from "phaser"

class GameTimer {
    constructor(){
        this.seconds = undefined
        this.timer = undefined
        this.clockText = undefined
    }

    /**
     * @param {Phaser.Scene} context
     */
    startTimer(context){
        this.timer = context.time.addEvent({
            delay:1000,
            callback:this.updateTimer,
            callbackScope: this,
            loop: true
            })
        if(this.seconds === undefined){
            this.seconds = 0
        }
        let rect = context.add.rectangle(375, 20, 70, 26)
        rect.isFilled = true
        rect.fillColor = 0x000033
        rect.setOrigin(0)
        let clockStr = this.getMinutesSecondsString(this.seconds)
        this.clockText = context.add.text(380, 20, clockStr, {font: "24px Arial"})
    }

    updateTimer(){
        this.seconds++
        this.clockText.text = this.getMinutesSecondsString(this.seconds)
        // console.log("Update timer!")
    }

    getMinutesSecondsString(seconds){
        let minutes = Math.floor(seconds / 60)
        
        let minutesStr
        if(minutes < 10){
            minutesStr = "0" + minutes.toString()
        }else{
            minutesStr = minutes.toString()
        }
        let remainingSeconds = seconds % 60
        let secondsStr
        if(remainingSeconds < 10){
            secondsStr = "0" + remainingSeconds.toString()
        }else{
            secondsStr = remainingSeconds.toString()
        }
        
        return `${minutesStr}:${secondsStr}`
    }
}
export default new GameTimer();