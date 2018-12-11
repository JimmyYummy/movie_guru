const express = require('express');
const Models = require('../models/models');
const recommend = require('../helpers/recommend')
const defSearch = require('../helpers/defSearch')
const router = express.Router();

module.exports = router;

router.get('/my_recommendations', function (req, res, next) {
  // check cache
  Models.User.findOne({ facebookId: req.user.facebookId }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      if (user.lastUpdated < user.lastCache) {
        res.render('index', { movies: user.cache });
      } else {
        if (Object.keys(req.user.ratings).length === 0) {
          defSearch(callback);
        } else {
          recommend(req.user.ratings, callback);
        }
      }
    }
  })

  // recommendation algorithm
  var callback = function callback(results) {
    Models.User.findOne({ facebookId: req.user.facebookId }, function(err, user) {
      if (err) {
        console.log(err);
      }
      user.lastCache = new Date();
      user.cache = results;
      Models.User.update({ facebookId: req.user.facebookId }, user ,{upsert:true},function(err){
        if (err) {
          console.log("Update Error", err);
        }
        res.render('index', { movies:results });
      })
    });
  };
});
