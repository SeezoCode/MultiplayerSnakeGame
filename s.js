// settings:

let playWithBots = 2            // enter number of bots
let width = 800, height = 500;  // in px
let scale = 20;                 // in px
let speed = 250;                // in ms
//let numberOfMaxPlayers = 5    // to save time, this feature is clunky and sometimes a duplicate ID may occur.
                                // The solution is to reload the page or increase the number



const {
    createServer
} = require('http')
const {
    readFileSync
} = require("fs");
const PF = require("pathfinding");

let print = console.log

let script = readFileSync('index.js', 'utf8')
let htmlFile = readFileSync('index.html', 'utf8')
let finder = new PF.AStarFinder({
    allowDiagonal: false
})

const {
    networkInterfaces
} = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }

            results[name].push(net.address);
        }
    }
}
console.log(`http://${results[Object.keys(results)[0]][0]}:8000`)

class assignID {
    constructor() {
        this.usedIDs = []
    }

    get assignID() {
        for (let i = 0; ; i++) {
            if (!this.usedIDs.includes(i)) {
                this.usedIDs.push(i)
                print("Assigned ID:", i)
                return i
            }
        }
    }
}
let IDAssigner = new assignID()
let file = `    
    let url = "http://${results[Object.keys(results)[0]][0]}:8000"
    let cx = document.querySelector('canvas').getContext('2d');
    const scale = ${scale}
    cx.width = ${width}
    cx.height = ${height}
    let speed = ${speed}
    ${script}</script> `


let id, repeats = 0;
let randomX = null,
    randomY = null;
let playerCount = 0
let nowBot = Date.now()


function addCandy(x = Math.floor(Math.random() * width),
                  y = Math.floor(Math.random() * height)) {

    randomX = x - x % scale
    randomY = y - y % scale

    for (let i = allUsedSpaces.x.length; i >= 0; i--) {
        if (allUsedSpaces.x[i] != null) {
            if (allUsedSpaces.x[i].includes(randomX) && allUsedSpaces.y[i].includes(randomY)) {addCandy();} // print("recursive")
        }
    }
}


function countPlayers(arr) {
    let players
    for (let elem of arr) {
        if (elem != null) {
            players++;
        }
    }

    print(playerCount, players)
    if (players != playerCount) {
        playerCount = players;
        return true
    }
    return false
}

class a {
    constructor() {
        this.x = [];
        this.y = [];
        this.color = []
    }
    pushSnake(arrX, arrY, id, color) {
        this.x[id] = arrX;
        this.y[id] = arrY;
        this.color[id] = color
    }
    getSnake() {
        return JSON.stringify([this.x, this.y]);
    }
    clearUsed() {
        this.x = [];
        this.y = [];
    }
    makeWalls() {
        this.clearUsed();
        this.x[0] = [];
        this.y[0] = [];

        let firstDim = Math.floor(Math.random() * width);
        firstDim -= firstDim % scale
        let secondDim = Math.floor(Math.random() * 30 * scale)
        let pos = Math.floor(Math.random() * 30 * scale)

        if (Math.random() > .95) { // for x
            for (let i = secondDim - secondDim % scale; i >= pos; i -= scale) {
                this.x[0].push(i)
                this.y[0].push(firstDim)
            }
        }
        if (Math.random() < .05) { // for x
            for (let i = secondDim - secondDim % scale; i >= pos; i -= scale) {
                this.x[0].push(firstDim)
                this.y[0].push(i)
            }
        }
    }
}

class botClass {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.length = 4
        this.usedSpaceX = [0 + x, scale + x, 2 * scale + x, 3 * scale + x]
        this.usedSpaceY = [0 + y, 0 + y, 0 + y, 0 + y]
        this.path = []
        this.prolong = false
        this.color = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;
        this.id = IDAssigner.assignID
    }

    move() {
        this.createMatrix()
        let currX = (this.usedSpaceX[this.usedSpaceX.length - 1]) / scale
        let currY = (this.usedSpaceY[this.usedSpaceY.length - 1]) / scale

        this.path = finder.findPath(currX, currY, randomX / scale, randomY / scale, this.grid)
        this.putSnakeToSharedSpace()

        //print(this.path)
        //print(currX, currY)

        //print(this.usedSpaceX, this.usedSpaceY)
        allUsedSpaces.pushSnake(this.usedSpaceX, this.usedSpaceY, this.id, this.color)

    }

    collisionCheck() {

    }

    delSnake() {

    }

    putSnakeToSharedSpace() {
        if (!this.prolong) {
            this.usedSpaceX.shift()
            this.usedSpaceY.shift()
        }
        this.prolong = false

        this.checkCollision(this.path[1][0] * scale, this.path[1][1] * scale)
        this.usedSpaceX.push(this.path[1][0] * scale)
        this.usedSpaceY.push(this.path[1][1] * scale)

        if (this.path[1][0] * scale === randomX && this.path[1][1] * scale === randomY) {
            addCandy()
            this.prolong = true
        }
    }

    createMatrix() {
        this.grid = new PF.Grid(width / scale, height / scale)
        /*
        for (let i = this.usedSpaceX.length - 1; i >= 0; i--) {
            this.grid.setWalkableAt(this.usedSpaceX[i] / scale, this.usedSpaceY[i] / scale, false)
        }
        */

        for (let i = allUsedSpaces.x.length - 1; i >= 0; i--) {
            if (allUsedSpaces.x[i] != null) {
                for (let j = allUsedSpaces.x[i].length - 1; j >= 0; j--) {
                    if (allUsedSpaces.x[i][j] != null) {
                        try {
                            this.grid.setWalkableAt(allUsedSpaces.x[i][j] / scale, allUsedSpaces.y[i][j] / scale, false)
                        }
                        catch (e) {}

                    }
                    //print(allUsedSpaces.x[i])
                }
            }
        }
    }

    makeMatrix() {
        let matrix = []
        for (let col = 0; col <= 25; col++) {
            matrix[col] = []
            for (let row = 0; row <= 25; row++) {
                matrix[col][row] = 0
            }
        }
        print(matrix)
        return matrix
    }

    revive() {
        if (this.usedSpaceX.length > 0) print('Died, score: ', this.usedSpaceX.length)

        let x = Math.floor(Math.random() * width)
        x = x - x % scale
        let y = Math.floor(Math.random() * height)
        y = y - y % scale

        allUsedSpaces.clearUsed()
        this.usedSpaceX = [x, x + scale]
        this.usedSpaceY = [y, y + scale]



        //this.usedSpaceX = [0 + this.x, 20 + this.x, 40 + this.x, 60 + this.x]
        //this.usedSpaceY = [0 + this.y, 0 + this.y, 0 + this.y, 0 + this.y]
    }
    checkCollision(tileX, tileY) {
        for (let i = allUsedSpaces.x.length - 1; i >= 0; i--) {
            if (allUsedSpaces.x[i] != null) {
                for (let j = allUsedSpaces.x[i].length - 1; j >= 0; j--) {
                    if (allUsedSpaces.x[i][j] === tileX && allUsedSpaces.y[i][j] === tileY) {
                        this.revive()
                        print('collision')
                    }
                }
            }
        }
    }
}

let allUsedSpaces = new a();
let bots = []

for (let i = playWithBots; i > 0; i--) {
    let x = Math.floor(Math.random() * width)
    x = x - x % scale
    let y = Math.floor(Math.random() * height)
    y = y - y % scale
    bots.push(new botClass(x, y))
}


addCandy()

const server = createServer();
server.on('request', (request, response) => {

    if (Date.now() - nowBot >= speed - 10) {
        nowBot = Date.now()
        for (bot of bots) {
            try {
                bot.move()
            } catch (e) {
                bot.revive();
                //print(e)
            }
        }
    }

    if (request.method === 'GET') {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.on('error', () => console.log("here"))
        //response.on('end', () => console.log('finish'))
        response.write(htmlFile)
        response.write(`<script>let id = ${IDAssigner.assignID}`)
        response.write(file)
        response.end()
        console.log("A new connection at:", request.connection.remoteAddress)
    }

    if (request.method === 'POST') {
        readStream(request)
    }
    response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    });

    //console.log(JSON.stringify([allUsedSpaces.x, allUsedSpaces.y]))

    response.end(JSON.stringify([allUsedSpaces.x, allUsedSpaces.y, id,
                    [randomX, randomY], Date.now(), allUsedSpaces.color]))

    if (repeats === 50) {
        //allUsedSpaces.makeWalls()
        //print(allUsedSpaces)
        repeats = 0
    }
    repeats++;
    //print("new connection")
}).listen(8000);


function readStream(stream) {
    return new Promise((resolve, reject) => {
        let data = "";
        stream.on("error", reject);
        stream.on("data", chunk => data += chunk.toString());
        stream.on("end", () => {
            resolve(data);
            data = JSON.parse(data)

            if (data[3]) {
                addCandy()
            }

            if (!data[0]) {
                allUsedSpaces.x = []
                allUsedSpaces.y = []
                print('reset')
            }

            id = data[2]

            allUsedSpaces.pushSnake(data[0], data[1], data[2], data[4]);

            //console.log(allUsedSpaces)
        });
    });
}



