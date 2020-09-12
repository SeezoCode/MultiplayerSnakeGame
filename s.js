const {
    createServer
} = require('http')


class a {
    constructor() {
        this.x = [];
        this.y = [];
    }
    pushSnake(id, arrX, arrY) {
        this.x[id] = arrX;
        this.y[id] = arrY;
    }
    getSnake() {
        return JSON.stringify(this.x, this.y);
    }
    clearUsed() {
        this.x = [];
        this.y = [];
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

    response.end(JSON.stringify(allUsedSpaces))

    if (Date.now() - now >= 1000) {
        now = Date.now();
        allUsedSpaces.clearUsed()
    }

}).listen(8080);


function readStream(stream) {
    return new Promise((resolve, reject) => {
        let data = "";
        stream.on("error", reject);
        stream.on("data", chunk => data += chunk.toString());
        stream.on("end", () => {
            resolve(data);
            allUsedSpaces.pushSnake(JSON.parse(data).id, JSON.parse(data).x, JSON.parse(data).y);
            //console.log(allUsedSpaces)
        });
    });
}