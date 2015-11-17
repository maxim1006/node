const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//получаю из юзера id
passport.serializeUser(function (user, done) {
    done(null, user.id); // uses _id as idFieldd
});
//получаю из id юзера
passport.deserializeUser(function (id, done) {
    User.findById(id, done); // callback version checks id validity automatically
});

// done(null, user)
// OR
// done(null, false, { message: <error message> })  <- 3rd arg format is from built-in messages of strategies
//в use - задаем настройки
passport.use(new LocalStrategy({
        usernameField: 'email', // 'username' by default
        passwordField: 'password'
    },
    function (email, password, done) {
        //эта ф-ция срабатывает на попытку логина (описано в login.js)
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err); //программная ошибка
            }
            if (!user || !user.checkPassword(password)) {
                // don't say whether the user exists
                return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
            }
            return done(null, user);
        });
    }
));

module.exports = passport.initialize();
