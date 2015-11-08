var mongoose = require('./mongoose.js');

var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: "Отсутствует email",
        unique: true,
        match: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    },
    name: {
        type: String,
        trim: true,
        maxlength: 10
    },
    age: {
        type: Number,
        min: 1,
        max: 100
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

var User = mongoose.model('User', userSchema);

module.exports = User;