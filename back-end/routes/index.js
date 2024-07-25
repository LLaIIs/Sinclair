const express = require('express');
const cadastrar = require('./cadastro');
const login = require('./login')

const router = express.Router();
router.use('/cadastrar', cadastrar);
router.use('/login',login);
router.use('/checkEmail',login)

module.exports = router;