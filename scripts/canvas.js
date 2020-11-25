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

    drawRect: (xPos, yPos, xSize, ySize, lineWidth = 1, colour = "white") => {
        canvas.ctx.strokeStyle = colour;
        canvas.ctx.lineWidth = lineWidth;
        canvas.ctx.beginPath();
        canvas.ctx.rect(xPos, yPos, xSize, ySize);
        canvas.ctx.stroke();
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
        
        let x0, x1, x2, x3, xw, y0, y1;

        x0 = 0;
        x1 = canvas.width/4;
        x2 = canvas.width/2;
        x3 = 3*canvas.width/4;
        xw = canvas.width;

        y0 = canvas.height;
        y1 = canvas.height - 60;
        
        canvas.ctx.moveTo(x0, y1);
        canvas.ctx.lineTo(xw, y1);

        canvas.ctx.moveTo(x1, y0);
        canvas.ctx.lineTo(x1, y1);

        canvas.ctx.moveTo(x2, y0);
        canvas.ctx.lineTo(x2, y1);

        canvas.ctx.moveTo(x3, y0);
        canvas.ctx.lineTo(x3, y1);

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
        for(let i=0; i<4; i++){
            let x = canvas.centreX(answers[i].text, answers[i].x);
            canvas.ctx.fillText(answers[i].text, x, answers[i].y);
        }
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
    },
};
