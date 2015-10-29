"use strict";

let http = require("http");
let fs = require("fs");
let url = require("url");
let path = require("path");
let fav = require("fav");
let mime = require("mime");


var server = new http.Server();

let ROOT = __dirname;

server.on('request', (req, res) => {
    //stop favicon reqs
    if (fav.stop(req, res)) return;

    if (!checkAccess(req)) {
        res.statusCode = 403;
        res.end("Tell me a password");
        return;
    }

    sendFileSafe(url.parse(req.url).pathname, res);
});

server.listen(2000);

function checkAccess(req) {
    return url.parse(req.url, true).query.secret == "max";
}

function sendFileSafe(filePath, res) {


    try {
        filePath = decodeURIComponent(filePath); //декодирую символы из Url и если ок то иду дальше
    } catch(e) {
        res.statusCode = 400;
        res.end("Bad request");
        return;
    }

    if (filePath.includes("\0")) { //проверка на нулевой байт
        res.statusCode = 400;
        res.end("Bad request");
        return;
    }

    filePath = path.normalize(path.join(ROOT, filePath)); //normalize - удаляет из пути // ... и остальные странные вещи
    //console.log(filePath); //C:\Projects\NODE\node\8-fs\server\gif.gif
    //console.log(ROOT); //C:\Projects\NODE\node\8-fs\server

    if (!filePath.startsWith(ROOT)) { //проверка что путь к файлу начинается с этого пути
        res.statusCode = 404;
        res.end("File not found");
        return;
    }

    fs.stat(filePath, (err, stats) => { //проверяю наличие файла и то что это вообще файл
        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("File not found");
            return;
        }
    });

    sendFile(filePath, res);
}

function sendFile(filePath, res) {
    /*Основная проблема этого метода - память, так как сперва весь файл будет считан и положен в буфер, если файл большой - это убьет нашу память, поэтому надо использовать потоки*/
    fs.readFile(filePath, (err, content) => {
        if (err) throw err;

        let mimeFilePath = mime.lookup(filePath);

        res.setHeader("Content-type", mimeFilePath + "; charset=utf-8");

       // console.log(mime); //image/gif

        res.end(content);
    });
}