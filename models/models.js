const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  facebookId: {
    type: String
  },
  displayName: {
    type: String
  },
  ratings: { // movie_id: rating
    type: Object
  },
  lastUpdated: {
    type: Date
  },
  lastCache: {
    type: Date
  },
  cache: {
    type: Object
  },
  lastMyMovieUpdate: {
    type: Date
  },
  myMovieCache: {
    type: Object
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };
