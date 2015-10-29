"use strict";

var http = require("http");
var debug = require("debug")('server'); //второй аргумент = иеднтификатор, которым дебаг метит весь вывод из данного файла


let server = new http.Server();


server.on("request", require("./request"));

server.listen(2000);

debug("debug");

/*
* модуль debug - использую для логгирования
*
* для того чтобы инфа из дебага выводилась, нужно установить переменную окружения
* set Debug=server:*
* */

