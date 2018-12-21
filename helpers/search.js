const connection = require('../sqlConnection');

// Search function. Takes a search term and call-back function.
// Callback function should expect a singel parameter: an array of result objects
var search = function (search_term, cb) {
    // Form conditions for secondary search based on individual terms in search
    let terms = search_term.split(' ');
    var sql = "";

    // Check for actor only search
    // Second query will be searching for cast members
    if (terms.length > 0 && terms[0].charAt(0) === '@') {
      let new_search_term = search_term.substr(1);
      sql = "SELECT DISTINCT m.movie_id ref,  title, release_year, runtime, rating FROM Movie m JOIN (Cast_In ci JOIN (SELECT id FROM Movie_Cast WHERE name = '" + new_search_term + "') c ON c.id = ci.cast_id) ON ci.movie_id = m.movie_id LIMIT 20;";
    } else {
      var bi_conditions = '';
      var uni_conditions = '';
      var prev_term = '';
      for (i in terms) {
          var term = terms[i].toLowerCase();
          if (isNaN(term) && term !== 'the' && term !== 'a' && term !== 'of' && term !== 'on' && term !== 'in') {
              uni_conditions += "title LIKE '%" + term + "%' OR ";
              if (i > 0) {
                  bi_conditions += "title LIKE '%" + prev_term + ' ' + term + "%' OR ";
              }
              prev_term = term;
          }
      }
      uni_conditions = uni_conditions.substring(0, uni_conditions.length - 4);
      bi_conditions = bi_conditions.substring(0, bi_conditions.length - 4);

      if (uni_conditions.length !== 0) {
        uni_conditions = 'WHERE ' + uni_conditions;
      }

      if (bi_conditions.length !== 0) {
        bi_conditions = 'WHERE ' + bi_conditions;
      }

      // First query will be searching for exact matches
      let sql1 = "SELECT DISTINCT movie_id ref,  title, release_year, runtime, rating FROM Movie WHERE title LIKE '%" + search_term + "%'";
      // Second query will be searching for the bigram parts of the search
      let sql2 = "SELECT DISTINCT movie_id ref,  title, release_year, runtime, rating FROM Movie " + bi_conditions;
      // Third query will be searching for the individual parts of the search
      let sql3 = "SELECT DISTINCT movie_id ref,  title, release_year, runtime, rating FROM Movie " + uni_conditions;

      // Planning on suplementing this query if we want a more robust search later

      // Combine the queries
      sql = '(' + sql1 + ') UNION (' + sql2 + ') UNION (' + sql3 + ') LIMIT 20;';
    }

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
        cb(rs);
    });
};

// Export the search function for movie listing endpoints
module.exports = search;
