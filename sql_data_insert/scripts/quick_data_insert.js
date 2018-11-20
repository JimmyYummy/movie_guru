const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit : 39,
  host            : process.env.MYSQL_HOST,
  user            : process.env.MYSQL_USER,
  port            : process.env.MYSQL_PORT,
  password        : process.env.MYSQL_PASSWORD,
  database        : process.env.MYSQL_DATABASE
});

let filename = process.argv[2];
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./cleaned_data/' + filename)
});
lineReader.on('line', function (line) {
  pool.query(line, function (err, result) {
    if (err) { // && err.code !== 'ER_NO_REFERENCED_ROW_2' && err.code !== 'ER_DUP_ENTRY'
      console.log(err);
    }
  });
});
