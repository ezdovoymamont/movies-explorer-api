const express = require('express');
const middleJwt = require('../middlewares/auth');

const router = express.Router();
const users = require('./users');
const movies = require('./movies');
const auth = require('./auth');
const NotFoundError = require('../Errors/NotFoundError');

router.use('/users', middleJwt, users);
router.use('/movies', middleJwt, movies);
router.use('', auth);
router.use('', middleJwt, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
})

module.exports = router;
