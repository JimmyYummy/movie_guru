// include modules for endpoint processing
const express = require('express');
const bodyParser = require('body-parser');

// include modules for view engine
const exphbs = require('express-handlebars');

// include system modules
const path = require('path');

// include debug modules
const logger = require('morgan');

// include verification
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');

// include mongodb connection
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// include User
const models = require('./models/models');

// include routes
const routes = require('./routes/routes');

// env variable check
if (!process.env.MONGODB_URI || !process.env.MYSQL_URI) {
  console.log('ERROR: environmental variables missing, remember to source your env.sh file!');
}

// create server with express: port defaults to 3000
const app = express();
const port = process.env.PORT || 3000;

// mongodb database setup

// start connection to MONGODB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true}).then(
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

// add middleware to parse body requests and login session information
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.SECRET));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SECRET,
  name: 'session',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

// passport authentication
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['displayName']
  },
  function(accessToken, refreshToken, profile, cb) {
    models.User.findOneAndUpdate({ facebookId: profile.id}, {
      $setOnInsert: {
        facebookId: profile.id,
        displayName: profile.displayName,
        ratings: {}
      }
    }, {
      new: true,   // return new doc if one is upserted
      upsert: true // insert the document if it does not exist
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.use(passport.initialize());
app.use(passport.session());

// include routes to use
app.use('/', routes.AUTH_ROUTES(passport)); // authentication routes
app.use('/', routes.VIEW_ROUTES); // other routes

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  if (err.status === 404) {
    res.status(404).send('Page Not Found: 404')
  } else {
    res.status(500).send('Internal Server Error: 500');
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
