const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compress = require('compression');
const passport = require('passport');
const config = require('./index');

// load API routes
const userRoutes = require('../modules/users/user.routes');
const messageRoutes = require('../modules/messages/message.routes');

const app = express();

if (config.env === 'development') {
  const logger = require('morgan');
  app.use(logger('dev'));
}

// Parse body params
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(compress());
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// API routes
const prefixRoutes = '/api/v1';
app.use(`${prefixRoutes}/users`, userRoutes);
app.use(`${prefixRoutes}/messages`, messageRoutes);

// error handler
app.use(function (err, req, res, next) {
  res.status(400).json(err);
});

// Passport middleware
app.use(passport.initialize());

// Passport config
require('../config/passport')(passport);

module.exports = app;