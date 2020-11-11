window.game = window.game || { };


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const explosionSheet = document.getElementById("explosion");
const nightSky = document.getElementById("nightSky");
const explSpriteSize = 64;
const expColNum = 4;
const textColour = "#EEEEEE";
const uiColour = "#EEEEEE";
const textFlashColour = "#FF0000";
const backgroundColour = "#000936";
const heart = "\u200D\u2764\uFE0F\u200D";

canvas.Draw = function(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(nightSky, 0, 0);
    ctx.drawImage(nightSky, 0, 320);

    if(isStart){
        DrawStartMenu();
        return;
    }

    if(isPaused){
        DrawPaused();
        return;
    }

    if(isGameOver){
        DrawGameOver();
        if(explosion.isExplosion){
            drawExplosion();
        }
        return;
    }

    drawSentence();
    drawUI();
    drawAnswers();
    if(explosion.isExplosion){
        drawExplosion();
    }
}

function DrawPaused(){

    ctx.font = "48px Arial";
    ctx.fillStyle = textColour;
    let txt = "PAUSED";
    x = centreX(txt, canvas.width/2);
    ctx.fillText(txt,x,canvas.height/2 - 40);

    ctx.font = "24px Arial"
    txt = "Press Escape to continue.";
    x = centreX(txt, canvas.width/2);
    ctx.fillText(txt,x,canvas.height/2);
}

function DrawGameOver(){
    
    ctx.font = "48px Arial";
    ctx.fillStyle = textColour;
    let txt = "GAME OVER";
    x = centreX(txt, canvas.width/2);
    ctx.fillText(txt,x,canvas.height/2 - 40);
    ctx.font = "24px Arial"
    txt = "Final Score: "+score;
    x = centreX(txt, canvas.width/2);
    ctx.fillText(txt,x,canvas.height/2);
    ctx.font = "24px Arial"
    txt = "Press Enter to restart.";
    x = centreX(txt, canvas.width/2);
    ctx.fillText(txt,x,canvas.height/2 + 40);
}

function DrawStartMenu(){
    let txt;

    ctx.font = "48px Arial";
    ctx.fillStyle = uiColour;
    txt = "ENGLISH";
    x = centreX(txt, canvas.width/2);
    ctx.fillText(txt,x,canvas.height/2 - 40);

    txt = "GRAMMAR BATTLE";
    x = centreX(txt, canvas.width/2);
    ctx.fillText(txt,x,canvas.height/2 + 5);

    ctx.font = "24px Arial"
    txt = "Press Enter to start.";
    x = centreX(txt, canvas.width/2);
    ctx.fillText(txt,x,canvas.height/2 + 40);
}

function drawUI(){
    ctx.beginPath();

    ctx.fillStyle = backgroundColour;
    ctx.rect(0, canvas.height - 60, canvas.width, 60);
    ctx.fill();

    ctx.strokeStyle = uiColour;
    ctx.lineWidth = "3";
    
    let x1 = 0;
    let x2 = canvas.width;
    let y = canvas.height - 60;
    
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);

    let x= canvas.width/2;
    let y1 = y;
    let y2 = canvas.height;

    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
    ctx.closePath();

    ctx.font = "24px Arial";
    ctx.fillStyle = uiColour;
    ctx.fillText("Score: "+score, 8, 25);
    ctx.fillText("Lives: "+livesStr, 8, 55);
    
}

function drawSentence(){
    ctx.font = "24px Arial";
    ctx.fillStyle = textColour;
    sentence.x = centreX(sentence.text, canvas.width/2);
    ctx.fillText(sentence.text, sentence.x+sentence.xOffset, sentence.y);
}

function drawAnswers(){
    if(isGameOver) return;

    ctx.font = "24px Arial";
    ctx.fillStyle = textColour;
    let x = centreX(answerLeft.text, answerLeft.x);
    ctx.fillText(answerLeft.text, x, answerLeft.y);
    
    ctx.font = "24px Arial";
    ctx.fillStyle = textColour;
    x = centreX(answerRight.text, answerRight.x);
    ctx.fillText(answerRight.text, x, answerRight.y);

}

function drawExplosion(){
    let coords = explosion.GetFrameCrop(explosion.frameNumber);
    
    ctx.drawImage(
        explosionSheet, 
        coords.x, 
        coords.y, 
        explSpriteSize, 
        explSpriteSize, 
        explosion.pos.x, 
        explosion.pos.y, 
        explSpriteSize * explosion.scale.x, 
        explSpriteSize * explosion.scale.x
    );
    
    explosion.frameNumber += 0.5; //Play at half speed
    if(explosion.frameNumber >= explosion.totalFrames){
        explosion.isExplosion = false;
    }
}

function centreX(text, x){
    return x - (ctx.measureText(text).width/2);
}

function getLivesString(livesLeft){
    let str = "";
    for(let i=0; i < lives; i++){
        str += heart;
    }
    return str;
}