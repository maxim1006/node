// Typical middleware examples
// middleware - это generator function, которые записываются в app.use()

var koa = require('koa');
var fs = require('mz/fs');
var app = koa();

// 1. Wrap into a meta function (count time, catch errors...)
app.use(function* (next) {
    console.log('--> request start', this.url);

    var time = new Date();

    //middleware данного типа работают так: сперва все что идет до этого yield, затем вызывается next и выполняется следующий middleware, а когда он закончится, то управление вернется в этот и выполнится все что после этого yield
    yield* next;

    time = new Date() - time;

    console.log('<-- request end', time, 'ms');
    // node.js finished, but...
    // response body may be not yet fully sent out,
    // use on-finished for that (or see koa-logger how to track full body length)
});

// 2. Add goodies to this (or this.request/response, but not req/res) - это middleware помощник, он тупо добавляет какую-то функциональность в this, и передает выполнение дальше
app.use(function* (next) {
    console.log('--> add useful method to this');

    this.renderFile = function* (file) { // просто function без * - ошибка!
        this.body = yield fs.readFile(file, 'utf-8');
    };

    yield* next;
});

// 3. Do the work, assign this.body (or throw)
app.use(function* (next) {
    console.log('--> work, work!');

    if (this.url != '/') {
        this.throw(404);
    }

    /*Если поставить this.respond = true, то коа не будет ничего отсылать, а так как у нас есть this.req, this.res, то мы на низком уровне можем сами все сдалать*/

    yield* this.renderFile(__filename); // если без yield, то не сработает!

    console.log('<-- work complete, body sent!');
});

app.listen(2000);
