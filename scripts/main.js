
function Init(){
    loadJSON(function(response){
        data = JSON.parse(response);
        updateLoop = setInterval(Update, 10);
    });
    canvas.init();
}

function Update(){
    canvas.render();
    Game();
    
}


Init();