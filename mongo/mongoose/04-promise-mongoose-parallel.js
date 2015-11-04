// Создать юзеров параллельно

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var User = mongoose.model('User', new mongoose.Schema({
  email:   {
    type:     String,
    required: true,
    unique:   true
  },
  created: {
    type:    Date,
    default: Date.now
  }
}));


function createUsers() {

  return User.remove({})
    .then(function() {
      console.log("removed");

      return Promise.all([
        User.create({email: 'john@gmail.com'}),
        User.create({email: 'pete@gmail.com'}),
        User.create({email: 'mary@gmail.com'})
      ]);
    });
}


createUsers().then(function(results) {
  console.log(results);
}, function(err) {
  console.error(err);
}).then(function() {
  // previous "then" handles the error, so the execution comes here always
  // (if it didn't, the script would hang)
  mongoose.disconnect();
});

