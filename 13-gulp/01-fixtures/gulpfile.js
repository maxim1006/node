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
});


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


//пример таска для тестов с помощью gulp-mocha
gulp.task('test', function() {
    return gulp.src('**/test/*.js', {read: false})//там где не надо читать файлы можно поставить read: false, это сильно ускоряет работу.
    .pipe(mocha({reporter: "nyan"}));
});

//gulp-plumber - возвращает поток с поменянным pipe, чтобы не навешивать on error на каждый поток, можно использовать его, пропатченный пайп будет у всех пайп в таске, у каждого из них будет обработка на error

//gulp-load-plugins позволяет заменить кучу requireов на один, лениво подключает плагины

//gulp-debug - позволяет дебажить gulp, выводит все что попадает в поток

//могу сделать так, на вход поток
//.pipe(es.map(function(file, cb) {
    //и тут что-то могу сделать с каждым файлом
//}));

//ленивая подгрузка тасок
//function lazyRequireTask(path) {
//    var args = [].slice.call(arguments, 1);
//    return function(callback) {
//        var task = require(path).apply(this, args);
//
//        return task(callback);
//    };
//}
//пример использования
//gulp.task('lint-once', lazyRequireTask('./tasks/lint', { src: jsSources }));

//для разруливанивая gulp.src() gulp использует библиотеку minimatch, можно в ней посмотреть весь синтаксис
