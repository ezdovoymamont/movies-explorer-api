const express = require('express');
const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  getUser, updateUser,
} = require('../controllers/users');

const router = express.Router();

router.get('/me', getUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string()
          .required()
          .min(2)
          .max(30),
        email: Joi.string()
          .required()
          .email(),
      }),
  }),
  updateUser,
);

module.exports = router;
