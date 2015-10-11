var phrases = require('./ru');

function User(name) {
    this.name = name;
}

User.prototype.hello = function(who) {
    console.log(phrases.Hello + " " + who.name);
};

exports.User = User;

/*Также есть глобальные переменные
* global.User = User;
* теперь можно будет вызвать просто require('./user') === User
* */