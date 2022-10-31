const Movie = require('../models/movieSchema');
const NotFoundError = require('../Errors/NotFoundError');
const ForbiddenError = require('../Errors/ForbiddenError');
const Error400 = require('../Errors/Error400');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({owner})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({ country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError'
        || err.name === 'ValidationError') {
        next(new Error400('Произошла ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOne({ _id: req.params.id })
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.equals(req.user._id) === false) {
        throw new ForbiddenError('Нельзя удалять не свой фильм');
      }
      Movie.remove(movie)
        .then(() => {
          res.send({ data: movie });
        })
        .catch(next);
    })
    .catch(next);
};
