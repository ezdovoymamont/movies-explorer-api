const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const NotFoundError = require('../Errors/NotFoundError');
const UnauthorizedError = require('../Errors/UnauthorizedError');
const UserAlreadyExistsError = require('../Errors/UserAlreadyExistsError');
const Error400 = require('../Errors/Error400');

module.exports.getUser = (req, res, next) => {
  let { id } = req.params;
  if (id === undefined) {
    id = req.user._id;
  }
  User.findById(id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найдена');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, password, email,
  } = req.body;
  const passwordHash = bcryptjs.hashSync(password);
  User.create({
    name, email, password: passwordHash,
  })
    .then((user) => {
      const userP = user.toObject();
      delete userP.password;
      res.send({ data: userP });
    })
    .catch((err) => {
      if (err.name === 'CastError'
        || err.name === 'ValidationError') {
        next(new Error400('Произошла ошибка валидации данных' ));
      }
      if (err.code === 11000) {
        next(new UserAlreadyExistsError('Пользователь уже создан'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найдена');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError'
        || err.name === 'ValidationError') {
        next(new Error400('Произошла ошибка валидации данных' ));
      } else if (err.code === 11000) {
        next(new UserAlreadyExistsError('E-mail уже занят'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user == null) {
        throw new UnauthorizedError('Пользователь не найден');
      }

      if (bcryptjs.compareSync(password, user.password) === false) {
        throw new UnauthorizedError('Неверный логин/пароль');
      }

      const { NODE_ENV, JWT_SECRET } = process.env;

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '1w' },
      );

      res.status(200).send({ jwt: token });
    })
    .catch(next);
};
