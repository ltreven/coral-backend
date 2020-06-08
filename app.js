const createError = require('http-errors');
const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
const logger = require('./config/winston');
const peopleRouter = require('./routes/peopleRouter');
const locationsRouter = require('./routes/locationsRouter');
const usersRouter = require('./routes/usersRouter');
const propertiesRouter = require('./routes/propertiesRouter');
const chatRouter = require('./routes/chatRouter')

const app = express();

app.use(morgan("combined", { "stream": logger.stream }));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/v1/people', peopleRouter);
app.use('/v1/properties', propertiesRouter);
app.use('/v1/users', usersRouter);
app.use('/v1/locations', locationsRouter);
app.use('/v1/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Para permitir CORS:
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
