"use strict";

// A "closer to real-life" app example
// using 3rd party middleware modules
// P.S. MWs calls be refactored in many files

//для защиты ноды использую cloudflare

//для запросов использую co-request
//для тестов использую co-mocha


// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
    require('./libs/trace'); //модуль для асинхронных стек трейсов
}

var koa = require('koa');
var app = koa();

var config = require('config');

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret]; //используется для подписи кук, чтобы гарантировать, что кука была поставлена нами

var path = require('path');
var fs = require('fs');
var middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
var templatesPath = path.join(__dirname, 'templates');

middlewares.forEach(function (middleware) {
    app.use(require('./middlewares/' + middleware));
});

// ---------------------------------------

// can be split into files too
var Router = require('koa-router');

var router = new Router();

router.get('/views', function* (next) {

    /*var n = this.session.views || 0;
    this.session.views = ++n;*/

    this.body = this.render(path.join(templatesPath , '/index.jade'), {
        user: 'John',
        count: 3
    });

    yield* next;
});

router.get('/', function* (next) {
    this.redirect('/views');
});

app
    .use(router.routes());

app.listen(2000);
