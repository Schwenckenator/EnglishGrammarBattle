
var mainMenu = {
       
    run: () => {
        mainMenu.menu();
    },

    startMenu: () => {
        canvas.drawText("ENGLISH", canvas.sizeBig, canvas.textColour, canvas.width/2, canvas.height/2 - 40);
        canvas.drawText("BATTLE ARENA", canvas.sizeBig, canvas.textColour, canvas.width/2, canvas.height/2 + 5);
        canvas.drawText("Press Enter to start", canvas.sizeMed, canvas.textColour, canvas.width/2, canvas.height/2 + 40);

        if(input.enter()){
            mainMenu.menu = mainMenu.mainMenu;
        }
    },

    mainMenu: () => {
        let xPos = canvas.width / 2;
        let yTitlePos = canvas.height/2 - 160;
        
        let yOffset = 60;
        let yPos = canvas.height/2 - yOffset;
        
        canvas.drawText("Choose game.", canvas.sizeMed, canvas.textColour, xPos, yTitlePos);
        for(let i=0; i<gameList.length; i++){
            canvas.drawText(gameList[i].name.toUpperCase(), canvas.sizeBig, canvas.textColour, xPos, yPos + i * yOffset);
        }
        // canvas.drawText("SPELLING SPIN", canvas.sizeBig, canvas.textColour, xPos, yPos);
        // canvas.drawText("GRAMMAR FALLS", canvas.sizeBig, canvas.textColour, xPos, yPos + yOffset);
        // canvas.drawText("TEXT TROUBLE", canvas.sizeBig, canvas.textColour, xPos, yPos + 2 * yOffset);

        canvas.drawRect(25, yPos - 48 +(mainMenu.selected * yOffset), canvas.width - 50, 60, 3, canvas.uiColour);


        if(input.down()){
            mainMenu.selected++;
            mainMenu.selected %= gameList.length;
            console.log(`Selected menu index is ${mainMenu.selected}.`);
        }else if(input.up()){
            mainMenu.selected--;
            mainMenu.selected += gameList.length;
            mainMenu.selected %= gameList.length;

            console.log(`Selected menu index is ${mainMenu.selected}.`);
        }
        
        if(input.escape()){
            mainMenu.menu = mainMenu.startMenu;
        }
        if(input.enter()){
            console.log("Game selected.");
            currentState = gameList[mainMenu.selected].instance;
            console.log(`Current state now: ${currentState}`);
        }
    },

    
}

var currentState = mainMenu;

function Init(){
    loadJSON(function(response){
        data = JSON.parse(response);
        updateLoop = setInterval(Update, 10);
    });
    canvas.init();
    mainMenu.menu = mainMenu.startMenu;
    mainMenu.selected = 0;
}

function Update(){

    drawBackground();

    currentState.run();
}

function drawBackground(){
    canvas.ctx.clearRect(0,0, canvas.width, canvas.height);
    canvas.ctx.drawImage(canvas.nightSky, 0, 0);
    canvas.ctx.drawImage(canvas.nightSky, 0, 320);
}

Init();