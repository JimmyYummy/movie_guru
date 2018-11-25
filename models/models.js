const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { // the username of the user
    type: String,
    unique: true,
    dropDups: true
  },
  password: { // the password of the user *** no-encryption ***
    type: String,
  },
  facebookId: {
    type: String
  },
  displayName: {
    type: String
  },
  ratings: { // movie_id: rating
    type: Object
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
