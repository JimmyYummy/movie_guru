const mysql = require('mysql');
const connection = mysql.createConnection(process.env.MYSQL_URI);

connection.connect();
var query = `SELECT COUNT(*) FROM ${process.argv[2]};`;
console.log(query);
connection.query(query, function (err, result) {
    if (err) throw err;
    console.log(result[0]);
});
