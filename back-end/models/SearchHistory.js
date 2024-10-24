// models/SearchHistory.js
const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  query: {
    type: String,
    required: true,
    trim: true,
  },
  place_id: {
    type: String,
    required: false,
    trim: true,
  }
}, {
  timestamps: true, 
});

const SearchHistory = mongoose.model('Search-History', searchHistorySchema);

module.exports = SearchHistory;
