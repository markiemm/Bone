
const express = require('express');
const app = express();
const logger = require('./utils/logger');
const path = require('path');
const flash = require('connect-flash');
const moment = require('moment');
const createError = require('http-errors');
const passport = require('passport');
const initializePassport = require('./utils/passport');
const connectDB  = require('./utils/database');
const users = require('./models/users');
const bodyParser = require('body-parser');
const expressUpload = require('express-fileupload');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require('dotenv').config();

// Connect to Database
connectDB();

app.set('trust proxy', false);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//remove x-powered-by header


// node-modules
app.use('/node-modules', express.static(path.join(__dirname, '../node_modules')));

// storage folder
app.use('/storage', express.static(path.join(__dirname, '../storage')));

//save session in database
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions'
});

app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  store: sessionStore
}));

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: false }));
// allow parsing of multipart/form-data
app.use(expressUpload());
app.use(passport.session());
app.disable('x-powered-by');

initializePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
);

app.use(flash())



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



//locals
app.use((req, res, next) => {
  res.locals.success = req.flash('success_msg');
  res.locals.warning = req.flash('warning_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  app.locals.moment = moment;
  next();
});

app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/upload', require('./routes/upload'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/settings', require('./routes/settings'));
app.use('/notifications', require('./routes/notifications'));

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Sentry error handler
//   Sentry.captureException(err);
  // set locals, only providing error in development
  res.locals.sysMessage = err.message;
  res.locals.sysError = err;
  res.locals.developmentEnv = process.env.NODE_ENV === 'development';

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

module.exports = app;