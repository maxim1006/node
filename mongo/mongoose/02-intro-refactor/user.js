var mongoose = require('./mongoose');

// this schema can be reused in another schema
var userSchema = new mongoose.Schema({
  email:   {
    type:     String,
    required: true,
    unique:   true
  },
  created: {
    type:    Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

