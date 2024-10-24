const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const router = express.Router();
const Validator = require('email-validator');

router.get('/user', auth, async (req, res) => {
    try {
      // Procura o usuário pelo ID que foi decodificado e adicionado ao req.userId
      const user = await User.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      // Retorna o nome do usuário
      res.json({ name: user.nome });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  });

  
// Rota PUT para atualizar o nome do usuário
router.put('/updateNome', auth, async (req, res) => {
  const { nome } = req.body; // Nome atualizado do cliente

  // Verifica se o nome foi enviado e se é válido
  if (!nome || !nome.trim() || nome.length < 2 || nome.length > 50) {
    return res.status(400).json({ message: 'Nome inválido. O nome deve ter entre 2 e 50 caracteres.' });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza o nome do usuário
    user.nome = nome;
    await user.save(); 

    res.json({ message: 'Nome atualizado com sucesso.', nome: user.nome });
  } catch (error) {
    console.error('Erro ao atualizar nome do usuário:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

router.get('/email', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Retorna apenas o email do usuário
    res.json({ email: user.email });
  } catch (error) {
    console.error('Erro ao buscar email do usuário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

router.put('/updateEmail', auth, async (req, res) => {
  const { email } = req.body; // Email atualizado

  // Valida o email usando o Validator
  if (!email || !Validator.validate(email)) {
    return res.status(400).json({ message: 'E-mail inválido!' });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza o email do usuário
    user.email = email;
    await user.save();

    res.json({ message: 'E-mail atualizado com sucesso.', email: user.email });
  } catch (error) {
    console.error('Erro ao atualizar e-mail do usuário:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});




module.exports = router;