// include modules for endpoint processing
const express = require('express');
const bodyParser = require('body-parser');

// include modules for view engine
const exphbs = require('express-handlebars');

// include system modules
const path = require('path');

// include debug modules
const logger = require('morgan');

//mysql
const mysql = require('mysql');
const mongoose = require('mongoose');
// include routes
//const routes = require('./routes');

// env variable check
if (!process.env.MONGODB_URI || !process.env.MYSQL_HOST) {
  console.log('ERROR: environmental variables missing, remember to source your env.sh file!');
}

// create server with express: port defaults to 3000
const app = express();
const port = process.env.PORT || 3000;

// sql database setup
const connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  port     : process.env.MYSQL_PORT,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DBNAME
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

// mongodb database setup


// start connection to MONGODB
console.log(process.env.MONDODB_URI)
mongoose.connect(process.env.MONGODB_URI).then(
  () => {
    console.log('connected to mongoDB');
  },
  (err) => {
    console.log('err', err);
  }
);

mongoose.connection.on('error', (err) => {
  console.log('MONGODB_ERROR:', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// add middleware to parse body requests and log requests
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// include routes to use
//app.use('/', routes);

app.use('/unauthorized', (req, res) => {
  res.render('error_views/unauthorized', { user: req.user });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  console.log('error handler', err);
  // render the error page
  res.status(err.status || 500);
  res.render('error', { user: req.user });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
