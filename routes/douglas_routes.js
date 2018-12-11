const express = require('express');
const Models = require('../models/models');
const router = express.Router();
const connection = require('../sqlConnection');
const recommend = require('../helpers/recommend')
const defSearch = require('../helpers/defSearch')


router.get('/my_movies', (req, res) => {
  Models.User.findOne({ facebookId: req.user.facebookId }, (err, user) => {
    if (err) {
      console.log('err', err);
    }
    let movie_ids = Object.keys(user.ratings).map((x) => `'${x}'`);
    let sql = `SELECT concat('<a href=http://localhost:3000/movie/', movie_id,'>') ref, movie_id, title, release_year as year, runtime, rating FROM Movie WHERE movie_id IN (${movie_ids})`;
    // sql query
    connection.query(sql, function (err, result) {
      let movies = result ? result.map((x) => {
        x.user_rating = user.ratings[x.movie_id];
        return x;
      }) : {};
      res.render('index', { movies: result, my_movies: true });
    });
  });
});

module.exports = router;
