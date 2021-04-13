function getRandomArray() {
    let obj = [];
    let iter = Math.randomInt(1024);
    let arr = []
    for(let i = 0; i < iter; i++) {

    }
    return obj;
}

let being = {};
let pellet = {};
let grid = {};
let size = 10;
let gridSize = 64;
var stop = false;
var frameCount = 0;
var fps = 30, fpsInterval, startTime, now, then, elapsed;

var canvas = document.querySelector("#viewport");
var context = canvas.getContext("2d");

function check(e) {
    alert(e.keyCode);
}

function _initialize() {
    console.log("1 - initializing...")
    being.x = 0;
    being.y = 0;
    being.dx = 1;
    being.dy = 0;
    pellet.x = Math.randomInt(gridSize);
    pellet.y = Math.randomInt(gridSize);
    canvas.width = size * gridSize;
    canvas.height = size * gridSize;
    context.clearRect(0,0,canvas.width, canvas.height);
    window.addEventListener('keydown',this._handleKey,false);
    _startAnimating();
}

function _handleKey(e) {
    console.log("key pressed! ", e.keyCode);
    let k = e.keyCode;
    switch(k) {
        case 37:
            if(being.dx != 1) {
                being.dx = -1;
                being.dy = 0;
            }
            break;
        case 38:
            if(being.dy != 1) {
                being.dx = 0;
                being.dy = -1;
            }
            break;
        case 39:
            if(being.dx != -1) {
                being.dx = 1;
                being.dy = 0;
            }
            break;
        case 40:
            if(being.dy != -1) {
                being.dx = 0;
                being.dy = 1;
            }
            break;
    }
}  

function _logic() {
    being.x = being.x + being.dx;
    being.y = being.y + being.dy;
    let collision = grid[hashCode(being.x,being.y)] != undefined || being.x < 0 || being.x > gridSize || being.y < 0 || being.y > gridSize;
    if(collision) {
        stop = true;
        alert("Game Over!");
        _initialize();
    } else {
        grid[hashCode(being.x,being.y)] = 1;
    }
}

function _startAnimating() {
    console.log("2 - beginning animation...")
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    _animate();
}

function _animate() {
    if(!stop) {
        requestAnimationFrame(_animate);
        now = Date.now();
        elapsed = now - then;
        if(elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            _logic();
            _draw();
        }
    }s
}

function _draw() {
    context.fillStyle('black');
    context.fillRect(being.x*size,being.y*size,size,size);
    context.fillStyle('white');
    context.fillRect(pellet.x*size,pellet.y*size,size,size);
}

function hashCode(x, y) {
    let hash = x + "@" + y;
    return hash;
}

_initialize();