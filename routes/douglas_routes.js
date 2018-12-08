const express = require('express');
const Models = require('../models/models');
const router = express.Router();
const connection = require('../sqlConnection');
const recommend = require('../helpers/recommend')
const defSearch = require('../helpers/defSearch')


router.get('/my_movies', (req, res) => {
  console.log('hit my_movies');
  Models.User.findOne({ facebookId: req.user.facebookId }, (err, user) => {
    if (err) {
      console.log('err', err);
    }
    let movie_ids = Object.keys(user.ratings).map((x) => `'${x}'`);
    let sql = `SELECT concat('<a href=http://localhost:3000/movie/', movie_id,'>') ref, movie_id, title, release_year as year, runtime, rating FROM Movie WHERE movie_id IN (${movie_ids})`;
    // sql query
    connection.query(sql, function (err, result) {
      let movies = result.map((x) => {
        x.user_rating = user.ratings[x.movie_id];
        return x;
      });
      console.log(movies);

      res.render('index', { movies: result, my_movies: true });
    });
    // for each movie,

  });
});

router.get('/my_recommendations', (req, res) => {
  // get movies here
    function callback(results) {
        console.log(results);
        res.render('index', { movies:results  });
    }

    console.log(req.user.ratings);
    if (Object.keys(req.user.ratings).length === 0) {
        defSearch(callback);
    } else {
        recommend(req.user.ratings, callback);
    }
});

module.exports = router;
