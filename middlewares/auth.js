const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../Errors/UnauthorizedError');
const { JWT_SECRET } = require('../config/config');

const middleJwt = (req, res, next) => {
  if (req.headers.authorization === undefined) {
    throw new UnauthorizedError('Ошибка сессии');
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(
    token,
    JWT_SECRET,
    {},
    (err, payload) => {
      if (err) {
        throw new UnauthorizedError('Ошибка сессии');
      }
      req.user = payload;
      next();
    },
  );
};
module.exports = middleJwt;
