'use strict';

Error.stackTraceLimit = 1e6;
/*require('trace'); //нужен для трассировки
require('clarify'); //нужен для красивого вывода ошибок*/
var fs = require('mz/fs'); //нужен, чтобы fs возвращал промисы
var co = require('co');
const path = require('path')

// Обычный async-код для чтения файла/директории path
//  dir -> return files list
//  file -> return contents
//  
//  



/*Через промисы*/
/*function readAsync(path) {
    return fs.stat(path)
        .then(stat => {
            if (stat.isDirectory()) {
                return fs.readdir(path);
            } else {
                return fs.readFile(path);
            }
        })
        .then((files) => {

            if (Array.isArray(files)) {
                let arr = [];

                for (let i = 0; i < files.length; i++ ) {
                    arr.push(fs.readFile(files[i]));
                }

                return Promise.all(arr)
            } else {
                return files;
            }

        });
}


readAsync(__dirname)  //"./test.txt"
    .then(function (res) {
        console.log(res.length);

        let size = 0;

        res.forEach((item) => {
            size += item.length;
        });

        console.log(size);
    })
    .catch(console.log);*/



/*Через co*/
function* readFiles(dir) {

    let length = 0;

    const files = yield fs.readdir(dir);

    for(let i = 0; i < files.length; i++) {
        let fullPath = path.join(dir, files[i]);
        let stat = yield fs.stat( fullPath );
        if (stat.isDirectory()) {
            length += yield* readFiles(fullPath);
        } else {
            let content = yield fs.readFile( fullPath ); // stat.size
            length += content.length;
        }
    }

    return length;

}

co(function*() {

    const sum = yield* readFiles('.');

    console.log(sum);

}).catch(err => console.log(err.stack));





//у объекта process, когда какой-либо промис сгенерировал ошибку и нет catch, то ее можно отловить тут
/*process.on('unhandledRejection', function (err, p) {
    console.log("UNHANDLED", err.message, err.stack, err);
});*/
