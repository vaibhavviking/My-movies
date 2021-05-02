const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new Schema({
    id: { type: String, unique: true },
    name : String
})

const Genre = mongoose.model('genre', genreSchema);

module.exports = Genre;