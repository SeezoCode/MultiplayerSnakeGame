const {
    createServer
} = require("http");
const {
    readFileSync
} = require("fs");

var {parse} = require("url");

module.exports = class Router {
  constructor() {
    this.routes = [];
  }
  add(method, url, handler) {
    this.routes.push({method, url, handler});
  }
  resolve(context, request) {
    let path = parse(request.url).pathname;

    for (let {method, url, handler} of this.routes) {
      let match = url.exec(path);
      if (!match || request.method != method) continue;
      let urlParts = match.slice(1).map(decodeURIComponent);
      return handler(context, ...urlParts, request);
    }
    return null;
  }
};



let file = readFileSync("index.html", "utf8")
let script = readFileSync("../MultiplayerSnakeGame/index.js", "utf8")

let server = createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write(file);
    response.end(`<script>${script}</script>`);

    if (request.method === 'POST') {
        readStream(request)
    }

}).listen(8000);


function readStream(stream) {
    return new Promise((resolve, reject) => {
        let data = "";
        stream.on("error", reject);
        stream.on("data", chunk => data += chunk.toString());
        stream.on("end", () => {
            resolve(data), console.log(data)
        });
    });
}

