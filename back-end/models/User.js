// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  resetaSenhaToken: String,
  resetaSenhaExpira: Date
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
