const {
    createServer
} = require("http");
const {
    readFileSync
} = require("fs");


let file = readFileSync("index.html", "utf8")

createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });

    response.write(file);

    response.writeHead(200, {
        'Content-Type': 'text/javascript'
    });

    response.end();



}).listen(8000);


class Matrix {
    constructor(width, height, element = (x, y) => undefined) {
        this.width = width;
        this.height = height;
        this.content = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.content[y * width + x] = element(x, y);
            }
        }
    }

    get(x, y) {
        return this.content[y * this.width + x];
    }
    set(x, y, value) {
        this.content[y * this.width + x] = value;
    }
    
}


let matrix = new Matrix(50, 50);

function newPlayer() {
    matrix.set(Math.floor(Math.random() * matrix.width), Math.floor(Math.random() * matrix.height), true);
}