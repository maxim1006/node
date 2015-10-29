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
        //info = fs.readFileSync('index.html'); //это синхронный метод обработки, блокирующий работу js, в синхронном коде ошибку ловлю с помощью try/catch

        fs.readFile('index.html', (err, info) => { //если файл прочтен успешно, то err === null, а в инфо результат (асинхронно)
            if (err) {
                res.statusCode = 500;
                console.log(err);
                res.end('На сервере произошла ошибка');
                return;
            }

            res.end(info);
        });

    } else if (req.url === "/now") {
        res.end(new Date().toString());
    }

});

server.listen(2000);