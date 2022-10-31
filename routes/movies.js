const express = require('express');
const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const router = express.Router();
// todo move to const
const pattern = /https?:\/\/(www\.)?[a-zA-Z\d\-.]+\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/;
router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(pattern).required().min(1),
    trailerLink: Joi.string().pattern(pattern).required().min(1),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(pattern).required().min(1),
    movieId: Joi.string().length(24).hex().required(),
    owner: Joi.string().length(24).hex().required(),
  }),
}), createMovie);

router.delete(
  '/:id',
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().length(24).hex().required(),
      }),
  }),
  deleteMovie,
);

module.exports = router;
