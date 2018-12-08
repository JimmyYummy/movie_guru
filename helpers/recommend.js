const connection = require('../sqlConnection');

// Recommed function.
// Callback function should expect a singel parameter: an array of result objects
var recommend = function (cb) {
    // Fetch movies user has rated
    rated_movies = {}

    // SQL query/queries to ?
    var in_statement = '(';
    for (var key in rated_movies) {
      if (rated_movies.hasOwnProperty(key)) {
          in_statement += '"' + movie + '",';
      }
    }
    in_statement = in_statement.substring(0, uni_conditions.length - 1) + ');';
    let sql = "SELECT cast_id, movie_id FROM Cast_In WHERE movie_id IN " + in_statement;

    // Execute query
    connection.query(sql, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        var cast_ratings = {};
        for (i in result) {
            if (! cast_ratings.hasOwnProperty(result[i].cast_id)) {
                cast_ratings[result[i].cast_id] = {ratings:[], count : 0};
            }
            var rating = rated_movies[results[i].movie_id];
            cast_ratings[result[i].cast_id].ratings.push(rating);
            cast_ratings[result[i].cast_id].count++;
        }

        // Sort cast by rating
        var cast_by_avgrating = []
        for (var key in cast_ratings) {
          if (cast_ratings.hasOwnProperty(key)) {
              const reducer = (accumulator, currentValue) => accumulator + currentValue;
              var avg_rating = cast_ratings[key].ratings.reduce(reducer);
              cast_by_avgrating.push({cast_id: key, rating: avg_rating});
          }
        }

        function cmp(a, b) {
          if (a.rating < b.rating) {
            return -1;
          }
          if (a.rating > b.rating) {
            return 1;
          }
          return 0
        }

        console.log(cast_by_avgrating);
        cast_by_avgrating.sort(cmp);
        console.log(cast_by_avgrating);

        // Create new SQL query from results
        var movie_sql = "";
        for (i in cast_by_avgrating) {
            const cast_id =  cast_by_avgrating[i].cast_id;
            const rating =  cast_by_avgrating[i].rating;
            var sql = "((SELECT concat('<a href=http://localhost:3000/movie/', m.movie_id,'>')  ref,  title, release_year, runtime, rating FROM Movie m JOIN Cast_In c ON c.movie_id = m.movie_id WHERE c.cast_id = '" + cast_id + "' AND m.movie_id NOT IN " + in_statement + " ORDER BY m.rating) LIMIT 5)"
            movie_sql += sql + " UNION "
        }
        movie_sql = movie_sql.substring(0, movie_sql.length - 7) + ' LIMIT 20;';

        connection.query(movie_sql, function(err, result) {
          // for loop
          if (err) {
              console.log(err);
              return;
          }
          var rs = [];
          console.log(result);
          for (i in result) {
              m = {};
              m.title = result[i].title;
              m.ref=result[i].ref;
              m.year = result[i].release_year;
              m.runtime = result[i].runtime;
              m.rating = result[i].rating;
              rs.push(m);
          }
          cb(rs);
        });
    });
};

// Export the search function for movie listing endpoints
module.exports = recommend;
