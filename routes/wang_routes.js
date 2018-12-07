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
            // var tmp=""
            // console.log("hey");
            // console.log(req.user);
            // console.log(req.user.facebookId);
            var uzer  = Models.User.find({ facebookId: req.user.facebookId});
            console.log("Facebook ID coming in: %s\n",req.user.facebookId);
            var ratQuery = Models.User.findOne({facebookId: req.user.facebookId}, 
                function(err,uz){
                if(err) return handleError(err);
                var foundIndex=-1;
                for(var i=0;i<uz.ratings.length;i++){
                    console.log("%d) %s\n",i,uz.ratings[i]);
                    if(uz.ratings[i].movID==req.params.movie_id){
                        found=i;
                        break;
                    }
                }
                var mongo_info={};
                if(foundIndex!=-1){
                    mongo_info.rating=uz.ratings[i].rating;
                    res.render("single_movie_view", {sql_data:data, goose_data:mongo_info});
                }else{
                    mongo_info.rating=2;
                    res.render("single_movie_view", {sql_data:data, goose_data:mongo_info});
                }
            });
            // console.log("________________________________________________________________________________________");
            // console.log(ratQuery);
            console.log("________________________________________________________________________________________");
        });
    }

    data = {};
    queryMovie(data);
});

