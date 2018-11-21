const mysql = require('mysql');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(process.env.MYSQL_URI);

        db.connect(function(err){
            if(!err) {
                console.log('MySQL Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();
