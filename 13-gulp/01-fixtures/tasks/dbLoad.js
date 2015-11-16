var fs = require('fs');
var co = require('co');
var path = require('path');
var gutil = require('gulp-util');
var projectRoot = require('config').projectRoot;

var loadModels = require('../libs/db/loadModels');

module.exports = function() {

  return co(function*() {
    //yargs - модуль, с ним удобнее задавать подсказки, которые покажутся в случае, если неправильно запукаю галп
    var args = require('yargs')
      .usage("Usage: gulp db:load --from <module>")
      .example("gulp db:load --from fixture/init")
      .demand(['from'])
      .describe('from', 'file to import')
      .argv;

    var dbPath = path.join(projectRoot, args.from);

    gutil.log("loading db " + dbPath);

    yield* loadModels(dbPath);

    gutil.log("loaded db " + dbPath);
  });

};

