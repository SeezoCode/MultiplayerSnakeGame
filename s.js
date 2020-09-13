const {
    createServer
} = require('http')

let id
let idList = []


function makeId() {

        idList.push(0)
        id = 0
    
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

    response.end(JSON.stringify([allUsedSpaces.x, allUsedSpaces.y, id]))

    if (Date.now() - now > 300) {
        //allUsedSpaces.clearUsed()
        now = Date.now()
    }


}).listen(8080);


function readStream(stream) {
    return new Promise((resolve, reject) => {
        let data = "";
        stream.on("error", reject);
        stream.on("data", chunk => data += chunk.toString());
        stream.on("end", () => {
            resolve(data);
            data = JSON.parse(data)

            for (let i = -1; i <= data[2]; i++) {
                //data[0].shift()
                //data[1].shift()
            }

            id = data[2]

            allUsedSpaces.pushSnake(data[0], data[1], data[2]);

            //console.log(allUsedSpaces)
        });
    });
}

