const express = require('express');
const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { patternLink } = require('../config/const');

const router = express.Router();
// todo move to const
router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(patternLink).required().min(1),
    trailerLink: Joi.string().pattern(patternLink).required().min(1),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(patternLink).required().min(1),
    movieId: Joi.number().required(),
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
