const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Validator = require('email-validator');

const router = express.Router();

router.post('/', async (req, res) => {
  const checkPassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber;
  };

  try {
    const { nome, email, senha } = req.body; // requisita as informacoes do front
    //Armazena mensagens de erros
    let errors={};

    // Verifica se todos os campos estão preenchidos
    if (!nome) errors.nome = 'Nome completo é obrigatório!';
    if (!email) errors.email = 'E-mail é obrigatório!';
    if (!senha) errors.senha = 'Senha é obrigatória!';

    // Verifica a validade do email
    if (email && !Validator.validate(email)) {
      errors.email = 'E-mail inválido!';
    }

    // Verifica a validade da senha
    if (senha && !checkPassword(senha)) {
     errors.senha = 'A senha deve ter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas e números.';
    }
    // Verifica se o email já existe no banco de dados
    const userExistente = await User.findOne({ email });
    if (userExistente) {
      errors.email= 'E-mail já cadastrado.';
    }

    //Se houver erros, retorna uma resposta HTTP 400 com o objeto errors
    if(Object.keys(errors).length>0){
      return res.status(400).json({errors})
    }
    // Cria a variável user para o banco de dados
    const hashedPassword = await bcrypt.hash(senha, 10); // Criptografa a senha
    const user = new User({ nome, email, senha: hashedPassword });

    // Salva o usuário no banco de dados
    await user.save();

    // Envia a resposta de sucesso
    return res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
  } catch (error) {
    // Envia uma resposta de erro caso ocorra uma exceção
    console.log(error + "catch do code cadastro")
    return res.status(500).json({ error: 'Erro ao realizar o cadastro.' });
   
  }
});

module.exports = router;