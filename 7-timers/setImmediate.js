"use strict";

let http = require("http");


/*
 * setImmediate - нужен нам для того, чтобы знать, что асинхронное событие произойдет после того, как в ноду придет следующий запрос или любое событие ввода/вывода.  process.nextTick, он сделает выполнение своего колбека асинхронным, т.е. он выполнится до того как освободится js, с другой стороны он гарантирует, что колбек сработает до того как придут следующие события ввода/вывода
 *
 * */
/*
let server = new http.Server((req, res) => {

    process.nextTick(() => {
        req.on('readable', () => {

        });
    });

}).listen(2000);
*/

/*Пример с nextTick и setImmediate*/

var fs = require("fs");

fs.open(__filename, "r", function(err, file) {
    console.log("IO");//это операцию ввода/вывода
});

setImmediate(() => {
    console.log("immediate"); //прошла после операции I/O
});

process.nextTick(() => {
    console.log("next tick"); //прошла до операции I/O
});