var User = require('./user').User;

var vasya = new User('Вася');
var petya = new User('Петя');

vasya.hello(petya);
