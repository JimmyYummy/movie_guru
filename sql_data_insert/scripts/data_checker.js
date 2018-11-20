const mysql = require('mysql');
const connection = mysql.createConnection(process.env.MYSQL_URI);

connection.query('SELECT COUNT(*) FROM Crew_In', function (err, result) {
  if (err) throw err;
  console.log("Query Successful:", result);
});

connection.end();
