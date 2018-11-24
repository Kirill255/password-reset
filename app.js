const config = require('./config')
const mongoose = require("./data/mongoose");
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { promisify } = require("es6-promisify");
const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(helmet())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());
app.use(session({
  secret: config.SECRET,
  key: config.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

// // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login.bind(req));
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
