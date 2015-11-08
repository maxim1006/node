var mongoose = require('./mongoose');
var User = require('./user');
var co = require('co');

co(function*() {

    yield User.remove({});

    var mary = yield* validate({email: 'mary@mail.com', name: "Mary  ", age: 10});
    var pete = yield* validate({email: 'pete@mail.com', name: "Pete", age: 20});
    var max = yield* validate({email: 'max@mail.com', name: "Max", age: 27});


    if (mary && pete) {
        mary.friends = [pete];

        yield mary.save(); //нужно сохранять для populate

        var maryAgain = yield User.findOne({
            email: 'mary@mail.com'
        }).populate('friends');

        maryAgain.getEmail();
    }

    if (max) {
        max.getEmail();
        max.getName();
    }
})
    .catch(err => console.log(err.stack, err.errors))
    .then(() => {
        mongoose.disconnect();
    });



/*HELPERS*/
function* validate(opts) {
    var user;

    user = yield User.create({
        email: opts.email,
        age: opts.age,
        name: opts.name
    });

    return user;
}
