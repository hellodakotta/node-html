const http = require("http");
const fs = require('fs');
const path = require('path');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} by method ${req.method}`);
    if (req.method === 'GET') {
        let fileUrl;
        if (req.url === '/') {
            fileUrl = 'index.html'
        } else {
            fileUrl = req.url;
        }

        let filePath = path.resolve(`./public/${fileUrl}`);
        const fileExt = path.extname(filePath);
        if (fileExt === '.html') {
            fs.exists(filePath, (exists) => {
                res.setHeader('Content-Type', 'text/html');
                if (!exists) {
                    res.statusCode = 404;
                    res.end(`<html><body><h1>Error 404: ${fileUrl} not found.</h1></body></html>`);
                }
                res.statusCode = 200;
                var readStream = fs.createReadStream(filePath);
                readStream.on('open', function () {
                    readStream.pipe(res);
                });

                readStream.on('error', function(err) {
                    res.end(err);
                });

            })
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 404;
            res.end(`<html><body><h1>Error 404: ${fileUrl} not an HTML file.</h1></body></html>`);
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<html><body><h1>Error 404: ${req.method} is not supported.</h1></body></html>`);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
});