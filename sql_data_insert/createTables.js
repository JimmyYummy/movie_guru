const mysql = require('mysql');

// sql database setup
const connection = mysql.createConnection(process.env.MYSQL_URI);

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});