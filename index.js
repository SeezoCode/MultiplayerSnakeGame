let id = Math.floor(Math.random() * 20)
let url = 'http://localhost:8080/'

class player {
    constructor(x, y, keyboard, name) {
        this.x = x * scale;
        this.y = y * scale;
        this.tailX = [0];
        this.tailY = [0];
        this.ctr = -6;
        this.usedSnakeSpaceX = [];
        this.usedSnakeSpaceY = [];
        this.go = true;
        this.kbd = keyboard;
        this.snakeLength = -this.ctr
        this.color = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;

        this.lastUsed = "";
        this.lastUsedIndex = ""

        this.shift = addEventListener("keydown", event => {
            console.log(event.key)
            if (this.shift && event.key == 'Shift') {
                this.shift = !this.shift;
                speed = speed * 2
            } else if (event.key == 'Shift') {
                this.shift = !this.shift;
                speed = speed / 2
            }
        })

        this.makeDisplay(this.x, this.y);
        this.events()

        this.name = name;
        let elem = document.createElement("p")
        let text = document.createTextNode(`${this.name}, score: ${this.snakeLength + 1}`)
        elem.appendChild(text)
        this.text = document.body.appendChild(elem)
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

            if (event.key == 'Enter') {
                this.go = true
            }
        })
    }


    clearDebris(ctr) {
        cx.clearRect(this.tailX[ctr], this.tailY[ctr], scale, scale)
        if (this.tailX[ctr] == randomX && this.tailY[ctr] == randomY) addCandy(randomX, randomY)
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
                this.snakeLength++
                //addCandy()
                discoveredCandy = true
                this.text.innerHTML = `${this.name}, score: ${this.snakeLength + 1}`;
            }

            if (this.lastUsed == this.kbd[0]) {
                if (this.y <= 0) {
                    this.y = cx.height - scale
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x, this.y -= scale)
            }
            if (this.lastUsed == this.kbd[1]) {
                if (this.y >= cx.height - scale) {
                    this.y = 0
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x, this.y += scale)
            }
            if (this.lastUsed == this.kbd[2]) {
                if (this.x <= 0) {
                    this.x = cx.width - scale
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x -= scale, this.y)
            }
            if (this.lastUsed == this.kbd[3]) {
                if (this.x >= cx.width - scale) {
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
                    this.ctr += this.snakeLength - 1
                    this.snakeLength = 1
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

const scale = 20
let speed = 300
let numOfSnakes = 1
let repeats = 0;
let discoveredCandy = false

stillRunning = true;

//required from server

let usedSquaresX = [],
    usedSquaresY = [];
let serverPlayersX = [], serverPlayersY = [];

let randomX = null,
    randomY = null;


let players = [
    new player(10, 10, ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], 'Player1'),
]

let now = Date.now()
requestAnimationFrame(hold);



function addCandy(x = Math.floor(Math.random() * cx.width), y = Math.floor(Math.random() * cx.height)) { //game

    cx.fillStyle = 'gold'
    randomX = x - x % scale
    randomY = y - y % scale

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


function undrawOtherPlayers() {
    cx.fillStyle = 'white'
    for (let i = 0; i <= serverPlayersX; i++) {
        cx.fillRect(serverPlayersX[i], serverPlayersY[i], scale, scale);
    }
    serverPlayersX = [];
    serverPlayersY = [];
}

function drawOtherPlayers(arrX = [], arrY) {
    
    if (repeats == 150) {
        cx.fillStyle = 'white';
        cx.fillRect(0, 0, cx.width, cx.height)
        repeats = 0;
    } 
    repeats++; 
    undrawOtherPlayers()
    cx.fillStyle = 'gray';
    for (let i = 0; i < arrX.length; i++) {
        cx.fillRect(arrX[i], arrY[i], scale, scale);
    }

    if (players[0].ctr > 12) {
        for (let i = 0; i < arrX.length; i++) {
            if (arrX[i] == players[0].x && arrY[i] == players[0].y) {
                players[0].ctr += players[0].snakeLength - 1
                players[0].snakeLength = 1
                players[0].delSnake()

                players[0].usedSnakeSpaceX = [];
                players[0].usedSnakeSpaceY = [];

                usedSquaresX = null;
                usedSquaresY = null;

                stillRunning = true;
            }
        }
    }

    cx.fillStyle = 'white';
    cx.fillRect(arrX[0], arrY[0], scale, scale);
    cx.fillRect(arrX[1], arrY[1], scale, scale);
}


function hold(timestamp) { //game
    if (Date.now() - now >= speed && stillRunning) {
        now = Date.now()



        for (let player of players) {
            player.move()
        }
        for (let player of players) {
            player.colisionCheck()
        }

        if (!usedSquaresX.length) endGame()

        fetch(url, {
                method: 'POST',
                'content-Type': 'application/json',
                body: JSON.stringify([usedSquaresX, usedSquaresY, id, discoveredCandy]),
                headers: new Headers(),
            })
            .then(response => response.json())
            .then(json => {

                for (let i = 0; i < json[0].length; i++) {
                    if (json[2] != id && json[0][i]) {
                        drawOtherPlayers(json[0][i], json[1][i])
                    }
                }

                for (let i = 0; i < json[0].length; i++) {
                    serverPlayersX.push(json[0][i])
                    serverPlayersY.push(json[1][i])
                }
                addCandy(json[3][0], json[3][1])

            })


        discoveredCandy = false
        usedSquaresX = [];
        usedSquaresY = [];


        requestAnimationFrame(hold)

    } else if (stillRunning) {
        requestAnimationFrame(hold)
    }

}