const connection = require('../sqlConnection');

// Search function. Takes a search term and call-back function.
// Callback function should expect a singel parameter: an array of result objects
var defSearch = function (cb) {

    let sql = "SELECT title, runtime, rating FROM Movie WHERE release_year='2017' ORDER BY rating desc LIMIT 10";

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
            m.year = result[i].release_year;
            m.runtime = result[i].runtime;
            m.rating = result[i].rating;
            rs.push(m);
        }
        cb(rs);
    });
};

// Export the search function for movie listing endpoints
module.exports = defSearch;
