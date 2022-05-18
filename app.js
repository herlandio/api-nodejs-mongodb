require("dotenv").config();
require('./database/connection');

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger_output.json');

const usersRouter = require('./routes/users');
const brandsRouter = require('./routes/brands');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
const Auth = require('./auth/auth');

const app = express();

app.use(logger('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));

/**
 * Geração de logs
 */
app.use(logger('common', {
  stream: fs.createWriteStream(path.join(__dirname, "./logs", `log-${moment().format('YYYY-MM-DD')}.log`), { flags: 'a' })
}));

app.use(cors({
  origin:'*'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', usersRouter);
app.use('/users', cors(), usersRouter);
app.use('/brands', cors(), Auth, brandsRouter);
app.use('/categories', cors(), Auth, categoriesRouter);
app.use('/products', cors(), Auth, productsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

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
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
