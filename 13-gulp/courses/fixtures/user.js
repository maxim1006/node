//Фикстуры - полноценные стабы для модели

var oid = require('../libs/oid');

exports.User = [{
    _id: oid('user-mk'), //oid для любой строки делает ее хеш выглядещий как object id, например строка oid('user-mk') превратится в 31ef97a095aa7859d9c6f43e
    email: "mk@javascript.ru"
}, {
    _id: oid('user-iliakan'),
    friends: [
        oid('user-mk')
    ],
    email: "iliakan@javascript.ru"
}];

console.log(oid('user-mk'));