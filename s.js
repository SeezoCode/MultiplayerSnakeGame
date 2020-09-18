const {
    createServer
} = require('http')
const {
    readFileSync
} = require("fs");

let print = console.log

let script = readFileSync('index.js', 'utf8')
let htmlFile = readFileSync('index.html', 'utf8')

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
console.log(results)

let file = `
    ${htmlFile}
    <script>${script}</script>`


let id, repeats = 0;
let randomX = null,
    randomY = null;
let scale = 20;
let playerCount = 0
let width = 500, height = 500;

function addCandy(x = Math.floor(Math.random() * 500), y = Math.floor(Math.random() * 500)) { //game

    randomX = x - x % scale
    randomY = y - y % scale

    if (allUsedSpaces.x.includes(randomX) && allUsedSpaces.y.includes(randomY)) addCandy()
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
    }
    pushSnake(arrX, arrY, id) {
        this.x[id] = arrX;
        this.y[id] = arrY;
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
                this.x.push(firstDim)
                this.y.push(i)
            }
        }
    }
}
let allUsedSpaces = new a();
addCandy()

const server = createServer();
server.on('request', (request, response) => {
    if (request.method === 'GET') {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.on('error', () => console.log("here"))
        //response.on('end', () => console.log('finish'))
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

    response.end(JSON.stringify([allUsedSpaces.x, allUsedSpaces.y, id, [randomX, randomY], Date.now()]))

    if (repeats == 50) {
        allUsedSpaces.makeWalls()
        print(allUsedSpaces)
        repeats = 0
    }
    repeats++;
    //print("new connection")
}).listen(8080);


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

            allUsedSpaces.pushSnake(data[0], data[1], data[2]);

            //console.log(allUsedSpaces)
        });
    });
}