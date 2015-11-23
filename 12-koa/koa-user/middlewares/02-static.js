
// Usually served by Nginx
var serve = require('koa-static');
module.exports = function* (next) {

    serve('public');

    yield* next;
};

