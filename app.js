require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const pug = require('pug');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const flash = require('connect-flash');
const initializePassport = require('./src/server/config/passport');
const bodyParser = require('body-parser');
const db = require('./src/server/config/db');
const expressFileUpload = require('express-fileupload');
const port = 8080


const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});
  
store.on('error', function(error) {
    console.log(error);
});


app.use(require('express-session')({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    store: store,
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.session());




initializePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
);

app.use(flash())

app.use(expressFileUpload());


app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.warning = req.flash('warning');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  next();
});

app.set('view engine', 'pug');
app.set('views', __dirname + '/src/app/views');

app.use(express.static(__dirname + '/src/app/assets'));
app.use('/' , require('./src/server/routes/mainRouter'));

try {
    db.mongodb_connect();

} catch (err) {
    console.log(err);
} finally {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}