"use strict";

let http = require("http");
let fs = require("fs");

let server = new http.Server();

server.on("request", (req, res) => {
    let info;

    /* res.statusCode = 200;*/
    res.setHeader('Cash-control', 'no-cash');
    res.setHeader('Content-type', 'text/html;charset=utf-8');

    if (req.url === "/") {

        try {
            info = fs.readFileSync('ind1ex.html');
        } catch (err) {
            res.statusCode = 500;
            console.log(err);
            res.end('На синхронном сервере произошла ошибка');
            return;
        }

        res.end(info);

    }

});

server.listen(2000);