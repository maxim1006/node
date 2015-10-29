"use strict";

var http = require("http");
var fav = require("fav");

var server = new http.Server((req, res) => {

    //stop favicon reqs
    if (fav.stop(req, res)) return;

    //console.log(req.headers); //так могу посмотреть все заголовки


    //1ый способ задания заголовков
    res.statusCode = 200;
    res.setHeader('Cash-control', 'no-cash'); //Запрещаю кеширование
    res.setHeader('Content-type', 'text/html;charset=utf-8'); //задаю тип контента и кодировку

    //2ой, отличается от первого тем, что заголовки пишутся тутже, не дожидаясь ближайшей записи (например end())
    /*res.writeHead(200, 'Ok', {
        'Cash-control': 'no-cash',
        'Content-type': 'text/html;charset=utf-8'
    });*/

    //Удалить заголовок res.removeHeader

    res.end('Привет');
});

server.listen('2000');