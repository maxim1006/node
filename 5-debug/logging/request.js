var fav = require("fav");
var debug = require("debug")('server:request');

function request(req, res) {
    if (fav.stop(req, res)) return;

    res.setHeader('Cash-control', 'no-cash'); //Запрещаю кеширование
    res.setHeader('Content-type', 'text/html;charset=utf-8'); //задаю тип контента и кодировку

    res.end("Привет!");

    debug(123);
}

module.exports = request;