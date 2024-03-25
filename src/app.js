require('dotenv').config();

const express = require('express');
const { default: helmet } = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const {
    errorHandlingMiddleware,
} = require('./middlewares/errorHandling.middleware');
const app = express();

// init middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// init db
require('./db/init.db');

// init router
app.use(require('./routes'));

// handling error
app.use(errorHandlingMiddleware);

module.exports = app;
