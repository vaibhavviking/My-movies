const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true },
    name: String,
    password: String,
})

const User = mongoose.model('user', userSchema);

module.exports = User;