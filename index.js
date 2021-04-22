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
let blockers = {};
let score = 0;
let grid = {};
let size = 16;
let gridSize = 32;
var stop = false;
var frameCount = 0;
var fps = 10, fpsInterval, startTime, now, then, elapsed;

var canvas = document.querySelector("#viewport");
var context = canvas.getContext("2d");

function check(e) {
    alert(e.keyCode);
}

function _initialize() {
    console.log("1 - initializing...");
    stop = false;
    being.x = 0;
    being.y = 0;
    being.dx = 1;
    being.dy = 0;
    pellet.x = Math.floor((Math.random() * gridSize));
    pellet.y = Math.floor((Math.random() * gridSize));
    console.log("Pellet located", pellet.x, pellet.y);
    canvas.width = size * gridSize;
    canvas.height = size * gridSize;
    context.clearRect(0,0,canvas.width, canvas.height);
    window.addEventListener('keydown',this._handleKey,false);
    _startAnimating();
}

function _handleKey(e) {
    //console.log("key pressed! ", e.keyCode);
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
    let s_collision = grid[hashCode(being.x,being.y)] != undefined || being.x < 0 || being.x > gridSize || being.y < 0 || being.y > gridSize;
    let b_collision = blockers.hasOwnProperty(hashCode(being.x,being.y));
    let collision = s_collision || b_collision;
    if(collision) {
        stop = true;
        score = 0;
        _clearGrid();
        _initialize(); 
    } else {
        grid[hashCode(being.x,being.y)] = 1;
    }
    let point = pellet.x == being.x && pellet.y == being.y;
    if(point) {
        _handlePellet();
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
            frameCount++;
            _logic();
            _draw();
        }
    }
}

function _draw() {
    context.fillStyle = 'green';
    context.fillRect(being.x*size,being.y*size,size,size);
    context.strokeStyle = 'black';
    context.rect(being.x*size,being.y*size,size,size);
    context.stroke();
    context.fillStyle = 'white';
    context.fillRect(pellet.x*size,pellet.y*size,size,size);
    context.fillStyle = 'red';
    document.getElementById("score").innerHTML = score;
    document.getElementById("pellet").innerHTML = "(" + pellet.x + ", " + pellet.y + ")";
    document.getElementById("grid").innerHTML = gridSize + "x" + gridSize;
    document.getElementById("frames").innerHTML = frameCount;
    for(const o in blockers) {
        
        let rx = getX(`${o}`);
        let ry = getY(`${o}`);
        console.log(`${o}`, rx, ry);
        context.fillRect(rx*size, ry*size,size,size);
    }
}

function hashCode(x, y) {
    let hash = x + '-' + y;
    return hash;
}

function getX(hash) {
    let x = hash.substring(0,hash.indexOf('-'));
    return x;
}

function getY(hash) {
    let y = hash.substring(hash.indexOf('-')+1);
    return y;
}

function _handlePellet() {
    pellet.x = Math.floor((Math.random() * (gridSize-2))) + 1;
    pellet.y = Math.floor((Math.random() * (gridSize-2))) + 1;
    console.log("Pellet located", pellet.x, pellet.y);
    score = score + 1;
    _clearGrid();
    let rx, ry;
    //console.log("Adding blockers...", score);
    for(let i = 0; i < score; i++) {
        rx = Math.floor((Math.random() * gridSize));
        ry = Math.floor((Math.random() * gridSize));
        if(rx != being.x && ry != being.y) {
            blockers[hashCode(rx, ry)] = 1;
            for(let j = 0; j <= i / 5; j++) {
                if(Math.abs(being.x - rx) > j && Math.abs(being.y - ry) > j) {
                    blockers[hashCode(rx+j, ry)] = 1;
                    blockers[hashCode(rx-j, ry)] = 1;
                    blockers[hashCode(rx, ry+j)] = 1;
                    blockers[hashCode(rx, ry-j)] = 1;
                    blockers[hashCode(rx+Math.floor(j/2), ry+Math.floor(j/2))] = 1;
                    blockers[hashCode(rx-Math.floor(j/2), ry+Math.floor(j/2))] = 1;
                    blockers[hashCode(rx+Math.floor(j/2), ry-Math.floor(j/2))] = 1;
                    blockers[hashCode(rx-Math.floor(j/2), ry-Math.floor(j/2))] = 1;
                }
            }
        }
    }
}

function _clearGrid() {
    grid = {};
    blockers = {};
    context.clearRect(0,0,canvas.width, canvas.height);
}

_initialize();