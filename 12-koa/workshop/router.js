var koa = require('koa');
var Router = require('koa-router'); //по умолчанию роутера нет

var app = module.exports = koa();

app.use(function* () {
    if (this.request.path === '/') {
        this.response.body = "index";
        this.response.status = 200;
    } else if (this.request.path === '/404') {
        this.response.body = "Not found";
        this.response.status = 404;
    } else if (this.request.path === '/500') {
        this.response.body = "Internal server error";
        this.response.status = 500;
    }

    this.type = 'text/html; charset=utf-8';

    console.log(`%s, %s, %s`, this.request.method, JSON.stringify(this.request.query), this.request.host);
});

app.listen(2000);