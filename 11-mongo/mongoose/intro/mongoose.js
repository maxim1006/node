var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', {
    server: {
        socketOptions: {
            keepAlive: 1 //даже если соединение с базой неактивно, не надо его разрывать
        },
        poolSize: 5 //на весь процесс ноды создаем 5 соединений к монго бд
    }
}, function() {console.log();});

module.exports = mongoose;