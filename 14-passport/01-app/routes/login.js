var passport = require('koa-passport');

exports.post = function*(next) {
    //аутентификация здесь запустит ф-цию в passport.use
    //пример более прогрессивной в auth/router.js
    yield passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
    });

};
