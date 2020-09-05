class player {
    constructor(x, y, keyboard, color) {
        this.x = x * scale;
        this.y = y * scale;
        this.tailX = [0];
        this.tailY = [0];
        this.ctr = -6;
        this.usedSnakeSpaceX = [];
        this.usedSnakeSpaceY = [];
        this.go = true;
        this.kbd = keyboard;
        this.color = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;

        this.lastUsed = "";
        this.lastUsedIndex = ""

        this.makeDisplay(this.x, this.y);
        this.events()
    }


    makeDisplay(x, y) {

        cx.fillStyle = 'black';
        cx.strokeRect(0, 0, cx.width, cx.height);

        cx.fillStyle = this.color;
        cx.fillRect(x, y, scale, scale);
    }


    events() {
        document.body.addEventListener("keydown", event => {
            event.preventDefault()
            if (event.key == this.kbd[0] && this.lastUsed != this.kbd[1]) this.lastUsedIndex = event.key
            if (event.key == this.kbd[1] && this.lastUsed != this.kbd[0]) this.lastUsedIndex = event.key
            if (event.key == this.kbd[2] && this.lastUsed != this.kbd[3]) this.lastUsedIndex = event.key
            if (event.key == this.kbd[3] && this.lastUsed != this.kbd[2]) this.lastUsedIndex = event.key
            console.log(event.key)
        })
    }


    clearDebris(ctr) {
        cx.clearRect(this.tailX[ctr], this.tailY[ctr], scale, scale)
    }


    move() { //player
        if (this.go) {
            this.lastUsed = this.lastUsedIndex
            this.ctr++
            this.tailX.push(this.x)
            this.tailY.push(this.y)

            for (let i = this.ctr; i < this.tailX.length; i++) {
                usedSquaresX.push(this.tailX[i])
                usedSquaresY.push(this.tailY[i])

                this.usedSnakeSpaceX.push(this.tailX[i])
                this.usedSnakeSpaceY.push(this.tailY[i])
            }

            if (this.x == randomX && this.y == randomY) {
                this.ctr--;
                addCandy()
            }
            
            if (this.lastUsed == this.kbd[0]) {
                this.clearDebris(this.ctr)
                if (this.y <= 0) {
                    this.y = cx.height
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x, this.y -= scale)
            }
            if (this.lastUsed == this.kbd[1]) {
                this.clearDebris(this.ctr)
                if (this.y >= cx.height) {
                    this.y = 0
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x, this.y += scale)
            }
            if (this.lastUsed == this.kbd[2]) {
                this.clearDebris(this.ctr)
                if (this.x <= 0) {
                    this.x = cx.width
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x -= scale, this.y)
            }
            if (this.lastUsed == this.kbd[3]) {
                this.clearDebris(this.ctr)
                if (this.x >= cx.width) {
                    this.x = 0
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x += scale, this.y)
            }
        }
    }


    colisionCheck() {
        if (this.ctr > 12) {
            for (let i = 0; i < usedSquaresX.length; i++) {
                if (usedSquaresX[i] == this.x && usedSquaresY[i] == this.y) {
                    this.delSnake()

                    this.usedSnakeSpaceX = [];
                    this.usedSnakeSpaceY = [];

                    stillRunning = true;


                }
            }
        }
    }

    delSnake() {
        for (let i = 0; i < this.usedSnakeSpaceX.length; i++) {
            cx.clearRect(this.usedSnakeSpaceX[i], this.usedSnakeSpaceY[i], scale, scale);
            usedSquaresX.filter(element => this.usedSnakeSpaceX[i] != element)
            usedSquaresY.filter(element => this.usedSnakeSpaceY[i] != element)
            this.go = false
        }
    }
}


//needed to run the game

let cx = document.querySelector('canvas').getContext('2d');
cx.width = 500
cx.height = 500

const scale = 50
const speed = 200

//required from server

let usedSquaresX = [],
    usedSquaresY = [];
stillRunning = true;

let player1 = new player(10, 10, ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], 'red');
console.log(player1)
let player2 = new player(12, 12, ['w', 's', 'a', 'd'], 'green')

addCandy();

let now = Date.now()
requestAnimationFrame(hold);



function addCandy() { //game
    cx.fillStyle = 'gold'
    randomX = Math.floor(Math.random() * cx.width)
    randomX = randomX - randomX % scale
    randomY = Math.floor(Math.random() * cx.height)
    randomY = randomY - randomY % scale
    if (usedSquaresX.includes(randomX) && usedSquaresY.includes(randomY)) addCandy()
    else cx.fillRect(randomX, randomY, scale, scale);

}

function endGame() {
    stillRunning = false
    cx.fillStyle = 'lightgray';
    cx.fillRect(0, 0, cx.width, cx.height);
    cx.fillStyle = 'red'
    cx.textAlign = 'center'
    cx.font = "38px Arial";
    cx.fillText("GAME LOST", cx.width / 2, cx.height / 2);
}



function hold(timestamp) { //game
    if (Date.now() - now >= speed && stillRunning) {
        now = Date.now()
        requestAnimationFrame(hold)

        player1.move()
        player2.move()

        player1.colisionCheck()
        player2.colisionCheck()

        if (!usedSquaresX.length) endGame()
        usedSquaresX = [];
        usedSquaresY = [];
    } else if (stillRunning) {
        requestAnimationFrame(hold)
    }

}