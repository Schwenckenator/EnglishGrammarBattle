var canvas = {};

canvas.gameCanvas = document.getElementById("gameCanvas");
ctx = gameCanvas.getContext("2d");
canvas.explosionSheet = document.getElementById("explosion");
canvas.nightSky = document.getElementById("nightSky");
canvas.explSpriteSize = 64;
canvas.expColNum = 4;
canvas.textColour = "#EEEEEE";
canvas.uiColour = "#EEEEEE";
canvas.textFlashColour = "#FF0000";
canvas.backgroundColour = "#000936";
canvas.heart = "\u200D\u2764\uFE0F\u200D";
canvas.livesStr = "";
canvas.width = gameCanvas.width;
canvas.height = gameCanvas.height;

canvas.Draw = function(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(nightSky, 0, 0);
    ctx.drawImage(nightSky, 0, 320);

    if(isStart){
        canvas.DrawStartMenu();
        return;
    }

    if(isPaused){
        canvas.DrawPaused();
        return;
    }

    if(isGameOver){
        canvas.DrawGameOver();
        if(explosion.isExplosion){
            canvas.drawExplosion();
        }
        return;
    }

    canvas.drawSentence();
    canvas.drawUI();
    canvas.drawAnswers();
    if(explosion.isExplosion){
        canvas.drawExplosion();
    }
}

canvas.drawText = function(ctx, txt, font, colour, xPos, yPos){
    ctx.font = font;
    ctx.fillStyle = colour;
    let x = centreX(txt, xPos);
    ctx.fillText(txt, x, yPos);
}

canvas.DrawPaused = function (){

    ctx.font = "48px Arial";
    ctx.fillStyle = canvas.textColour;
    let txt = "PAUSED";
    x = centreX(txt, canvas.width/2);
    ctx.fillText(txt,x,canvas.height/2 - 40);

    ctx.font = "24px Arial"
    txt = "Press Escape to continue.";
    x = centreX(txt, canvas.width/2);
    ctx.fillText(txt,x,canvas.height/2);
}

canvas.DrawGameOver = function(){
    
    ctx.font = "48px Arial";
    ctx.fillStyle = canvas.textColour;
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

canvas.DrawStartMenu = function(){
    
    let txt;

    ctx.font = "48px Arial";
    ctx.fillStyle = canvas.uiColour;
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

canvas.drawUI = function(){
    ctx.beginPath();

    ctx.fillStyle = canvas.backgroundColour;
    ctx.rect(0, canvas.height - 60, canvas.width, 60);
    ctx.fill();

    ctx.strokeStyle = canvas.uiColour;
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

canvas.drawSentence = function(){
    ctx.font = "24px Arial";
    ctx.fillStyle = textColour;
    sentence.x = centreX(sentence.text, canvas.width/2);
    ctx.fillText(sentence.text, sentence.x+sentence.xOffset, sentence.y);
}

canvas.drawAnswers = function(){
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

canvas.drawExplosion = function(){
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

centreX = function(text, x){
    return x - (ctx.measureText(text).width/2);
}

canvas.getLivesString = function(livesLeft){
    let str = "";
    for(let i=0; i < livesLeft; i++){
        str += heart;
    }
    return str;
}