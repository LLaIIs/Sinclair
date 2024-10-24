//models/Favorite.js

const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    itemId: String,
    imageUrl:String,
    title:String
});

const Favorite  = mongoose.model('Favorite', FavoriteSchema);

module.exports = Favorite;