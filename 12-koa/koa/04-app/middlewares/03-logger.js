//пишем текущий запрос, время которое заняла обработка и т.д.
// request/response logger
var logger = require('koa-logger')();

module.exports = function*(next) {
  if (this.path == '/views') {
    yield* logger.call(this, next);
  } else {
    yield* next;
  }
};

