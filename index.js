let cx = document.querySelector('canvas').getContext('2d');
cx.width = 500
cx.height = 500
let now = Date.now()
let snakeTiles = [0, 0];
let x = 0,
    y = 0;

let tailX = [0],
    tailY = [0]
let ctr = -1
let countdown = false,
    stillRunning = true;
let lastUsed = "ArrowDown",
    lastUsedIndex = ""
let arrayX = [],
    arrayY = [];
const scale = 20
const speed = 200

addCandy()
makeDisplay(x, y)
events()
requestAnimationFrame(hold)



function events() { //player
    document.body.addEventListener("keydown", event => {
        event.preventDefault()
        if (event.key == "ArrowUp" && lastUsed != "ArrowDown") lastUsedIndex = event.key
        if (event.key == "ArrowDown" && lastUsed != "ArrowUp") lastUsedIndex = event.key
        if (event.key == "ArrowLeft" && lastUsed != "ArrowRight") lastUsedIndex = event.key
        if (event.key == "ArrowRight" && lastUsed != "ArrowLeft") lastUsedIndex = event.key
    })
}

function makeDisplay() {//game
    for (let i = 0; i < arrayX.length; i++) {
        if (arrayX[i] == x && arrayY[i] == y) {
            stillRunning = false;
            cx.fillStyle = 'lightgray';
            cx.fillRect(0, 0, cx.width, cx.height);
            cx.fillStyle = 'red'
            cx.textAlign = 'center'
            cx.font = "38px Arial";
            cx.fillText("GAME LOST", cx.width / 2, cx.height / 2);
        }
    }

    arrayX = [];
    arrayY = [];

    cx.fillStyle = 'black';
    cx.strokeRect(0, 0, cx.width, cx.height);

    cx.fillStyle = 'gray';
    cx.fillRect(x, y, scale, scale);
}


function addCandy() {//game
    cx.fillStyle = 'gold'
    randomX = Math.floor(Math.random() * cx.width)
    randomX = randomX - randomX % scale
    randomY = Math.floor(Math.random() * cx.height)
    randomY = randomY - randomY % scale
    cx.fillRect(randomX, randomY, scale, scale);

}

function clearDebris(ctr) {//player
    cx.clearRect(tailX[ctr], tailY[ctr], scale, scale)
}


function move() {//player
    lastUsed = lastUsedIndex
    ctr++
    tailX.push(x)
    tailY.push(y)

    for (let i = ctr; i < tailX.length; i++) {
        arrayX.push(tailX[i])
        arrayY.push(tailY[i])
    }

    if (x == randomX && y == randomY) {
        ctr--;
        addCandy()
    }
    if (lastUsed == "ArrowUp") {
        clearDebris(ctr)
        if (y <= 0) {
            y = cx.height
            makeDisplay(x, y)
        } else makeDisplay(x, y -= scale)
    }
    if (lastUsed == "ArrowDown") {
        clearDebris(ctr)
        if (y >= cx.height) {
            y = 0
            makeDisplay(x, y)
        } else makeDisplay(x, y += scale)
    }
    if (lastUsed == "ArrowLeft") {
        clearDebris(ctr)
        if (x <= 0) {
            x = cx.width
            makeDisplay(x, y)
        } else makeDisplay(x -= scale, y)
    }
    if (lastUsed == "ArrowRight") {
        clearDebris(ctr)
        if (x >= cx.width) {
            x = 0
            makeDisplay(x, y)
        } else makeDisplay(x += scale, y)
    }
}



function hold(timestamp) {//game
    if (Date.now() - now >= speed && stillRunning) {
        now = Date.now()
        requestAnimationFrame(hold)

        move()

    } else if (stillRunning) {
        requestAnimationFrame(hold)
    }

}