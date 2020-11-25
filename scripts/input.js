document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchstart", touchHandler, {passive: false});
document.addEventListener("touchend", touchEndHandler, {passive: false});
document.addEventListener("mousedown", mouseDownHandler, {passive: false});
document.addEventListener("mouseup", mouseUpHandler, {passive: false});

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var enterPressed = false;
var escapePressed = false;

var input = {
    hasInput: () => {
        return input.right() || input.left() || input.up() || input.down();
    },
    right: () => {
        if(rightPressed){
            rightPressed = false;
            return true;
        } else{
            return false;
        }
    },
    left: () =>{
        if(leftPressed){
            leftPressed = false;
            return true;
        } else{
            return false;
        } 
    }, 
    up: () => {
        if(upPressed){
            upPressed = false;
            return true;
        } else{
            return false;
        }   
    },
    down: () => {
        if(downPressed){
            downPressed = false;
            return true;
        } else{
            return false;
        }   
    },
    enter: () => {
        if(enterPressed){
            enterPressed = false;
            return true;
        } else{
            return false;
        }   
    },
    escape: () => {
        if(escapePressed){
            escapePressed = false;
            return true;
        } else {
            return false;
        }
    }
}


function keyDownHandler(e){
    console.log("Key down handler");

    if(e.key == "Escape" || e.key == "Esc"){
        console.log("Escape pressed");
        escapePressed = true;
        // if(!isStart){
        //     TogglePause();
        // }
    }
    // if(isPaused) return;
    
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
        console.log("Enter pressed");
        enterPressed = true;
    }

}

function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }
    if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
    if(e.key == "Up" || e.key == "ArrowUp"){
        upPressed = false;
    }
    if(e.key == "Down" || e.key == "ArrowDown"){
        downPressed = false;
    }
    if(e.key == "Enter"){
        //StartGame();
        enterPressed = false;
    }
    if(e.key == "Escape" || e.key == "Esc"){
        escapePressed = false;
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
    upPressed = false;
    downPressed = false;
}