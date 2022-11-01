/* const { ObjectId } = require('mongodb'); */
const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: [(value) => validator.isURL(value, {
      protocols: ['http', 'https', 'ftp'],
      require_tld: true,
      require_protocol: true,
    })],
    required: true,
  },
  trailerLink: {
    type: String,
    validate: [(value) => validator.isURL(value, {
      protocols: ['http', 'https', 'ftp'],
      require_tld: true,
      require_protocol: true,
    })],
    required: true,
  },
  thumbnail: {
    type: String,
    validate: [(value) => validator.isURL(value, {
      protocols: ['http', 'https', 'ftp'],
      require_tld: true,
      require_protocol: true,
    })],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
