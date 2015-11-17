// A "closer to real-life" app example
// using 3rd party middleware modules
// P.S. MWs calls be refactored in many files

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

var koa = require('koa');
var app = koa();

var config = require('config');
var mongoose = require('./libs/mongoose');

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

var path = require('path');
var fs = require('fs');
var middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});

// ---------------------------------------

// can be split into files too
var Router = require('koa-router');

var router = new Router();

router.get('/', require('./routes/frontpage').get);
router.post('/login', require('./routes/login').post);
router.post('/logout', require('./routes/logout').post);
// router.get('/', require('./routes/login').post);

app.use(router.routes());

app.listen(3000);

/*c помощью koa-passport делаю авторизацию, он делает:
*1) создает при любом запросе cookie -> user
* 2) логин / логаут, его логика в 10 middleware
*koa-passport добавляет в this несколько полезных методов, например login или logout
*
* пример регистрации юзера в register.js у Ильи
*
* пример рендеринга ошибок
* https://github.com/iliakan/javascript-nodejs/blob/73d35b9f7b2bcd57311fe20a21988bead8f6fcb8/handlers/errorHandler/index.js
*
* пример ajax авторизации в strategies/localStrategy.js
* /
