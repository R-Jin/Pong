var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');


// sets the drawing surface to the same width and height as the canvas height and width set in css
canvas.width = canvas.scrollWidth;         
canvas.height = canvas.scrollHeight;

// Player constructor
function Player(x, y, speedY){
    this.x = x;
    this.y = y;
    this.w = 5;
    this.h = 100;
    this.speedY = speedY;
    this.up = false;
    this.down = false;
}

var scorePlayer1 = 0;
var scorePlayer2 = 0;

const paddleSpeed = 600;

var ballX = canvas.width / 2; 
var ballY = canvas.height / 2;
var ballR = 10;
var ballVY = 500;
var ballVX = 500;

var player1 = new Player(100, canvas.height/2 - 50, paddleSpeed);

var player2 = new Player(canvas.scrollWidth - 100, canvas.height/2 - 50, paddleSpeed);

ctx.fillStyle = 'white'

var lastAnimationTime = 0;

// Handling multiple keypresses
let keysPressed = {}

window.addEventListener("keydown", (e) => {
    let key = e.key
    keysPressed[key] = true;
})

window.addEventListener("keyup", (e) => {
    let key = e.key
    delete keysPressed[key];
})

// Animation handling
function animate(){

    // Framebuffer handling 
    var currentAnimationTime = Date.now();
    var animationTimeDelta = (currentAnimationTime - (lastAnimationTime || Date.now())) / 1000;
    lastAnimationTime = currentAnimationTime;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Drawing scoreboard
    ctx.font = "50px Arial";
    ctx.fillText(`P1: ${scorePlayer1}`, 80, 80);
    ctx.font = "50px Arial";
    ctx.fillText(`P2: ${scorePlayer2}`, canvas.width - 180, 80);

    // Drawing paddles
    ctx.fillRect(player1.x, player1.y, player1.w, player1.h)
    ctx.fillRect(player2.x, player2.y, player2.w, player2.h)

    // Paddle movement handling
    if (keysPressed['s'] && player1.y <= canvas.height - player1.h) {
        player1.y += player1.speedY * animationTimeDelta
    } 
    if (keysPressed['w'] && player1.y >= 0) {
        player1.y -= player1.speedY * animationTimeDelta
    }
    if (keysPressed['ArrowDown'] && player2.y <= canvas.height - player2.h) {
        player2.y += player2.speedY * animationTimeDelta
    }
    if (keysPressed['ArrowUp'] && player2.y >= 0) {
        player2.y -= player2.speedY * animationTimeDelta
    }

    // Drawing ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballR, 0, Math.PI * 2);
    ctx.fill()

    ballY += ballVY * animationTimeDelta
    ballX += ballVX * animationTimeDelta

    var distanceUp = ballY;
    var distanceDown = canvas.height-ballY; 

    if (distanceUp <= ballR || distanceDown <= ballR) {
        if (distanceUp < ballR) {
            ballY = ballR;
        }
        if (distanceDown < ballR) {
            ballY = canvas.height - ballR;
        }
        ballVY = ballVY * -1;
    }
    if (ballX - ballR  <= player1.x + player1.w && ballX - ballR >= player1.x && ballY >= player1.y && ballY <= player1.y + player1.h || ballX + ballR >= player2.x && ballX - ballR <= player2.x + player2.w && ballY >= player2.y && ballY <= player2.y + player2.h ) {
        if (ballX - ballR  < player1.x + player1.w && ballX - ballR > player1.x) {
            ballX = player1.x + player1.w + ballR
        } 

        if (ballX + ballR > player2.x && ballX - ballR < player2.x + player2.w ) {
            ballX = player2.x - ballR
        } 
        ballVX = ballVX * -1;
        ballVY += Math.floor(Math.random() * 200) - 100;
    }
    
    if (ballX - ballR < player1.x - 50) {
        scorePlayer2 += 1;
        ballVX = 500
        ballVY = 500
        ballX = canvas.width / 2
        ballY = canvas.height / 2
    }
    
    if (ballX - ballR > player2.x + 50) {
        scorePlayer1 += 1;
        ballVX = 500
        ballVY = 500
        ballX = canvas.width / 2
        ballY = canvas.height / 2
    }

    requestAnimationFrame(animate)
}

animate()

