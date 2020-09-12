const {
    createServer
} = require('http')
let allUsedSpaces = {
    x: [],
    y: [],
}
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
        allUsedSpaces.x = [];
        allUsedSpaces.y = [];
    }

}).listen(8080);


function readStream(stream) {
    return new Promise((resolve, reject) => {
        let data = "";
        stream.on("error", reject);
        stream.on("data", chunk => data += chunk.toString());
        stream.on("end", () => {
            resolve(data);
            allUsedSpaces.x = allUsedSpaces.x.concat(0, 0, JSON.parse(data).x);
            allUsedSpaces.y = allUsedSpaces.y.concat(0, 0, JSON.parse(data).y);

        });
    });
}