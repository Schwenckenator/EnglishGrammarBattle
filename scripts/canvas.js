const canvas = {
    gameCanvas: document.getElementById("gameCanvas"),
    
    nightSky: document.getElementById("nightSky"),

    textColour: "#EEEEEE",
    uiColour: "#EEEEEE",
    textFlashColour: "#FF0000",
    backgroundColour: "#000936",
    heart: "\u200D\u2764\uFE0F\u200D",
    livesStr: "",
    sizeMed: "24px Arial",
    sizeBig: "48px Arial",

    init: () =>{
        canvas.ctx = gameCanvas.getContext("2d");
        canvas.width = canvas.gameCanvas.width;
        canvas.height = canvas.gameCanvas.height;
    },
    
    render: () =>{
        canvas.ctx.clearRect(0,0, canvas.width, canvas.height);
        canvas.ctx.drawImage(canvas.nightSky, 0, 0);
        canvas.ctx.drawImage(canvas.nightSky, 0, 320);

        if(isStart){
            canvas.drawStartMenu();
            return;
        }

        if(isPaused){
            canvas.drawPaused();
            return;
        }

        if(isGameOver){
            canvas.drawGameOver();
            if(explosion.isExplosion){
                canvas.drawExplosion(explosion);
            }
            return;
        }

        canvas.drawSentence();
        canvas.drawUI();
        canvas.drawAnswers();
        if(explosion.isExplosion){
            canvas.drawExplosion(explosion);
        }
    },
    drawText: (txt, font, colour, xPos, yPos) => {
        canvas.ctx.font = font;
        canvas.ctx.fillStyle = colour;
        let x = canvas.centreX(txt, xPos);
        canvas.ctx.fillText(txt, x, yPos);
    },
    drawStartMenu: () =>{
        canvas.drawText("ENGLISH", canvas.sizeBig, canvas.textColour, canvas.width/2, canvas.height/2 - 40);
        canvas.drawText("GRAMMAR BATTLE", canvas.sizeBig, canvas.textColour, canvas.width/2, canvas.height/2 + 5);
        canvas.drawText("Press Enter to start", canvas.sizeMed, canvas.textColour, canvas.width/2, canvas.height/2 + 40);
    },
    drawUI: () => {
        canvas.ctx.beginPath();

        canvas.ctx.fillStyle = canvas.backgroundColour;
        canvas.ctx.rect(0, canvas.height - 60, canvas.width, 60);
        canvas.ctx.fill();

        canvas.ctx.strokeStyle = canvas.uiColour;
        canvas.ctx.lineWidth = "3";
        
        let x1 = 0;
        let x2 = canvas.width;
        let y = canvas.height - 60;
        
        canvas.ctx.moveTo(x1, y);
        canvas.ctx.lineTo(x2, y);

        let x= canvas.width/2;
        let y1 = y;
        let y2 = canvas.height;

        canvas.ctx.moveTo(x, y1);
        canvas.ctx.lineTo(x, y2);
        canvas.ctx.stroke();
        canvas.ctx.closePath();

        canvas.ctx.font = canvas.sizeMed;
        canvas.ctx.fillStyle = canvas.uiColour;
        canvas.ctx.fillText("Score: "+score, 8, 25);
        canvas.ctx.fillText("Lives: "+canvas.livesStr, 8, 55);
    },
    drawPaused: () => {
        canvas.drawText("PAUSED", canvas.sizeBig, canvas.textColour, canvas.width/2, canvas.height/2 - 40);
        canvas.drawText("Press Escape to continue", canvas.sizeMed, canvas.textColour, canvas.width/2, canvas.height/2);
    },
    drawGameOver: () =>{
        canvas.drawText("GAME OVER", canvas.sizeBig, canvas.textColour, canvas.width/2, canvas.height/2 - 40);
        canvas.drawText("Final score: "+score, canvas.sizeMed, canvas.textColour, canvas.width/2, canvas.height/2);
        canvas.drawText("Press Enter to restart.", canvas.sizeMed, canvas.textColour, canvas.width/2, canvas.height/2 + 40);
    },
    drawSentence: () => {
        canvas.ctx.font = canvas.sizeMed;
        canvas.ctx.fillStyle = canvas.textColour;
        sentence.x = canvas.centreX(sentence.text, canvas.width/2);
        canvas.ctx.fillText(sentence.text, sentence.x+sentence.xOffset, sentence.y);
    },
    drawAnswers: () => {
        if(isGameOver) return;

        canvas.ctx.font = canvas.sizeMed;
        canvas.ctx.fillStyle = canvas.textColour;
        let x = canvas.centreX(answerLeft.text, answerLeft.x);
        canvas.ctx.fillText(answerLeft.text, x, answerLeft.y);
        
        canvas.ctx.font = canvas.sizeMed;
        canvas.ctx.fillStyle = canvas.textColour;
        x = canvas.centreX(answerRight.text, answerRight.x);
        canvas.ctx.fillText(answerRight.text, x, answerRight.y);
    },
    
    drawExplosion: (exp) => {
        let coords = exp.GetFrameCrop(exp.frameNumber);
    
        canvas.ctx.drawImage(
            exp.explosionSheet, 
            coords.x, 
            coords.y, 
            exp.explSpriteSize, 
            exp.explSpriteSize, 
            exp.pos.x, 
            exp.pos.y, 
            exp.explSpriteSize * exp.scale.x, 
            exp.explSpriteSize * exp.scale.x
        );
        
        exp.frameNumber += 0.5; //Play at half speed
        if(exp.frameNumber >= exp.totalFrames){
            exp.isExplosion = false;
        }
    },
    
    centreX: (text, x) => x - (canvas.ctx.measureText(text).width/2),

    setLivesString: (livesLeft) => {
        canvas.livesStr = canvas.getLivesString(livesLeft);
    },

    getLivesString: livesLeft => {
        let str = "";
        for(let i=0; i < livesLeft; i++){
            str += canvas.heart;
        }
        return str;
    }
};

// canvas.gameCanvas = document.getElementById("gameCanvas");
// ctx = gameCanvas.getContext("2d");
// canvas.explosionSheet = document.getElementById("explosion");
// canvas.nightSky = document.getElementById("nightSky");
// canvas.explSpriteSize = 64;
// canvas.expColNum = 4;
// canvas.textColour = "#EEEEEE";
// canvas.uiColour = "#EEEEEE";
// canvas.textFlashColour = "#FF0000";
// canvas.backgroundColour = "#000936";
// canvas.heart = "\u200D\u2764\uFE0F\u200D";
// canvas.livesStr = "";
// canvas.width = gameCanvas.width;
// canvas.height = gameCanvas.height;

// canvas.Draw = function(){
//     ctx.clearRect(0,0, canvas.width, canvas.height);
//     ctx.drawImage(nightSky, 0, 0);
//     ctx.drawImage(nightSky, 0, 320);

//     if(isStart){
//         canvas.DrawStartMenu();
//         return;
//     }

//     if(isPaused){
//         canvas.DrawPaused();
//         return;
//     }

//     if(isGameOver){
//         canvas.DrawGameOver();
//         if(explosion.isExplosion){
//             canvas.drawExplosion();
//         }
//         return;
//     }

//     canvas.drawSentence();
//     canvas.drawUI();
//     canvas.drawAnswers();
//     if(explosion.isExplosion){
//         canvas.drawExplosion();
//     }
// }

// canvas.drawText = function(ctx, txt, font, colour, xPos, yPos){
//     ctx.font = font;
//     ctx.fillStyle = colour;
//     let x = centreX(txt, xPos);
//     ctx.fillText(txt, x, yPos);
// }

// canvas.DrawPaused = function (){

//     ctx.font = "48px Arial";
//     ctx.fillStyle = canvas.textColour;
//     let txt = "PAUSED";
//     x = centreX(txt, canvas.width/2);
//     ctx.fillText(txt,x,canvas.height/2 - 40);

//     ctx.font = "24px Arial"
//     txt = "Press Escape to continue.";
//     x = centreX(txt, canvas.width/2);
//     ctx.fillText(txt,x,canvas.height/2);
// }

// canvas.DrawGameOver = function(){
    
//     ctx.font = "48px Arial";
//     ctx.fillStyle = canvas.textColour;
//     let txt = "GAME OVER";
//     x = centreX(txt, canvas.width/2);
//     ctx.fillText(txt,x,canvas.height/2 - 40);
//     ctx.font = "24px Arial"
//     txt = "Final Score: "+score;
//     x = centreX(txt, canvas.width/2);
//     ctx.fillText(txt,x,canvas.height/2);
//     ctx.font = "24px Arial"
//     txt = "Press Enter to restart.";
//     x = centreX(txt, canvas.width/2);
//     ctx.fillText(txt,x,canvas.height/2 + 40);
// }

// canvas.DrawStartMenu = function(){
    
//     let txt;

//     ctx.font = "48px Arial";
//     ctx.fillStyle = canvas.uiColour;
//     txt = "ENGLISH";
//     x = centreX(txt, canvas.width/2);
//     ctx.fillText(txt,x,canvas.height/2 - 40);

//     txt = "GRAMMAR BATTLE";
//     x = centreX(txt, canvas.width/2);
//     ctx.fillText(txt,x,canvas.height/2 + 5);

//     ctx.font = "24px Arial"
//     txt = "Press Enter to start.";
//     x = centreX(txt, canvas.width/2);
//     ctx.fillText(txt,x,canvas.height/2 + 40);
    
// }

// canvas.drawUI = function(){
//     ctx.beginPath();

//     ctx.fillStyle = canvas.backgroundColour;
//     ctx.rect(0, canvas.height - 60, canvas.width, 60);
//     ctx.fill();

//     ctx.strokeStyle = canvas.uiColour;
//     ctx.lineWidth = "3";
    
//     let x1 = 0;
//     let x2 = canvas.width;
//     let y = canvas.height - 60;
    
//     ctx.moveTo(x1, y);
//     ctx.lineTo(x2, y);

//     let x= canvas.width/2;
//     let y1 = y;
//     let y2 = canvas.height;

//     ctx.moveTo(x, y1);
//     ctx.lineTo(x, y2);
//     ctx.stroke();
//     ctx.closePath();

//     ctx.font = "24px Arial";
//     ctx.fillStyle = uiColour;
//     ctx.fillText("Score: "+score, 8, 25);
//     ctx.fillText("Lives: "+livesStr, 8, 55);
    
// }

// canvas.drawSentence = function(){
//     ctx.font = sizeMed;
//     ctx.fillStyle = textColour;
//     sentence.x = centreX(sentence.text, canvas.width/2);
//     ctx.fillText(sentence.text, sentence.x+sentence.xOffset, sentence.y);
// }

// canvas.drawAnswers = function(){
//     if(isGameOver) return;

//     ctx.font = sizeMed;
//     ctx.fillStyle = textColour;
//     let x = centreX(answerLeft.text, answerLeft.x);
//     ctx.fillText(answerLeft.text, x, answerLeft.y);
    
//     ctx.font = sizeMed;
//     ctx.fillStyle = textColour;
//     x = centreX(answerRight.text, answerRight.x);
//     ctx.fillText(answerRight.text, x, answerRight.y);

// }

// canvas.drawExplosion = function(){
//     let coords = explosion.GetFrameCrop(explosion.frameNumber);
    
//     ctx.drawImage(
//         explosionSheet, 
//         coords.x, 
//         coords.y, 
//         explSpriteSize, 
//         explSpriteSize, 
//         explosion.pos.x, 
//         explosion.pos.y, 
//         explSpriteSize * explosion.scale.x, 
//         explSpriteSize * explosion.scale.x
//     );
    
//     explosion.frameNumber += 0.5; //Play at half speed
//     if(explosion.frameNumber >= explosion.totalFrames){
//         explosion.isExplosion = false;
//     }
// }

// centreX = function(text, x){
    
// }

// canvas.getLivesString = function(livesLeft){
//     let str = "";
//     for(let i=0; i < livesLeft; i++){
//         str += heart;
//     }
//     return str;
// }