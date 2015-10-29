'use strict';

let http = require('http');

let server = new http.Server(); //сервер - это EventEmitter

//задаю порт и ip
server.listen(3001, () => console.log("ONLINE!"));

var counter = 0;

//на входящий запрос формируется событие request
//2 тика на счетчик из-за того, что браузер делает доп запрос за фавиконкой
server.on('request', (req, res) => {
    res.writeHead(200, {'Content-type': 'text/plain;charset=utf-8'});
    res.end("Привет мир!" + ++counter);
});

//Так как сервер = eventEmitter, то могу посмотреть все события которые на нем происходят,
//в событиях сервера 2 connection и куча request, так как браузер открывает соединение и пытается
//использовать его по максимуму (keep Alive)
var emit = server.emit;
server.emit = function(event) {
    console.log(event);
    emit.apply(server, arguments);
};