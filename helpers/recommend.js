const connection = require('../sqlConnection');

// Recommed function.
// Callback function should expect a singel parameter: an array of result objects
var recommend = function (cb) {
    // Fetch movies user has rated

    // SQL query/queries to ?
    let sql1 = ""

    // Combine the queries if needed
    let sql = sql

    // Execute query
    connection.query(sql, function(err, result) {
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
};

// Export the search function for movie listing endpoints
module.exports = recommend;
