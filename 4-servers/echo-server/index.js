"use strict";

var http = require('http');
let url = require('url'); //встроенный модуль для работы с url

var server = new http.Server();

server.listen(2000);

server.on('request', (req, res) => {
    res.writeHead(200, {'Content-type': 'text/plain;charset=utf-8'});

    let urlParsed = url.parse(req.url, true); //если 2ой аргумент в тру, то метод разберет свойство query в объект

    if (urlParsed.pathname === '/echo' && urlParsed.query.method) {
        res.end(urlParsed.query.method);
    } else {
        res.statusCode = 404;
        res.end("Page not found");
    }

    //console.log(req.method, req.url); //GET /echo?method=hello
});

//Эхо сервер при запросе на url с параметром http://localhost:20/echo?message=Hello выдает значение параметра message, а на все другие запросы отвечает не найдено