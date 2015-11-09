// The simplest example of Koa
// middleware - это generator function, которые записываются в app.use()

var koa = require('koa');

var app = koa();

/**
 * в доках можно посмотеть алиасы для request и response, все эти алиасы - методы, которые могу использовать для управления запросами и ответами
 *
 * Основные объекты:
 * this.req / this.res
 * this.request / this.response - обертки над req, res, с доп методами
 * this (контекст)
 *
 * Основные методы:
 * this.set/get this.get - ищет заголовок в запросе, this.set - в ответе
 * this.body=
 */
app.use(function*() {

  /* sleep(1000); */
  yield function(callback) {
    setTimeout(callback, 1000);
  };

  this.body = "hello"; // {result: "hello"} //в боди может быть {} (тогда content-type=json), поток, текст

});

app.listen(3000);
