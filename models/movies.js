const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    movieid: { type: String, unique: true },
    name: String,
    poster: String,
    rating: String,
    overview: String
})

const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;