const connection = require('../sqlConnection');

var search = function (search_term, cb) {
    // Form conditions for secondary search based on individual terms in search
    let terms = search_term.split(' ');
    var conditions = '';
    for (i in terms) {
        conditions += "title LIKE '%" + terms[i].toLowerCase() + "%' OR ";
    }
    conditions = conditions.substring(0, conditions.length - 4);

    // First query will be searching for exact matches
    let sql1 = "SELECT DISTINCT title, runtime, rating FROM Movie WHERE title LIKE '%" + search_term + "%' ORDER BY title";
    // Second query will be searching for the individual parts of the search
    let sql2 = "SELECT DISTINCT title, runtime, rating FROM Movie WHERE " + conditions + ' ORDER BY title';

    // Combine the queries
    let sql = '(' + sql1 + ') UNION (' + sql2 + ');';

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
            m.runtime = result[i].runtime;
            m.rating = result[i].rating;
            rs.push(m);
        }
        cb(rs);
    });
};

// Export the search function for movie listing endpoints
module.exports = search;
