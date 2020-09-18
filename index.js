let id = Math.floor(Math.random() * 20) + 1
let url = 'http://192.168.1.135:8080/'

class player {
    constructor(x, y, keyboard, name) {
        this.x = x * scale;
        this.y = y * scale;
        this.tailX = [];
        this.tailY = [];
        this.ctr = -6;
        this.usedSnakeSpaceX = [];
        this.usedSnakeSpaceY = [];
        this.go = true;
        this.kbd = keyboard;
        this.snakeLength = -this.ctr
        this.color = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;

        this.lastUsed = "";
        this.lastUsedIndex = ""

        this.makeDisplay(this.x, this.y);
        this.events()

        this.name = name;
        let elem = document.createElement("p")
        let text = document.createTextNode(`${this.name}, score: ${this.snakeLength + 1}`)
        elem.appendChild(text)
        this.text = document.body.appendChild(elem)

        let elem2 = document.createElement("p")
        let showableSpeed = document.createTextNode(`speed: ${speed}`)
        elem2.appendChild(showableSpeed)
        this.showableSpeed = document.body.appendChild(elem2)

        //this.changeSpeedLimited()
        this.changeSpeed()
    }


    makeDisplay(x, y) {
        cx.fillStyle = this.color;
        cx.fillRect(x, y, scale, scale);
    }


    changeSpeedLimited() {
        this.shift = addEventListener("keydown", event => {
            console.log(event.key)
            if (this.shift && event.key == 'Shift') {
                this.shift = !this.shift;
                speed = speed * 2
                this.showableSpeed.innerHTML = `speed: ${speed}`
            } else if (event.key == 'Shift') {
                this.shift = !this.shift;
                speed = speed / 2
                this.showableSpeed.innerHTML = `speed: ${speed}`
            }
        })
    }

    changeSpeed() {
        addEventListener("keydown", event => {
            console.log(event.key)
            if (event.key == 'Control') { // this.shift && 
                //this.shift = !this.shift;
                speed += 30

                if (speed > 600) {
                    speed = 600;
                }
                this.showableSpeed.innerHTML = `speed: ${speed}`
            } else if (event.key == 'Shift') {
                //this.shift = !this.shift;
                speed -= 50
                if (speed < 50) {
                    speed = 50
                }
                this.showableSpeed.innerHTML = `speed: ${speed}`
            }
        })
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

        document.body.addEventListener("touchstart", event => {
            let directionX = event.changedTouches['0'].clientX,
                directionY = event.changedTouches['0'].clientY;

            // if (!this.go) this.go = true;


            document.body.addEventListener("touchmove", event => {

                if (directionX - event.changedTouches['0'].clientX > 50 && this.lastUsed != this.kbd[3]) {
                    console.log('left'), directionX = event.changedTouches['0'].clientX;
                    this.lastUsedIndex = this.kbd[2]
                }
                if (directionX - event.changedTouches['0'].clientX < -50 && this.lastUsed != this.kbd[2]) {
                    console.log('right'), directionX = event.changedTouches['0'].clientX;
                    this.lastUsedIndex = this.kbd[3]
                }
                if (directionY - event.changedTouches['0'].clientY > 50 && this.lastUsed != this.kbd[1]) {
                    console.log('up'), directionY = event.changedTouches['0'].clientY;
                    this.lastUsedIndex = this.kbd[0]
                }
                if (directionY - event.changedTouches['0'].clientY < -50 && this.lastUsed != this.kbd[0]) {
                    console.log('down'), directionY = event.changedTouches['0'].clientY;
                    this.lastUsedIndex = this.kbd[1]
                }
                document.body.removeEventListener('touchmove', event)
            })
        })
    }


    clearDebris(ctr) {
        cx.clearRect(this.tailX[ctr], this.tailY[ctr], scale, scale)
        if (this.tailX[ctr] == randomX && this.tailY[ctr] == randomY) addCandy(randomX, randomY)
    }


    move() { //player
        if (roundsToReset > 30) {
            cx.fillStyle = 'white'
            cx.fillRect(0, 0, cx.width, cx.height)
            roundsToReset = 0
        }
        roundsToReset++;

        if (this.go) {
            this.lastUsed = this.lastUsedIndex
            this.ctr++
            this.tailX.push(this.x)
            this.tailY.push(this.y)


            for (let i = this.ctr; i <= this.tailX.length; i++) {
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
const scale = 20
cx.width = 20 * 25
cx.height = 20 * 25

let speed = 300
let numOfSnakes = 1
let repeats = 0;
let discoveredCandy = false
let fetched = false;
let stillRunning = true;
let roundsToReset = 0;

let elem = document.createElement("p")
let text = document.createTextNode(`ping: `)
elem.appendChild(text)
text = document.body.appendChild(elem)

//required from server

let usedSquaresX = [],
    usedSquaresY = [];
let serverPlayersX = [],
    serverPlayersY = [];

let randomX = null,
    randomY = null;

let playerCount = [1, 1]


let players = [
    new player(4, 4, ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], 'You'),
]

let now = Date.now()
let now2 = Date.now()
requestAnimationFrame(hold);



function addCandy(x = Math.floor(Math.random() * cx.width), y = Math.floor(Math.random() * cx.height)) { //game

    cx.fillStyle = 'gold'
    randomX = x - x % scale
    randomY = y - y % scale

    try {
        if (usedSquaresX.includes(randomX) && usedSquaresY.includes(randomY)) addCandy()
        else cx.fillRect(randomX, randomY, scale, scale);
    }
    catch (err) {endGame()}
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



function undrawOtherPlayers(arrX, arrY) {
    cx.fillStyle = 'white'

    for (let i = 0; i < arrX.length; i++) {
        //needs to loop one more time
        for (let j = 0; j < arrX.length; j++) {
            cx.fillRect(arrX[i][j], arrY[i][j], scale, scale);
            //console.log(111, arrX);
        }
    }
    serverPlayersX = [];
    serverPlayersY = [];
}



function drawOtherPlayers(arrX = [], arrY) {
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
    //cx.fillStyle = 'white';
    //cx.fillRect(arrX[0], arrY[0], scale, scale);
    //cx.fillRect(arrX[1], arrY[1], scale, scale);
}


function fetchOK() {
    fetched = false;
    fetch(url, {
            method: 'POST',
            'content-Type': 'application/json',
            body: JSON.stringify([usedSquaresX, usedSquaresY, id, discoveredCandy]),
            headers: new Headers(),
        })
        .then(response => response.json())
        .then(json => { //console.log(json)
            for (let i = 0; i < json[0].length; i++) {
                if (json[0][i]) {
                    undrawOtherPlayers(serverPlayersX, serverPlayersY)
                    drawOtherPlayers(json[0][i], json[1][i])
                }
            }

            for (let i = json[0].length; i >= 0; i--) {
                if (json[0][i] != null && json[0][i].length > 1) {
                    serverPlayersX.push(json[0][i]);
                    serverPlayersY.push(json[1][i]);
                    //console.log(serverPlayersX);
                }
            }

            addCandy(json[3][0], json[3][1])
            text.innerHTML = `ping: ${Date.now() - json[4]}`
        })

    fetched = true
}


function checkAmmounthOfPlayers() {
    if (playerCount[1] != playerCount[0]) {
        if (repeats > 2) {
            cx.fillStyle = 'white';
            cx.fillRect(0, 0, cx.width, cx.height)
            playerCount[1] = playerCount[0]
            repeats = 0
        } else repeats = 0;
        repeats++;

    }
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

        fetchOK()
        //checkAmmounthOfPlayers()

        console.log(playerCount[0])

        discoveredCandy = false
        usedSquaresX = [];
        usedSquaresY = [];
        //playerCount[0] = 0;

        requestAnimationFrame(hold)

    } else if (stillRunning) {
        if (Date.now() - now2 >= speed / 2 && false) {
            fetchOK()
            now2 = Date.now()
        }
        requestAnimationFrame(hold)
    }
}

// undrawOtherPlayers seemingly does nothing