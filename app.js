require('dotenv').config();
const { connect } = require('mongoose');
const express = require('express');
const { json } = require('express');
const { errors } = require('celebrate');
const users = require('./routes/users');
const movies = require('./routes/movies');
const auth = require('./routes/auth');
const middleJwt = require('./middlewares/auth');
const NotFoundError = require('./Errors/NotFoundError');

const { PORT = 3000 } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleErrors } = require('./middlewares/handleErrors');

connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
//  useCreateIndex: true,
//   useFindAndModify: false
});

//todo add lib cors
const allowedCors = [
  'http://garry.students.nomoredomains.icu',
  'https://garry.students.nomoredomains.icu',
  'http://localhost:3000',
];

const app = express();
app.use(json());
app.use(requestLogger);

app.use((req, res, next) => {
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Origin', '*');
    return res.end();
  }

  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  return next();
});

app.use('/users', middleJwt, users);
app.use('/movies', middleJwt, movies);
app.use('', auth);

app.use(errorLogger);
app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(handleErrors);
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
