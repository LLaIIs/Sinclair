const express = require('express');
const cadastrar = require('./cadastro');
const login = require('./login');
const redefinirSenha = require('./redefinirSenha');
const favorites = require('./favorites');
const searchHistory = require('./searchHistory');
const Chat = require('./chat');
const profile = require('./profile');

const router = express.Router();
//ConnectPages
router.use('/cadastrar', cadastrar);
router.use('/login',login);
router.use('/',login);
router.use('/redefinirSenha', redefinirSenha);  

//MainPages
router.use('/favorites', favorites);
router.use('/search-history',searchHistory);
router.use('/chat', Chat);
router.use('/profile', profile );



module.exports = router;