"use strict";

// ЗАДАЧА - сделать readFile, возвращающее promise
// ЗАДАЧА - прочитать все файлы текущей директории, используя новый readfile
// (последовательно или параллельно - как считаете нужным)
var fs = require('fs');

function readFile(path) {

    return new Promise((resolve, reject) => {
        let req = fs.readFile(path, {encoding: "utf-8"}, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    });

}

readFile("./test.txt").then(function (content) {
    console.log(content);
}, function (err) {
    console.log(err);
});