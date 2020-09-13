const {
    createServer
} = require('http')

let id, repeats = 0;
let randomX = null, randomY = null;
let scale = 20;

function addCandy(x = Math.floor(Math.random() * 500), y = Math.floor(Math.random() * 500)) { //game

    randomX = x - x % scale
    randomY = y - y % scale

    if (allUsedSpaces.x.includes(randomX) && allUsedSpaces.y.includes(randomY)) addCandy()
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
        this.x = [0];
        this.y = [0];
    }
}
let allUsedSpaces = new a();
addCandy()

let now = Date.now()

const server = createServer();
server.on('request', (request, response) => {

    if (request.method === 'POST') {
        readStream(request)
    }
    response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    });

    //console.log(JSON.stringify([allUsedSpaces.x, allUsedSpaces.y]))

    response.end(JSON.stringify([allUsedSpaces.x, allUsedSpaces.y, id, [randomX, randomY]]))

    if (repeats == 80) {
        allUsedSpaces.x = []
        allUsedSpaces.y = []
        repeats = 0
    }
    repeats++;
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

            id = data[2]

            allUsedSpaces.pushSnake(data[0], data[1], data[2]);

            //console.log(allUsedSpaces)
        });
    });
}