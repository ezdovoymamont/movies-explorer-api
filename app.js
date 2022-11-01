const { connect } = require('mongoose');
const express = require('express');
const { json } = require('express');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const users = require('./routes/users');
const movies = require('./routes/movies');
const auth = require('./routes/auth');
const middleJwt = require('./middlewares/auth');
const NotFoundError = require('./Errors/NotFoundError');
const { limiter } = require('./utils/limiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleErrors } = require('./middlewares/handleErrors');
const { DATABASE_URL, PORT } = require('./config/config');

connect(DATABASE_URL, {
  useNewUrlParser: true,
//  useCreateIndex: true,
//   useFindAndModify: false
});

const app = express();
app.use(helmet());
app.use(limiter);
app.use(json());
app.use(requestLogger);

app.use(cors());

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
  console.log(`App listening on port ${PORT}`);
});
