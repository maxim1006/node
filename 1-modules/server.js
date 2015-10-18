'use strict';

//простейшее использование модуля
/*var User = require('./user').User;

var vasya = new User('Вася');
var petya = new User('Петя');
var max = new User('Максим');

vasya.hello(max);*/

var db = require('db');
var log = require('./logger')(module);

//Если кто-то вызывает этот модуль то лучше просто экспортировать его
//содержимое с помощью module.parent

var User = require('./user');

let run = () => {
    var vasya = new User('Вася');
    var petya = new User('Петя');
    var max = new User('Максим');

    vasya.hello(max);

    //console.log(db.getPhrase('Run successful'));
    log(db.getPhrase('Run successful'));
};

/*Проверяю если есть модуль parent, то просто передаю run,
если нет, то вызываю*/
if (module.parent) {
    exports.run = run;
} else {
    run();
}

/*module.exports = exports = this*/
