let cx = document.querySelector('canvas').getContext('2d');
cx.width = 500
cx.height = 500
let snakeTiles = [0, 0];
let x = 0,
    y = 0;

let tailX = [0],
    tailY = [0]
let ctr = -1
let countdown = false
let lastUsed = ""
addCandy()
makeDisplay(x, y)


document.body.addEventListener("keydown", event => {
    event.preventDefault()
    
    if (!countdown) {
        setTimeout(() => {
            tailX.push(x)
            tailY.push(y)

            ctr++
            countdown = false
            if (x == randomX && y == randomY) {
                ctr--;
                addCandy()
            }

            if (event.key == "ArrowUp") {
                y -= 10
                clearDebris(ctr)
                makeDisplay(x, y)
            }
            if (event.key == "ArrowDown") {
                y += 10
                clearDebris(ctr)
                makeDisplay(x, y)
            }
            if (event.key == "ArrowLeft") {
                x -= 10
                clearDebris(ctr)
                makeDisplay(x, y)
            }
            if (event.key == "ArrowRight") {
                x += 10
                clearDebris(ctr)
                makeDisplay(x, y)
            } 
        }, 100)
        countdown = true
    }
})

function makeDisplay(x, y) {

    cx.fillStyle = 'black';
    cx.strokeRect(0, 0, 500, 500);

    cx.fillStyle = 'gray';
    cx.fillRect(x, y, 10, 10);
}

console.log(randomX, randomY)

function addCandy() {
    cx.fillStyle = 'gold'
    randomX = Math.floor(Math.random() * cx.width)
    randomX = randomX - randomX % 10
    randomY = Math.floor(Math.random() * cx.height)
    randomY = randomY - randomY % 10
    cx.fillRect(randomX, randomY, 10, 10);

}

function clearDebris(ctr) {
    cx.clearRect(tailX[ctr], tailY[ctr], 10, 10)
}


function hold() {

}