const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { // the username of the user
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  password: { // the password of the user *** no-encryption ***
    type: String,
    required: true
  },
  ratings: { // movie_id: rating

  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
