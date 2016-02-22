
var mongoose = module.exports = require('mongoose');

mongoose.connect('mongodb://localhost/test');

mongoose.model('User', new mongoose.Schema({
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
