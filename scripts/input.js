document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchstart", touchHandler, {passive: false});
document.addEventListener("touchend", touchEndHandler, {passive: false});
document.addEventListener("mousedown", mouseDownHandler, {passive: false});
document.addEventListener("mouseup", mouseUpHandler, {passive: false});

var rightPressed = false;
var leftPressed = false;
var rightWasPressed = false;
var leftWasPressed = false;
var upPressed = false;
var upWasPressed = false;
var downPressed = false;
var downWasPressed = false;
var enterPressed = false;
var enterWasPressed = false;

var input = {
    hasInput: () => {
        return input.right() || input.left() || input.up() || input.down();
    },
    right: () => {
        if(rightWasPressed) return false;
        if(rightPressed){
            rightWasPressed = true;
            return true;
        }   
    },
    left: () =>{
        if(leftWasPressed) return false;
        if(leftPressed){
            leftWasPressed = true;
            return true;
        }   
    }, 
    up: () => {
        if(leftWasPressed) return false;
        if(upPressed){
            leftWasPressed = true;
            return true;
        }   
    },
    down: () => {
        if(downWasPressed) return false;
        if(downPressed){
            downWasPressed = true;
            return true;
        }    
    },
    enter: () => {
        if(enterWasPressed) return false;
        if(enterPressed){
            enterWasPressed = true;
            return true;
        }   
    }
}


function keyDownHandler(e){
    console.log("Key down handler");

    if(e.key == "Escape" || e.key == "Esc"){
        console.log("Escape pressed");
        if(!isStart){
            TogglePause();
        }
    }
    if(isPaused) return;
    
    if(e.key == "Right" || e.key == "ArrowRight"){
        console.log("Right pressed");
        rightPressed = true;
    }
    if(e.key == "Left" || e.key == "ArrowLeft"){
        console.log("Left pressed");
        leftPressed = true;
    }
    if(e.key == "Up" || e.key == "ArrowUp"){
        console.log("Up pressed");
        upPressed = true;
    }
    if(e.key == "Down" || e.key == "ArrowDown"){
        console.log("Down pressed");
        downPressed = true;
    }
    if(e.key == "Enter"){ // && (isGameOver || isStart)
        //StartGame();
        if(enterPressed === true){
            enterWasPressed = true;
        }else{
            enterPressed = true;
        }
        
    }

}

function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
        rightWasPressed = false;
    }
    if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
        leftWasPressed = false;
    }
    if(e.key == "Up" || e.key == "ArrowUp"){
        upPressed = false;
        upWasPressed = false;
    }
    if(e.key == "Down" || e.key == "ArrowDown"){
        downPressed = false;
        downWasPressed = false;
    }
    if(e.key == "Enter"){
        //StartGame();
        enterPressed = false;
        enterWasPressed = false;
    }
}

function touchHandler(e){
    
    if(e.touches && e.target == canvas.gameCanvas) {
        
        e.preventDefault();
        
        touchX = (e.touches[0].pageX - canvas.gameCanvas.offsetLeft) / (window.innerHeight * .675);
        touchY = (e.touches[0].pageY - canvas.gameCanvas.offsetTop) / (window.innerHeight * .9);
        
        output.innerHTML = "Touch: "+ " x: " + touchX + ", y: " + touchY;

        clickHandler(touchX, touchY);
    }
}

function touchEndHandler(e){
    clickUpHandler();
}

function mouseDownHandler(e){
    console.log("Mouse Down");
    if(e.target == canvas.gameCanvas){
        e.preventDefault();

        mouseX = (e.clientX - canvas.gameCanvas.offsetLeft) / (window.innerHeight * .675);
        mouseY = (e.clientY - canvas.gameCanvas.offsetTop) / (window.innerHeight * .9);

        //output.innerHTML = "Click: "+ " x: " + mouseX + ", y: " + mouseY;
        console.log("Mouse Down at " + mouseX + ", " + mouseY);
        clickHandler(mouseX, mouseY);
    }
}
function mouseUpHandler(e){
    clickUpHandler();
}

function clickHandler(x, y){
    
    if(isStart || isGameOver){
        StartGame();
        return;
    }
    if(isPaused){
        TogglePause();
        return;
    }
    if(y > .8){
        if(x < 0.25){
            leftPressed = true;
            return;
        }else if(x < 0.5){
            upPressed = true;
            return;
        }else if(x < 0.75){
            downPressed = true;
            return;
        }else{
            rightPressed = true;
            return;
        }
    }else{
        TogglePause();
        return;
    }
}
function clickUpHandler(){
    leftPressed = false;
    rightPressed = false;
    leftWasPressed = false;
    rightWasPressed = false;
    upPressed = false;
    upWasPressed = false;
    downPressed = false;
    downWasPressed = false;
}