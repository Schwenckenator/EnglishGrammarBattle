
function Init(){
    loadJSON(function(response){
        data = JSON.parse(response);
        updateLoop = setInterval(Update, 10);
    });
     
}

function Update(){
    canvas.Draw();
    Game();

}


Init();