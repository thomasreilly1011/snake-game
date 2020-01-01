//Canvas Paramaters
var canvas;
var ctx;

//Difficulty Settings
const NUM_ROWS = 15;
const FRAMES_PER_SECOND = 8;
const GAP = 6;


//Snake Data
var snakePos = {x: Math.floor(NUM_ROWS/2), y: Math.floor(NUM_ROWS/2)}; //Snake Head Position
var snakeDirection = "right";
var tail = new Array(3);
var applePos = {x: getAppleSqr(), y: getAppleSqr()};
var endDiff;
var gameOver = false;



//Main Function
window.onload = function() {
    //Initialising the canvas
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    snakeInit();

    //The game loop
    setInterval(
        function(){
            drawEverything();
            moveEverything();
        }, 1000/FRAMES_PER_SECOND);

    //User Input
    window.addEventListener('keydown', checkKeyPress);
    
}

function snakeInit() {
    for (var i=0; i < tail.length; i++) {
        console.log(tail.length);
        tail[i] = {x: snakePos.x-i-1, y: snakePos.y}
    }
}

function checkKeyPress(evt) {
    if (evt.keyCode == "38") {
        console.log("Up");
        snakeDirection = "up";
    } else if (evt.keyCode == "40") {
        console.log("Down");
        snakeDirection = "down";
    } else if (evt.keyCode == "39") {
        console.log("Right"); 
        snakeDirection = "right";
    } else if (evt.keyCode == "37") {
        console.log("Left");
        snakeDirection = "left";
    } else if (gameOver) {
        tail.length = 3;
        snakePos = {x: Math.floor(NUM_ROWS/2), y: Math.floor(NUM_ROWS/2)};
        snakeDirection = "right";
        snakeInit();
        applePos = {x: getAppleSqr(), y: getAppleSqr()};
        gameOver = false;
    } 

}

function colorRect(leftX, topY, width, height, drawColor) {
    ctx.fillStyle = drawColor;
    ctx.fillRect(leftX, topY, width, height);
}

function drawEverything(){
    var squareWidth = (canvas.width - ((NUM_ROWS+1)*GAP))/NUM_ROWS;
    //The Background
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.fillText("Press Enter To Continue", 250, 300);
        return;
    }
    
    //The Grid
    var spaceX = GAP;
    var spaceY = GAP;
    for (var i=0; i < NUM_ROWS; i++) {
        for (var j=0; j < NUM_ROWS; j++) {//Goes through all squares
            colorRect(j*squareWidth+spaceX, i*squareWidth+spaceY, squareWidth, squareWidth, 'white');
            spaceX += GAP;
        }
        spaceY += GAP;
        spaceX = GAP;
    }
    //The Apple
    colorRect(getPixelPos(applePos.x), getPixelPos(applePos.y), squareWidth, squareWidth, 'red');
    //The Snake
    colorRect(getPixelPos(snakePos.x), getPixelPos(snakePos.y), squareWidth, squareWidth, 'green');
    //The Tail
    for (var i=0; i < tail.length; i++) {
        colorRect(getPixelPos(tail[i].x), getPixelPos(tail[i].y), squareWidth, squareWidth, 'green');
    }
}

/* A funciton that takes in the distance in grid squares from the origin and 
returns the equivilant distance in pixels */
function getPixelPos(squares) { 
    var squareWidth = (canvas.width - ((NUM_ROWS+1)*GAP))/NUM_ROWS;
    return squares*squareWidth+(GAP*squares)+GAP;
}

function moveEverything() {
    //Move The Head
    var prev = {x: snakePos.x, y: snakePos.y};
    if (snakeDirection == "left") {
        snakePos.x--;
    } else if (snakeDirection == "right") {
        snakePos.x++;
    } else if (snakeDirection == "up") {
        snakePos.y--;
    } else if (snakeDirection == "down") {
        snakePos.y++;
    }

    //Move The Tail
    for (var i=0; i < tail.length; i++) {
        temp = {x: tail[i].x, y: tail[i].y};
        tail[i] = {x: prev.x, y: prev.y};
        prev = {x: temp.x, y: temp.y};
        endDiff = {x: tail[i].x - temp.x, y: tail[i].y - temp.y};
    }

    //If the snake eats an apple
    if (snakePos.x == applePos.x && snakePos.y == applePos.y) {
        applePos = {x: getAppleSqr(), y: getAppleSqr()};
        grow();
    }

    //If the snake eats itself
    for (var i=0; i<tail.length; i++) {
        if (snakePos.x == tail[i].x && snakePos.y == tail[i].y) {
            gameOver = true;
        }
    }
    //If the snake eats the wall
    if (snakePos.x >= NUM_ROWS || snakePos.x < 0 || snakePos.y >= NUM_ROWS || snakePos.y < 0) {
        gameOver = true;
    }
}

function grow() {
    var temp = tail.length;
    tail.length += 2;

    for (var i=temp; i < tail.length; i++) {
        if (endDiff.x > 0){
            tail[i] = {x: tail[i-1].x + 1 + i, y: tail[i-1]};
        } else if (endDiff.x < 0) {
            tail[i] = {x: tail[i-1].x - 1 - i, y: tail[i-1]};
        } else if (endDiff.y > 0) {
            tail[i] = {x: tail[i-1].x, y: tail[i-1] + 1 + i};
        } else if (endDiff.y < 0) {
            tail[i] = {x: tail[i-1].x, y: tail[i-1] - 1 - i};
        }
        
    }
}

function getAppleSqr() {
    var rand = Math.floor((Math.random() * (NUM_ROWS - 1) + 1));
    while (rand > NUM_ROWS) {
        rand = Math.floor((Math.random() * NUM_ROWS - 1) + 1);
    }
    return rand;
}
