var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
//load passport strategies
require('./config/passport/passport.js'); // pass passport for configuration
var cors = require('cors')
var SQLiteStore = require('connect-sqlite3')(session);

// For MySQL databases
/*var SessionStore = require('express-mysql-session')(session);
var options = {
  host: 'ctdb.coulsontech.net',
  user: 'iowatchuser',
  password: 'BangctPass89',
  database: 'iowatchdb'
};
var sessionStore = new SessionStore(options);*/

var index = require('./routes/index');
var users = require('./routes/users');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(session({
  secret: 'why have one keyboard cat when you can have two keyboard cats',
  store:  new SQLiteStore,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge:86400000
  }
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

//app.use(expressJwt({secret: 'some-secret-key-goes-here'}));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
