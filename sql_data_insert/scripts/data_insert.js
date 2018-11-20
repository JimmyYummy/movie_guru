const mysql = require('mysql');
const connection = mysql.createConnection(process.env.MYSQL_URI);

connection.connect();

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./cleaned_data/crew.sql')
});

lineReader.on('line', function (line) {
  connection.query(line, function (err, result) {
    if (err) throw err;
  });
});

//connection.end();
