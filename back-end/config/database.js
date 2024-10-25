// Importa o módulo mongoose
const mongoose = require('mongoose');
require('dotenv').config()
//função assíncrona para a conexão ao banco de dados
const connectDB = async () => {

  try {
    //String de conexão
   await mongoose.connect('mongoDb'); //variavel de ambiente
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    
    
  }
};

module.exports = connectDB;
