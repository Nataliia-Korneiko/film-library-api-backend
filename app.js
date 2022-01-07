const fs = require('fs');
const path = require('path');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');
const { auth, films } = require('./routes');
const { httpCode } = require('./helpers/constants');
const { ErrorHandler } = require('./helpers/error-handler');
const { apiLimit, jsonLimit } = require('./config/rate-limit.json');
require('dotenv').config();

const { API_URL } = process.env;
const api = API_URL;
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// app.set('trust proxy', 1);
app.use(helmet());
app.use(cors('*'));
app.use(express.json({ limit: jsonLimit }));
app.use(logger('combined', { stream: accessLogStream }, formatsLogger));
app.use(
  '/api/',
  rateLimit({
    windowMs: apiLimit.windowMs,
    max: apiLimit.max,

    handler: (req, res, next) => {
      next(
        new ErrorHandler(
          httpCode.BAD_REQUEST,
          'You have reached your request limit. Try later!'
        )
      );
    },
  })
);

app.use(`${api}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(`${api}/auth`, auth);
app.use(`${api}/films`, films);

app.use((req, res, _next) => {
  res.status(httpCode.NOT_FOUND).json({
    status: 'error',
    code: httpCode.NOT_FOUND,
    message: `Use api on routes: ${req.baseUrl}${api}/auth/signup`,
    data: 'Not found',
  });
});

app.use((error, _req, res, _next) => {
  const status = error.status ? error.status : httpCode.INTERNAL_SERVER_ERROR;

  res.status(status).json({
    status: status === 500 ? 'fail' : 'error',
    code: status,
    message: error.message,
    data: status === 500 ? 'Internal server error' : error.data,
  });
});

module.exports = app;
