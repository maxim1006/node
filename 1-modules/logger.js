//var log = require('logger')(module); - пример вызова

module.exports = function(module) {
    return function() {
        /*Здесь прибавляю filename модуля из которого вызвали логгер, вместе с аргументам
            функции логгера
         */
        var args = [module.filename].concat([].slice.call(arguments));

        return console.log.apply(console, args);
    };
};