const express = require('express');
const Models = require('../models/models');
const connection = require('../sqlConnection');
const router = express.Router();

module.exports = router;



router.get('/movie/:movie_id', function (req, res, next) {
    console.log("\n\n\n we're here!!!\n\n\n");
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
        console.log("QUERY CAST!\n");
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
            console.log("ratquery");
            console.log("facebookId: ",req.user.facebookId);
            var cb1=function(err, uz1){
                console.log(uz1.ratings);
                var mongo_info={};
                console.log(req.query);
                if(req.query.movie_rating){
                    console.log("WE HAVE A MOVIE RATING ",req.query.movie_rating);
                    uz1.ratings[req.params.movie_id]=req.query.movie_rating;
                    mongo_info.rating=req.query.movie_rating;
                    Models.User.update({facebookId:req.user.facebookId},uz1,{upsert:true},function(err){
                        if(err)console.log("Update Error ",err);
                        res.render('single_movie_view',{sql_data:data,mongo_info});
                    })

                }else{
                    mongo_info.rating= uz1.ratings.hasOwnProperty(req.params.movie) ? 
                    uz1.ratings[req.params.movie_id] : "" ;
                    res.render('single_movie_view',{sql_data:data,mongo_info});
                }

            };
            Models.User.findOne({facebookId:req.user.facebookId},cb1);
        });
    }

    data = {};
    queryMovie(data);
});

