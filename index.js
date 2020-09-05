class Matrix {
    constructor(width, height, element = (x, y) => undefined) {
        this.width = width;
        this.height = height;
        this.content = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.content[y * width + x] = element(x, y);
            }
        }
    }

    get(x, y) {
        return this.content[y * this.width + x];
    }
    set(x, y, value) {
        this.content[y * this.width + x] = value;
    }
}


class player {
    constructor(x, y) {

        this.x = x * scale;
        this.y = y * scale;
        this.tailX = [0];
        this.tailY = [0];
        this.ctr = -4;
        this.usedSnakeSpaceX = [];
        this.usedSnakeSpaceY = [];

        this.lastUsed = "ArrowDown";
        this.lastUsedIndex = ""

        this.makeDisplay(this.x, this.y);
        this.events()
    }


    makeDisplay(x, y) {

        cx.fillStyle = 'black';
        cx.strokeRect(0, 0, cx.width, cx.height);

        cx.fillStyle = 'gray';
        cx.fillRect(x, y, scale, scale);
    }


    events() {
        document.body.addEventListener("keydown", event => {
            event.preventDefault()
            if (event.key == "ArrowUp" && this.lastUsed != "ArrowDown") this.lastUsedIndex = event.key
            if (event.key == "ArrowDown" && this.lastUsed != "ArrowUp") this.lastUsedIndex = event.key
            if (event.key == "ArrowLeft" && this.lastUsed != "ArrowRight") this.lastUsedIndex = event.key
            if (event.key == "ArrowRight" && this.lastUsed != "ArrowLeft") this.lastUsedIndex = event.key
        })
    }


    clearDebris(ctr) {
        cx.clearRect(this.tailX[ctr], this.tailY[ctr], scale, scale)
    }


    move() { //player
        this.lastUsed = this.lastUsedIndex
        this.ctr++
        this.tailX.push(this.x)
        this.tailY.push(this.y)

        for (let i = this.ctr; i < this.tailX.length; i++) {
            this.usedSnakeSpaceX.push(this.tailX[i])
            this.usedSnakeSpaceY.push(this.tailY[i])
        }

        if (this.x == randomX && this.y == randomY) {
            this.ctr--;
            addCandy()
        }
        if (this.lastUsed == "ArrowUp") {
            this.clearDebris(this.ctr)
            if (this.y <= 0) {
                this.y = cx.height
                this.makeDisplay(this.x, this.y)
            } else this.makeDisplay(this.x, this.y -= scale)
        }
        if (this.lastUsed == "ArrowDown") {
            this.clearDebris(this.ctr)
            if (this.y >= cx.height) {
                this.y = 0
                this.makeDisplay(this.x, this.y)
            } else this.makeDisplay(this.x, this.y += scale)
        }
        if (this.lastUsed == "ArrowLeft") {
            this.clearDebris(this.ctr)
            if (this.x <= 0) {
                this.x = cx.width
                this.makeDisplay(this.x, this.y)
            } else this.makeDisplay(this.x -= scale, this.y)
        }
        if (this.lastUsed == "ArrowRight") {
            this.clearDebris(this.ctr)
            if (this.x >= cx.width) {
                this.x = 0
                this.makeDisplay(this.x, this.y)
            } else this.makeDisplay(this.x += scale, this.y)
        }

        everyUsedSquareX.push(this.usedSnakeSpaceX)
        everyUsedSquareY.push(this.usedSnakeSpaceY)

        this.usedSnakeSpaceX = [];
        this.usedSnakeSpaceY = [];
    }
    colisionCheck() {
        if (this.ctr > 12) {
            for (let i = 0; i < everyUsedSquareX.length; i++) {
                if (everyUsedSquareX[i] == this.x && everyUsedSquareY[i] == this.y) {
                    for (let i = 0; i < usedSnakeSpaceX.length; i++) {

                    }
                    everyUsedSquareX = everyUsedSquareX.concat(this.usedSnakeSpaceX)
                    everyUsedSquareY = everyUsedSquareY.concat(this.usedSnakeSpaceY)
                    stillRunning = false;

                    cx.fillStyle = 'lightgray';
                    cx.fillRect(0, 0, cx.width, cx.height);
                    /*
                    cx.fillStyle = 'red'
                    cx.textAlign = 'center'
                    cx.font      = "38px Arial";
                    cx.fillText("GAME LOST", cx.width / 2, cx.height / 2);
                    */
                }
            }
        }
    }
}


//needed to run the game

let cx = document.querySelector('canvas').getContext('2d');
cx.width = 500
cx.height = 500

const scale = 20
const speed = 200

//required from server

let everyUsedSquareX = [],
    everyUsedSquareY = [];
stillRunning = true;

let player1 = new player(10, 10)
let player2 = new player(12, 12)

addCandy();

let now = Date.now()
requestAnimationFrame(hold);



function addCandy() { //game
    cx.fillStyle = 'gold'
    randomX = Math.floor(Math.random() * cx.width)
    randomX = randomX - randomX % scale
    randomY = Math.floor(Math.random() * cx.height)
    randomY = randomY - randomY % scale
    cx.fillRect(randomX, randomY, scale, scale);

}


function hold(timestamp) { //game
    if (Date.now() - now >= speed && stillRunning) {
        now = Date.now()
        requestAnimationFrame(hold)

        player1.move()
        player2.move()

        player1.colisionCheck()
        player2.colisionCheck()
        console.log(everyUsedSquareX)
        everyUsedSquareX = [];
        everyUsedSquareY = [];
    } else if (stillRunning) {
        requestAnimationFrame(hold)
    }

}