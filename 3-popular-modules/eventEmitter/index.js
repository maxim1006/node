//обработчики отрабатывают в том же порядке в котором навешаны, в отличие от браузерных, которые срабатывают в произвольном

var EventEmitter = require('events').EventEmitter;

var server = new EventEmitter();

var cb = (request) => {
    request.approved = true;
};

server.on('request', cb);

server.on('request', (request) => {
    console.log(request);
});

//так удаляю обработчик, обязательно с cb
server.removeListener('request', cb);

server.emit('request', {from: 'client'});

server.emit('request', {from: 'another client'});

/*********************/
server.on('error', (err) => {
    console.log(err);
});
server.emit('error', new Error('какая-то ошибка')); //если у события error нет обработчика, то генерируется исключение
/*********************/

//чтобы посмотреть сколько памяти съедается делаю process.memoryUsage().heapUsed
console.log(process.memoryUsage().heapUsed);

//По умолчанию макс. число обработчиков = 10; отключить это условие можно при помощи server.setMaxListeners(0);
//server.setMaxListeners(0);

//для проверки утечек можно использовать heapDump модуль
