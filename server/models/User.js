const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    id: { type: String, required: false },
    title: { type: String, required: true }, 
    rating: { type: Number, required: false }, 
    genres: { type: [String], required: false }, 
    cast: { type: [String], required: false }, 
    image: { type: String, required: false }, 
    year: { type: Number, required: false } 
}, { _id: false }); 

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    watchlist: { type: [movieSchema], default: [] },
    watched: { type: [movieSchema], default: [] } 
});

const User = mongoose.model('User', userSchema);
module.exports = User;
