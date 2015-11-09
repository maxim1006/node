var koa = require('koa');

var app = module.exports = koa();

app.use(function* () {
    this.body = 'hello world';
    this.status = 200;
    this.type = 'text/html; charset=utf-8';
});

app.listen(2000);