"use strict";

let http = require("http");
let fs = require("fs");
let fav = require("fav");
let mime = require("mime");
let chat = require("./chatObj");
let server = new http.Server();

server.on("request", (req, res) => {

    if (fav.stop(req, res)) return;

    let mimeFilePath = mime.lookup("index.html");
    res.setHeader("Content-type", mimeFilePath + "; charset=utf-8");

    if (req.url === "/") {
        sendFile("index.html", res);
    } else if(req.url === "/subscribe") {
        chat.subscribe(req, res);
    } else if(req.url === "/publish") {
        let body = '';

        req
            .on("readable", () => {
                body += req.read();

                //проверка на размер body
                if (body.length > 1e4) {
                    res.statusCode = 413; //тело запроса слишком большого
                    res.end("Your message is too big for this chat");
                }
            })
            .on("end", () => {
                //проверка на галимый JSON
                try {
                    body = JSON.parse(body);
                } catch(e) {
                    res.statusCode = 400; //Bad request
                    res.end("Bad request");
                    return;
                }

                chat.publish(body.message);
                res.end("ok");
            });

    } else {
        res.statusCode = 404;
        res.end("Not found");
    }
});


function sendFile(fileName, res) {
    var fileStream = fs.createReadStream(fileName);
    fileStream
        .on('error', function() {
            res.statusCode = 500;
            res.end("Server error");
        })
        .pipe(res)
        .on('close', function() {
            fileStream.destroy();
        });
}

server.listen(2000);