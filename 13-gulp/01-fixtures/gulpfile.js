const config = require('config');
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const runSequence = require('run-sequence');
const gulpNodemon = require('gulp-nodemon');
// const gp = require('gulp-load-plugins')();

const mongoose = require('./libs/mongoose');

//обработчик на случай если все упадет
process.on('uncaughtException', function(err) {
  console.error(err.message, err.stack, err.errors);
  process.exit(255);
});

/*
gulp.task('deploy', ['clean', 'rebuild', 'update'], function() {
  return promise;
});
*/

//запускаю сервер
gulp.task("nodemon", function(callback) {
  gulpNodemon({
    nodeArgs: ['--debug'],
    script:   "index.js"
    /* watch, ignore */
  });
});

gulp.task('db:load', require('./tasks/dbLoad'));

gulp.task('db:load:watch', function(callback) {
// not working
// parse args -> dbPath
  gulp.watch(dbPath, ['db:load']);
})


// when queue finished, close db
// orchestrator events (sic!)
//когда задачи завершаются или завершаются с ошибкой делаю дисконнект от бд, так как при подключении модуля мангуст, устанавливается соединение с бд
gulp.on('stop', function() {
  mongoose.disconnect();
});

gulp.on('err', function(gulpErr) {
  if (gulpErr.err) {
    // cause
    console.error("Gulp error details", [gulpErr.err.message, gulpErr.err.stack, gulpErr.err.errors].filter(Boolean));
  }
  mongoose.disconnect();
});

