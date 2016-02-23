"use strict";
let gulp = require('gulp');
let debug = require('gulp-debug'); //выводит промежуточные результаты работы pipeов
let concat = require('gulp-concat');
let less = require('gulp-less');
let sourcemaps = require('gulp-sourcemaps');
let gulpif = require('gulp-if'); //в зависимости от условия пропускает поток, пример .pipe(gulpIf('*.styl', gulp.dest('tmp/styles'), gulp.dest('public/styles'))); если файл с расширением .styl то по одному пути, если нет то по другому
let del = require("del"); //использую этот модуль для удаления
let newer = require("gulp-newer"); //смотрит в папку и проверяет даты модификации у файлов
let remember = require("gulp-remember"); //запоминает файлы из потока, которые по нему проходят, надо делать доп обработчик на удаление файла, на вотчер вешаю событие unlink, и вызываю remember.forget
let path = require("path"); //чтобы получить из относительного абсолютный путь делаю path.resolve(относительный путь);
let cached = require("gulp-cached"); //не пропускает в поток файлы, содержимое которых не изменилось, в unlink его использую как delete cached.caches.styles[path.resolve(относительный путь)];
let browserSync = require("browser-sync").create();
let notify = require("gulp-notify");//для симпотичного вывода ошибок
let plumber = require("gulp-plumber"); //либо multipipe
let combine = require('stream-combiner2').obj; //нужно для объединения потоков, пример .pipe(gulpIf(!isDevelopment, combine(rev.manifest('css.json'), gulp.dest('manifest'))));
let rev = require("gulp-rev");
let revreplace = require("gulp-rev-replace"); //пример .pipe(gulpIf(!isDevelopment, revReplace({manifest: gulp.src('manifest/css.json', {allowEmpty: true})})))





const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development"; //переменная окружения, если ее не задали или она равна девелопмент, по мне так проще сделать gulp:prod. Могу писать NODE_ENV=production gulp less - так типо запускаю в продакшене, для винды SET NODE_ENV=prod&&gulp less
console.log("isDevelopment", isDevelopment);





/*
node-static - модуль для сервера, перехожу в папку и набираю static

 Vinyl fs - виртуальная система, служит в галп для того, чтобы передавать файлы через память, а не каждый раз писать на диск как в грант

 Галп надо ставить и локально и глобально, один чтобы рекуарить его в галпфайле, второй для глобальной команды

тут прикол галп должен быть npm i gulpjs/gulp#4.0 причем глобально тоже

gulp --tasks - можно посмотреть какие таски естьв  Галп


 gulp.src(..., {allowEmpty: true}) - чтобы не кидал ошибку в случае если файлов нет
 */


//
//gulp.task("hello", (cb) => {
//    console.log("hello");
//    cb(); //это способ показать, что задача завершена, т.е. пишу так, чтобы завершить задачу
//});
//
//gulp.task("hello:promise", () => { //может возвращать прамис
//    return new Promise((res, rej) => {
//        res('result')
//    })
//        .then((data) => {console.log(data);});
//});
//
//gulp.task("hello:fs", () => { //может возвращать прамис
//    return require('fs').createReadStream(__filename);
//});
//
//gulp.task('task:series', gulp.series("hello:fs", "hello", "hello:promise"));
//gulp.task('parallel', gulp.parallel("hello:fs", "hello", "hello:promise"));









/*Vinyl fs part*/

//Важно, что в дест попадает путь без base, т.е. путь где звездочки стоят, чтобы сделать по-другому можно в gulp.src(path, {base: "_имя_папки_путь_после_которой_будет_скопирован")

//для удобства вывода использую gulp-debug

gulp.task("example", () => {
   return gulp.src("source/**/*{js,css,txt}") //для всех регэкспов используется модуль minimatch, так же в src есть опции: {read: false}, чтобы не читать файлы (например видео файлы или те которые надо удалить, при этом file.contents будет = null), фйлы можно указать с !перед именем, тогда он будет проигнорирован
       .pipe(debug({title: "src"}))
       .on("data", (file) => {
           //console.log(JSON.stringify(file)); //на выходе винил объект с путями именем контентом и т.д.
           //console.log(file.contents.toString());
       })
       .pipe(debug({title: "dest"}))
       .pipe(gulp.dest(function(file) {//так можно разбросать куда на выходе будут копироваться файлы, возвращаю путь куда копировать
           console.log({
               contents: file.contents,
               path:     file.path, //абсолютный путь к файлу
               cwd:      file.cwd, //текущая директория относительно которой ищутся файлы
               base:     file.base,//часть пути до звездочек
               // path component helpers
               relative: file.relative, //путь после звездочек
               dirname:  file.dirname,  // .../source/1
               basename: file.basename, // 1.js
               stem:     file.stem,     // 1
               extname:  file.extname   // .js
           });
           var path;

           if (file.extname == '.js') {
               path = 'js';
           } else if (file.extname == '.css') {
               path ='css';
           } else {
               path = "dest"
           }

           return  path;

       }));
});







/*Styles example*/
gulp.task('less', () => {
    return gulp.src('styles/main.less') //достаточно двух звездочек, чтобы пролезть внутрь всех директорий
        .pipe(plumber({
            errorHandler: notify.onError((err) => {
                return {
                    message: err.message
                }
            })
        }))
        .pipe(debug({title: "src"}))
        .pipe(gulpif(isDevelopment, sourcemaps.init()))//у объекта file этот плагин делает свойство file.sourceMap, а плагины прокидывают это свойство дальше
        .pipe(debug({title: "sourcemap"}))
        .pipe(less())
        .pipe(debug({title: "less"}))
        .pipe(gulpif(isDevelopment, sourcemaps.write()))
        .pipe(debug({title: "dest"}))
        .pipe(gulp.dest("public/styles/"));
});

gulp.task("copy:assets", () => {
    return gulp.src("assets/**" /*{since: gulp.lastRun("copy:assets")}*/) //since - возвращает дату последнего выполнения задачи copy:assets - только с 4.0
    .pipe(newer("public"))
    .pipe(gulp.dest("public"));
});

//console.log("gulp.lastRun", gulp.lastRun("copy:assets"));

gulp.task("dell:public", () => {
   return del("public");
});

gulp.task("default", ["less", "copy:assets"]);

//когда выйдет 4ый галп смогу делать так использовать запуск в очереди и параллельно
//gulp.task("build",
//    gulp.series('dell:css',  gulp.series('less', ...))
//);








//watchers
//gulp.watch("styles/**/*.less", gulp.series('less')); //для 4.0
gulp.task("watch", () => {
    gulp.watch("styles/**/*.less", ["less"]);
    gulp.watch("assets/**/*.*", ["copy:assets"]);
});

//gulp watch возвращает объект chokidar, у которого есть свойства и все такое, можно подписаться на эти события unlink например

//тут можно посмотреть как готовить gulp 4 https://github.com/gulpjs/gulp/tree/4.0/docs/recipes

//вотчеры лучше обернуть в отдельный таск или они будут запускаться постоянно







//browserSync
gulp.task('serve', function() {
    browserSync.init({
        server: 'public'
    });

    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('bs', ['watch', 'serve']);






//потоки
/*
* Так как галп потоки это всего лишь передающиеся объекты vinyl-fs, а through2 накапливает 16 элементов (файлов) и встает на паузу, вывести из паузы можно с помощью return gulp.src()... либо .resume() либо gulp.dest либо обработчиков on('data'),
*
* либо просто function(file, enc, cb) {
 console.log(file.relative);
 cb(); //тут пустой коллбек файлы не накапливаются
 }
*
*
* */
gulp.task('streams', function(callback) {

    gulp.src('node_modules/**/*.*')
        .pipe(through2(
            function(file, enc, cb) {
                console.log(file.relative);
                cb(null, file);
            }
        ))
        .resume()
        .on('end', callback);

});





//Организация галп файла
function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback) {
        let task = require(path).call(this, options);

        return task(callback);
    });
}
//пример вызова задачи
lazyRequireTask('styles', './tasks/styles', {
    src: 'frontend/styles/main.styl'
});
//пример задачи
/*
'use strict';

const $ = require('gulp-load-plugins')();
const gulp = require('gulp');



const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {

    return function() {
        return combine(
            gulp.src(options.src),
            $.if(isDevelopment, $.sourcemaps.init()),
            $.stylus(),
            $.if(isDevelopment, $.sourcemaps.write()),
            gulp.dest('public')
        ).on('error', $.notify.onError());
    };

};*/





