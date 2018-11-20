const mysql = require('mysql');
const connection = mysql.createConnection(process.env.MYSQL_URI);

connection.connect();
var query = 'DELETE FROM Movie';
connection.query(query, function (err, result) {
  if (err) throw err;
  console.log(result);
});
