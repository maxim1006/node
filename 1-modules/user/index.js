//могу не писать путь к db так как db лежит в node modules или могу прописать set NODE_PATH = . node server.js - в этом случае переменная будет в NODE_PATH
var db = require('db');
var log = require('../logger')(module); //это паттерн модуль - фабрика, т.е. я подключаю модуль и тут же передаю ему параметры

/*Хотя я и обращаюсь к index.js в db и отсюда и из server.js, connect к бд можно вызвать только один раз, так как при require нода
* кеширует все запросы и записывает их в свойство модуль*/
db.connect();

function User(name) {
    this.name = name;
}

User.prototype.hello = function(who) {
    //console.log(this.name + ' говорит ' + db.getPhrase('Hello') + " пользователю " + who.name);
    log(this.name + ' говорит ' + db.getPhrase('Hello') + " пользователю " + who.name);
};

module.exports = User;

/*Также есть глобальные переменные
* global.User = User;
* теперь можно будет вызвать просто require('./user') === User
* */

//объект модуль есть в каждом файле
//console.log(module);