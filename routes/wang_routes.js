const express = require('express');
const Models = require('../models/models');
const connection = require('../sqlConnection');
const router = express.Router();

module.exports = router;

router.get('/movie/:movie_id', function (req, res, next) {
    function queryMovie(data) {
        let sql = `SELECT * FROM Movie WHERE movie_id = "${req.params.movie_id}";`;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                let err = new Error('Server meets an internal error.');
                err.status = 500;
                next(err);
                return;
            }
            if (result.length == 0) {
                let err = new Error('Movie Not Found');
                err.status = 404;
                next(err);
                return;
            }
            data.movie = result[0];
            queryCrew(data);
        });
    }

    function queryCrew(data) {
        let sql = `SELECT Crew.name, Crew_In.job FROM Crew_In JOIN Crew ON Crew_In.crew_id = Crew.id WHERE Crew_In.movie_id = "${req.params.movie_id}";`
        connection.query(sql, function(err, result) {
            if (err) {
                console.log(err);
                let err = new Error('Server meets an internal error.');
                err.status = 500;
                next(err);
                return;
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
                console.log(err);
                let err = new Error('Server meets an internal error.');
                err.status = 500;
                next(err);
                return;
            }
            data.casts = result;
            res.render("single_movie_view", data)
        });
    }

    data = {};
    queryMovie(data);
});

