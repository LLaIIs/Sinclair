const express = require('express');
const cadastrar = require('./cadastro');

const router = express.Router();
router.use('/cadastrar', cadastrar);

module.exports = router;