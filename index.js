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
let water = {};
let camSize = 16;
let score = 0;
let grid = {};
let size = 32;
let gridSize = 128;
var stop = false;
var frameCount = 0;
var fps = 20, fpsInterval, startTime, now, then, elapsed;

var canvas = document.querySelector("#viewport");
var context = canvas.getContext("2d");

function check(e) {
    alert(e.keyCode);
}

function _initialize() {
    stop = false;
    being.x = 0;
    being.y = 0;
    being.dx = 1;
    being.dy = 0;
    pellet.x = Math.floor((Math.random() * gridSize));
    pellet.y = Math.floor((Math.random() * gridSize));
    canvas.width = size * camSize * 2;
    canvas.height = size * camSize * 2;
    context.clearRect(0,0,canvas.width, canvas.height);
    window.addEventListener('keydown',this._handleKey,false);
    
    _startAnimating();
}

function _handleKey(e) {
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
        case 32:
            fps = fps == 30 ? 10 : 30;
            fpsInterval = 1000 / fps;
            break;
    }
}  

function _logic() {
    being.x = being.x + being.dx;
    being.y = being.y + being.dy;

    let s_collision = grid[hashCode(being.x,being.y)] != undefined || being.x < 0 || being.x > gridSize || being.y < 0 || being.y > gridSize;
    let b_collision = blockers.hasOwnProperty(hashCode(being.x,being.y));
    let underwater = water[hashCode(being.x,being.y)];
    let collision = s_collision || b_collision;

    if(collision) {
        stop = true;
        score = 0;
        water = {};
        _clearGrid();
        _initialize(); 
    } else if (underwater) {
        fps = 10;
        fpsInterval = 1000 / fps;
    }
    else {
        fps = 20;
        fpsInterval = 1000 / fps;
        grid[hashCode(being.x,being.y)] = 1;
    }
    let point = pellet.x == being.x && pellet.y == being.y;
    if(point) {
        _handlePellet();
    }
}

function _startAnimating() {
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
            context.clearRect(0,0,canvas.width, canvas.height);
            raster_draw();
        }
    }
}

function raster_draw() {
    let boundX0 = being.x - camSize;
    let boundX1 = being.x + camSize;
    let boundY0 = being.y - camSize;
    let boundY1 = being.y + camSize;
    
    //Dynamic Objects
    for(let i = boundX0; i < boundX1; i++) {
        for(let j = boundY0; j < boundY1; j++) {
            let b_found = blockers[hashCode(i,j)];
            let s_found = grid[hashCode(i,j)];
            let w_found = water[hashCode(i,j)];
            if(w_found) {
                context.fillStyle = 'blue';
                context.fillRect((i - boundX0)*size,(j - boundY0)*size,size,size);
            }
            if(b_found) {
                context.fillStyle = 'red';
                context.fillRect((i - boundX0)*size,(j - boundY0)*size,size,size);
            }
            if(s_found) {
                context.fillStyle = 'green';
                context.fillRect((i - boundX0)*size,(j - boundY0)*size,size,size);
            }
        }
    }
    context.stroke();

    //Dynamic Walls
    context.fillStyle = 'red';
    if(boundX1 > gridSize) {
        context.fillRect((gridSize - boundX0)*size,0,(boundX1 - gridSize)*size,gridSize*size);
    } else if(boundX0 < 0) {
        context.fillRect(0,0,-boundX0*size,gridSize*size);
    }
    if(boundY1 > gridSize) {
        context.fillRect(0,(gridSize - boundY0)*size,gridSize*size,(boundY1-gridSize)*size); 
    } else if(boundY0 < 0) {
        context.fillRect(0,0,gridSize*size,-boundY0*size);
    }

    
    //Dynamic Pellet
    context.fillStyle = 'white';
    let tx = pellet.x < boundX0 ? boundX0 : pellet.x;
    tx = pellet.x > boundX1 ? boundX1 - 1 : tx;
    let ty = pellet.y < boundY0 ? boundY0 : pellet.y;
    ty = pellet.y > boundY1 ? boundY1 - 1 : ty;
    context.fillRect((tx - boundX0)*size,(ty - boundY0)*size,size,size);

    //Static Snake
    context.fillStyle = 'green';
    context.fillRect(camSize*size,camSize*size,size,size);
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
    score = score + 1;
    _clearGrid();
    _addBlocks();
    _addWater();
}

function _addBlocks() {
    let rx, ry;
    for(let i = 0; i < score; i++) {
        rx = Math.floor((Math.random() * gridSize));
        ry = Math.floor((Math.random() * gridSize));
        if(rx != being.x && ry != being.y) {
            blockers[hashCode(rx, ry)] = 1;
            for(let j = 0; j <= i / 2; j++) {
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

function _addWater() {
    let rx, ry, s;
    rx = Math.floor((Math.random() * gridSize));
    ry = Math.floor((Math.random() * gridSize));
    s = Math.floor((Math.random() * gridSize / 4));
    for(let j = -s; j < s; j++) {
        for(let k = -s; k < s; k++) {
            let isCircle = Math.sqrt(((j*j) + (k*k))) < s;
            if(isCircle) {
                water[hashCode(rx+j,ry+k)] = 1;
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