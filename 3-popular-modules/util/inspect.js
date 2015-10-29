var util = require('util');

/**
 * util.inspect
 *
 * **/
//var a = 7,
//b = 7;
//
//var obj = {
//    a,
//    b,
//    //inspect: () => 123 //если есть такой метод, то вернется именно его результат
//};
//
////console.log(util.inspect(obj)); //консоль по умолчанию вызывает метод util.inspect, те console.log(obj) === console.log(util.inspect(obj))
//console.log(obj);



/**
 *
 * util.format
 *
 * **/
//var str = util.format("My %s %d %j", "string", 123, {test: "test"});
//
//console.log(str); //%s - строка, %d - число, %j - объект в формате json

//util.format также работает в консоли неявно
//console.log("My %s %d %j", "string", 123, {test: "test"});



/**
 util.inherits
 **/
function Animal(name) {
    this.name = name;
}

Animal.prototype.walk = function() {
    console.log('Ходит ' + this.name);
};

function Rabbit(name) {
    this.name = name;
}

util.inherits(Rabbit, Animal);

Rabbit.prototype.jump = function() {
    console.log('Прыгает ' + this.name);
};

var rabbit = new Rabbit('кролик');

rabbit.walk();
rabbit.jump();