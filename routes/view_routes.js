const express = require('express');
const Models = require('../models/models');
const connection = require('../sqlConnection');
const router = express.Router();
const search = require('../helpers/search');
const defSearch = require('../helpers/defSearch');
const recommend = require('../helpers/recommend')
let home_results;

router.get('/', (req, res, next) => {
    var search_param = req.query.search_term;
    if (search_param === '' || search_param === undefined) {
        if (!home_results) {
            defSearch( (results) => {
                home_results = results
                res.render('index', { movie: 'no search!', movies: results });
            });
        } else {
            res.render('index', { movie: 'no search!', movies: home_results });
        }
    } else {
        search(search_param, function (results) {
            res.render('index', { movie: search_param, movies:results  });
        });
    }
});

router.get('/my_movies', (req, res) => {
    Models.User.findOne({ facebookId: req.user.facebookId }, (err, user) => {
        if (err) {
            console.log('err', err);
        }
        // attempt caching
        if (user.lastUpdated < user.lastMyMovieUpdate) {
            console.log('fetching from cache');
            return res.render('index', { movies: user.myMovieCache, my_movies: true });
        }

        // otherwise search
        let movie_ids = Object.keys(user.ratings).map((x) => `'${x}'`);
        let sql = `SELECT concat('<a href=http://localhost:3001/movie/', movie_id,'>') ref, movie_id, title, release_year as year, runtime, rating FROM Movie WHERE movie_id IN (${movie_ids})`;
        // sql query
        connection.query(sql, function (err, result) {
            let movies = result ? result.map((x) => {
                x.user_rating = user.ratings[x.movie_id];
                return x;
            }) : {};

            user.lastMyMovieUpdate = new Date();
            user.myMovieCache = result;
            Models.User.update({ facebookId: req.user.facebookId }, user , {upsert:true}, function(err){
                if (err) {
                    console.log("Update Error", err);
                }
                res.render('index', { movies: result, my_movies: true });
            });
        });
    });
});

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
            Models.User.update({ facebookId: req.user.facebookId }, user , {upsert:true}, function(err){
                if (err) {
                    console.log("Update Error", err);
                }
                res.render('index', { movies:results });
            })
        });
    };
});

router.get('/movie/:movie_id', function (req, res, next) {
    function getRecos(data) {
        var mid = req.params.movie_id;
        var js = {};
        js[mid] = '10';
        recommend(js, function (results){
            data.movies = results.slice(0,5);
            queryMovie(data);
        });
    };

    function queryMovie(data) {
        let sql = `SELECT * FROM Movie WHERE movie_id = "${req.params.movie_id}";`;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('query movie error', err);
            }
            if (result.length == 0) {
                console.log('movie not found');
            }
            data.movie = result[0];
            queryCrew(data);
        });
    }

    function queryCrew(data) {
        let sql = `SELECT Crew.name, Crew_In.job FROM Crew_In JOIN Crew ON Crew_In.crew_id = Crew.id WHERE Crew_In.movie_id = "${req.params.movie_id}";`
        connection.query(sql, function(err, result) {
            if (err) {
                console.log('query crew err', err);
            }
            var crews = {}
            for (i in result) {
                if (crews[`${result[i].job}`] == undefined) {
                    crews[`${result[i].job}`] = `${result[i].name}`;
                } else {
                    crews[`${result[i].job}`] += `, ${result[i].name}`;
                }
            }
            data.crews = crews;
            queryCast(data);
        });
    }

    function queryCast(data) {
        let sql = `SELECT Cast_In.charac, Movie_Cast.name FROM Cast_In JOIN Movie_Cast ON Cast_In.cast_id = Movie_Cast.id WHERE Cast_In.movie_id = "${req.params.movie_id}" ORDER BY charac;`
        connection.query(sql, function(err, result) {
            if (err) {
                console.log('query cast err', err);
            }
            data.casts = result;
            getRating(data);
        });
    }

    function getRating(data) {
        Models.User.findOne({facebookId:req.user.facebookId}, function (err, result) {
            info = {};
            info.rating = result.ratings.hasOwnProperty(req.params.movie_id) ?
                result.ratings[req.params.movie_id] : '?';
            res.render('single_movie_view',{sql_data:data, movies: data.movies, goose_data: info});
        });
    }

    data = {mid: req.params.movie_id};
    getRecos(data);
});

router.get('/do_rating/', function (req, res, next) {
    let movie = req.query.movie;
    let rating = req.query.rating;
    if (movie === undefined || req.query.rating === undefined) {
        return;
    }
    var cb = function(err, user){
        user.lastUpdated = new Date();
        user.ratings[movie] = rating;
        Models.User.updateOne({ facebookId:req.user.facebookId }, user, { upsert:true }, function(err){
            if (err) {
                console.log("Mongo Update Error", err);
            }
            res.send({success: true});
        });
    };
    Models.User.findOne({facebookId:req.user.facebookId},cb);
})

module.exports = router;
