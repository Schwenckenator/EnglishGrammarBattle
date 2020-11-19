
var mainMenu = {
    menu: mainMenu.startMenu,
    
    run: () => {
        canvas.ctx.clearRect(0,0, canvas.width, canvas.height);
        canvas.ctx.drawImage(canvas.nightSky, 0, 0);
        canvas.ctx.drawImage(canvas.nightSky, 0, 320);
        
        menu();

        if(input.enter()){
            menu = mainMenu.mainMenu;
        }
    },

    startMenu: () => {
        canvas.drawText("ENGLISH", canvas.sizeBig, canvas.textColour, canvas.width/2, canvas.height/2 - 40);
        canvas.drawText("BATTLE ARENA", canvas.sizeBig, canvas.textColour, canvas.width/2, canvas.height/2 + 5);
        canvas.drawText("Press Enter to start", canvas.sizeMed, canvas.textColour, canvas.width/2, canvas.height/2 + 40);
    },

    mainMenu: () => {
        canvas.drawText("Choose game.", canvas.sizeMed, canvas.textColour, canvas.width/2, canvas.height/2 - 40);
        canvas.drawText("GRAMMAR FALLS", canvas.sizeBig, canvas.textColour, canvas.width/2, canvas.height/2 + 5);
    },

    
}

var currentGame = mainMenu;

function Init(){
    loadJSON(function(response){
        data = JSON.parse(response);
        updateLoop = setInterval(Update, 10);
    });
    canvas.init();
}

function Update(){
    //canvas.render();
    //Game();

    currentGame.run();
}

Init();