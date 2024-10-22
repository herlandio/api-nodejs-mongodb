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

// Import routes
const usersRouter = require('./routes/users');
const brandsRouter = require('./routes/brands');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
const Auth = require('./auth/auth');

const app = express();

// Logging configuration
app.use(logger('dev', {
  skip: (req, res) => res.statusCode < 400
}));

app.use(logger('common', {
  stream: fs.createWriteStream(path.join(__dirname, "./logs", `log-${moment().format('YYYY-MM-DD')}.log`), { flags: 'a' })
}));

// CORS configuration
app.use(cors({
  origin: '*'
}));

// Middleware for JSON and URL-encoded analysis
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/', usersRouter);
app.use('/users', usersRouter);
app.use('/brands', Auth, brandsRouter);
app.use('/categories', Auth, categoriesRouter);
app.use('/products', Auth, productsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Capture 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// Validate necessary environment variables
if (!process.env.TOKEN || !process.env.REFRESH_TOKEN) {
  console.error('The environment variables TOKEN and REFRESH_TOKEN are required!');
  process.exit(1);
}

module.exports = app;
