const connection = require('../sqlConnection');

// Search function. Takes a search term and call-back function.
// Callback function should expect a singel parameter: an array of result objects
var defSearch = function (cb) {

    let sql = "SELECT concat('<a href=http://localhost:3001/movie/', movie_id,'>')  ref,  title, release_year, runtime, rating FROM Movie WHERE release_year='2017' ORDER BY rating desc LIMIT 11";

    // Execute query
    connection.query(sql, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        var rs = [];
        for (i in result) {
            m = {};
            m.title = result[i].title;
            m.ref=result[i].ref;
            m.year = result[i].release_year;
            m.runtime = result[i].runtime;
            m.rating = result[i].rating;
            rs.push(m);
        }
        rs = rs.slice(1, 11);
        cb(rs);
    });
};

// Export the search function for movie listing endpoints
module.exports = defSearch;
