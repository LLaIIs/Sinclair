const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Validator = require('email-validator');

const router = express.Router();

// Checa o email 
router.post('/checkEmail', async (req, res) => {
  const { email } = req.body;

  // Verificar se o formato do e-mail é válido
  if (email && !Validator.validate(email)) {
    return res.status(400).json({ message: 'E-mail inválido!' });
  }

  try {
    // Procura o email na tabela User do BD
    const user = await User.findOne({ email });
    // Se não existir -> status 401
    if (!user) {
      return res.status(401).json({ message: 'Endereço de e-mail não cadastrado!' });
    }
    // Se existir -> status 200
    return res.status(200).json({ message: 'E-mail encontrado!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Checa a senha e gera o token JWT
router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    // Usa o bcrypt para comparar a senha achada do user com a senha digitada
    if (user && await bcrypt.compare(senha, user.senha)) {
      // Criação do payload JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      // Geração do token JWT
      jwt.sign(
        payload,
        'your_jwt_secret', // Substitua pela  chave secreta mais robusta
        { expiresIn: 360000 }, // Tempo de expiração do token (em segundos)
        (err, token) => {
          if (err) throw err;
          // Envia o token como resposta
          res.status(200).json({ token });
          console.log(token)
        }
      );
    } else {
      return res.status(401).json({ message: 'Senha incorreta. Tente novamente' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
