var fs = require('fs')

var file_name = 'movie.sql';
var file = './imdb_movie_data/' + file_name;
var new_file = './imdb_movie_data/cleaned_' + file_name;

fs.readFile(file, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.split('\n');
  console.log(result.length);

  // fs.writeFile(new_file, result, 'utf8', function (err) {
  //    if (err) return console.log(err);
  // });
});
