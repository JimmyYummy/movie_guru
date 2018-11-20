var fs = require('fs')

var file = 'keyword.sql';
var filename = './cleaned_data/' + file;

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(filename)
});

let keywords = new Set();
lineReader.on('line', function (line) {
  keywords.add(line);
});

lineReader.on('close', function() {
  console.log(keywords.size);
});
