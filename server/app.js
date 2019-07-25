const http = require("http");
const fs = require("fs");
const path = require("path");

const mongoConnect = require('./database').mongoConnect;
const API = require('./api.js');

const PORT = 2000;
const IP = "127.0.0.1";

mongoConnect();
    http
      .createServer((req, res) => {
    
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
        let api = req.url;
        if(API.catchApiRequest(api)) {
           return API.exec(req, res);
        }

        //handle non api calls
        return API.execNonApi(req, res);



      })
      .listen(PORT, IP);


//   if(type == 'text/html') {
//     fs.readFile(file, (err, data) => {
//       if (err) {
//         if (err.code == "ENOENT") {
//           fs.readFile("./404.html", (err, data) => {
//             res.writeHead(200, { "Content-Type": type });
//             res.end(data, "utf-8");
//           });
//         } else {
//           fs.readFile("./500.html", (err, data) => {
//             res.writeHead(500, { "Content-Type": type });
//             res.end(data, "utf-8");
//           });
//         }
//       } else {
//         res.writeHead(200, { "Content-Type": type });
//         res.end(data, "utf-8");
//       }
//     });
// } else {
//     let filePath = path.join(__dirname, file);
//     let readStream = fs.createReadStream(filePath).on('error', (err) => {
//         console.log(err);
//     });
//     res.writeHead(200, {'Content-Type': type})
//     readStream.pipe(res);
// }