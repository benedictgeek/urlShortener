const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 2000;
const IP = "127.0.0.1";

http
  .createServer((req, res) => {
    let file = req.url;
    console.log(file);
    if (file == "/") {
      file = "./index.html";
    }

    let extension = String(path.extname(file).toLocaleLowerCase());

    let mime = { ".html": "text/html", ".css": "text/css" };

    let type = mime[extension] || "application/octet-stream";

    if(type == 'text/html') {
        fs.readFile(file, (err, data) => {
          if (err) {
            if (err.code == "ENOENT") {
              fs.readFile("./404.html", (err, data) => {
                res.writeHead(200, { "Content-Type": type });
                res.end(data, "utf-8");
              });
            } else {
              fs.readFile("./500.html", (err, data) => {
                res.writeHead(500, { "Content-Type": type });
                res.end(data, "utf-8");
              });
            }
          } else {
            res.writeHead(200, { "Content-Type": type });
            res.end(data, "utf-8");
          }
        });
    } else {
        let filePath = path.join(__dirname, file);
        let readStream = fs.createReadStream(filePath).on('error', (err) => {
            console.log(err);
        });
        res.writeHead(200, {'Content-Type': type})
        readStream.pipe(res);
    }

  })
  .listen(PORT, IP);
