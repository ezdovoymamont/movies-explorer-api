const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../Errors/UnauthorizedError');

const middleJwt = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  if (req.headers.authorization === undefined) {
    throw new UnauthorizedError('Ошибка сессии');
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(
    token,
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
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
