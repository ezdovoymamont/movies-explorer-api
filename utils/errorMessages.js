const UserAlreadyExistsError = require('../Errors/UserAlreadyExistsError');
const Error400 = require('../Errors/Error400');

const errorMessage = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new Error400('Произошла ошибка валидации данных'));
  }
  if (err.code === 11000) {
    next(new UserAlreadyExistsError('Пользователь с таким email уже существует'));
  }
  next(err);
};

module.exports = { errorMessage };
