var fs = require('fs');
// 45,400 kaggle ids

// 1. read in imdb_to_kaggle csv. Establish a dictionary
const dictionary = {};
var idReader = require('readline').createInterface({
  input: require('fs').createReadStream('./imdb_movie_data/matchings.csv')
});

idReader.on('line', function(line) {
  var arr = line.split(',');
  dictionary[arr[0]] = arr[1];
}).on('close', function() {
  // 2. read in line by line movie.sql
  var movieReader = require('readline').createInterface({
    input: require('fs').createReadStream('./imdb_movie_data/genre_movie.sql')
  });

  var writeStream = fs.createWriteStream('./imdb_movie_data/finalized_genre_movie.sql', {'flags': 'w'});

  movieReader.on('line', function(line) {
    // 3. parse the imdb_id
    var arr = line.split('"');

    // 4. write to kaggle_id_movie_data.sql if imdb movie_id is in the dictionary
    if (dictionary.hasOwnProperty(arr[1])) {
      // replace imdbId with kaggleId
      arr[1] = dictionary[arr[1]];
      // write to file
      writeStream.write(arr.join('"') + '\n');
    }
  }).on('close', function() {
    writeStream.end();
  });
});
