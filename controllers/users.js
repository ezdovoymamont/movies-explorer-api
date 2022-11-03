const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const NotFoundError = require('../Errors/NotFoundError');
const { errorMessage } = require('../utils/errorMessages');
const { JWT_STORAGE_TIME, JWT_SECRET } = require('../config/config');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
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
    .catch((err) => errorMessage(err, req, res, next));
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
    .catch((err) => errorMessage(err, req, res, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Неправильная почта или пароль');
      }

      if (bcryptjs.compareSync(password, user.password) === false) {
        throw new NotFoundError('Неверный логин/пароль');
      }

      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: JWT_STORAGE_TIME },
      );

      res.status(200).send({ jwt: token });
    })
    .catch(next);
};
