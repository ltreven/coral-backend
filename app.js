const createError = require('http-errors');
const express = require('express');
const peopleRouter = require('./routes/peopleRouter');
const usersRouter = require('./routes/usersRouter');

//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

const app = express();

// view engine setup (Jade)
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

//app.use(logger('combined')); >> another option >> understand better about morgan...
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/people', peopleRouter);
app.use('/v1/users', usersRouter);

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
  res.setHeader('Content-Type', 'application/json');
  res.json(err);
res.render('error');
});

module.exports = app;
