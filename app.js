var createError = require('http-errors');
var express = require('express');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var config = require('config');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/api/users');
var resturantRouter = require("./routes/api/resturants");
var cors = require('cors')

var app = express();
app.use(cors())

const path = require('path')// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/resturant', resturantRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

mongoose
  .connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongo DB"))
  .catch((err) => console.log(err.message));

module.exports = app;
