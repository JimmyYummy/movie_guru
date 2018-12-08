const express = require('express');
const Models = require('../models/models');
const recommend = require('../helpers/recommend')
const defSearch = require('../helpers/defSearch')
const router = express.Router();

module.exports = router;

router.get('/recommend', function (req, res, next) {

    function callback(results) {
        console.log(results);
        res.render('index', {button: true, movies:results  });
    }

    console.log(req.user.ratings);
    if (Object.keys(req.user.ratings).length === 0) {
        defSearch(callback);
    } else {
        recommend(req.user.ratings, callback);
    }
})

