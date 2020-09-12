class player {
    constructor(x, y, keyboard, name) {
        this.x = x * scale;
        this.y = y * scale;
        this.usedSnakeSpaceX = [0];
        this.usedSnakeSpaceY = [0];
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
        

        //drawOtherPlayers(this.usedSnakeSpaceX, this.usedSnakeSpaceY)

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
                    console.log('left');
                    directionX = event.changedTouches['0'].clientX;
                    this.lastUsedIndex = this.kbd[2]
                }
                if (directionX - event.changedTouches['0'].clientX < -50 && this.lastUsed != this.kbd[2]) {
                    console.log('right');
                    directionX = event.changedTouches['0'].clientX;
                    this.lastUsedIndex = this.kbd[3]
                }
                if (directionY - event.changedTouches['0'].clientY > 50 && this.lastUsed != this.kbd[1]) {
                    console.log('up');
                    directionY = event.changedTouches['0'].clientY;
                    this.lastUsedIndex = this.kbd[0]
                }
                if (directionY - event.changedTouches['0'].clientY < -50 && this.lastUsed != this.kbd[0]) {
                    console.log('down');
                    directionY = event.changedTouches['0'].clientY;
                    this.lastUsedIndex = this.kbd[1]
                }
                document.body.removeEventListener('touchmove', event)
            })
        })
    }


    clearDebris(ctr) {
        cx.clearRect(this.usedSnakeSpaceX[ctr], this.usedSnakeSpaceY[ctr], scale, scale)
        if (this.usedSnakeSpaceX[ctr] == randomX && this.usedSnakeSpaceY[ctr] == randomY) addCandy(randomX, randomY)
    }


    move() { //player
        if (this.go) {
            this.lastUsed = this.lastUsedIndex
            this.ctr++
            this.usedSnakeSpaceX.push(this.x)
            this.usedSnakeSpaceY.push(this.y)


            for (let i = this.ctr; i < this.usedSnakeSpaceX.length; i++) {
                locallyUsedSquaresX.push(this.usedSnakeSpaceX[i])
                locallyUsedSquaresY.push(this.usedSnakeSpaceY[i])
            }

            if (this.x == randomX && this.y == randomY) {
                this.ctr--;
                this.snakeLength++
                this.text.innerHTML = `${this.name}, score: ${this.snakeLength + 1}`;

                addCandy()
            }

            if (this.lastUsed == this.kbd[0]) {
                this.clearDebris(this.ctr)
                if (this.y <= 0) {
                    this.y = cx.height - scale
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x, this.y -= scale)
            }
            if (this.lastUsed == this.kbd[1]) {
                this.clearDebris(this.ctr)
                if (this.y >= cx.height - scale) {
                    this.y = 0
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x, this.y += scale)
            }
            if (this.lastUsed == this.kbd[2]) {
                this.clearDebris(this.ctr)
                if (this.x <= 0) {
                    this.x = cx.width - scale
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x -= scale, this.y)
            }
            if (this.lastUsed == this.kbd[3]) {
                this.clearDebris(this.ctr)
                if (this.x >= cx.width - scale) {
                    this.x = 0
                    this.makeDisplay(this.x, this.y)
                } else this.makeDisplay(this.x += scale, this.y)
            }
        }
    }


    colisionCheck() {
        if (this.ctr > 12) {
            for (let i = 0; i < locallyUsedSquaresX.length; i++) {
                if (locallyUsedSquaresX[i] == this.x && locallyUsedSquaresY[i] == this.y) {
                    this.ctr += this.snakeLength - 1
                    this.snakeLength = 1
                    this.text.innerHTML = `${this.name}, score: ${this.snakeLength + 1}`;

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
            locallyUsedSquaresX.filter(element => this.usedSnakeSpaceX[i] != element)
            locallyUsedSquaresY.filter(element => this.usedSnakeSpaceY[i] != element)
            this.go = false
            this.text.innerHTML = `${this.name}, score: Dead`;

        }
    }
}


//needed to run the game

let cx = document.querySelector('canvas').getContext('2d');
cx.width = 500
cx.height = 500

const scale = 20
let speed = 1000

stillRunning = true;

//required from server

let locallyUsedSquaresX = [],
    locallyUsedSquaresY = [];



let players = [
    new player(Math.floor(Math.random() * cx.width / scale), Math.floor(Math.random() * cx.height / scale), ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], 'Player1')
]

addCandy();

let now = Date.now()
requestAnimationFrame(hold);



function addCandy(x = Math.floor(Math.random() * cx.width), y = Math.floor(Math.random() * cx.height)) { //game
    cx.fillStyle = 'gold'
    randomX = x - x % scale
    randomY = y - y % scale

    if (locallyUsedSquaresX.includes(randomX) && locallyUsedSquaresY.includes(randomY)) addCandy()
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


function drawOtherPlayers(arrX, arrY) {
    for (let i = 0; i < arrX.length; i++) {
        cx.fillStyle = 'gray';
        cx.fillRect(arrX[i], arrY[i], scale, scale);
    }
    cx.fillStyle = 'white';
    cx.fillRect(arrX[0], arrY[0], scale, scale);
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

        if (!locallyUsedSquaresX.length) endGame()

        let locallyUsedSquares = {
            x: locallyUsedSquaresX,
            y: locallyUsedSquaresY
        }


        fetch('http://localhost:8080/', {
                method: 'POST',
                'content-Type': 'application/json',
                body: JSON.stringify(locallyUsedSquares),
                headers: new Headers(),
            })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                drawOtherPlayers(json.x, json.y)
                locallyUsedSquaresX = json.x;
                locallyUsedSquaresY = json.y;
            })


        cx.fillStyle = 'white';
        //cx.fillRect(0, 0, cx.width, cx.height)

        requestAnimationFrame(hold)

    } else if (stillRunning) {
        
        requestAnimationFrame(hold)
    }

}