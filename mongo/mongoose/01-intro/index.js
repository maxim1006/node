// Connecting w/ mongoose, schema, model, basic queries
var mongoose = require('mongoose'); //надстройка над монго, чтобы было удобнее делать запросы

//в js нет такого типа ObjectId, поэтому надо его подключить, нужно для того чтобы миксовать схемы
var ObjectId = mongoose.Schema.Types.ObjectId;
var co = require('co');
mongoose.set('debug', true);//нужно, чтобы посмотреть какие запросы мангуст отсылает в монго

mongoose.connect('mongodb://localhost/test', {
    server: {
        socketOptions: {
            keepAlive: 1 //даже если соединение с базой неактивно, не надо его разрывать
        },
        poolSize: 5 //на весь процесс ноды создаем 5 соединений к монго бд
    }
}, function() {console.log();});

// в мангусте работаю через схемы (описание полей, по ней создается модель), внутри одной схемы могут быть другие
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: "Отсутствует email",
        unique: true,
    },
    name: {
        type: String,
    },
    age: {
        type: Number
    },
    friends: [{
        type: ObjectId,
        ref: 'User'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.getEmail = function () {
    console.log(this.email);
};

userSchema.methods.getName = function () {
    console.log(this.name);
};

userSchema.statics.sayHi = function () {
    console.log(this.schema);
};

//модель - это объект, инстансы которого можно создавать
var User = mongoose.model('User', userSchema); //значит в базе будет коллекция users

//User.sayHi(); //показываю бд

//создаст объект, но никуда не сохранит
/*
var mary = new User({
    email: 'mary@mail.com'
});
*/


co(function*() {

    yield User.remove({/*здесь параметры, объектов, которые хочу удалить например email:...*/}); //удаляю юзеров с параметрами, которые захочу

    //User.create - создаст объект и отправит запрос на сохранение в базу
    var mary = yield* validate({email: 'mary@mail.com', name: "Mary", age: 15});
    var pete = yield* validate({email: 'pete@mail.com', name: "Pete", age: 20});
    var max = yield* validate({email: 'max@mail.com', name: "Max", age: 27});


    if (mary && pete) {
        mary.friends = [pete];

        yield mary.save(); //нужно сохранять для populate

        var maryAgain = yield User.findOne({
            email: 'mary@mail.com'
        }).populate('friends'); //populate - достает объекты друзей мери, в виде объектов, а не id

        maryAgain.getEmail();
    }

    if (max) {
        max.getEmail();
        max.getName();
    }


    /*yield mary.save(); - не нужно, так как используем create
    yield max.save();*/
})
    //если не заполнил поле то возникнет Validation err, у него есть свойство errors с подробностями (err.errors)
    //Также стоит заметить, что если catch не бросает ошибку, то можно продолжить поток и написать then
    .catch(err => console.log(err.stack, err.errors))
    .then(() => {
        //после всего делаю дисконнект, чтобы закончить соединение иначе нода подвиснет
        mongoose.disconnect();
    });



/*HELPERS*/
function* validate(opts) {
    var user;

    if (opts.email && !checkEmail(opts.email)) {
        throw(new Error("Неверный формат email " + opts.name));
        return;
    }

    if (opts.name && !checkName(opts.name)) {
        throw(new Error("Неверное имя " + opts.name));
        return;
    }

    if (opts.age && !checkAge(opts.age)) {
        throw(new Error("Неверный возраст " + opts.name));
        return;
    }

    user = yield User.create({
        email: opts.email,
        name: opts.name
    });

    return user;
}

function checkEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function checkName(name) {
    return name && name.length < 10;
}

function checkAge(age) {
    return age === undefined || age > 1 && age < 100;
}

