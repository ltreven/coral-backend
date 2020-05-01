const createError = require('http-errors');
const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
const logger = require('./config/winston');
const peopleRouter = require('./routes/peopleRouter');
const usersRouter = require('./routes/usersRouter');
const propertiesRouter = require('./routes/propertiesRouter');

//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

const app = express();

// view engine setup (Jade)
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(morgan("combined", { "stream": logger.stream }));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/v1/people', peopleRouter);
app.use('/v1/properties', propertiesRouter);
app.use('/v1/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.setHeader('Content-Type', 'application/json');
//   res.json(err);
// });

module.exports = app;
