// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
var views = require('jade');
var config = require('config');
var path = require('path');

module.exports = function*(next) {
  this.render = function(file, options) {
    return views.renderFile(file, options);
  };

  yield* next;
};
