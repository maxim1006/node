var koa = require('koa');
var Router = require('koa-router'); //по умолчанию роутера нет
var fs = require('mz/fs');
//var fs = require('fs');

var app = module.exports = koa();

app
    .use(function* () {
        this.response.body = yield fs.readFile("index1.html");
        this.response.status = 200;
        this.type = 'text/html; charset=utf-8';
        //this.response.length= 1000; //задаю длинну символов ответа в байтах

        console.log(`%s, %s, %s`, this.request.method, JSON.stringify(this.request.query), this.request.host);
    }).
    on("error", console.log);

app.listen(2000);